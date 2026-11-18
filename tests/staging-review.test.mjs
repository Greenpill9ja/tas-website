import { expect, test } from "bun:test";

test("November staging review removes repeated and misleading presentation", async () => {
    const about = await Bun.file("src/app/about/page.tsx").text();
    expect(about).not.toContain("Schedule a call");
    expect(about).toContain("Contact the team");
    expect(about).toContain("<Footer showMemorial={false} />");
    const gallery = await Bun.file("src/components/about/AboutHeroCarousel.tsx").text();
    expect(gallery).not.toContain("01-izzy-memorial.jpeg");
    expect(gallery).not.toContain("11-izzy-framed-portrait.jpeg");
    expect(gallery.indexOf("15-active-workspace.jpeg")).toBeLessThan(gallery.indexOf("12-hub-video-highlight.mp4"));
    for (const route of ["src/app/impact/page.tsx", "src/app/impact/preview/page.tsx"]) {
        expect(await Bun.file(route).text()).toContain("showTeam={false}");
    }
    const impact = await Bun.file("src/components/impact/ImpactContent.tsx").text();
    expect(impact).toContain('item.kind === "approved" && item.consentRecordedAt');
    expect(impact).not.toContain("Talk with the TAS team");
    expect(impact).toContain("Filter by recorded month");
});
