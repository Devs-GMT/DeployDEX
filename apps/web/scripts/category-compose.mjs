// Composes the category art from what we already have: an existing Kit render
// (public/kit/<pose>.webp) plus two 3D props from art-src/props (3dicons.co, CC0), each with a
// soft contact shadow. Writes art-src/composed/<slug>.png; then run scripts/category-art.mjs,
// which prefers a hand-made render in art-src/category/<slug>.png over the composed one.
// Pass slugs to rebuild only those (e.g. `node scripts/category-compose.mjs ai rwa`).
// Usage (from apps/web): node scripts/category-compose.mjs [slug ...]
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const KIT = join(root, "public", "kit");
const PROPS = join(root, "art-src", "props");
const OUT = join(root, "art-src", "composed");
const S = 1024;

/**
 * Per category: Kit pose and props. Kit sits left of centre; props are placed by their centre
 * (x, y in px on the 1024 canvas), sized by their longest side, tilted by `rot` degrees, and
 * drawn behind Kit when `back` is set.
 */
const SCENES = {
  ai: {
    pose: "astro",
    kit: 700,
    props: [
      { name: "bulb", x: 845, y: 250, size: 300, rot: 14 },
      { name: "flash", x: 700, y: 120, size: 170, rot: -12, back: true },
    ],
  },
  rwa: {
    pose: "curator",
    kit: 720,
    props: [
      { name: "dollar", x: 815, y: 700, size: 290, rot: -10 },
      { name: "key", x: 820, y: 330, size: 290, rot: 28 },
    ],
  },
  community: {
    pose: "party",
    kit: 730,
    props: [
      { name: "chat-bubble", x: 800, y: 300, size: 330, rot: 8 },
      { name: "heart", x: 860, y: 680, size: 210, rot: -14 },
    ],
  },
  productivity: {
    pose: "inspector",
    kit: 720,
    props: [
      { name: "calender", x: 805, y: 330, size: 320, rot: 10 },
      { name: "tick", x: 860, y: 720, size: 220, rot: -8 },
    ],
  },
  "fun-lifestyle": {
    pose: "napping",
    kit: 760,
    props: [
      { name: "music", x: 800, y: 260, size: 300, rot: 12 },
      { name: "color-palette", x: 200, y: 280, size: 250, rot: -18, back: true },
    ],
  },
  "dev-tools": {
    pose: "dev",
    kit: 730,
    props: [
      { name: "tools", x: 820, y: 330, size: 320, rot: 12 },
      { name: "link", x: 860, y: 720, size: 230, rot: -18 },
    ],
  },
  hackathon: {
    pose: "hackathon",
    kit: 730,
    props: [
      { name: "trophy", x: 815, y: 330, size: 320, rot: 10 },
      { name: "fire", x: 860, y: 720, size: 210, rot: -6 },
    ],
  },
  other: {
    pose: "404",
    kit: 740,
    props: [
      { name: "puzzle", x: 810, y: 300, size: 290, rot: 16 },
      { name: "star", x: 220, y: 230, size: 200, rot: -14, back: true },
    ],
  },
};

/**
 * The 3dicons previews come on solid white. Flood-fill the white that touches the border (so
 * white details inside an icon survive), then soften a 2px edge band by un-mixing the white.
 */
async function knockOutWhite(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const bg = new Uint8Array(w * h);
  const whiteish = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) >= 232;
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !whiteish(i)) continue;
    bg[i] = 1;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  const near = (i, r) => {
    const x = i % w,
      y = (i / w) | 0;
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx,
          ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && bg[ny * w + nx]) return true;
      }
    return false;
  };
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (bg[i]) {
      data[o + 3] = 0;
      continue;
    }
    if (!near(i, 2)) continue;
    const dist = 255 - Math.min(data[o], data[o + 1], data[o + 2]);
    const a = Math.min(1, dist / 60);
    if (a <= 0.02) {
      data[o + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++)
      data[o + c] = Math.max(0, Math.min(255, (data[o + c] - 255 * (1 - a)) / a));
    data[o + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer();
}

/** Trimmed, resized (longest side = size) and rotated image with its pixel size. */
async function piece(file, size, rot = 0) {
  const input = file.startsWith(PROPS) ? await knockOutWhite(file) : file;
  const trimmed = await sharp(input).ensureAlpha().trim({ threshold: 4 }).toBuffer();
  const resized = await sharp(trimmed)
    .resize(size, size, { fit: "inside", kernel: "lanczos3" })
    .rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { buf: resized.data, w: resized.info.width, h: resized.info.height };
}

/** A soft warm shadow from an image's alpha, offset down a little. */
async function shadow(p) {
  const alpha = await sharp(p.buf).extractChannel("alpha").blur(14).linear(0.28, 0).toBuffer();
  return sharp({
    create: { width: p.w, height: p.h, channels: 3, background: { r: 90, g: 40, b: 10 } },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

const clamp = (v, max) => Math.max(0, Math.min(v, max));

async function compose(slug, scene) {
  const kit = await piece(join(KIT, `${scene.pose}.webp`), scene.kit);
  const kitLeft = Math.round(S * 0.42 - kit.w / 2);
  const kitTop = S - kit.h - 40;

  const layers = [];
  const place = async (prop) => {
    const p = await piece(join(PROPS, `${prop.name}.webp`), prop.size, prop.rot);
    const left = clamp(Math.round(prop.x - p.w / 2), S - p.w);
    const top = clamp(Math.round(prop.y - p.h / 2), S - p.h);
    layers.push({
      input: await shadow(p),
      left: clamp(left + 6, S - p.w),
      top: clamp(top + 18, S - p.h),
    });
    layers.push({ input: p.buf, left, top });
  };
  for (const prop of scene.props.filter((p) => p.back)) await place(prop);
  layers.push({ input: kit.buf, left: kitLeft, top: kitTop });
  for (const prop of scene.props.filter((p) => !p.back)) await place(prop);

  mkdirSync(OUT, { recursive: true });
  await sharp({
    create: { width: S, height: S, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(layers)
    .png()
    .toFile(join(OUT, `${slug}.png`));
  console.log(`✓ ${slug}`);
}

/**
 * The default project logo per category (components/dapps/logo-avatar.tsx): the category's
 * main prop alone, centred on a transparent square, built straight to public/category/icons.
 */
const ICONS = {
  ai: "bulb",
  rwa: "dollar",
  community: "chat-bubble",
  productivity: "calender",
  "fun-lifestyle": "color-palette",
  "dev-tools": "tools",
  hackathon: "trophy",
  other: "puzzle",
};

async function icon(slug, name) {
  const dir = join(root, "public", "category", "icons");
  mkdirSync(dir, { recursive: true });
  const p = await piece(join(PROPS, `${name}.webp`), 220);
  await sharp({
    create: { width: 256, height: 256, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: p.buf, left: Math.round((256 - p.w) / 2), top: Math.round((256 - p.h) / 2) },
    ])
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(join(dir, `${slug}.webp`));
  console.log(`✓ icon ${slug}`);
}

const only = process.argv.slice(2);
for (const [slug, scene] of Object.entries(SCENES)) {
  if (!only.length || only.includes(slug)) {
    await compose(slug, scene);
    await icon(slug, ICONS[slug]);
  }
}
