import { expect, test, type Page } from "@playwright/test";

function collectRuntimeErrors(page: Page) {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    return { consoleErrors, pageErrors };
}

test("about page presents verified TAS context and hub status", async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page);

    await page.goto("/about", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: /About Tech & Sun/i })).toBeVisible();
    await expect(page.getByText(/Tech & Sun is a nonprofit community infrastructure initiative/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Why TAS exists/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Active hub/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Coming next/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Get in touch/i })).toBeVisible();
    await expect(page.getByText(/24\/7 electricity/i)).toHaveCount(0);

    expect(runtimeErrors.consoleErrors).toEqual([]);
    expect(runtimeErrors.pageErrors).toEqual([]);
});

test("about page remains readable without horizontal overflow on mobile", async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page);
    await page.setViewportSize({ width: 393, height: 852 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about", { waitUntil: "networkidle" });

    const overflow = await page.locator("main").evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
    }));

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    await expect(page.getByRole("link", { name: /Partner with TAS/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /How a hub grows/i })).toBeVisible();
    expect(runtimeErrors.consoleErrors).toEqual([]);
    expect(runtimeErrors.pageErrors).toEqual([]);
});
