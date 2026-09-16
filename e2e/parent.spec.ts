import { test, expect } from "@playwright/test"

test.describe("Parent portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[type="email"]', "parent.youssef@example.com")
    await page.fill('input[placeholder*="secret"]', "YOUSSEF-2026")
    await page.click('button[type="submit"]')
    await page.waitForURL("/parent", { timeout: 10000 })
  })

  test("dashboard loads with student info", async ({ page }) => {
    await expect(page.locator("text=Youssef").first()).toBeVisible()
    await expect(page.locator("text=Notifications").first()).toBeVisible()
  })

  test("portfolio page shows tabs", async ({ page }) => {
    await page.click('a[href="/parent/portfolio"]')
    await expect(page.locator("text=Projets").first()).toBeVisible()
    await expect(page.locator("text=Certificats").first()).toBeVisible()
    await expect(page.locator("text=Galerie").first()).toBeVisible()
  })

  test("certifications page loads", async ({ page }) => {
    await page.click('a[href="/parent/certifications"]')
    await expect(page.locator("h1").first()).toContainText("Certifications")
  })

  test("report page loads with PDF button", async ({ page }) => {
    await page.click('a[href="/parent/report"]')
    await expect(page.locator("h1").first()).toContainText("Rapport")
    await expect(page.locator("text=Télécharger PDF").first()).toBeVisible()
  })

  test("privacy page has toggle", async ({ page }) => {
    await page.click('a[href="/parent/privacy"]')
    await expect(page.locator("text=Portfolio public").first()).toBeVisible()
  })
})

test.describe("Parent unauth redirect", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/parent")
    await page.waitForURL("/login", { timeout: 5000 })
    expect(page.url()).toContain("/login")
  })
})
