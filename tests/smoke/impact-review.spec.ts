import { expect, test } from "@playwright/test";

// CI/clean-room regression coverage, not a substitute for authenticated Brave QA.
for (const route of ["/", "/about", "/impact"]) {
    test(`shared navigation and mobile drawer on ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: 393, height: 852 });
        await page.goto(route);
        const trigger = page.getByRole("button", { name: "Open navigation menu" });
        await trigger.click();
        const dialog = page.getByRole("dialog", { name: "Explore Tech & Sun" });
        await expect(dialog).toBeVisible();
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await expect(dialog.getByRole("link", { name: "Home", exact: true })).toBeVisible();
        await expect(dialog.locator('[aria-current="page"]')).toHaveAttribute("href", route);
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
        await trigger.click();
        await dialog.getByRole("link", { name: "About us", exact: true }).click();
        await expect(page).toHaveURL(/\/about$/);
        await expect(dialog).not.toBeVisible();
    });
}

test("Impact preview keeps unconfirmed sources and sample records distinct", async ({ page }) => {
    await page.goto("/impact");
    await expect(page.getByRole("link", { name: "Read the source report" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Public work records are not connected yet." })).toBeVisible();
    await page.getByRole("button", { name: "Layout preview · samples", exact: true }).click();
    await expect(page.getByText("Sample · not a live record", { exact: true })).toHaveCount(3);
    await page.getByRole("button", { name: "Infrastructure", exact: true }).click();
    await expect(page.getByText("Sample · not a live record", { exact: true })).toHaveCount(1);
    await page.getByLabel("Reporting month").selectOption("2026-10");
    await expect(page.getByTestId("impact-monthly").getByText("—", { exact: false })).toHaveCount(4);
});
