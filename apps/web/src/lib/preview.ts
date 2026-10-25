import { safeHttpsUrl } from "./validators";

/**
 * Card covers. A listing has no cover field on-chain, so the card shows the project's own
 * share image (og:image / twitter:image of its live site, found by /api/preview) when there is
 * one, else the logo on the category tint. Pure helpers for the server route.
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
