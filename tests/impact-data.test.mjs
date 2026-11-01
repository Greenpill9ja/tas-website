import { describe, expect, test } from "bun:test";
import { metricDefinitions, monthlyReports, sampleRecords } from "../src/components/impact/impact-data.ts";

describe("staging impact data boundaries", () => {
    test("sample work cannot impersonate verified public records", () => {
        expect(sampleRecords).toHaveLength(3);
        for (const record of sampleRecords) {
            expect(record.verification).toBe("sample");
            expect(record.publicRecordUrl).toBeNull();
            expect(record.completedAt).toBeNull();
            expect(record.contributor).toBeNull();
            expect(record.sourceNote).toContain("Layout example only");
            expect(Bun.file(`public${record.image}`).size).toBeGreaterThan(0);
        }
    });
    test("unpublished monthly readings stay unavailable, not zero", () => {
        expect(monthlyReports["2026-10"].values.every(value => value === null)).toBe(true);
        expect(monthlyReports["2026-10"].source).toBeNull();
        expect(metricDefinitions.map(metric => metric.unit)).toEqual(["people", "kWh", "TB", "hours"]);
    });
    test("each category filter has a distinct sample", () => {
        expect(new Set(sampleRecords.map(record => record.category)).size).toBe(3);
        expect(new Set(sampleRecords.map(record => record.id)).size).toBe(3);
    });
    test("all routes reuse the homepage footer, without duplicate contact forms", async () => {
        for (const route of ["src/app/page.tsx", "src/app/about/page.tsx", "src/app/impact/page.tsx"]) {
            const source = await Bun.file(route).text();
            expect(source).toContain('import Footer from "@/components/sections/Footer"');
            expect(source.match(/<Footer\s*\/>/g)).toHaveLength(1);
            expect(source).not.toContain("<footer");
            expect(source).not.toContain("<AboutContactForm");
        }
    });
    test("monthly cards reuse the original TAS illustration assets", async () => {
        const source = await Bun.file("src/components/impact/ImpactContent.tsx").text();
        for (const asset of ["Hub-icon.png", "Solar Panel.png", "Internet (Starlink) green.png", "Node.png"]) {
            expect(source).toContain(asset);
            expect(Bun.file(`public/${asset}`).size).toBeGreaterThan(0);
        }
        expect(source).not.toContain("const metricIcons = [Users");
    });
});
