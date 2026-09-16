import { test, expect } from "@playwright/test"

test.describe("Admin flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin-login")
    await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
    await page.fill('input[placeholder*="mot de passe"]', "admin1234")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard", { timeout: 15000 })
  })

  test("dashboard loads with stats and activity", async ({ page }) => {
    await expect(page.locator("text=Total Élèves")).toBeVisible()
    await expect(page.locator("text=En Attente").first()).toBeVisible()
    await expect(page.locator("text=Acceptées").first()).toBeVisible()
    await expect(page.locator("text=Activité récente").first()).toBeVisible()
  })

  test("students page loads with list and search", async ({ page }) => {
    await page.goto("/admin/students")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("main").getByRole("heading", { name: "Élèves" })).toBeVisible({ timeout: 10000 })
    await page.fill('input[placeholder*="Rechercher"]', "Youssef")
    await expect(page.locator("text=Youssef").first()).toBeVisible()
  })

  test("students bulk operations show action bar", async ({ page }) => {
    await page.goto("/admin/students")
    await page.waitForLoadState("networkidle")
    const checkboxes = page.locator('input[type="checkbox"]')
    await expect(checkboxes.nth(1)).toBeVisible({ timeout: 10000 })
    await checkboxes.nth(1).check()
    await expect(page.locator("text=sélectionné").first()).toBeVisible()
  })

  test("enrollments page loads with filters and sorting", async ({ page }) => {
    await page.goto("/admin/enrollments")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("main").getByRole("heading", { name: "Inscriptions" })).toBeVisible({ timeout: 10000 })
    await expect(page.locator("text=En attente").first()).toBeVisible()
    await expect(page.locator("text=Acceptées").first()).toBeVisible()
    await expect(page.locator("text=Refusées").first()).toBeVisible()
  })

  test("admin users page loads with create form", async ({ page }) => {
    await page.goto("/dashboard/admin-users")
    await page.waitForLoadState("networkidle")
    await expect(page.locator("text=Ajouter").first()).toBeVisible({ timeout: 10000 })
  })

  test("settings page loads with security checkboxes", async ({ page }) => {
    await page.goto("/dashboard/settings")
    await page.waitForLoadState("networkidle")
    await expect(page.locator("text=Validation des emails").first()).toBeVisible({ timeout: 10000 })
  })

  test("activity log page loads with filters", async ({ page }) => {
    await page.goto("/dashboard/activity")
    await page.waitForLoadState("networkidle")
    await expect(page.locator("text=Journal d").first()).toBeVisible({ timeout: 10000 })
  })

  test("curricula page loads with programs list", async ({ page }) => {
    await page.goto("/admin/curricula")
    await page.waitForLoadState("networkidle")
    await expect(page.getByRole("heading", { name: "Programmes" })).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Admin unauth redirect", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL("/admin-login", { timeout: 5000 })
    expect(page.url()).toContain("/admin-login")
  })
})
