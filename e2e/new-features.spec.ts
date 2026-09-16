import { test, expect } from "@playwright/test"

test.describe("New features", () => {

  test.describe("Admin login with email+password", () => {
    test("logs in with email and password", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 15000 })
      await expect(page.locator("h1").first()).toContainText("Dashboard")
    })

    test("shows error on wrong password", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "wrongpass")
      await page.click('button[type="submit"]')
      const toast = page.locator("text=Identifiants incorrects").first()
      await expect(toast).toBeVisible({ timeout: 5000 })
    })

    test("shows error on wrong email", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "wrong@email.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      const error = page.locator("text=Identifiants incorrects").first()
      await expect(error).toBeVisible({ timeout: 10000 })
    })

    test("toggles password visibility", async ({ page }) => {
      await page.goto("/admin-login")
      const passwordInput = page.locator('input[placeholder*="mot de passe"]')
      await passwordInput.fill("admin1234")
      await expect(passwordInput).toHaveAttribute("type", "password")
      await page.click('button[aria-label="Afficher"]')
      await expect(passwordInput).toHaveAttribute("type", "text")
      await page.click('button[aria-label="Masquer"]')
      await expect(passwordInput).toHaveAttribute("type", "password")
    })
  })

  test.describe("Enrollment processing", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 15000 })
      await page.goto("/admin/enrollments")
      await page.waitForLoadState("networkidle")
    })

    test("enrollments page shows pending requests and filters", async ({ page }) => {
      await expect(page.locator("text=En attente").first()).toBeVisible({ timeout: 10000 })
      await expect(page.locator("text=Acceptées").first()).toBeVisible()
      await expect(page.locator("text=Refusées").first()).toBeVisible()
    })

    test("csv export button is present", async ({ page }) => {
      await expect(page.locator("text=CSV").or(page.locator("text=Télécharger")).first()).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe("Analytics page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 15000 })
      await page.goto("/dashboard/analytics")
      await page.waitForLoadState("networkidle")
    })

    test("analytics page loads with charts", async ({ page }) => {
      await expect(page.locator("text=Analytiques").first()).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe("Logout flow", () => {
    test("sidebar logout link navigates to admin-login", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 15000 })
      await page.goto("/api/auth/logout", { waitUntil: "commit" })
      await page.goto("/admin-login", { waitUntil: "networkidle" })
      expect(page.url()).toContain("/admin-login")
    })

    test("redirects to login after logout", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 15000 })
      await page.goto("/api/auth/logout", { waitUntil: "commit" })
      await page.goto("/admin-login", { waitUntil: "networkidle" })
      await page.goto("/dashboard")
      await page.waitForURL("/admin-login", { timeout: 5000 })
    })
  })

  test.describe("Public inscription form", () => {
    test("inscription form has multi-step flow", async ({ page }) => {
      await page.goto("/inscription")
      await page.waitForLoadState("networkidle")
      await expect(page.locator("text=Informations de l").first()).toBeVisible({ timeout: 15000 })
      await page.fill('input[placeholder="Karim"]', "Test")
      await page.fill('input[placeholder="Benali"]', "User")
      await page.click("text=Continuer")
      await expect(page.locator("h2:text('Choix du parcours')")).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe("Curricula CSV export", () => {
    test("curricula page has CSV export", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin1234")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 15000 })
      await page.goto("/admin/curricula")
      await page.waitForLoadState("networkidle")
      await expect(page.getByRole("heading", { name: "Programmes" })).toBeVisible({ timeout: 10000 })
      await expect(page.locator("text=CSV").or(page.locator("text=Télécharger")).first()).toBeVisible({ timeout: 3000 })
    })
  })
})
