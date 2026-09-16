import { test, expect } from "@playwright/test"

test.describe("Public pages", () => {
  test("home page loads with heading", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.ok()).toBe(true)
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("portfolios list shows public students", async ({ page }) => {
    await page.goto("/portfolios")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("heading", { name: /apprennent|créent/i })).toBeVisible({ timeout: 10000 })
  })

  test("curricula page shows programs", async ({ page }) => {
    await page.goto("/curricula")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("heading", { name: /Choisis le parcours/i })).toBeVisible({ timeout: 10000 })
  })

  test("inscription page has form", async ({ page }) => {
    await page.goto("/inscription")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("heading", { name: /Inscription/i })).toBeVisible({ timeout: 10000 })
  })

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("heading", { name: /Contact/i }).first()).toBeVisible({ timeout: 10000 })
  })

  test("about page loads", async ({ page }) => {
    await page.goto("/about")
    await page.waitForLoadState("networkidle")
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 })
  })
})
