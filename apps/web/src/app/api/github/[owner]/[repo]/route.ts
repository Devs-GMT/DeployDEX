import { z } from "zod";

const OWNER = /^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;
/** README characters sent to the client; longer files end with a "continue on GitHub" link. */
const README_MAX = 40_000;

const repoSchema = z.object({
  full_name: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  open_issues_count: z.number(),
  pushed_at: z.string(),
  html_url: z.string(),
  private: z.boolean().optional(),
});

function ghHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "deploydex",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

export async function GET(_req: Request, ctx: RouteContext<"/api/github/[owner]/[repo]">) {
  const { owner, repo } = await ctx.params;
  if (!OWNER.test(owner) || !REPO.test(repo)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const base = `https://api.github.com/repos/${owner}/${repo}`;
  const res = await fetch(base, { headers: ghHeaders(), next: { revalidate: 3600 } });

  if (res.status === 403 || res.status === 429) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  if (!res.ok) return Response.json({ error: "not_found" }, { status: 404 });

  const parsed = repoSchema.safeParse(await res.json());
  if (!parsed.success) return Response.json({ error: "bad_response" }, { status: 502 });
  const r = parsed.data;

  // Raw markdown; the client renders it (no raw HTML) and starts collapsed to a short preview.
  let readme: string | null = null;
  let readmeTruncated = false;
  const readmeRes = await fetch(`${base}/readme`, {
    headers: { ...ghHeaders(), Accept: "application/vnd.github.raw+json" },
    next: { revalidate: 3600 },
  });
  if (readmeRes.ok) {
    const text = await readmeRes.text();
    readmeTruncated = text.length > README_MAX;
    const cut = text.lastIndexOf("\n", README_MAX);
    readme = readmeTruncated ? text.slice(0, cut > 0 ? cut : README_MAX) : text;
  }

  return Response.json(
    {
      name: r.full_name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      openIssues: r.open_issues_count,
      lastCommit: r.pushed_at,
      url: r.html_url,
      readme,
      readmeTruncated,
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
