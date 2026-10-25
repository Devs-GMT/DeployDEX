// Scroll-position screenshots for checking scroll scenes, using the locally installed Edge.
// Usage: node scripts/shots.mjs <url> <outDir> [width] [--reduced] [--at=0,0.4,0.8,...|--sections]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const [url = "http://localhost:3100/", out = "shots", widthArg = "1440", ...flags] = process.argv.slice(2);
const width = Number(widthArg);
const reduced = flags.includes("--reduced");
const atFlag = flags.find((f) => f.startsWith("--at="));
const bySections = flags.includes("--sections");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  viewport: { width, height: width < 768 ? 844 : 900 },
  reducedMotion: reduced ? "reduce" : "no-preference",
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(3500); // let the intro timeline finish

const vh = page.viewportSize().height;
let stops;
if (bySections) {
  stops = await page.$$eval("main > section, main > div > section, footer", (els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY)),
  );
} else {
  const fractions = (atFlag ? atFlag.slice(5) : "0").split(",").map(Number);
  stops = fractions.map((f) => Math.round(f * vh));
}

let i = 0;
for (const y of stops) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1400); // scrubbed tweens catch up
  const name = `${out}/${String(i++).padStart(2, "0")}-${width}-${y}.png`;
  await page.screenshot({ path: name });
  console.log(name);
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(`horizontal overflow: ${overflow}px`);
await browser.close();
