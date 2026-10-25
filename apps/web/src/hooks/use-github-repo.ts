"use client";

import { useQuery } from "@tanstack/react-query";
import { parseRepo } from "@/lib/validators";

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  openIssues: number;
  lastCommit: string;
  url: string;
  readme: string | null;
  /** The README was longer than the proxy sends; link to the rest on GitHub. */
  readmeTruncated?: boolean;
  /** Lowercased wallets named in the repo's `.deploydex` file (empty when there is none). */
  claims?: string[];
}

export type GithubResult =
  { state: "ok"; repo: GithubRepo } | { state: "not_found" } | { state: "rate_limited" };

/** Public repo info via our /api/github proxy (cached for 1h server-side and in the browser). */
export function useGithubRepo(input: string, enabled = true) {
  const parsed = parseRepo(input);
  return useQuery({
    queryKey: ["github", parsed?.owner, parsed?.repo],
    enabled: enabled && !!parsed,
    staleTime: 60 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<GithubResult> => {
      if (!parsed) return { state: "not_found" };
      const res = await fetch(`/api/github/${parsed.owner}/${parsed.repo}`);
      if (res.status === 429) return { state: "rate_limited" };
      if (!res.ok) return { state: "not_found" };
      return { state: "ok", repo: (await res.json()) as GithubRepo };
    },
  });
}
