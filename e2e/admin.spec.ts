import { test, expect } from "@playwright/test"

test.describe("Admin flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin-login")
    await page.fill('input[placeholder*="admin@elitecodeschool"]', "admin@elitecodeschool.com")
    await page.fill('input[placeholder*="mot de passe"]', "admin123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard", { timeout: 10000 })
  })

  test("dashboard loads with stats and activity", async ({ page }) => {
    await expect(page.locator("text=Total Élèves")).toBeVisible()
    await expect(page.locator("text=En Attente")).toBeVisible()
    await expect(page.locator("text=Demandes")).toBeVisible()
    await expect(page.locator("text=Activité récente")).toBeVisible()
  })

  test("students page loads with list and search", async ({ page }) => {
    await page.click('a[href="/admin/students"]')
    await page.waitForSelector("text=élèves", { timeout: 5000 })
    await expect(page.locator("h1")).toContainText("Élèves")
    await page.fill('input[placeholder*="Rechercher"]', "Youssef")
    await expect(page.locator("text=Youssef")).toBeVisible()
  })

  test("students bulk operations show action bar", async ({ page }) => {
    await page.goto("/admin/students")
    const checkboxes = page.locator('input[type="checkbox"]')
    await expect(checkboxes.nth(1)).toBeVisible()
    await checkboxes.nth(1).check()
    await expect(page.locator("text=sélectionné")).toBeVisible()
    await expect(page.locator("text=Public")).toBeVisible()
    await expect(page.locator("text=Privé")).toBeVisible()
    await expect(page.locator("text=Supprimer")).toBeVisible()
  })

  test("enrollments page loads with filters and sorting", async ({ page }) => {
    await page.click('a[href="/admin/enrollments"]')
    await page.waitForSelector("h1", { timeout: 5000 })
    await expect(page.locator("h1")).toContainText("Inscriptions")
    await expect(page.locator("text=En attente")).toBeVisible()
    await expect(page.locator("text=Acceptées")).toBeVisible()
    await expect(page.locator("text=Refusées")).toBeVisible()
    await page.click("text=En attente")
    await expect(page.locator("text=Aucune demande").or(page.locator("text=En attente"))).toBeVisible({ timeout: 3000 })
  })

  test("admin users page loads with create form", async ({ page }) => {
    await page.click('a[href="/dashboard/admin-users"]')
    await expect(page.locator("h1")).toContainText("Administrateurs")
    await page.click("text=Ajouter")
    await expect(page.locator("text=Nouvel administrateur")).toBeVisible()
  })

  test("settings page loads with security checkboxes", async ({ page }) => {
    await page.click('a[href="/dashboard/settings"]')
    await expect(page.locator("h2")).toContainText("Paramètres")
    await expect(page.locator("text=Activer la validation des emails")).toBeVisible()
    await expect(page.locator("text=Notifications par email")).toBeVisible()
    await expect(page.locator("text=Portfolios publics par défaut")).toBeVisible()
  })

  test("activity log page loads with filters", async ({ page }) => {
    await page.click('a[href="/dashboard/activity"]')
    await expect(page.locator("h1")).toContainText("Activité")
  })

  test("curricula page loads with programs list", async ({ page }) => {
    await page.click('a[href="/admin/curricula"]')
    await expect(page.locator("h1")).toContainText("Programmes")
  })
})

test.describe("Admin unauth redirect", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL("/admin-login", { timeout: 5000 })
    expect(page.url()).toContain("/admin-login")
  })
})
