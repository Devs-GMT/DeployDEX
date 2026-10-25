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
  // NAT64 (64:ff9b::/96, RFC 6052): IPv6-only networks reach IPv4 hosts through it, so judge
  // the IPv4 address embedded in the last 32 bits rather than refusing every such host.
  const nat64 =
    v.match(/^64:ff9b::(\d+\.\d+\.\d+\.\d+)$/) ??
    v.match(/^64:ff9b::([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (nat64) {
    if (nat64[2] === undefined) return ipv4Private(nat64[1]!);
    const hi = parseInt(nat64[1]!, 16);
    const lo = parseInt(nat64[2], 16);
    return ipv4Private(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
  }
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

/**
 * Image type from the first bytes (the upstream Content-Type is not trusted). Raster formats
 * browsers show in <img>, plus SVG; anything else (HTML, scripts, archives) is null.
 */
export function sniffImage(bytes: Uint8Array): string | null {
  const b = (i: number) => bytes[i] ?? -1;
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (b(0) === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return "image/jpeg";
  if (ascii(0, 4) === "GIF8") return "image/gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && /^avi[fs]$/.test(ascii(8, 12))) return "image/avif";
  if (b(0) === 0 && b(1) === 0 && b(2) === 1 && b(3) === 0) return "image/x-icon";
  const head = new TextDecoder()
    .decode(bytes.slice(0, 1024))
    .replace(/^\uFEFF/, "")
    .trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head)) {
    return "image/svg+xml";
  }
  return null;
}
