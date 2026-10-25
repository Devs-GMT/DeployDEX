import { safeHttpsUrl } from "./validators";

/**
 * Card covers. A listing has no cover field on-chain, so the card shows the project's own
 * share image (og:image / twitter:image of its live site, found by /api/preview) and falls back
 * to a generative cover seeded by the contract address. Pure helpers, shared by server and client.
 */

const META_KEYS = [
  "og:image:secure_url",
  "og:image",
  "og:image:url",
  "twitter:image",
  "twitter:image:src",
];

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

/** Attributes of one tag, lower-cased names, entity-decoded values. */
function attributes(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    out[m[1]!.toLowerCase()] = decodeEntities((m[3] ?? m[4] ?? m[5] ?? "").trim());
  }
  return out;
}

/**
 * The share image declared in a page's <head>, resolved against the page URL.
 * Only https results are returned; anything else is treated as "no image".
 */
export function extractPreviewImage(html: string, pageUrl: string): string | null {
  const found = new Map<string, string>();
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attributes(m[0]);
    const key = (a.property ?? a.name ?? "").toLowerCase();
    if (META_KEYS.includes(key) && a.content && !found.has(key)) found.set(key, a.content);
  }
  for (const key of META_KEYS) {
    const raw = found.get(key);
    if (!raw || !URL.canParse(raw, pageUrl)) continue;
    const safe = safeHttpsUrl(new URL(raw, pageUrl).toString());
    if (safe) return safe;
  }
  return null;
}

function ipv4Private(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p as [number, number, number, number];
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && p[2] === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

/**
 * True for loopback, private, link-local, CGNAT, multicast and other non-public addresses.
 * The preview fetcher refuses these so a listing cannot point our server at internal hosts.
 */
export function isPrivateAddress(ip: string): boolean {
  const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(v)) return ipv4Private(v);
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return ipv4Private(mapped[1]!);
  if (!v.includes(":")) return true;
  return (
    v === "::" ||
    v === "::1" ||
    /^f[cd][0-9a-f]{2}:/.test(v) ||
    /^fe[89ab][0-9a-f]:/.test(v) ||
    /^ff[0-9a-f]{2}:/.test(v) ||
    v.startsWith("::ffff:") ||
    v.startsWith("64:ff9b:")
  );
}

/** FNV-1a, so the same seed always paints the same cover (server and client alike). */
function hash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Curated schemes from brand tokens, so every cover looks intentional: warm, sunset sky (the
 * hero), pink, and night (the dark sections). `dark` tells the cover to print its wordmark
 * faintly instead of in white.
 */
const SCHEMES = [
  { base: "--color-peach", blobs: ["--color-brand", "--color-pink", "--color-card"], dark: false },
  { base: "--color-sky", blobs: ["--color-card", "--color-peach", "--color-brand"], dark: false },
  {
    base: "--color-pink-soft",
    blobs: ["--color-pink", "--color-peach", "--color-card"],
    dark: false,
  },
  { base: "--color-charcoal", blobs: ["--color-brand", "--color-pink", "--color-ink"], dark: true },
] as const;

export interface CoverArt {
  style: { backgroundColor: string; backgroundImage: string };
  dark: boolean;
}

/** Mesh-gradient cover for a seed: one scheme, its blobs placed and sized by the seed. */
export function coverArt(seed: string): CoverArt {
  const r = rng(hash(seed.toLowerCase()));
  const scheme = SCHEMES[Math.floor(r() * SCHEMES.length)]!;
  const blobs = scheme.blobs.map((color, i) => {
    const x = Math.round(r() * 100);
    const y = Math.round(r() * 100);
    const size = Math.round(50 + r() * 30);
    const strength = Math.round((i === 0 ? 75 : 55) + r() * 20);
    return `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, var(${color}) ${strength}%, transparent), transparent ${size}%)`;
  });
  return {
    style: { backgroundColor: `var(${scheme.base})`, backgroundImage: blobs.join(", ") },
    dark: scheme.dark,
  };
}
