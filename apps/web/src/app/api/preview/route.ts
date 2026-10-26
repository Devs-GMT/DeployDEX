import { z } from "zod";
import { extractPreviewImage } from "@/lib/preview";
import { fetchPublic, readCapped } from "@/lib/safe-fetch";
import { parseRepo, safeHttpsUrl } from "@/lib/validators";

/**
 * GET /api/preview?url=<live https url>&repo=<owner/repo>
 * Finds a listing's share image for its card cover: the live site's og:image / twitter:image,
 * else the repo's custom GitHub social preview. Returns `{ image: string | null }`; the card
 * loads it through /api/image. Listing URLs are untrusted: see lib/safe-fetch.ts.
 */

const querySchema = z.object({
  url: z.string().max(512).optional(),
  repo: z.string().max(200).optional(),
});

const MAX_BYTES = 300_000;
const TIMEOUT_MS = 5_000;

/** The page's <head> (or its first MAX_BYTES). */
async function fetchHead(start: string): Promise<{ html: string; url: string } | null> {
  const got = await fetchPublic(start, "text/html");
  if (!got) return null;
  const { res, url } = got;
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) {
    await res.body?.cancel();
    return null;
  }
  const body = await readCapped(res, MAX_BYTES, /<\/head>/i);
  return body ? { html: new TextDecoder().decode(body), url } : null;
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
