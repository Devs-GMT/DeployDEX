"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useContractTrust } from "@/hooks/use-contract-trust";
import { useIsContractOwner } from "@/hooks/use-contract-check";
import { useGithubRepo } from "@/hooks/use-github-repo";
import { EXPLORER_URL, explorerAddressUrl } from "@/lib/config";
import { shortAddress } from "@/lib/format";
import { parseRepo } from "@/lib/validators";
import { cn } from "@/lib/utils";
import type { Dapp } from "@/lib/types";
import { Kit } from "@/components/kit/kit";
import { Seal } from "@/components/illustrations/seal";
import { ExternalLink } from "@/components/ui/button";
import { IconCheck, IconSpinner } from "@/components/ui/icons";

type Status = "pass" | "open" | "loading" | "unknown" | "na";

type Check = {
  id: string;
  title: string;
  status: Status;
  detail: ReactNode;
  action?: ReactNode;
};

function Mark({ status }: { status: Status }) {
  if (status === "pass") {
    return (
      <span className="bg-success grid size-7 shrink-0 place-items-center rounded-full text-white shadow-[0_3px_8px_-3px_rgb(20_105_58/0.6)]">
        <IconCheck className="size-4" />
      </span>
    );
  }
  if (status === "loading") {
    return (
      <span className="text-muted grid size-7 shrink-0 place-items-center">
        <IconSpinner className="size-5" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full border-2 border-dashed",
        status === "open" ? "border-brand/50" : "border-line-strong",
      )}
    />
  );
}

const HOW = (anchor: string, label = "How to get it") => (
  <Link href={`/guidelines#${anchor}`} className="text-brand-deep font-medium hover:underline">
    {label} →
  </Link>
);

/**
 * The project's checks in one place: what the registry enforced, and what the explorer, the
 * contract and the repo say on top of that. Only "real contract" is guaranteed; the rest are
 * signals a builder can add (see /guidelines).
 */
export function TrustReport({ dapp }: { dapp: Dapp }) {
  const trust = useContractTrust(dapp.target);
  const owner = useIsContractOwner(dapp.target, dapp.lister);
  const repo = parseRepo(dapp.repo);
  const gh = useGithubRepo(dapp.repo, !!repo);
  const lister = dapp.lister.toLowerCase();

  const explorerDown = !trust.isLoading && trust.data === null;
  const creator = trust.data?.creator?.toLowerCase() ?? null;

  const checks: Check[] = [
    {
      id: "contract",
      title: "Real contract on BOT Chain",
      status: "pass",
      detail: "The registry checked for deployed bytecode before it accepted the listing.",
      action: (
        <ExternalLink href={explorerAddressUrl(dapp.target)} className="text-brand-deep font-medium hover:underline">
          View on explorer ↗
        </ExternalLink>
      ),
    },
    {
      id: "source",
      title: "Source code verified",
      status: trust.isLoading ? "loading" : explorerDown ? "unknown" : trust.data?.verified ? "pass" : "open",
      detail: trust.data?.verified
        ? [trust.data.name, trust.data.compiler?.replace(/\+commit.*/, "")].filter(Boolean).join(" · ") ||
          "Readable source is published on the explorer."
        : explorerDown
          ? "We couldn't reach the explorer just now."
          : "Anyone can read the code once it's verified on the explorer.",
      action: trust.data?.verified ? (
        <ExternalLink
          href={`${EXPLORER_URL}/address/${dapp.target}?tab=contract`}
          className="text-brand-deep font-medium hover:underline"
        >
          Read the source ↗
        </ExternalLink>
      ) : explorerDown ? undefined : (
        HOW("source")
      ),
    },
    {
      id: "deployer",
      title: "Deployed by the lister",
      status: trust.isLoading
        ? "loading"
        : explorerDown || !creator
          ? "unknown"
          : creator === lister
            ? "pass"
            : "open",
      detail:
        creator === lister
          ? `The wallet that listed it (${shortAddress(dapp.lister)}) also deployed the contract.`
          : creator
            ? `Deployed by ${shortAddress(creator)}, listed by ${shortAddress(dapp.lister)}. Teams often split these.`
            : "The explorer doesn't know who deployed this contract.",
    },
    {
      id: "owner",
      title: "Lister owns the contract",
      status: owner.isLoading ? "loading" : owner.data ? "pass" : "open",
      detail: owner.data
        ? "The contract's owner() returns the lister's wallet."
        : "The contract has no owner(), or it points to another wallet.",
      action: owner.data ? undefined : HOW("owner", "What this means"),
    },
    {
      id: "repo",
      title: "Repo names the lister",
      status: !repo
        ? "na"
        : gh.isLoading
          ? "loading"
          : gh.data?.state !== "ok"
            ? "unknown"
            : gh.data.repo.claims?.includes(lister)
              ? "pass"
              : "open",
      detail: !repo
        ? "No GitHub repo linked."
        : gh.data?.state === "ok" && gh.data.repo.claims?.includes(lister)
          ? `${repo.owner}/${repo.repo} has a .deploydex file with the lister's wallet.`
          : gh.data?.state === "rate_limited"
            ? "GitHub is taking a nap. Try again soon."
            : gh.data?.state === "not_found"
              ? "The repo is private or gone."
              : `Add a .deploydex file with ${shortAddress(dapp.lister)} to ${repo.owner}/${repo.repo}.`,
      action:
        repo && gh.data?.state === "ok" && !gh.data.repo.claims?.includes(lister) ? HOW("repo") : undefined,
    },
  ];

  const counted = checks.filter((c) => c.status !== "na");
  const passed = counted.filter((c) => c.status === "pass").length;
  const settled = counted.every((c) => c.status !== "loading");
  const all = settled && passed === counted.length;

  return (
    <section
      aria-labelledby="trust-title"
      className="border-line bg-card relative mt-20 rounded-xl border p-6 sm:p-8"
    >
      <div aria-hidden className="kit-group pointer-events-none absolute -top-16 right-4 w-24 sm:right-8 sm:w-28">
        <Kit pose="inspector" sizes="112px" />
      </div>

      <div className="max-w-[34ch] pr-20 sm:pr-0">
        <h2 id="trust-title" className="flex items-center gap-3 text-2xl">
          Trust report
          {all && <Seal className="size-12 -rotate-12" />}
        </h2>
        <p className="text-muted mt-1 text-sm" aria-live="polite">
          {settled ? (
            <>
              <span className="text-ink font-mono font-medium tabular-nums">
                {passed} of {counted.length}
              </span>{" "}
              checks passed{all ? ". Kit has nothing left to sniff." : "."}
            </>
          ) : (
            "Inspector Kit is checking…"
          )}
        </p>
      </div>

      <ol className="divide-line mt-6 divide-y">
        {checks.map((c) => (
          <li
            key={c.id}
            className={cn("flex gap-4 py-4 first:pt-0 last:pb-0", c.status === "na" && "opacity-60")}
          >
            <Mark status={c.status} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">
                {c.title}
                <span className="sr-only">
                  {c.status === "pass"
                    ? ": passed"
                    : c.status === "loading"
                      ? ": checking"
                      : c.status === "na"
                        ? ": not applicable"
                        : c.status === "unknown"
                          ? ": unknown"
                          : ": not yet"}
                </span>
              </p>
              <p className="text-muted mt-0.5 break-words">{c.detail}</p>
              {c.action && <p className="mt-1.5">{c.action}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
