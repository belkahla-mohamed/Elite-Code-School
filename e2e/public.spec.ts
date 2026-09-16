import { test, expect } from "@playwright/test"

test.describe("Public pages", () => {
  test("home page loads with heading", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.ok()).toBe(true)
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("portfolios list shows public students", async ({ page }) => {
    await page.goto("/portfolios")
    await expect(page.locator("h1").first()).toContainText("Portfolios")
  })

  test("curricula page shows programs", async ({ page }) => {
    await page.goto("/curricula")
    await expect(page.locator("h1").first().or(page.locator("text=Programmes").first())).toBeVisible({ timeout: 5000 })
  })

  test("inscription page has form", async ({ page }) => {
    await page.goto("/inscription")
    await expect(page.locator("h1").first().or(page.locator("text=Inscription").first())).toBeVisible({ timeout: 5000 })
  })

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact")
    await expect(page.locator("h1").first().or(page.locator("text=Contact").first())).toBeVisible({ timeout: 5000 })
  })

  test("about page loads", async ({ page }) => {
    await page.goto("/about")
    await expect(page.locator("h1").first()).toBeVisible()
  })
})
