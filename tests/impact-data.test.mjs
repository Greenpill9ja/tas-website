import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ImpactContent from "../src/components/impact/ImpactContent.tsx";
import { tasGardens, testimonials } from "../src/lib/impact/gardens.ts";

const unavailable = { garden: tasGardens[0], submittedWorkCount: null, approvedWorkCount: null, approvedCountSource: null, records: [], historyComplete: false, status: "unavailable", fetchedAt: null };

describe("impact presentation boundaries", () => {
    test("source failures show unavailable totals and a useful recovery state", () => {
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [unavailable] }));
        expect(html).toContain("some evidence is temporarily unavailable");
        expect(html).toMatch(/Approved work records<\/dt><dd[^>]*>—<\/dd>/);
        expect(html).toContain("Refresh impact");
        expect(html).not.toContain("Layout preview");
        expect(html).not.toContain('data-testid="impact-monthly"');
    });
    test("a genuinely empty approved history displays zero and honest empty states", () => {
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [{ ...unavailable, approvedWorkCount: 0, submittedWorkCount: 0, historyComplete: true, status: "ready" }] }));
        expect(html).toMatch(/Approved work records<\/dt><dd[^>]*>0<\/dd>/);
        expect(html).toContain("No approved development records");
        expect(html).not.toContain("temporarily unavailable");
    });
    test("sample testimonials remain hidden until approved with consent", () => {
        const sample = { kind: "sample", gardenId: "awka", quote: "Illustrative quote", attribution: "Sample member testimonial" };
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [unavailable], quotes: [sample] }));
        expect(html).not.toContain('id="community-voices"');
        expect(html).not.toContain("Illustrative quote");
        expect(html).not.toContain("Sample member testimonial");
    });
    test("all seven consented community posts link to their originals", () => {
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [unavailable] }));
        expect(html).toContain('id="community-voices"');
        expect(new Set(testimonials.map(t => t.sourceUrl)).size).toBe(7);
        for (const t of testimonials) expect(html).toContain('href="' + t.sourceUrl + '"');
    });
    test("a stale successful snapshot keeps its counts and clearly reports the refresh", () => {
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [{ ...unavailable, status: "stale", approvedWorkCount: 16, historyComplete: true }] }));
        expect(html).toMatch(/Approved work records<\/dt><dd[^>]*>16<\/dd>/);
        expect(html).toContain("last successfully fetched records");
        expect(html).not.toContain("some evidence is temporarily unavailable");
    });
    test("attestation-derived totals identify their source instead of implying an API summary", () => {
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [{ ...unavailable, status: "partial", approvedWorkCount: 0, approvedCountSource: "attestations", historyComplete: true }] }));
        expect(html).toContain("come from the complete public attestation history");
        expect(html).not.toContain("some evidence is temporarily unavailable");
    });
    test("each hub follows its development stages and the shared community feed stays newest first", () => {
        const record = (id, gardenId, title, recordedAt, track, development) => ({
            id, gardenId, title, recordedAt, track, development, approvedAt: recordedAt, summary: "",
            media: [], actionUid: 0, sourceUrl: "https://www.greengoods.app",
            attestationUrl: "https://arbitrum.easscan.org", measurements: [],
        });
        const html = renderToStaticMarkup(createElement(ImpactContent, { gardens: [
            { ...unavailable, status: "ready", historyComplete: true, approvedWorkCount: 5, records: [
                record("solar", "awka", "Installing panels", "2026-02-01T00:00:00.000Z", "construction", { stage: "solar" }),
                record("opening", "awka", "Opening Awka", "2026-03-19T00:00:00.000Z", "community", { stage: "opening", occurredOn: "2026-03-14" }),
                record("design", "awka", "Drawing the plans", "2026-05-01T00:00:00.000Z", "construction", { stage: "design" }),
                record("additional", "awka", "Unplaced construction", "2026-05-02T00:00:00.000Z", "construction"),
                record("old-class", "awka", "Earlier workshop", "2026-02-01T00:00:00.000Z", "community"),
            ] },
            { ...unavailable, status: "ready", historyComplete: true, approvedWorkCount: 2, garden: { ...tasGardens[0], id: "next", name: "Next TAS garden" }, records: [
                record("old-build", "next", "Preparing the next site", "2026-01-01T00:00:00.000Z", "construction", { stage: "site-preparation" }),
                record("new-class", "next", "Later workshop", "2026-06-01T00:00:00.000Z", "community"),
            ] },
        ] }));
        expect([...html.matchAll(/data-stage="([^"]+)"/g)].map(match => match[1])).toEqual(["design", "solar", "opening", "site-preparation"]);
        expect(html.indexOf("Drawing the plans")).toBeLessThan(html.indexOf("Installing panels"));
        expect(html.indexOf("Opening Awka")).toBeLessThan(html.indexOf("Preparing the next site"));
        expect(html).toContain("Other development records");
        expect(html).toContain("Unplaced construction");
        expect(html).toContain("14 Mar 2026");
        expect(html).not.toContain("19 Mar 2026");
        expect(html.match(/data-testid="impact-record"/g)).toHaveLength(7);
        expect(html).toMatch(/Learning &amp; community<\/dt><dd[^>]*>3<\/dd>/);
        expect(html.indexOf("Later workshop")).toBeLessThan(html.indexOf("Earlier workshop"));
        expect(html).toContain('<option value="next">Next TAS garden</option>');
    });
    test("all routes share a footer while About keeps its own tribute and Impact hides the team", async () => {
        for (const route of ["src/app/page.tsx", "src/app/about/page.tsx", "src/app/impact/page.tsx"]) {
            const source = await Bun.file(route).text();
            expect(source).toContain('import Footer from "@/components/sections/Footer"');
            expect(source.match(/<Footer(?:\s[^>]*)?\s*\/>/g)).toHaveLength(1);
            expect(source).not.toContain("<footer");
            expect(source.includes("showMemorial={false}")).toBe(route !== "src/app/page.tsx");
            expect(source.includes("showTeam={false}")).toBe(route.includes("/impact/"));
        }
    });
});
