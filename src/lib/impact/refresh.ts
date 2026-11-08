import { impactApiOrigin, loadGardenImpact, type ReadJson } from "./green-goods";
import type { GardenDefinition, GardenImpact } from "./types";

export class TemporaryImpactSourceError extends Error {}

export class ImpactRefreshError extends Error {
    constructor(public fallback: GardenImpact, cause: Error) {
        super("Impact refresh temporarily unavailable", { cause });
    }
}

export const impactRefreshSeconds = 300;
export const impactRequestTimeoutMs = 30000;

export function hasTemporaryQueryFailure(value: unknown): boolean {
    if (!value || typeof value !== "object" || !("errors" in value) || !Array.isArray(value.errors)) return false;
    return value.errors.some(error => {
        if (!error || typeof error !== "object" || !("extensions" in error)) return false;
        const extensions = error.extensions;
        return extensions !== null && typeof extensions === "object" && "code" in extensions && extensions.code === "INTERNAL_SERVER_ERROR";
    });
}

export function unavailableGarden(garden: GardenDefinition): GardenImpact {
    return { garden, submittedWorkCount: null, approvedWorkCount: null, approvedCountSource: null, records: [], historyComplete: false, status: "unavailable", fetchedAt: null };
}

/** A temporary failure must not overwrite the last successful cached snapshot. */
export async function refreshGardenImpact(garden: GardenDefinition, readJson: ReadJson) {
    let temporaryFailure: TemporaryImpactSourceError | undefined;
    let apiTemporarilyUnavailable = false;
    const result = await loadGardenImpact(garden, async (url, init) => {
        try {
            return await readJson(url, init);
        } catch (error) {
            if (error instanceof TemporaryImpactSourceError) {
                temporaryFailure = error;
                if (url.startsWith(`${impactApiOrigin}/`)) apiTemporarilyUnavailable = true;
            }
            throw error;
        }
    });
    // Explicit API rejections remain authoritative, even if EAS also times out.
    if (temporaryFailure && (result.status !== "unavailable" || apiTemporarilyUnavailable)) {
        throw new ImpactRefreshError(result, temporaryFailure);
    }
    // A retained API summary has only recent work. Preserve any fuller local
    // snapshot; on a cold cache the caller can still show this labelled fallback.
    if (result.status === "stale") {
        throw new ImpactRefreshError(result, new Error("Green Goods returned a retained snapshot after a failed refresh"));
    }
    if (result.status === "partial" && result.approvedWorkCount === null) {
        throw new ImpactRefreshError(result, new Error("Work summaries and full attestation history are unavailable"));
    }
    return { impact: result, checkedAt: Date.now() };
}
