import { describe, expect, test } from "bun:test";
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
        for (const label of ["Home", "About", "Impact"]) expect(source).toContain(`label: "${label}"`);
        expect(source).toContain('pathname === link.href ? "page" : undefined');
    });
    test("both navigation layouts hide Home only on home and list Impact before About", async () => {
        const source = await Bun.file("src/components/SiteHeader.tsx").text();
        expect(source).toContain('links.filter(link => link.href !== "/" || pathname !== "/")');
        expect(source).toContain("visibleLinks.map(link =>");
        expect(source.indexOf('label: "Impact"')).toBeLessThan(source.indexOf('label: "About"'));
        expect(source).toContain("{navigation()}");
        expect(source).toContain("{navigation(true)}");
    });
    test("shared primary buttons retain the homepage contact-button style", () => {
        for (const token of ["rounded-full", "bg-secondary", "px-8", "py-4", "font-heading", "text-lg", "font-bold", "text-dark", "shadow-lg", "focus-visible:outline"]) expect(buttonStyles()).toContain(token);
        expect(buttonStyles({ variant: "secondary" })).not.toContain("bg-secondary");
        expect(buttonStyles({ className: "mt-8" })).toContain("mt-8");
    });
    test("impact details contain mobile overflow and lock both page scroll roots", async () => {
        const card = await Bun.file("src/components/impact/ImpactRecordCard.tsx").text();
        const gallery = await Bun.file("src/components/impact/ImpactRecordGallery.tsx").text();
        for (const token of ["max-h-dvh", "max-w-full", "overflow-x-hidden", "document.documentElement.style.overflow", "break-words"]) expect(card).toContain(token);
        for (const token of ["w-full", "max-w-full", "overflow-hidden"]) expect(gallery).toContain(token);
    });
    test("about media and its compact hero label stay inside the mobile viewport", async () => {
        const carousel = await Bun.file("src/components/about/AboutHeroCarousel.tsx").text();
        const page = await Bun.file("src/app/about/page.tsx").text();
        expect(carousel).toContain('className="min-w-0 w-full max-w-full"');
        expect(carousel).toContain("overscroll-x-contain");
        expect(page).not.toContain("Community-led infrastructure · Access is free");
        expect(page).not.toContain("&nbsp;");
    });
    test("impact activity uses semantic metric artwork, date filtering and progressive pagination", async () => {
        const source = await Bun.file("src/components/impact/ImpactContent.tsx").text();
        for (const icon of ["/icons/approved-work.svg", "/icons/hub-development.svg", "/icons/learning-community.svg"]) expect(source).toContain(icon);
        expect(source).not.toContain('/Internet (Starlink) green.png');
        for (const control of ["Filter by recorded month", "All recorded months", "Show more community records", "Show more recorded work"]) expect(source).toContain(control);
        expect(source).toContain("RECORD_PAGE_SIZE");
    });
    test("about gallery omits the tilted interior photographs", async () => {
        const source = await Bun.file("src/components/about/AboutHeroCarousel.tsx").text();
        expect(source).not.toContain("/album/07-power-inverter.jpeg");
        expect(source).not.toContain("/album/10-interior-desks.jpeg");
    });
    test("footer presents the verified incorporated-trustee identity", async () => {
        const source = await Bun.file("src/components/sections/Footer.tsx").text();
        expect(source).toContain("Technology and Solar Support Foundation");
        expect(source).toContain("Incorporated Trustee");
        expect(source).toContain("CAC IT No. 9929336");
        expect(source).toContain("© 2026");
    });
    test("operating documents remain unpublished while they are still being developed", async () => {
        const source = await Bun.file("src/app/about/page.tsx").text();
        expect(source).toContain("See hub activities");
        expect(source).not.toContain("NEXT_PUBLIC_TAS_OPERATING_DOCUMENTS_URL");
        expect(source).not.toContain("Read our public operating documents");
        expect(source).not.toContain('href="/#activities">Read our documentation');
    });
});
