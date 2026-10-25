"use client";

import { useState } from "react";
import Link from "next/link";
import { categoryById } from "@/lib/categories";
import { CONTACT_EMAIL, explorerAddressUrl, REGISTRY_DEPLOYED } from "@/lib/config";
import { formatDate, shortAddress } from "@/lib/format";
import { useIsDelisted, useProject } from "@/hooks/use-projects";
import { useIsContractOwner } from "@/hooks/use-contract-check";
import { Chip } from "@/components/ui/chip";
import { Button, ButtonLink } from "@/components/ui/button";
import { safeHttpsUrl } from "@/lib/validators";
import { Kit } from "@/components/kit/kit";
import { DappCover } from "./dapp-cover";
import { StarButton } from "./star-button";
import { GithubPanel } from "./github-panel";
import { TrustReport } from "./trust-report";
import { useContractTrust } from "@/hooks/use-contract-trust";
import { parseRepo } from "@/lib/validators";

function NotFound({ delisted = false }: { delisted?: boolean }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
      <Kit pose="napping" className="w-44" />
      <h1 className="text-3xl">{delisted ? "This dApp packed up." : "This dApp ran off."}</h1>
      <p className="text-muted text-sm">
        {delisted
          ? "Its builder delisted it. The record stays on-chain, but it's no longer in the Dex."
          : "We looked everywhere, even under the cardboard box."}
      </p>
      <ButtonLink href="/dapps">Browse dApps</ButtonLink>
    </div>
  );
}

export function ProjectView({ id }: { id: number }) {
  const { data: dapp, isLoading } = useProject(id);
  const { data: delisted } = useIsDelisted(id, !isLoading && !dapp);
  const trust = useContractTrust(dapp?.target);
  const [copied, setCopied] = useState(false);
  const isOwner = useIsContractOwner(
    dapp?.target ?? "0x0000000000000000000000000000000000000000",
    dapp?.lister ?? "0x0000000000000000000000000000000000000000",
  );

  if (!REGISTRY_DEPLOYED) return <NotFound />;
  if (isLoading)
    return (
      <p className="text-muted py-24 text-center text-sm" role="status">
        Loading…
      </p>
    );
  if (!dapp) return <NotFound delisted={!!delisted} />;

  async function copy() {
    if (!dapp) return;
    try {
      await navigator.clipboard.writeText(dapp.target);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const repo = parseRepo(dapp.repo);
  const liveUrl = safeHttpsUrl(dapp.liveUrl);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-12">
      <Link href="/dapps" className="text-muted hover:text-ink text-sm">
        ← All dApps
      </Link>

      <header className="border-line bg-card overflow-hidden rounded-xl border">
        <div className="border-line relative aspect-[1.91/1] border-b sm:aspect-[3/1]">
          <DappCover
            name={dapp.name}
            logoUrl={dapp.logoUrl}
            category={dapp.category}
            liveUrl={dapp.liveUrl}
            repo={dapp.repo}
            size="lg"
          />
        </div>
        <div className="flex flex-wrap items-start gap-4 p-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl">{dapp.name}</h1>
            <p className="text-muted mt-1">{dapp.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip>{categoryById(dapp.category).label}</Chip>
              <Chip tone="green">✓ Contract on BOT Chain</Chip>
              {repo && <Chip tone="green">✓ GitHub repo</Chip>}
              {trust.data?.verified && <Chip tone="green">✓ Source verified</Chip>}
              {isOwner.data && <Chip tone="green">✓ Listed by the contract owner</Chip>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-brand font-mono text-lg font-medium">⭐ {dapp.stars}</span>
            <StarButton dapp={dapp} size="md" />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {liveUrl ? (
          <ButtonLink href={liveUrl} target="_blank" rel="noopener noreferrer">
            Live app ↗
          </ButtonLink>
        ) : (
          <Button disabled title="This listing has no safe https link">
            Link unavailable
          </Button>
        )}
        {repo && (
          <ButtonLink
            href={`https://github.com/${repo.owner}/${repo.repo}`}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </ButtonLink>
        )}
        <ButtonLink
          href={explorerAddressUrl(dapp.target)}
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explorer ↗
        </ButtonLink>
      </div>

      <section className="border-line bg-card rounded-xl border p-6 text-sm">
        <h2 className="text-lg">On-chain info</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-muted font-mono text-xs">Contract</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2 font-mono break-all">
              {dapp.target}
              <button
                type="button"
                onClick={copy}
                className="border-line hover:bg-panel rounded border px-2 py-0.5 text-xs"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs">Listed by</dt>
            <dd className="mt-1 font-mono">{shortAddress(dapp.lister)}</dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs">Listed on</dt>
            <dd className="mt-1">{formatDate(dapp.listedAt)}</dd>
          </div>
        </dl>
        <p className="text-muted mt-4 text-xs">
          Something wrong?{" "}
          <a
            className="underline"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Report dApp #${dapp.id}`)}`}
          >
            Report this listing
          </a>
        </p>
      </section>

      <TrustReport dapp={dapp} />

      {dapp.repo && <GithubPanel repo={dapp.repo} />}
    </div>
  );
}
