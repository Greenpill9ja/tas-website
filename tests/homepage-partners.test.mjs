import { describe, expect, test } from "bun:test";

describe("homepage partner strip", () => {
    test("uses Green Goods branding in both copies of the scrolling strip", async () => {
        const source = await Bun.file("src/components/sections/Hero.tsx").text();

        expect(source.match(/name: "Green Goods"/g)).toHaveLength(2);
        expect(source.match(/logo: "\/green-goods\.webp"/g)).toHaveLength(2);
        expect(source).not.toContain("Greenpill Dev Guild");
        expect(source).not.toContain("/Dev-Guild.png");
        expect(await Bun.file("public/green-goods.webp").exists()).toBe(true);
    });
});
