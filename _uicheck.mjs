import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const context = await browser.newContext({ baseURL: "http://localhost:3000" });
await context.request.post("/api/auth/admin", { data: { email: "admin@elitecodeschool.com", password: "admin1234" } });
const page = await context.newPage();
await page.goto("/admin/students/stu-youssef", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('button:has-text("Ajouter un projet")', { timeout: 30000 });

const form = page.locator("#project-form");
console.log("1 form hidden initially:", !(await form.isVisible().catch(() => false)));
console.log("1 add button visible:", await page.getByText("Ajouter un projet").first().isVisible());

await page.getByText("Ajouter un projet").first().click();
await page.waitForTimeout(400);
console.log("2 form visible after click:", await form.isVisible());

await form.getByText("Annuler").click();
await page.waitForTimeout(400);
console.log("3 form hidden after Annuler:", !(await form.isVisible().catch(() => false)));

await page.locator('button[aria-label^="Modifier"]').first().click();
await page.waitForTimeout(500);
console.log("4 pencil opens prefilled form:", await form.isVisible(), "| title:", await form.locator('input[name="title"]').inputValue());

const t = "HiddenUI " + Date.now();
await form.locator('input[name="title"]').fill(t);
await form.locator('input[name="description"]').fill("desc for hidden ui test");
await form.locator('button[type="submit"]').click();
await page.waitForTimeout(2000);
console.log("5 added + form auto-hidden:", (await page.content()).includes(t), "hidden:", !(await form.isVisible().catch(() => false)));
await browser.close();