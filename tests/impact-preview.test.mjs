import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ImpactContent from "../src/components/impact/ImpactContent.tsx";
import { previewGardens, previewTestimonials } from "../src/lib/impact/preview.ts";
import { tasGardens } from "../src/lib/impact/gardens.ts";

const render = (initialGardenId = "all", gardens = previewGardens) => renderToStaticMarkup(createElement(ImpactContent, { gardens, initialGardenId, preview: true, quotes: previewTestimonials }));
const metric = (html, label, value) => expect(html).toMatch(new RegExp(`${label}<\\/dt><dd[^>]*>${value}<\\/dd>`));

describe("multi-hub impact selection", () => {
    test("all hubs combine records while a hub being built is not counted as active", () => {
        const html = render();
        metric(html, "Active hubs", "2");
        metric(html, "Example work records", "10");
        metric(html, "Development records", "5");
        metric(html, "Learning &amp; community", "5");
        expect(html.match(/data-testid="impact-record"/g)).toHaveLength(10);
        expect(html.match(/data-testid="impact-hub-timeline"/g)).toHaveLength(3);
        expect(html.match(/<blockquote/g)).toHaveLength(3);
    });

    test("a hub selection scopes counts, records and testimonials together", () => {
        const html = render("example-b");
        metric(html, "Active hubs", "1");
        metric(html, "Example work records", "3");
        metric(html, "Development records", "1");
        metric(html, "Learning &amp; community", "2");
        expect(html.match(/data-testid="impact-record"/g)).toHaveLength(3);
        expect(html).toContain("A peer learning session");
        expect(html).not.toContain("Solar power comes online");
        expect(html).not.toContain("Preparing the next site");
        expect(html.match(/<blockquote/g)).toHaveLength(1);
        expect(html).not.toContain("Reliable power and internet give me");
    });

    test("a building hub retains construction evidence with an honest community empty state", () => {
        const html = render("example-c");
        metric(html, "Active hubs", "0");
        metric(html, "Example work records", "2");
        metric(html, "Learning &amp; community", "0");
        expect(html).toContain("No example learning or community records for this selection yet.");
        expect(html).not.toContain('data-stage="opening"');
        expect(html).not.toContain("temporarily unavailable");
    });

    test("an unknown URL selection falls back to the whole network", () => {
        const html = render("not-a-registered-hub");
        metric(html, "Example work records", "10");
        expect(html).toContain('value="all" selected=""');
    });

    test("one failed hub does not erase other records or turn a network total into a misleading zero", () => {
        const failed = { ...previewGardens[2], status: "unavailable", approvedWorkCount: null, records: [], historyComplete: false };
        const html = render("all", [previewGardens[0], previewGardens[1], failed]);
        metric(html, "Example work records", "—");
        expect(html.match(/data-testid="impact-record"/g)).toHaveLength(8);
        expect(html).toContain("some evidence is temporarily unavailable");
        metric(render("example-b", [previewGardens[0], previewGardens[1], failed]), "Example work records", "3");
    });

    test("example evidence is labelled and cannot be mistaken for live source links or TAS membership", () => {
        const html = render();
        expect(html).toContain("All three hubs, their figures and work records are illustrative");
        expect(html.match(/Design sample only/g)).toHaveLength(10);
        expect(html).not.toContain("View on Green Goods");
        expect(html).not.toContain("Read the original attestation");
        expect(html).not.toContain("Steward approved");
        expect(tasGardens.some(garden => garden.id.startsWith("example-"))).toBe(false);
        expect(html).toContain('id="locally-rooted"');
    });
});
