import { describe, expect, test } from "bun:test";
import { getReportSource, getWorkRecordUrl, monthlyReports, publishedRecords, sampleRecords } from "../src/components/impact/impact-data.ts";
import { buttonStyles } from "../src/components/ui/button-styles.ts";

describe("Impact review 48–53", () => {
    test("all three page entrypoints use one shared header", async () => {
        for (const route of ["src/app/page.tsx", "src/app/about/page.tsx", "src/app/impact/page.tsx"]) {
            const source = await Bun.file(route).text();
            expect(source.match(/<SiteHeader\s*\/>/g)).toHaveLength(1);
            expect(source).not.toContain("<header");
        }
    });
    test("the native mobile dialog has a title, trigger state and close action", async () => {
        const source = await Bun.file("src/components/SiteHeader.tsx").text();
        for (const expected of ["<dialog", "showModal()", "aria-expanded={isOpen}", 'aria-controls="site-navigation-drawer"', 'aria-labelledby="site-navigation-title"', 'aria-label="Close navigation menu"', "onClose=", "data-lenis-prevent"]) expect(source).toContain(expected);
        for (const label of ["Home", "About us", "Impact"]) expect(source).toContain(`label: "${label}"`);
        expect(source).toContain('pathname === link.href ? "page" : undefined');
    });
    test("unreviewed and missing reports have no source CTA", () => {
        for (const report of Object.values(monthlyReports)) expect(getReportSource(report)).toBeNull();
        expect(getReportSource({ source: "https://example.org/report", sourceReviewed: false })).toBeNull();
        expect(getReportSource({ source: null, sourceReviewed: true })).toBeNull();
    });
    test("only reviewed HTTPS reports can expose links", () => {
        expect(getReportSource({ source: "https://example.org/report", sourceReviewed: true })).toBe("https://example.org/report");
        for (const source of ["javascript:alert(1)", "http://example.org/report", "not a URL", "https://user:password@example.org/report"]) expect(getReportSource({ source, sourceReviewed: true })).toBeNull();
    });
    test("layout samples never become published work or expose evidence links", () => {
        expect(publishedRecords).toHaveLength(0);
        for (const record of sampleRecords) expect(getWorkRecordUrl({ ...record, publicRecordUrl: "https://beta.greengoods.app/sample-test" })).toBeNull();
    });
    test("real-record view links require an allowed public Green Goods URL", () => {
        const record = { ...sampleRecords[0], verification: "pending", publicRecordUrl: "https://beta.greengoods.app/test-record" };
        expect(getWorkRecordUrl(record)).toBe(record.publicRecordUrl);
        for (const publicRecordUrl of [null, "javascript:alert(1)", "http://beta.greengoods.app/test", "https://greengoods.app.evil.example/test", "https://user:pass@beta.greengoods.app/test"]) expect(getWorkRecordUrl({ ...record, publicRecordUrl })).toBeNull();
    });
    test("published and sample states are separate and View names its record", async () => {
        const source = await Bun.file("src/components/impact/ImpactContent.tsx").text();
        expect(source).toContain('useState<"published" | "samples">("published")');
        expect(source).toContain("Published records");
        expect(source).toContain("Layout preview · samples");
        expect(source).toContain("records.length === 0");
        expect(source).toContain('aria-label={`View ${record.title} on Green Goods`}');
        expect(source).toContain(">View <ArrowUpRight");
    });
    test("shared primary buttons retain the homepage contact-button style", () => {
        for (const token of ["rounded-full", "bg-secondary", "px-8", "py-4", "font-heading", "text-lg", "font-bold", "text-dark", "shadow-lg", "focus-visible:outline"]) expect(buttonStyles()).toContain(token);
        expect(buttonStyles({ variant: "secondary" })).not.toContain("bg-secondary");
        expect(buttonStyles({ className: "mt-8" })).toContain("mt-8");
    });
});
