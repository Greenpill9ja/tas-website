export function object(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object");
    return value as Record<string, unknown>;
}

export function text(value: unknown): string {
    if (typeof value !== "string") throw new Error("Expected text");
    return value;
}

export function count(value: unknown): number | null {
    if (value === null) return null;
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid count");
    return value;
}

export function list(value: unknown): unknown[] {
    if (!Array.isArray(value)) throw new Error("Expected a list");
    return value;
}

export function uid(value: unknown): string {
    const result = text(value).toLowerCase();
    if (!/^0x[0-9a-f]{64}$/.test(result)) throw new Error("Invalid attestation UID");
    return result;
}

export function isoDate(value: unknown): string {
    const result = text(value);
    if (!/^\d{4}-\d{2}-\d{2}T/.test(result) || !Number.isFinite(Date.parse(result))) throw new Error("Invalid date");
    return result;
}

export function publicHttpsUrl(value: string): string | null {
    try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
    } catch { return null; }
}

/** Only the fixed public media gateway is loaded by the page. No arbitrary remote fetch. */
export function mediaUrl(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const cid = value.replace(/^ipfs:\/\//, "");
    if (/^(bafy[a-z2-7]+|bafk[a-z2-7]+|Qm[1-9A-HJ-NP-Za-km-z]{44})$/.test(cid)) {
        return `https://greengoods.mypinata.cloud/ipfs/${cid}`;
    }
    const safe = publicHttpsUrl(value);
    if (!safe) return null;
    const url = new URL(safe);
    return url.hostname === "greengoods.mypinata.cloud" && url.port === "" && url.pathname.startsWith("/ipfs/") ? safe : null;
}
