const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "scratch/home-after-phase0.png", fullPage: false });
  await page.screenshot({ path: "scratch/home-full-after-phase0.png", fullPage: true });
  console.log("Screenshots saved");
  await browser.close();
})().catch(e => { console.error("FAIL:", e.message); process.exit(1); });
