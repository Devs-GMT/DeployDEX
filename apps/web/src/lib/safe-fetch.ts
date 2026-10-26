import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { isPrivateAddress } from "./preview";

/**
 * Server-side fetch for URLs that come from listings (untrusted): https on 443 only, refuses
 * hosts that resolve to private/internal addresses (checked again on every redirect), follows
 * at most a few redirects and times out. Route handlers only; it needs Node's DNS.
 */

const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 5_000;

async function publicHost(url: URL): Promise<boolean> {
  if (url.protocol !== "https:" || (url.port && url.port !== "443")) return false;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal")) {
    return false;
  }
  if (isIP(host)) return !isPrivateAddress(host);
  try {
    const addresses = await lookup(host, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every((a) => !isPrivateAddress(a.address));
  } catch {
    return false;
  }
}

/** The final non-redirect response and its URL, or null when refused, failed or looping. */
export async function fetchPublic(
  start: string,
  accept: string,
): Promise<{ res: Response; url: string } | null> {
  if (!URL.canParse(start)) return null;
  let url = new URL(start);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!(await publicHost(url))) return null;
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "DeployDex/1.0 (+https://deploydex)", Accept: accept },
      cache: "no-store",
    });
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get("location");
      await res.body?.cancel();
      if (!next || !URL.canParse(next, url)) return null;
      url = new URL(next, url);
      continue;
    }
    return { res, url: url.toString() };
  }
  return null;
}

/**
 * Reads a body up to `maxBytes`. With `stopAt`, stops early once the text so far matches it
 * and returns what was read; otherwise a body over the cap returns null.
 */
export async function readCapped(
  res: Response,
  maxBytes: number,
  stopAt?: RegExp,
): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!res.body) return null;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  const decoder = stopAt ? new TextDecoder() : null;
  let text = "";
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        if (!stopAt) return null;
        break;
      }
      chunks.push(value);
      if (decoder && stopAt) {
        text += decoder.decode(value, { stream: true });
        if (stopAt.test(text)) break;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}
