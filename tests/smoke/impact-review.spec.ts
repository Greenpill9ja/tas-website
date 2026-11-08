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

test("Impact shows real evidence sections without preview controls", async ({ page }) => {
    await page.goto("/impact");
    await expect(page.getByRole("heading", { name: "Local infrastructure. Shared possibilities.", exact: true })).toBeVisible();
    await expect(page.getByTestId("impact-overview")).toBeVisible();
    await expect(page.getByRole("button", { name: /preview|samples/i })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "In loving memory of Izzy" })).toHaveCount(0);
    await page.getByLabel("View impact for").selectOption("awka");
    await expect(page.getByTestId("impact-construction")).toBeAttached();
    await expect(page.getByTestId("impact-community")).toBeAttached();
    const records = page.getByTestId("impact-record");
    if (await records.count()) {
        await records.first().getByRole("button", { name: /View impact details for/ }).click();
        await expect(page.getByRole("dialog").getByRole("link", { name: "Read the original attestation" })).toHaveAttribute("href", /^https:\/\/arbitrum\.easscan\.org\/attestation\/view\/0x/);
    } else {
        await expect(page.getByTestId("impact-scope")).toBeVisible();
    }
});

test("Impact image selection carries between the card, desktop modal and mobile sheet", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/impact/preview?hub=example-a");
    const card = page.getByTestId("impact-record").filter({ has: page.getByRole("heading", { name: "A place to start", exact: true }) });
    const trigger = card.getByRole("button", { name: "View impact details for A place to start" });
    const dialog = page.getByRole("dialog", { name: "A place to start" });

    await card.getByRole("button", { name: "Next image" }).click();
    await expect(card.getByText("Image 2 of 2", { exact: true })).toBeVisible();
    await expect(card.getByRole("img")).toHaveAttribute("src", "/album/01-container-ground.jpeg");
    await expect(dialog).not.toBeVisible();

    await trigger.click();
    await expect(dialog.getByText("Image 2 of 2", { exact: true })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Open original image" })).toHaveAttribute("href", "/album/01-container-ground.jpeg");
    const desktopBounds = await dialog.boundingBox();
    expect(desktopBounds?.x).toBeGreaterThan(0);
    expect(desktopBounds?.y).toBeGreaterThan(0);

    await dialog.getByRole("button", { name: "Next image" }).click();
    await expect(dialog.getByText("Image 1 of 2", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(card.getByText("Image 1 of 2", { exact: true })).toBeVisible();

    await page.setViewportSize({ width: 393, height: 852 });
    await trigger.click();
    const mobileBounds = await dialog.boundingBox();
    expect(mobileBounds?.width).toBe(393);
    expect(mobileBounds!.y + mobileBounds!.height).toBeCloseTo(852, 0);
    await expect(dialog.getByText("Image 1 of 2", { exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Close impact details" }).click();
    await expect(dialog).not.toBeVisible();
});
