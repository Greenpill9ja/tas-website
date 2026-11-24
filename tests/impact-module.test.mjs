import { describe, expect, test } from "bun:test";
import { loadImpact, validateGardens } from "../src/lib/impact/green-goods.ts";
import { tasGardens, monthlyReports, testimonials } from "../src/lib/impact/gardens.ts";
import { mediaUrl, publicHttpsUrl } from "../src/lib/impact/validation.ts";
import { hasTemporaryQueryFailure, ImpactRefreshError, refreshGardenImpact, TemporaryImpactSourceError } from "../src/lib/impact/refresh.ts";

const garden = tasGardens[0];
const workSchema = "0x43ebd37da5479df9d495a4c6514e7cb7f370e9f4166a0a58e14a3baf466078c4";
const approvalSchema = "0x6f44cac380791858e86c67c75de1f10b186fb6534c00f85b596709a3cd51f381";
const id = n => `0x${n.toString(16).padStart(64, "0")}`;
const encode = fields => JSON.stringify(Object.entries(fields).map(([name, value]) => ({ name, value: { value } })));
function fixture(size = 2) {
    const works = Array.from({ length: size }, (_, i) => ({ id: id(i + 1), recipient: garden.address, schemaId: workSchema, revoked: false, timeCreated: 1700000000 + i,
        decodedDataJson: encode({ actionUID: { hex: i === 0 ? "0x00" : "0x02" }, title: `Work ${i + 1}`, feedback: "Recorded work", media: [] }) }));
    const approvals = works.map((work, i) => ({ ...work, id: id(i + 2000), schemaId: approvalSchema, timeCreated: 1700100000 + i,
        decodedDataJson: encode({ workUID: work.id, approved: true }) }));
    const snapshot = { version: 1, ok: true, garden: { chainId: garden.chainId, address: garden.address }, summary: { submittedWorkCount: size, approvedWorkCount: size },
        recentWork: [{ id: works.at(-1).id, title: "Recent work", description: null, media: [], actionUid: 2, createdAt: "2026-01-01T00:00:00Z", approvedAt: "2026-01-02T00:00:00Z" }],
        provenance: { status: "ready", partialData: false, unavailableSources: [], fetchedAt: "2026-11-07T07:00:00Z" } };
    const calls = [];
    const read = async (url, init) => {
        calls.push({ url, init });
        if (!init) return snapshot;
        const { variables } = JSON.parse(init.body);
        if (variables.where.schemaId.equals === workSchema) expect(variables.where.recipient.in).toContain(garden.address);
        expect(variables.where.revoked.equals).toBe(false);
        const candidates = variables.where.schemaId.equals === workSchema ? works : approvals;
        const rows = variables.where.recipient ? candidates.filter(row => variables.where.recipient.in.includes(row.recipient)) : candidates;
        return { data: { attestations: rows.slice(variables.skip, variables.skip + variables.take) } };
    };
    return { works, approvals, snapshot, read, calls };
}

describe("TAS impact boundary", () => {
    test("HTTP 200 GraphQL database-pool failures are treated as temporary source failures", () => {
        expect(hasTemporaryQueryFailure({ errors: [{ extensions: { code: "INTERNAL_SERVER_ERROR", exception: { code: "P2024" } } }] })).toBe(true);
        expect(hasTemporaryQueryFailure({ errors: [{ extensions: { code: "GRAPHQL_VALIDATION_FAILED" } }] })).toBe(false);
        expect(hasTemporaryQueryFailure({ data: { attestations: [] } })).toBe(false);
    });
    test("temporary API failures cannot replace a successful cached snapshot", async () => {
        const f = fixture();
        const cached = await refreshGardenImpact(garden, f.read);
        expect(cached.impact.status).toBe("ready");
        const refresh = refreshGardenImpact(garden, async (url, init) => {
            if (!init) throw new TemporaryImpactSourceError("request timed out");
            return f.read(url, init);
        });
        const error = await refresh.catch(error => error);
        expect(error).toBeInstanceOf(ImpactRefreshError);
        expect(error.fallback.status).toBe("unavailable");
    });
    test("first-load EAS failure still offers API records without caching a failed refresh", async () => {
        const f = fixture();
        const error = await refreshGardenImpact(garden, async (url, init) => {
            if (init) throw new TemporaryImpactSourceError("reader timed out");
            return f.read(url, init);
        }).catch(error => error);
        expect(error).toBeInstanceOf(ImpactRefreshError);
        expect(error.fallback.status).toBe("partial");
        expect(error.fallback.records).toHaveLength(1);
    });
    test("retained Green Goods snapshots keep their original date and do not trigger more EAS reads", async () => {
        const f = fixture(105);
        f.snapshot.provenance = { ...f.snapshot.provenance, stale: true, refreshFailedAt: "2026-11-07T07:30:00Z" };
        const [result] = await loadImpact([garden], f.read);
        expect(result.status).toBe("stale");
        expect(result.fetchedAt).toBe("2026-11-07T07:00:00Z");
        expect(result.approvedWorkCount).toBe(105);
        expect(result.records).toHaveLength(1);
        expect(result.historyComplete).toBe(false);
        expect(f.calls).toHaveLength(1);
    });
    test("a stale API fallback cannot replace a complete cached history and fresh data can recover", async () => {
        const f = fixture();
        const complete = await refreshGardenImpact(garden, f.read);
        expect(complete.impact.records).toHaveLength(2);
        f.snapshot.provenance.stale = true;
        const error = await refreshGardenImpact(garden, f.read).catch(error => error);
        expect(error).toBeInstanceOf(ImpactRefreshError);
        expect(error.fallback.status).toBe("stale");
        expect(error.fallback.records).toHaveLength(1);
        f.snapshot.provenance.stale = false;
        const recovered = await refreshGardenImpact(garden, f.read);
        expect(recovered.impact.status).toBe("ready");
        expect(recovered.impact.records).toHaveLength(2);
    });
    test("a retained empty snapshot stays distinct from a source failure", async () => {
        const f = fixture();
        f.snapshot.summary = { submittedWorkCount: 0, approvedWorkCount: 0 };
        f.snapshot.recentWork = [];
        f.snapshot.provenance = { ...f.snapshot.provenance, status: "empty", stale: true };
        const [result] = await loadImpact([garden], f.read);
        expect(result.status).toBe("stale");
        expect(result.approvedWorkCount).toBe(0);
        expect(result.historyComplete).toBe(true);
        expect(f.calls).toHaveLength(1);
    });
    test("malformed freshness metadata is rejected before querying attestations", async () => {
        const f = fixture();
        f.snapshot.provenance.stale = "false";
        const [result] = await loadImpact([garden], f.read);
        expect(result.status).toBe("unavailable");
        expect(result.records).toHaveLength(0);
        expect(f.calls).toHaveLength(1);
    });
    test("explicit API rejection clears old data even during an EAS outage", async () => {
        const result = await refreshGardenImpact(garden, async (_url, init) => {
            if (init) throw new TemporaryImpactSourceError("reader timed out");
            throw new Error("Impact source returned 404");
        });
        expect(result.impact.status).toBe("unavailable");
        expect(result.impact.records).toHaveLength(0);
    });
    test("reads full paginated history, including construction older than recent cards", async () => {
        const f = fixture(105);
        const [result] = await loadImpact([garden], f.read);
        expect(result.status).toBe("ready");
        expect(result.records).toHaveLength(105);
        expect(result.records[0].title).toBe("Work 1");
        expect(result.records[0].track).toBe("construction");
        expect(result.records.at(-1).track).toBe("community");
        expect(result.records[0].recordedAt).not.toBe(result.records[0].approvedAt);
        expect(f.calls.filter(call => call.init)).toHaveLength(4);
    });
    test("pending and rejected work do not become approved cards", async () => {
        const f = fixture(3);
        f.approvals.pop();
        f.approvals[1].decodedDataJson = encode({ workUID: id(2), approved: false });
        f.snapshot.summary.approvedWorkCount = 1;
        f.snapshot.recentWork[0].id = id(1);
        const [result] = await loadImpact([garden], f.read);
        expect(result.records.map(record => record.id)).toEqual([`42161:${id(1)}`]);
        expect(result.historyComplete).toBe(true);
    });
    test("the opening attestation keeps its community classification and source timestamps", async () => {
        const f = fixture();
        const openingId = "0x18f7e5efa10565eb9d6e545a9da6b58ce13cc234b03687ca878406db49517ec8";
        f.works[1].id = openingId;
        f.approvals[1].decodedDataJson = encode({ workUID: openingId, approved: true });
        f.snapshot.recentWork[0].id = openingId;
        const [result] = await loadImpact([garden], f.read);
        const opening = result.records.find(record => record.id === `42161:${openingId}`);
        expect(result.historyComplete).toBe(true);
        expect(opening?.track).toBe("community");
        expect(opening?.development).toEqual({ stage: "opening", occurredOn: "2026-03-14" });
        expect(opening?.recordedAt).toBe(new Date(f.works[1].timeCreated * 1000).toISOString());
        expect(opening?.approvedAt).toBe(new Date(f.approvals[1].timeCreated * 1000).toISOString());
    });
    test("historical approvals join by work UID regardless of recipient, without importing another garden's work", async () => {
        const f = fixture();
        const otherRecipient = `0x${"b".repeat(40)}`;
        f.approvals[0].recipient = otherRecipient;
        f.approvals.push({ ...f.approvals[0], id: id(3000), decodedDataJson: encode({ workUID: id(999), approved: true }) });
        f.works.push({ ...f.works[0], id: id(999), recipient: otherRecipient });
        const [result] = await loadImpact([garden], f.read);
        expect(result.historyComplete).toBe(true);
        expect(result.records.map(record => record.id)).toEqual([`42161:${id(1)}`, `42161:${id(2)}`]);
        expect(result.approvedWorkCount).toBe(2);
    });
    test("an incomplete chain approval read cannot establish a complete garden history", async () => {
        const f = fixture();
        f.approvals.push(...Array.from({ length: 999 }, (_, i) => ({ ...f.approvals[0], id: id(4000 + i), decodedDataJson: encode({ workUID: id(5000 + i), approved: true }) })));
        const [result] = await loadImpact([garden], f.read);
        expect(result.historyComplete).toBe(false);
        expect(result.status).toBe("partial");
        expect(result.records).toHaveLength(1);
    });
    test("failed EAS reads retain recent API records without claiming a complete timeline", async () => {
        const f = fixture();
        const [result] = await loadImpact([garden], async (url, init) => { if (init) throw new Error("offline"); return f.read(url, init); });
        expect(result.status).toBe("partial");
        expect(result.historyComplete).toBe(false);
        expect(result.records).toHaveLength(1);
        expect(result.approvedWorkCount).toBe(2);
    });
    test("API rejection or mismatched identity cannot be bypassed through EAS", async () => {
        for (const mutation of [s => { s.version = 2; }, s => { s.garden.address = `0x${"b".repeat(40)}`; }]) {
            const f = fixture(); mutation(f.snapshot);
            const [result] = await loadImpact([garden], f.read);
            expect(result.status).toBe("unavailable");
            expect(result.records).toHaveLength(0);
            expect(result.approvedWorkCount).toBeNull();
            expect(f.calls.filter(call => call.init)).toHaveLength(0);
        }
    });
    test("complete attestations supply counts when the accepted API summary is unavailable", async () => {
        const f = fixture();
        f.snapshot.summary.approvedWorkCount = null;
        f.snapshot.provenance = { ...f.snapshot.provenance, status: "partial", partialData: true, unavailableSources: ["approvals"] };
        const [result] = await loadImpact([garden], f.read);
        expect(result.approvedWorkCount).toBe(2);
        expect(result.approvedCountSource).toBe("attestations");
        expect(result.status).toBe("partial");
        expect(result.historyComplete).toBe(true);
    });
    test("missing counts stay unavailable without a complete attestation read", async () => {
        const f = fixture();
        f.snapshot.summary.approvedWorkCount = null;
        f.snapshot.provenance = { ...f.snapshot.provenance, status: "partial", partialData: true, unavailableSources: ["works"] };
        const error = await refreshGardenImpact(garden, async (url, init) => {
            if (init) return { errors: [{ message: "temporarily unavailable" }] };
            return f.read(url, init);
        }).catch(error => error);
        expect(error).toBeInstanceOf(ImpactRefreshError);
        expect(error.fallback.approvedWorkCount).toBeNull();
        expect(error.fallback.historyComplete).toBe(false);
    });
    test("a shorter attestation response does not discard available API cards", async () => {
        const f = fixture();
        const [result] = await loadImpact([garden], async (url, init) => init ? { data: { attestations: [] } } : f.read(url, init));
        expect(result.records).toHaveLength(1);
        expect(result.approvedWorkCount).toBe(2);
        expect(result.approvedCountSource).toBe("api");
        expect(result.historyComplete).toBe(false);
    });
    test("keeps recent API work missing from EAS without losing older records or claiming complete history", async () => {
        const f = fixture(3);
        const recent = f.snapshot.recentWork[0];
        f.snapshot.recentWork.unshift({ ...recent, id: id(2), title: "Overlapping API record" });
        const delayedWork = f.works.pop();

        const [partial] = await loadImpact([garden], f.read);
        expect(partial.records.map(record => record.id)).toEqual([1, 2, 3].map(n => `42161:${id(n)}`));
        expect(partial.records.map(record => record.title)).toEqual(["Work 1", "Work 2", "Recent work"]);
        expect(partial.approvedWorkCount).toBe(3);
        expect(partial.approvedCountSource).toBe("api");
        expect(partial.historyComplete).toBe(false);
        expect(partial.status).toBe("partial");

        f.works.push(delayedWork);
        const [recovered] = await loadImpact([garden], f.read);
        expect(recovered.records.map(record => record.title)).toEqual(["Work 1", "Work 2", "Work 3"]);
        expect(recovered.historyComplete).toBe(true);
        expect(recovered.status).toBe("ready");
    });
    test("an empty history cannot supply a zero count when the API still has recent work", async () => {
        const f = fixture();
        f.snapshot.summary.approvedWorkCount = null;
        f.snapshot.provenance = { ...f.snapshot.provenance, status: "partial", partialData: true, unavailableSources: ["works"] };
        const [result] = await loadImpact([garden], async (url, init) => init ? { data: { attestations: [] } } : f.read(url, init));
        expect(result.approvedWorkCount).toBeNull();
        expect(result.approvedCountSource).toBeNull();
        expect(result.historyComplete).toBe(false);
        expect(result.records).toHaveLength(1);
    });
    test("one unavailable garden leaves another garden usable and avoids duplicate registration", async () => {
        const other = { ...garden, id: "next-hub", address: `0x${"b".repeat(40)}`, status: "building" };
        const f = fixture();
        const results = await loadImpact([garden, other], async (url, init) => {
            if (url.includes(other.address) || init?.body.includes(other.address)) throw new Error("offline");
            return f.read(url, init);
        });
        expect(results.map(result => result.status)).toEqual(["ready", "unavailable"]);
        expect(() => validateGardens([garden, { ...garden, id: "duplicate" }])).toThrow();
        expect(() => validateGardens([{ ...garden, chainId: 1 }])).toThrow();
    });
    test("unexpected/revoked attestations are rejected and unknown actions are not misclassified", async () => {
        const f = fixture();
        f.works[0].decodedDataJson = encode({ actionUID: { hex: "0x63" }, title: "New activity", feedback: "", media: [] });
        expect((await loadImpact([garden], f.read))[0].records[0].track).toBeNull();
        f.works[0].revoked = true;
        expect((await loadImpact([garden], f.read))[0].historyComplete).toBe(false);
    });
    test("source overflow is partial, never a truncated complete history", async () => {
        const f = fixture(1001);
        const [result] = await loadImpact([garden], f.read);
        expect(result.historyComplete).toBe(false);
        expect(result.records).toHaveLength(1);
    });
    test("only safe public media and reviewed editorial material can be presented", () => {
        expect(mediaUrl("ipfs://bafkreieg7ca5tmtfzym5f6fusfqqzzonkpt26pz4m2beveqm23iclx32te")).toStartWith("https://greengoods.mypinata.cloud/ipfs/");
        for (const value of ["http://localhost/a", "https://evil.example/image", "https://user:pass@greengoods.mypinata.cloud/ipfs/test", "javascript:alert(1)"]) expect(mediaUrl(value)).toBeNull();
        expect(publicHttpsUrl("javascript:alert(1)")).toBeNull();
        for (const report of monthlyReports) { expect(report.reviewedAt).toBeTruthy(); expect(publicHttpsUrl(report.sourceUrl)).toBeTruthy(); }
        for (const quote of testimonials) {
            if (quote.kind === "approved") expect(quote.consentRecordedAt).toBeTruthy();
            else expect(quote.attribution).toContain("Sample");
        }
    });
});
