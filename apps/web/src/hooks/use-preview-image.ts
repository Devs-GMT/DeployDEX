"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { parseRepo, safeHttpsUrl } from "@/lib/validators";

const responseSchema = z.object({ image: z.string().nullable() });

/** A listing's share image via our /api/preview (cached a day server-side and in the browser). */
export function usePreviewImage(liveUrl?: string, repo?: string) {
  const url = safeHttpsUrl(liveUrl);
  const r = parseRepo(repo ?? "");
  const repoKey = r ? `${r.owner}/${r.repo}` : "";
  return useQuery({
    queryKey: ["preview", url, repoKey],
    enabled: !!url || !!repoKey,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<string | null> => {
      const qs = new URLSearchParams();
      if (url) qs.set("url", url);
      if (repoKey) qs.set("repo", repoKey);
      const res = await fetch(`/api/preview?${qs}`);
      if (!res.ok) return null;
      const parsed = responseSchema.safeParse(await res.json());
      return parsed.success ? safeHttpsUrl(parsed.data.image) : null;
    },
  });
}
