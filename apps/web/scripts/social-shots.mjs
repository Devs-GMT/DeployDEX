// Captures real screenshots of the live site for the X post images (docs/social/shots/).
// Usage (repo root): node apps/web/scripts/social-shots.mjs [baseUrl]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const base = (process.argv[2] ?? "https://www.deploydex.my.id").replace(/\/$/, "");
const out = "docs/social/shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });

/** [file, path, scrollY] */
const shots = [
  ["home", "/", 0],
  ["dapps", "/dapps", 0],
  ["list", "/list", 0],
  ["stats", "/stats", 0],
];
for (const [name, path, y] of shots) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // intro timeline + chain reads
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(`${out}/${name}.png`);
}

// first project page, if any card links to one
await page.goto(base + "/dapps", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
const href = await page.$$eval("a[href^='/dapps/']", (as) => as[0]?.getAttribute("href") ?? null);
if (href) {
  await page.goto(base + href, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${out}/project.png` });
  console.log(`${out}/project.png (${href})`);
}
await browser.close();
