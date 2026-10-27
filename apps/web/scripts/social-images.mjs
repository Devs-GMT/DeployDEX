// Renders the X (Twitter) post images and profile banner into docs/social/ using the locally installed Edge.
// Usage (repo root): node apps/web/scripts/social-images.mjs
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

const pub = pathToFileURL(process.cwd() + "/apps/web/public/").href;
const icon = pathToFileURL(process.cwd() + "/apps/web/src/app/icon.svg").href;
const out = "docs/social";
const shots = pathToFileURL(process.cwd() + "/docs/social/shots/").href;
const tmp = `${out}/.tmp`;
mkdirSync(tmp, { recursive: true });

const css = `
*{box-sizing:border-box;margin:0}
:root{--page:#f6f6f6;--ink:#191919;--muted:#5f5f5f;--brand:#ff5c00;--peach:#ffdecc;--pink:#ff405d;--line:#e1e1e1;--live:#22c55e}
body{background:var(--page);color:var(--ink);font-family:"Segoe UI",system-ui,sans-serif;overflow:hidden;position:relative}
.mono{font-family:"Cascadia Mono",Consolas,ui-monospace,monospace;letter-spacing:-0.05em}
.serif{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;color:var(--brand);letter-spacing:-0.02em}
.dots{position:absolute;inset:0;background-image:radial-gradient(#d9d9d9 2px,transparent 2px);background-size:36px 36px;opacity:.7}
.blob{position:absolute;border-radius:50%;background:var(--peach)}
.kit{position:absolute;filter:drop-shadow(0 24px 30px rgba(120,45,0,.18))}
.live{display:inline-flex;align-items:center;gap:12px;background:var(--ink);color:#fff;border-radius:999px;padding:14px 26px;font-weight:600}
.live i{width:14px;height:14px;border-radius:50%;background:var(--live);box-shadow:0 0 0 6px rgba(34,197,94,.25)}
.pill{display:inline-block;background:#fff;border:2px solid var(--line);border-radius:999px;padding:8px 20px;font-weight:600;color:var(--muted)}
.card{background:#fff;border:2px solid var(--line);border-radius:28px;box-shadow:0 18px 40px rgba(25,25,25,.07)}
.logo{position:absolute;top:56px;left:72px;display:flex;align-items:center;gap:16px;font-size:34px;font-weight:600}
.logo img{width:56px;height:56px;border-radius:14px}
.foot{position:absolute;left:72px;bottom:52px;display:flex;align-items:center;gap:20px;font-size:26px;color:var(--muted)}
h1{font-weight:500;line-height:.98}
mark{background:linear-gradient(transparent 62%,var(--peach) 62%,var(--peach) 92%,transparent 92%);color:inherit}
`;
const logo = `<div class="logo mono"><img src="${icon}">DeployDex</div>`;
const foot = (t = "deploydex.my.id") =>
  `<div class="foot mono"><span class="live" style="font-size:24px;padding:10px 22px"><i></i>LIVE on @Botchain_ai</span>${t}</div>`;
const kit = (n, style) => `<img class="kit" src="${pub}kit/${n}.webp" style="${style}">`;
const cat = (s, size = 150) =>
  `<img src="${pub}category/${s}-512.webp" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:24px">`;


/** Real site screenshot in a browser frame (top promo banner cropped), headline on the left, Kit peeking in. */
const shotPage = ({ shot, kitName, title, sub, url }) => `
  <div class="dots"></div><div class="blob" style="width:560px;height:560px;right:-140px;top:-120px"></div>
  ${logo}
  <div style="position:absolute;left:72px;top:190px;width:520px">
    <h1 class="mono" style="font-size:64px">${title}</h1>
    <p style="font-size:28px;color:var(--muted);margin-top:30px;line-height:1.4">${sub}</p>
  </div>
  <div class="card" style="position:absolute;left:640px;top:120px;width:900px;height:580px;overflow:hidden;border-radius:22px">
    <div style="height:44px;background:#fff;border-bottom:2px solid var(--line);display:flex;align-items:center;gap:8px;padding:0 18px">
      <i style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></i><i style="width:12px;height:12px;border-radius:50%;background:#febc2e"></i><i style="width:12px;height:12px;border-radius:50%;background:#28c840"></i>
      <span class="mono" style="margin-left:18px;font-size:16px;color:var(--muted);letter-spacing:0">${url}</span>
    </div>
    <div style="height:534px;overflow:hidden"><img src="${shots}${shot}.png" style="display:block;width:900px;margin-top:-28px"></div>
  </div>
  ${kit(kitName, "right:10px;top:600px;width:300px")}
  ${foot()}`;

const W = 1600;
const H = 900;
const pages = [
  ["post-1-hero", W, H, `
    <div class="dots"></div><div class="blob" style="width:760px;height:760px;right:-120px;top:70px"></div>
    ${logo}
    <div style="position:absolute;left:72px;top:210px;width:880px">
      <span class="pill mono" style="font-size:26px">On-chain directory · BOT Chain</span>
      <h1 class="mono" style="font-size:112px;margin-top:34px">The home of<br><mark>BOT Chain</mark> <span class="serif" style="font-size:120px">dApps</span></h1>
      <p style="font-size:34px;color:var(--muted);margin-top:34px;line-height:1.35">Ship it. List it. Get starred.</p>
    </div>
    ${kit("dev", "right:20px;top:150px;width:700px")}
    ${foot()}`],
  ["post-2-list", W, H, shotPage({
    shot: "list", kitName: "hackathon",
    title: 'List your dApp<br>in <span class="serif" style="font-size:72px">a minute</span>',
    sub: "Live checks while you type: contract on BOT Chain, not already listed, public GitHub repo, https:// live URL.",
    url: "deploydex.my.id/list" })],
  ["post-3-stars", W, H, shotPage({
    shot: "project", kitName: "party",
    title: 'Stars live<br><span class="serif" style="font-size:72px">on-chain</span>',
    sub: "One star per wallet, no self-stars. A trust report on every project page.",
    url: "deploydex.my.id/dapps/0" })],
  ["post-4-browse", W, H, shotPage({
    shot: "dapps", kitName: "astro",
    title: 'Browse every<br>dApp, <span class="serif" style="font-size:72px">no wallet</span>',
    sub: "Search, filter by shelf, sort by stars. Works without MetaMask.",
    url: "deploydex.my.id/dapps" })],
  ["x-banner", 1500, 500, `
    <div class="dots"></div><div class="blob" style="width:520px;height:520px;right:40px;top:-20px"></div>
    <div style="position:absolute;left:400px;top:92px;width:900px">
      <div class="logo mono" style="position:static;font-size:30px"><img src="${icon}" style="width:48px;height:48px">DeployDex</div>
      <h1 class="mono" style="font-size:62px;margin-top:22px;white-space:nowrap">The home of <mark>BOT Chain</mark><br><span class="serif" style="font-size:78px">dApps</span></h1>
      <div style="margin-top:26px;display:flex;align-items:center;gap:18px;font-size:22px"><span class="live" style="padding:10px 22px"><i></i>LIVE on @Botchain_ai</span><span class="mono" style="color:var(--muted)">Ship it. List it. Get starred.</span></div>
    </div>
    ${kit("dev", "right:40px;top:50px;width:430px")}`],
];

const browser = await chromium.launch({ channel: "msedge" });
for (const [name, w, h, body] of pages) {
  const file = `${tmp}/${name}.html`;
  writeFileSync(file, `<!doctype html><meta charset="utf-8"><style>${css}body{width:${w}px;height:${h}px}</style><body>${body}</body>`);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(pathToFileURL(process.cwd() + "/" + file).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(`${out}/${name}.png`);
  await page.close();
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
