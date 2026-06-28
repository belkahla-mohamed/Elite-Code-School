import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("should load successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Elite Code School|Élite Code School|Elite/);
  });

  test("should have a visible heading", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });
});
