import { z } from "zod";
import { sniffImage } from "@/lib/preview";
import { fetchPublic, readCapped } from "@/lib/safe-fetch";
import { safeHttpsUrl } from "@/lib/validators";

/**
 * GET /api/image?url=<https image>&kind=logo|cover
 * Serves a listing's logo or cover image from our origin, so it shows even where the builder's
 * host is slow or blocked (e.g. raw.githubusercontent.com on some ISPs) and visitors' browsers
 * never contact third-party hosts. The type comes from the bytes, not the upstream header;
 * only raster images and SVG pass, under a size cap. SVG is served sandboxed (no scripts, no
 * external loads) in case someone opens the URL directly. Cached by the CDN for a day.
 */

const querySchema = z.object({
  url: z.string().max(512),
  kind: z.enum(["logo", "cover"]).default("logo"),
});

const MAX_BYTES = { logo: 1_000_000, cover: 4_000_000 } as const;

const miss = () =>
  new Response(null, {
    status: 404,
    headers: { "Cache-Control": "public, s-maxage=600" },
  });

export async function GET(req: Request) {
  const q = querySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  const src = q.success ? safeHttpsUrl(q.data.url) : null;
  if (!q.success || !src) return Response.json({ error: "invalid" }, { status: 400 });

  try {
    const got = await fetchPublic(src, "image/avif,image/webp,image/png,image/svg+xml,image/*");
    if (!got) return miss();
    if (!got.res.ok) {
      await got.res.body?.cancel();
      return miss();
    }
    const body = await readCapped(got.res, MAX_BYTES[q.data.kind]);
    const type = body ? sniffImage(body) : null;
    if (!body || !type) return miss();

    return new Response(body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        "Content-Disposition": "inline",
      },
    });
  } catch {
    return miss();
  }
}
