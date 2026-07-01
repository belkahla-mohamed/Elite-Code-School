import { test, expect } from "@playwright/test"

test.describe("New features", () => {

  test.describe("Admin login with email+password", () => {
    test("logs in with email and password", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 10000 })
      await expect(page.locator("h1")).toContainText("Dashboard")
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
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      const toast = page.locator("text=Identifiants incorrects").first()
      await expect(toast).toBeVisible({ timeout: 5000 })
    })

    test("toggles password visibility", async ({ page }) => {
      await page.goto("/admin-login")
      const passwordInput = page.locator('input[placeholder*="mot de passe"]')
      await passwordInput.fill("admin123")
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
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 10000 })
      await page.goto("/admin/enrollments")
      await page.waitForSelector("h1", { timeout: 5000 })
    })

    test("enrollments page shows pending requests and filters", async ({ page }) => {
      await expect(page.locator("h1")).toContainText("Inscriptions")
      await expect(page.locator("text=En attente")).toBeVisible()
      await expect(page.locator("text=Acceptées")).toBeVisible()
      await expect(page.locator("text=Refusées")).toBeVisible()
    })

    test("csv export button is present", async ({ page }) => {
      await expect(page.locator("text=CSV").or(page.locator("text=Télécharger"))).toBeVisible({ timeout: 3000 })
    })
  })

  test.describe("Analytics page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 10000 })
      await page.goto("/dashboard/analytics")
    })

    test("analytics page loads with charts", async ({ page }) => {
      await expect(page.locator("h1")).toContainText("Analytiques")
      await expect(page.locator("text=Élèves").first()).toBeVisible()
      const stat = page.locator("text=En attente").or(page.locator("text=0")).first()
      await expect(stat).toBeVisible({ timeout: 5000 })
      const chart = page.locator("text=Élèves par programme").or(page.locator("text=Aucune donnée")).first()
      await expect(chart).toBeVisible({ timeout: 5000 })
      const status = page.locator("text=Répartition des statuts").or(page.locator("text=Aucune donnée")).first()
      await expect(status).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe("Logout flow", () => {
    test("sidebar logout link navigates to admin-login", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 10000 })
      await page.goto("/api/auth/logout")
      await page.waitForURL("/admin-login", { timeout: 5000 })
      expect(page.url()).toContain("/admin-login")
    })

    test("redirects to login after logout", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 10000 })
      await page.goto("/api/auth/logout")
      await page.waitForURL("/admin-login", { timeout: 5000 })
      await page.goto("/dashboard")
      await page.waitForURL("/admin-login", { timeout: 5000 })
    })
  })

  test.describe("Public inscription form", () => {
    test("inscription form has multi-step flow", async ({ page }) => {
      await page.goto("/inscription")
      await expect(page.locator("text=Informations de l'élève")).toBeVisible()
      await page.fill('input[placeholder="Karim"]', "Test")
      await page.fill('input[placeholder="Benali"]', "User")
      await page.click("text=Suivant")
      await expect(page.locator("text=Choix du parcours")).toBeVisible()
    })
  })

  test.describe("Curricula CSV export", () => {
    test("curricula page has CSV export", async ({ page }) => {
      await page.goto("/admin-login")
      await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
      await page.fill('input[placeholder*="mot de passe"]', "admin123")
      await page.click('button[type="submit"]')
      await page.waitForURL("/dashboard", { timeout: 10000 })
      await page.goto("/admin/curricula")
      await expect(page.locator("h1")).toContainText("Programmes")
      await expect(page.locator("text=CSV").or(page.locator("text=Télécharger"))).toBeVisible({ timeout: 3000 })
    })
  })
})
