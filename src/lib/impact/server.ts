import "server-only";
import { unstable_cache } from "next/cache";
import { tasGardens } from "./gardens";
import { impactApiOrigin, validateGardens, type ReadJson } from "./green-goods";
import { hasTemporaryQueryFailure, ImpactRefreshError, impactRefreshSeconds, impactRequestTimeoutMs, refreshGardenImpact, TemporaryImpactSourceError, unavailableGarden } from "./refresh";
import type { GardenDefinition, GardenImpact } from "./types";

const readJson: ReadJson = async (url, init) => {
    const source = url.startsWith(impactApiOrigin) ? "Public impact API" : "Attestation source";
    let response: Response;
    try {
        response = await fetch(url, { ...init, signal: AbortSignal.timeout(impactRequestTimeoutMs), cache: "no-store" });
    } catch (error) {
        throw new TemporaryImpactSourceError(`${source}: request failed`, { cause: error });
    }
    if (response.status === 408 || response.status === 429 || response.status >= 500) {
        throw new TemporaryImpactSourceError(`${source}: HTTP ${response.status}`);
    }
    if (!response.ok) throw new Error(`Impact source returned ${response.status}`);
    let payload: unknown;
    try {
        payload = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) throw error;
        throw new TemporaryImpactSourceError(`${source}: response interrupted`, { cause: error });
    }
    if (source === "Attestation source" && hasTemporaryQueryFailure(payload)) {
        throw new TemporaryImpactSourceError("Attestation source: temporary GraphQL failure");
    }
    return payload;
};

const getCachedGarden = unstable_cache(
    (garden: GardenDefinition) => refreshGardenImpact(garden, readJson),
    ["tas-garden-impact-v7"],
    { revalidate: impactRefreshSeconds },
);

export async function getTasImpact(): Promise<GardenImpact[]> {
    validateGardens(tasGardens);
    const results: GardenImpact[] = [];
    for (let i = 0; i < tasGardens.length; i += 3) {
        results.push(...await Promise.all(tasGardens.slice(i, i + 3).map(async garden => {
            try {
                const cached = await getCachedGarden(garden);
                const stale = Date.now() - cached.checkedAt > impactRefreshSeconds * 1000;
                return { ...cached.impact, status: stale && cached.impact.status !== "unavailable" ? "stale" as const : cached.impact.status };
            } catch (error) {
                console.warn(`[impact] ${garden.id}: initial load unavailable`, error);
                return error instanceof ImpactRefreshError ? error.fallback : unavailableGarden(garden);
            }
        })));
    }
    return results;
}
