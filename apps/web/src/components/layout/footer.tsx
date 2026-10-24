"use client";

import Link from "next/link";
import { useState } from "react";
import { useReadContract } from "wagmi";
import { deployDexAbi } from "@/lib/abi";
import {
  BOT_CHAIN_SITE,
  CHAIN,
  REGISTRY_ADDRESS,
  REGISTRY_DEPLOYED,
  explorerAddressUrl,
} from "@/lib/config";
import { shortAddress } from "@/lib/format";
import { ExternalLink } from "@/components/ui/button";
import { BotChainLogo } from "@/components/ui/bot-chain-logo";
import { Kit } from "@/components/kit/kit";
import { Landscape } from "@/components/ui/landscape";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "All dApps", href: "/dapps" },
      { label: "Categories", href: "/#categories" },
      { label: "Most starred", href: "/dapps?s=stars" },
      { label: "Fresh deploys", href: "/dapps?s=new" },
    ],
  },
  {
    title: "Builders",
    links: [
      { label: "List your dApp", href: "/list" },
      { label: "My dApps", href: "/my" },
      { label: "Listing guidelines", href: "/#faq" },
      { label: "GitHub", href: "https://github.com/Devs-GMT/DeployDEX", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "BOT Chain docs", href: BOT_CHAIN_SITE, external: true },
      { label: "Explorer", href: "https://scan.botchain.ai", external: true },
      { label: "Faucet", href: "https://scan.bohr.life", external: true },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "mailto:hello@deploydex.xyz", external: true },
      { label: "X", href: "https://x.com/BOTChain_ai", external: true },
    ],
  },
];

function Certificate() {
  const [copied, setCopied] = useState(false);
  const { data: total } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: deployDexAbi,
    functionName: "total",
    chainId: CHAIN.id,
    query: { enabled: REGISTRY_DEPLOYED },
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(REGISTRY_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="group kit-group relative mx-auto mt-24 max-w-2xl">
      <Kit
        pose="curator"
        className="absolute -top-20 left-1/2 w-32 -translate-x-1/2 sm:left-12 sm:translate-x-0"
        title="Curator Kit holding the certificate"
      />
      <div className="border-line border-l-brand bg-card relative -rotate-1 overflow-hidden rounded-2xl border border-l-8 p-6 shadow-lg transition-transform duration-300 group-hover:rotate-0 sm:p-8">
        <div
          aria-hidden
          className="border-brand text-brand absolute top-4 right-4 grid size-14 rotate-12 place-items-center rounded-full border-2 border-dashed font-mono text-[10px]"
        >
          VERIFIED
        </div>
        <p className="text-muted font-mono text-xs tracking-widest uppercase">Official record</p>
        <h2 className="mt-1 text-2xl sm:text-3xl">Certificate of Deployment</h2>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted font-mono text-xs">Network</dt>
            <dd className="mt-1">
              <ExternalLink
                href={BOT_CHAIN_SITE}
                aria-label="BOT Chain (opens botchain.ai)"
                className="inline-block transition-opacity hover:opacity-80"
              >
                <BotChainLogo />
              </ExternalLink>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs">Chain ID</dt>
            <dd className="mt-1 font-mono">{CHAIN.id}</dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs">Registry contract</dt>
            <dd className="mt-1 flex items-center gap-2 font-mono">
              {REGISTRY_DEPLOYED ? shortAddress(REGISTRY_ADDRESS) : "Not deployed yet"}
              {REGISTRY_DEPLOYED && (
                <button
                  type="button"
                  onClick={copy}
                  className="border-line hover:bg-panel rounded border px-2 py-0.5 text-xs"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-xs">dApps listed</dt>
            <dd className="mt-1 font-mono">{total !== undefined ? total.toString() : "—"}</dd>
          </div>
        </dl>

        {REGISTRY_DEPLOYED && (
          <ExternalLink
            href={explorerAddressUrl(REGISTRY_ADDRESS)}
            className="border-brand-deep bg-brand mt-6 inline-flex h-11 items-center rounded-xl border-b-4 px-5 text-sm font-medium text-white hover:bg-[#ff6c1a]"
          >
            View on explorer ↗
          </ExternalLink>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-line bg-page border-t">
      <div className="lg:border-line mx-auto max-w-300 px-5 pb-0 sm:px-10 lg:border-x">
        <Certificate />

        <div className="border-line mt-20 grid border-y md:grid-cols-[1.1fr_repeat(4,1fr)]">
          <div className="border-line flex items-center gap-3 border-b p-8 md:border-r md:border-b-0">
            <Kit pose="dev" className="w-16" />
            <span className="font-display text-brand text-3xl">DeployDex</span>
          </div>
          {COLUMNS.map((col) => (
            <div
              key={col.title}
              className="border-line border-b p-6 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
            >
              <h3 className="font-sans text-sm font-semibold tracking-wide uppercase">
                {col.title}
              </h3>
              <ul className="text-ink/80 mt-4 space-y-3 text-[15px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <ExternalLink href={l.href} className="hover:text-brand">
                        {l.label}
                      </ExternalLink>
                    ) : (
                      <Link href={l.href} className="hover:text-brand">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <nav
          aria-label="Legal"
          className="text-ink/80 flex flex-wrap justify-center gap-x-8 gap-y-2 py-8 text-[15px]"
        >
          <Link href="/privacy" className="hover:text-brand">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-brand">
            Terms
          </Link>
          <ExternalLink href="mailto:hello@deploydex.xyz" className="hover:text-brand">
            Email
          </ExternalLink>
          <ExternalLink href="https://x.com/BOTChain_ai" className="hover:text-brand">
            X
          </ExternalLink>
        </nav>
        <p className="text-muted mx-auto max-w-xl pb-8 text-center text-xs">
          DeployDex is a community directory. Listings are submitted by builders — always do your
          own research before using a dApp.
        </p>
      </div>
      <Landscape className="block h-56 w-full sm:h-72" />
    </footer>
  );
}
