"use client";

import type { ReactNode } from "react";
import { parseRepo } from "@/lib/validators";
import type { GithubResult } from "@/hooks/use-github-repo";
import { IconExternal, IconSpinner } from "@/components/ui/icons";
import { Kit } from "@/components/kit/kit";
import { FormField, fieldProps, inputClass } from "./form-field";

export function RepoField({
  value,
  onChange,
  onBlur,
  error,
  result,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string | null;
  result?: GithubResult;
  loading: boolean;
}) {
  const parsed = parseRepo(value);
  const notFound = result?.state === "not_found" && !!parsed;
  const displayError = error ?? (notFound ? "Repo not found or private. Check the owner and name." : null);

  let hint: ReactNode = "owner/repo or a github.com URL";
  if (parsed && loading) {
    hint = (
      <span className="inline-flex items-center gap-1.5">
        <IconSpinner className="size-3.5" /> Looking up {parsed.owner}/{parsed.repo}…
      </span>
    );
  } else if (result?.state === "ok") {
    const repo = result.repo;
    hint = (
      <div className="mt-1 rounded-xl border border-line bg-panel/70 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-[13px] font-medium text-ink">{repo.name}</p>
            {repo.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted">{repo.description}</p>
            )}
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            GitHub <IconExternal className="size-3" />
          </a>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
          <span>★ {repo.stars}</span>
          {repo.language && <span>{repo.language}</span>}
          <span>
            updated{" "}
            {new Date(repo.lastCommit).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    );
  } else if (result?.state === "rate_limited") {
    hint = (
      <span className="flex items-start gap-2">
        <Kit pose="napping" className="w-10 shrink-0" />
        <span>
          GitHub is taking a nap — you can still list. We&apos;ll link the repo by its name.
        </span>
      </span>
    );
  } else if (value && !parsed) {
    hint = "Use owner/repo, for example vercel/next.js.";
  }

  return (
    <FormField
      id="repo"
      label="GitHub repo"
      error={displayError}
      hint={displayError ? undefined : hint}
    >
      <input
        {...fieldProps("repo", { error: displayError, hasHint: !displayError })}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        onBlur={onBlur}
        placeholder="owner/repo"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
    </FormField>
  );
}
