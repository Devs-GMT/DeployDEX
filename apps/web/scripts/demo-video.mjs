// Records a narrated demo of the live site: Windows TTS narration + Playwright screen capture, muxed with ffmpeg.
// Usage (repo root): FFMPEG=<path to ffmpeg.exe> node apps/web/scripts/demo-video.mjs [baseUrl] [outFile]
// Needs Edge (playwright-core channel) and the Windows System.Speech voices (Zira/David).
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, statSync, rmSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const base = (process.argv[2] ?? "https://www.deploydex.my.id").replace(/\/$/, "");
const outFile = process.argv[3] ?? "docs/social/deploydex-demo.mp4";
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const VOICE = process.env.VOICE ?? "Microsoft Zira Desktop";
const work = "docs/social/.demo-tmp";
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pub = pathToFileURL(process.cwd() + "/apps/web/public/").href;
const icon = pathToFileURL(process.cwd() + "/apps/web/src/app/icon.svg").href;

// ---------------------------------------------------------------- narration
const narration = [
  "This is DeployDex, the on-chain home of BOT Chain dApps. Every listing points to a real contract, checked on chain, so what you see is what actually exists. Say hi to Kit, our orange tabby, who hosts the shelf.",
  "There is no backend and no database. The site reads the registry smart contract directly, so you can browse everything without a wallet, and even without MetaMask installed.",
  "In the directory you can search by name, filter by shelf, like A I, R W A, or Dev tools, and sort by most starred, newest, or recently updated.",
  "Open any project to see its trust report. The contract on BOT Chain, the GitHub repo, who listed it, and when. Star it to show some love. One star per wallet, stored on chain, and you can't star your own project.",
  "Listing your own dApp takes about a minute. Add a name and tagline, paste your contract address and your public GitHub repo. Inspector Kit checks everything live while you type. Nothing is written on chain until you confirm in your wallet.",
  "The Dex stats page shows listings per week and shelves per category, read straight from the chain. No analytics, just what the contract says.",
  "DeployDex is live on BOT Chain. Ship it. List it. Get starred. Visit deploydex dot my dot id, and bring your dApp to the shelf.",
];

const synthPs = `${work}/synth.ps1`;
writeFileSync(
  synthPs,
  `param($voice,$in,$out)
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice($voice)
$s.Rate = 0
$s.SetOutputToWaveFile($out)
$s.Speak([IO.File]::ReadAllText($in))
$s.Dispose()`,
);
const wavs = narration.map((text, i) => {
  const txt = `${work}/n${i}.txt`;
  const wav = `${work}/n${i}.wav`;
  writeFileSync(txt, text);
  execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", synthPs, VOICE, txt, wav]);
  const b = readFileSync(wav);
  const byteRate = b.readUInt32LE(28);
  const ms = Math.round(((b.length - 44) / byteRate) * 1000);
  return { wav, ms };
});
const PAD = 900; // breathing room after each line
const durations = wavs.map((w) => w.ms + PAD);
console.log("scene ms:", durations.join(", "), "total:", Math.round(durations.reduce((a, b) => a + b) / 1000) + "s");

// ---------------------------------------------------------------- recording
const W = 1600;
const H = 900;
const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({
  viewport: { width: W, height: H },
  recordVideo: { dir: work, size: { width: W, height: H } },
});
// Playwright's video has no cursor; draw one that follows the mouse.
await context.addInitScript(() => {
  addEventListener("DOMContentLoaded", () => {
    const c = document.createElement("div");
    c.style.cssText =
      "position:fixed;z-index:2147483647;pointer-events:none;width:22px;height:22px;margin:-4px 0 0 -4px;border-radius:50%;background:rgba(255,92,0,.85);border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.35);left:-50px;top:-50px;transition:transform .1s";
    document.documentElement.appendChild(c);
    addEventListener("mousemove", (e) => {
      c.style.left = e.clientX + "px";
      c.style.top = e.clientY + "px";
    });
    addEventListener("mousedown", () => (c.style.transform = "scale(.7)"));
    addEventListener("mouseup", () => (c.style.transform = "scale(1)"));
  });
});
const recStart = Date.now();
const page = await context.newPage();
page.setDefaultTimeout(4000);

const move = (x, y, steps = 35) => page.mouse.move(x, y, { steps });
const safe = async (fn) => {
  try {
    await fn();
  } catch (e) {
    console.warn("  skipped step:", String(e.message).split("\n")[0]);
  }
};
async function scrollBy(total, ms) {
  // time-based so the scroll always takes `ms`, however slow each wheel call is
  const t0 = Date.now();
  let done = 0;
  while (done < total) {
    const frac = Math.min(1, (Date.now() - t0) / ms);
    const target = total * frac;
    const d = Math.round(target - done);
    if (d > 0) {
      await page.mouse.wheel(0, d);
      done += d;
    }
    if (frac >= 1) break;
    await sleep(30);
  }
}
const go = async (path) => {
  await page.goto(base + path, { waitUntil: "networkidle", timeout: 30000 });
  await sleep(1500);
};

const endCard = `${work}/endcard.html`;
writeFileSync(
  endCard,
  `<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#f6f6f6;font-family:"Cascadia Mono",Consolas,monospace;color:#191919;overflow:hidden;position:relative;display:flex;align-items:center}
.dots{position:absolute;inset:0;background-image:radial-gradient(#d9d9d9 2px,transparent 2px);background-size:36px 36px;opacity:.7}
.blob{position:absolute;width:760px;height:760px;border-radius:50%;background:#ffdecc;right:-80px;top:70px}
img.k{position:absolute;right:30px;top:140px;width:680px;filter:drop-shadow(0 24px 30px rgba(120,45,0,.18))}
.t{position:relative;margin-left:90px;width:800px}h1{font-size:104px;font-weight:500;letter-spacing:-0.05em;line-height:1}
.s{font-size:38px;color:#5f5f5f;margin-top:26px;font-family:"Segoe UI",sans-serif}.u{font-size:40px;margin-top:40px;color:#ff5c00;font-weight:600}
.live{display:inline-flex;gap:12px;align-items:center;background:#191919;color:#fff;border-radius:999px;padding:14px 28px;margin-top:34px;font-size:28px;font-weight:600;font-family:"Segoe UI",sans-serif}
.live i{width:14px;height:14px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 6px rgba(34,197,94,.25)}
.logo{display:flex;align-items:center;gap:18px;font-size:40px;font-weight:600;margin-bottom:30px}.logo img{width:64px;height:64px;border-radius:16px}
</style><div class="dots"></div><div class="blob"></div><img class="k" src="${pub}kit/party.webp">
<div class="t"><div class="logo"><img src="${icon}">DeployDex</div><h1>Ship it.<br>List it.<br>Get starred.</h1>
<div class="u">deploydex.my.id</div><span class="live"><i></i>LIVE on @Botchain_ai</span></div>`,
);

const scenes = [
  // 1 · home hero
  async (mark) => {
    await go("/");
    mark();
    await move(1300, 300);
    await sleep(3000);
    await move(1360, 98, 60); // "Browse dApps" area
    await sleep(2500);
    await move(900, 520, 60);
  },
  // 2 · scroll the home page
  async () => {
    await move(800, 500);
    await scrollBy(1800, durations[1] - 1500);
  },
  // 3 · directory: filters, sort, search
  async (mark) => {
    await go("/dapps");
    mark();
    await safe(async () => {
      const chip = page.locator("button", { hasText: /^AI\s*\d/ });
      await chip.hover();
      await chip.click();
    });
    await sleep(1500);
    await safe(async () => {
      await page.locator("button", { hasText: /^Dev tools\s*\d/ }).click();
    });
    await sleep(1200);
    await safe(async () => {
      await page.locator("button", { hasText: /^All\s*\d/ }).click();
    });
    await sleep(800);
    await safe(async () => {
      await page.locator("button", { hasText: /^Newest$/ }).click();
    });
    await sleep(1000);
    await safe(async () => {
      const search = page.getByPlaceholder(/search/i).first();
      await search.click();
      await search.pressSequentially("velora", { delay: 140 });
    });
    await sleep(1500);
    await safe(async () => {
      await page.getByPlaceholder(/search/i).first().fill("");
    });
    await scrollBy(300, 1500);
  },
  // 4 · project page: trust info, star
  async (mark) => {
    await go("/dapps/0");
    await page.getByText("On-chain info").first().waitFor();
    mark();
    await move(900, 480);
    await scrollBy(420, 4000);
    await safe(async () => {
      await page.getByRole("button", { name: /star/i }).first().scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: /star/i }).first().hover();
    });
    await sleep(3000);
    await safe(async () => {
      await page.getByRole("link", { name: /github/i }).first().hover();
    });
  },
  // 5 · list form with live checks
  async (mark) => {
    await go("/list");
    mark();
    await scrollBy(340, 1500);
    await safe(async () => {
      await page.locator("#name").click();
      await page.locator("#name").pressSequentially("Kit's Canvas", { delay: 60 });
      await page.locator("#tagline").click();
      await page.locator("#tagline").pressSequentially("Draw, mint and remix on-chain art", { delay: 35 });
    });
    await sleep(800);
    await scrollBy(420, 1500);
    await safe(async () => {
      await page.locator("#target").click();
      await page.locator("#target").pressSequentially("0xD5452816194a3784dBa983426cCe7c122F4abd30", { delay: 25 });
    });
    await sleep(2500);
    await safe(async () => {
      await page.locator("#liveUrl").click();
      await page.locator("#liveUrl").pressSequentially("www.deploydex.my.id", { delay: 40 });
      await page.locator("#repo").click();
      await page.locator("#repo").pressSequentially("vercel/next.js", { delay: 40 });
    });
    await sleep(3000);
  },
  // 6 · stats
  async (mark) => {
    await go("/stats");
    mark();
    await move(900, 600);
    await sleep(2500);
    await scrollBy(700, durations[5] - 6500);
  },
  // 7 · end card
  async () => {
    await page.goto(pathToFileURL(process.cwd() + "/" + endCard).href);
  },
];

const starts = [];
for (let i = 0; i < scenes.length; i++) {
  let marked = null;
  const mark = () => (marked ??= Date.now());
  console.log(`scene ${i + 1}`);
  if (scenes[i].length === 0) mark(); // scenes without a page load start narrating immediately
  await safe(() => scenes[i](mark));
  mark();
  starts.push(marked - recStart);
  const left = marked + durations[i] - Date.now();
  if (left > 0) await sleep(left);
  else console.warn(`  scene ${i + 1} overran by ${-left}ms`);
}
const videoPath = await page.video().path();
await context.close();
await browser.close();

// ---------------------------------------------------------------- mux
const inputs = wavs.flatMap((w) => ["-i", w.wav]);
const filter =
  wavs.map((_, i) => `[${i + 1}:a]adelay=${starts[i]}|${starts[i]}[a${i}]`).join(";") +
  `;${wavs.map((_, i) => `[a${i}]`).join("")}amix=inputs=${wavs.length}:normalize=0:duration=longest[aout]`;
execFileSync(
  ffmpeg,
  [
    "-y", "-i", videoPath, ...inputs,
    "-filter_complex", `[0:v]scale=1920:1080:flags=lanczos,fps=30[v];${filter}`,
    "-map", "[v]", "-map", "[aout]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
    outFile,
  ],
  { stdio: "inherit" },
);
console.log(`${outFile} (${(statSync(outFile).size / 1e6).toFixed(1)} MB)`);
for (const f of readdirSync(work)) if (f.endsWith(".webm")) rmSync(`${work}/${f}`);
rmSync(work, { recursive: true, force: true });
