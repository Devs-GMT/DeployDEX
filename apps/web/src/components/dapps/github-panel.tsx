"use client";

import { useGithubRepo } from "@/hooks/use-github-repo";
import { parseRepo } from "@/lib/validators";
import { ExternalLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { ReadmeView } from "./readme-view";

export function GithubPanel({ repo }: { repo: string }) {
  const { data, isLoading } = useGithubRepo(repo);
  const parsed = parseRepo(repo);
  const fallbackUrl = parsed ? `https://github.com/${parsed.owner}/${parsed.repo}` : null;

  if (isLoading) {
    return (
      <div className="border-line bg-card text-muted rounded-xl border p-6 text-sm" role="status">
        Loading repo info…
      </div>
    );
  }

  if (!data || data.state !== "ok") {
    return (
      <div className="border-line bg-card flex items-center gap-4 rounded-xl border p-6">
        <Kit pose="napping" className="w-20 shrink-0" />
        <div className="text-sm">
          <p className="font-medium">
            {data?.state === "not_found"
              ? "Repo not found or private."
              : "GitHub is taking a nap — try again soon."}
          </p>
          {fallbackUrl && (
            <ExternalLink
              href={fallbackUrl}
              className="text-brand mt-1 inline-block hover:underline"
            >
              Open {parsed?.owner}/{parsed?.repo} ↗
            </ExternalLink>
          )}
        </div>
      </div>
    );
  }

  const r = data.repo;
  const stats: [string, string][] = [
    ["Language", r.language ?? "—"],
    ["GitHub stars", String(r.stars)],
    ["Open issues", String(r.openIssues)],
    [
      "Last commit",
      new Date(r.lastCommit).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ],
  ];

  return (
    <section className="border-line bg-card rounded-xl border p-6" aria-labelledby="gh-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="gh-title" className="text-lg">
          GitHub
        </h2>
        <ExternalLink href={r.url} className="text-brand font-mono text-sm hover:underline">
          {r.name} ↗
        </ExternalLink>
      </div>
      {r.description && <p className="text-muted mt-2 text-sm">{r.description}</p>}
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k}>
            <dt className="text-muted font-mono text-xs">{k}</dt>
            <dd className="mt-1 text-sm font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {r.readme && parsed && (
        <ReadmeView
          markdown={r.readme}
          owner={parsed.owner}
          repo={parsed.repo}
          url={r.url}
          truncated={r.readmeTruncated}
        />
      )}
    </section>
  );
}
