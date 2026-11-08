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
        for (const label of ["Home", "About us", "Impact"]) expect(source).toContain(`label: "${label}"`);
        expect(source).toContain('pathname === link.href ? "page" : undefined');
    });
    test("both navigation layouts hide Home only on home and list Impact before About us", async () => {
        const source = await Bun.file("src/components/SiteHeader.tsx").text();
        expect(source).toContain('links.filter(link => link.href !== "/" || pathname !== "/")');
        expect(source).toContain("visibleLinks.map(link =>");
        expect(source.indexOf('label: "Impact"')).toBeLessThan(source.indexOf('label: "About us"'));
        expect(source).toContain("{navigation()}");
        expect(source).toContain("{navigation(true)}");
    });
    test("shared primary buttons retain the homepage contact-button style", () => {
        for (const token of ["rounded-full", "bg-secondary", "px-8", "py-4", "font-heading", "text-lg", "font-bold", "text-dark", "shadow-lg", "focus-visible:outline"]) expect(buttonStyles()).toContain(token);
        expect(buttonStyles({ variant: "secondary" })).not.toContain("bg-secondary");
        expect(buttonStyles({ className: "mt-8" })).toContain("mt-8");
    });
});
