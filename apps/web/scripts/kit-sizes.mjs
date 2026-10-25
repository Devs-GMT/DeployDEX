// Builds the responsive Kit renders: public/kit/<pose>.webp (1024px master) -> <pose>-256.webp, <pose>-512.webp.
// Usage (from apps/web): node scripts/kit-sizes.mjs
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "public", "kit");
const masters = readdirSync(dir).filter((f) => /^[a-z0-9]+\.webp$/.test(f));

for (const file of masters) {
  const name = file.replace(/\.webp$/, "");
  for (const size of [256, 512]) {
    const out = join(dir, `${name}-${size}.webp`);
    await sharp(join(dir, file))
      .resize(size, size, { kernel: "lanczos3" })
      .sharpen({ sigma: 0.5 })
      .webp({ quality: 88, alphaQuality: 100, effort: 6 })
      .toFile(out);
    console.log(out);
  }
}
