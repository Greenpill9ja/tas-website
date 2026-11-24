import { workEditorial } from "./editorial";
import { count, isoDate, list, mediaUrl, object, text, uid } from "./validation";
import type { GardenDefinition, GardenImpact, ImpactRecord } from "./types";

export type ReadJson = (url: string, init?: RequestInit) => Promise<unknown>;
export const impactApiOrigin = "https://agent.greengoods.app";

// Green Goods deployments/42161-latest.json. A new garden on this chain needs no new transport.
const networks: Record<number, { eas: string; explorer: string; workSchema: string; approvalSchema: string }> = {
    42161: {
        eas: "https://arbitrum.easscan.org/graphql",
        explorer: "https://arbitrum.easscan.org",
        workSchema: "0x43ebd37da5479df9d495a4c6514e7cb7f370e9f4166a0a58e14a3baf466078c4",
        approvalSchema: "0x6f44cac380791858e86c67c75de1f10b186fb6534c00f85b596709a3cd51f381",
    },
};

export function validateGardens(gardens: GardenDefinition[]): void {
    const ids = new Set<string>();
    const addresses = new Set<string>();
    for (const garden of gardens) {
        const key = `${garden.chainId}:${garden.address.toLowerCase()}`;
        if (!networks[garden.chainId] || !/^0x[0-9a-fA-F]{40}$/.test(garden.address) || !garden.id || ids.has(garden.id) || addresses.has(key)) {
            throw new Error("Invalid or duplicate TAS garden registration");
        }
        ids.add(garden.id);
        addresses.add(key);
    }
}

function record(garden: GardenDefinition, input: {
    id: string; title: string; summary: string; media: unknown[]; actionUid: number; recordedAt: string; approvedAt: string;
}): ImpactRecord {
    const id = `${garden.chainId}:${input.id}`;
    const editorial = workEditorial[id];
    const originalNote = input.summary.trim();
    return {
        ...input, id, gardenId: garden.id,
        title: editorial?.title ?? input.title.replace(/ - \d{4}-\d{2}-\d{2}T.*$/, ""),
        summary: editorial?.summary ?? input.summary,
        sourceDescription: editorial && originalNote && originalNote !== editorial.summary ? originalNote : undefined,
        development: editorial?.development,
        media: input.media.map(mediaUrl).filter((url): url is string => url !== null),
        track: garden.actionTracks[input.actionUid] ?? null,
        sourceUrl: `https://www.greengoods.app/gardens/${garden.address}/work/${input.id}`,
        attestationUrl: `${networks[garden.chainId].explorer}/attestation/view/${input.id}`,
        measurements: editorial?.measurements ?? [],
    };
}

function parseSnapshot(value: unknown, garden: GardenDefinition) {
    const response = object(value);
    const identity = object(response.garden);
    if (response.version !== 1 || response.ok !== true || identity.chainId !== garden.chainId || text(identity.address).toLowerCase() !== garden.address.toLowerCase()) {
        throw new Error("Unexpected garden impact response");
    }
    const summary = object(response.summary);
    const provenance = object(response.provenance);
    if (!["ready", "empty", "partial"].includes(text(provenance.status)) || typeof provenance.partialData !== "boolean") throw new Error("Invalid provenance");
    if (provenance.stale !== undefined && typeof provenance.stale !== "boolean") throw new Error("Invalid snapshot freshness");
    const unavailable = list(provenance.unavailableSources).map(text);
    if (provenance.partialData !== (unavailable.length > 0) || (provenance.status === "partial") !== provenance.partialData) throw new Error("Inconsistent provenance");
    const approved = count(summary.approvedWorkCount);
    const submitted = count(summary.submittedWorkCount);
    if (approved !== null && submitted !== null && approved > submitted) throw new Error("Inconsistent work counts");
    const recent = response.recentWork === null ? [] : list(response.recentWork).map(value => {
        const work = object(value);
        const actionUid = count(work.actionUid);
        if (actionUid === null) throw new Error("Missing action");
        return record(garden, {
            id: uid(work.id), title: text(work.title), summary: work.description === null ? "" : text(work.description),
            media: list(work.media), actionUid,
            recordedAt: isoDate(work.createdAt), approvedAt: isoDate(work.approvedAt),
        });
    });
    if (new Set(recent.map(work => work.id)).size !== recent.length) throw new Error("Duplicate recent work");
    return { submitted, approved, recent, partial: provenance.partialData, stale: provenance.stale === true, fetchedAt: isoDate(provenance.fetchedAt) };
}

const attestationsQuery = `query TASImpactAttestations($where: AttestationWhereInput!, $take: Int!, $skip: Int!) {
    attestations(where: $where, orderBy: [{timeCreated: asc}, {id: asc}], take: $take, skip: $skip) {
        id recipient schemaId revoked timeCreated decodedDataJson
    }
}`;

type Attestation = { id: string; recordedAt: string; fields: Record<string, unknown> };

async function readAttestations(garden: GardenDefinition, schema: string, readJson: ReadJson, scope: "garden" | "chain" = "garden"): Promise<Attestation[]> {
    const result = new Map<string, Attestation>();
    // Never present a capped source as a complete timeline. The extra row detects overflow.
    for (let skip = 0; skip <= 1000; skip += 100) {
        const take = skip === 1000 ? 1 : 100;
        const response = object(await readJson(networks[garden.chainId].eas, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: attestationsQuery, variables: {
                where: { schemaId: { equals: schema }, ...(scope === "garden" ? { recipient: { in: [garden.address, garden.address.toLowerCase()] } } : {}), revoked: { equals: false } }, take, skip,
            } }),
        }));
        if (response.errors) throw new Error("Attestation source unavailable");
        const rows = list(object(response.data).attestations);
        if (skip === 1000 && rows.length > 0) throw new Error("Attestation source limit reached");
        for (const value of rows) {
            const row = object(value);
            if (row.revoked !== false || row.schemaId !== schema || (scope === "garden" && text(row.recipient).toLowerCase() !== garden.address.toLowerCase())) throw new Error("Unexpected attestation scope");
            const seconds = count(row.timeCreated);
            if (!seconds || seconds > 8640000000000) throw new Error("Invalid attestation time");
            const fields: Record<string, unknown> = {};
            for (const value of list(JSON.parse(text(row.decodedDataJson)))) {
                const field = object(value);
                fields[text(field.name)] = object(field.value).value;
            }
            const id = uid(row.id);
            result.set(id, { id, recordedAt: new Date(seconds * 1000).toISOString(), fields });
        }
        if (rows.length < take) return [...result.values()];
    }
    return [...result.values()];
}

async function readHistory(garden: GardenDefinition, readJson: ReadJson): Promise<ImpactRecord[]> {
    const network = networks[garden.chainId];
    // Both queries share the public reader's small database connection pool.
    const works = await readAttestations(garden, network.workSchema, readJson);
    // Historical approval recipients vary. Green Goods joins chain-scoped approvals
    // by decoded workUID; only the garden-scoped works below can become records.
    const approvals = await readAttestations(garden, network.approvalSchema, readJson, "chain");
    const approvedAt = new Map<string, string>();
    for (const approval of approvals) {
        if (typeof approval.fields.approved !== "boolean") throw new Error("Invalid approval");
        // Matches Green Goods v1: an unrevoked positive steward approval qualifies work.
        if (approval.fields.approved) {
            const id = uid(approval.fields.workUID);
            if ((approvedAt.get(id) ?? "") < approval.recordedAt) approvedAt.set(id, approval.recordedAt);
        }
    }
    return works.filter(work => approvedAt.has(work.id)).map(work => {
        const rawAction = work.fields.actionUID;
        const action = typeof rawAction === "object" ? text(object(rawAction).hex) : rawAction;
        const actionUid = count(typeof action === "string" ? Number(action) : action);
        if (actionUid === null) throw new Error("Missing action UID");
        return record(garden, { id: work.id, actionUid, title: text(work.fields.title), summary: text(work.fields.feedback),
            media: list(work.fields.media), recordedAt: work.recordedAt, approvedAt: approvedAt.get(work.id)!,
        });
    });
}

export async function loadGardenImpact(garden: GardenDefinition, readJson: ReadJson): Promise<GardenImpact> {
    // The API also reads EAS: validate visibility first and avoid a source-request burst.
    let snapshot: ReturnType<typeof parseSnapshot>;
    try {
        snapshot = parseSnapshot(await readJson(`${impactApiOrigin}/public/gardens/${garden.chainId}/${garden.address}/impact?recentLimit=12`), garden);
    } catch {
        return { garden, submittedWorkCount: null, approvedWorkCount: null, approvedCountSource: null, records: [], historyComplete: false, status: "unavailable", fetchedAt: null };
    }
    // The API explicitly retained an older snapshot after provider failure. Do not
    // add more EAS work during that outage or present these observations as fresh.
    if (snapshot.stale) {
        return {
            garden, submittedWorkCount: snapshot.submitted, approvedWorkCount: snapshot.approved,
            approvedCountSource: snapshot.approved !== null ? "api" : null,
            records: snapshot.recent.sort((a, b) => a.recordedAt.localeCompare(b.recordedAt) || a.id.localeCompare(b.id)),
            historyComplete: !snapshot.partial && snapshot.approved !== null && snapshot.recent.length === snapshot.approved,
            status: "stale", fetchedAt: snapshot.fetchedAt,
        };
    }
    const history = await readHistory(garden, readJson).catch(() => null);
    const recordsById = new Map<string, ImpactRecord>(history?.map(work => [work.id, work]));
    // Check EAS coverage before adding recent API work. The merged count cannot prove completeness.
    const derivedCount = history !== null && snapshot.recent.every(work => recordsById.has(work.id)) ? recordsById.size : null;
    const historyComplete = derivedCount !== null && (snapshot.approved === null || derivedCount === snapshot.approved);
    const approved = snapshot.approved ?? derivedCount;
    // Keep direct attestation data for shared IDs and retain API records missing from EAS.
    for (const work of snapshot.recent) {
        if (!recordsById.has(work.id)) recordsById.set(work.id, work);
    }
    return {
        garden, submittedWorkCount: snapshot.submitted, approvedWorkCount: approved,
        approvedCountSource: snapshot.approved !== null ? "api" : derivedCount !== null ? "attestations" : null,
        records: [...recordsById.values()].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt) || a.id.localeCompare(b.id)),
        historyComplete, status: snapshot.partial || !historyComplete ? "partial" : "ready", fetchedAt: snapshot.fetchedAt,
    };
}

export async function loadImpact(gardens: GardenDefinition[], readJson: ReadJson): Promise<GardenImpact[]> {
    validateGardens(gardens);
    const results: GardenImpact[] = [];
    // Bound fan-out as the registry grows; each garden is independent of failures elsewhere.
    for (let i = 0; i < gardens.length; i += 3) results.push(...await Promise.all(gardens.slice(i, i + 3).map(garden => loadGardenImpact(garden, readJson))));
    return results;
}
