import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { z } from "zod";
import { extractPreviewImage, isPrivateAddress } from "@/lib/preview";
import { parseRepo, safeHttpsUrl } from "@/lib/validators";

/**
 * GET /api/preview?url=<live https url>&repo=<owner/repo>
 * Finds a listing's share image for its card cover: the live site's og:image / twitter:image,
 * else the repo's custom GitHub social preview. Returns `{ image: string | null }`; the browser
 * loads the image itself. Listing URLs are untrusted, so the fetch is https-only, refuses
 * private/internal addresses (checked again on every redirect), times out, and reads at most
 * the first part of the page.
 */

const querySchema = z.object({
  url: z.string().max(512).optional(),
  repo: z.string().max(200).optional(),
});

const MAX_BYTES = 300_000;
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

/** The page's <head> (or its first MAX_BYTES), following a few checked redirects. */
async function fetchHead(start: string): Promise<{ html: string; url: string } | null> {
  let url = new URL(start);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!(await publicHost(url))) return null;
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "DeployDex-preview/1.0", Accept: "text/html" },
      cache: "no-store",
    });
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get("location");
      await res.body?.cancel();
      if (!next || !URL.canParse(next, url)) return null;
      url = new URL(next, url);
      continue;
    }
    if (!res.ok || !res.body || !(res.headers.get("content-type") ?? "").includes("html")) {
      await res.body?.cancel();
      return null;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let html = "";
    let bytes = 0;
    while (bytes < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (/<\/head>/i.test(html)) break;
    }
    await reader.cancel();
    return { html, url: url.toString() };
  }
  return null;
}

const ghSchema = z.object({
  data: z.object({
    repository: z
      .object({ usesCustomOpenGraphImage: z.boolean(), openGraphImageUrl: z.string() })
      .nullable(),
  }),
});

/** The repo's social preview, only when the owner uploaded one (GitHub's default is generic). */
async function githubImage(owner: string, repo: string): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "User-Agent": "deploydex" },
    body: JSON.stringify({
      query:
        "query($o:String!,$r:String!){repository(owner:$o,name:$r){usesCustomOpenGraphImage openGraphImageUrl}}",
      variables: { o: owner, r: repo },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const parsed = ghSchema.safeParse(await res.json());
  const r = parsed.success ? parsed.data.data.repository : null;
  return r?.usesCustomOpenGraphImage ? safeHttpsUrl(r.openGraphImageUrl) : null;
}

export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const q = querySchema.safeParse(params);
  if (!q.success) return Response.json({ error: "invalid" }, { status: 400 });

  const live = safeHttpsUrl(q.data.url);
  const repo = parseRepo(q.data.repo ?? "");
  let image: string | null = null;

  if (live) {
    try {
      const page = await fetchHead(live);
      if (page) image = extractPreviewImage(page.html, page.url);
    } catch {
      /* unreachable, slow or refused: fall through */
    }
  }
  if (!image && repo) {
    try {
      image = await githubImage(repo.owner, repo.repo);
    } catch {
      /* GitHub down or rate limited: no image */
    }
  }

  // A found image is stable for a day; a miss is retried sooner in case the site adds one.
  const maxAge = image ? 86_400 : 3_600;
  return Response.json(
    { image },
    { headers: { "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=604800` } },
  );
}
