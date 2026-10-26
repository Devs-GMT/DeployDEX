"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useReadContract } from "wagmi";
import { deployDexAbi } from "@/lib/abi";
import {
  BOT_CHAIN_DOCS,
  BOT_CHAIN_FAUCET,
  BOT_CHAIN_SITE,
  CHAIN,
  CONTACT_EMAIL,
  EXPLORER_URL,
  REGISTRY_ADDRESS,
  REGISTRY_DEPLOYED,
  explorerAddressUrl,
} from "@/lib/config";
import { shortAddress } from "@/lib/format";
import { ExternalLink } from "@/components/ui/button";
import { BotChainLogo } from "@/components/ui/bot-chain-logo";
import { Kit } from "@/components/kit/kit";
import { LogoMark } from "@/components/ui/logo";
import { Seal } from "@/components/illustrations/seal";
import { gsap, MQ_MOTION, muteTransitions, restoreTransitions, useGSAP } from "@/lib/gsap";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "All dApps", href: "/dapps" },
      { label: "Categories", href: "/#categories" },
      { label: "Most starred", href: "/dapps?s=stars" },
      { label: "Fresh deploys", href: "/dapps?s=new" },
      { label: "Dex stats", href: "/stats" },
    ],
  },
  {
    title: "Builders",
    links: [
      { label: "List your dApp", href: "/list" },
      { label: "My dApps", href: "/my" },
      { label: "Listing guidelines", href: "/guidelines" },
      { label: "GitHub", href: "https://github.com/Devs-GMT/DeployDEX", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "BOT Chain docs", href: BOT_CHAIN_DOCS, external: true },
      { label: "Explorer", href: EXPLORER_URL, external: true },
      { label: "Faucet", href: BOT_CHAIN_FAUCET, external: true },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: `mailto:${CONTACT_EMAIL}`, external: true },
      { label: "X", href: "https://x.com/BOTChain_ai", external: true },
    ],
  },
];

function Certificate() {
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Kit lands on the certificate, then the VERIFIED seal slams down and the card shudders.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MQ_MOTION, () => {
        const card = q("[data-cert-card]");
        muteTransitions(card);
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
            onComplete: () => restoreTransitions(card),
          })
          .from(card, { y: 70, rotation: -5, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from(
            q("[data-cert-kit]"),
            { y: 70, opacity: 0, duration: 0.6, ease: "back.out(1.8)" },
            "-=0.35",
          )
          .from(
            q("[data-cert-seal]"),
            { scale: 2.8, rotation: -45, opacity: 0, duration: 0.32, ease: "expo.in" },
            "+=0.1",
          )
          .to(card, { keyframes: { x: [0, -6, 5, -3, 0] }, duration: 0.3, ease: "none" });
      });
    },
    { scope: root },
  );
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
    <div ref={root} className="group kit-group relative mx-auto mt-24 max-w-2xl">
      <div
        data-cert-kit
        className="absolute -top-20 left-1/2 w-32 -translate-x-1/2 sm:left-12 sm:translate-x-0"
      >
        <Kit pose="curator" title="Curator Kit holding the certificate" />
      </div>
      <div
        data-cert-card
        className="border-line border-l-brand bg-card relative -rotate-1 overflow-hidden rounded-2xl border border-l-8 p-6 shadow-lg transition-transform duration-300 group-hover:rotate-0 sm:p-8"
      >
        <div
          data-cert-seal
          aria-hidden
          className="absolute top-3 right-3 size-20 rotate-12 sm:size-24"
        >
          <Seal className="size-full" />
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
            className="border-brand-deep bg-brand mt-6 inline-flex h-11 items-center rounded-xl border-b-4 px-5 text-sm font-medium text-white hover:bg-brand-hover"
          >
            View on explorer ↗
          </ExternalLink>
        )}
      </div>
    </div>
  );
}

const WORD = "DEPLOYDEX";

/**
 * Edge-to-edge DEPLOYDEX in an orange dot screen, cut off by the bottom of the page, with
 * Napping Kit asleep on the letters: you've reached the end. Decorative; hover wakes Kit up.
 */
function Wordmark() {
  return (
    <div aria-hidden data-wordmark className="group kit-group relative mt-10 select-none sm:mt-16">
      <div
        data-wm-kit
        className="pointer-events-none absolute top-0 left-[46%] z-10 w-[clamp(5.5rem,13vw,11rem)] -translate-y-[72%]"
      >
        <Kit pose="napping" sizes="(min-width: 1024px) 176px, 96px" />
      </div>
      <div className="font-display h-[0.72em] overflow-hidden text-[18.4vw] leading-[0.8] tracking-[-0.05em] [mask-image:linear-gradient(to_bottom,rgb(0_0_0/0.5),#000_70%)]">
        <p className="flex justify-center whitespace-nowrap">
          {[...WORD].map((ch, i) => (
            <span key={i} data-wm-letter className="wordmark-dots inline-block">
              {ch}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function Footer() {
  const root = useRef<HTMLElement>(null);

  // As the page bottoms out the wordmark's letters rise one by one, their dots print in,
  // and Napping Kit settles on top. Scrubbed, so it finishes exactly at the end of the page.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MQ_MOTION, () => {
        const letters = q("[data-wm-letter]");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: q("[data-wordmark]")[0],
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.8,
            },
          })
          .from(letters, { yPercent: 70, ease: "power2.out", stagger: 0.06 }, 0)
          .fromTo(letters, { "--fill": 0 }, { "--fill": 0.33, ease: "none", stagger: 0.06 }, 0)
          .from(q("[data-wm-kit]"), { yPercent: 40, opacity: 0, ease: "back.out(1.6)" }, ">-0.3");
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="border-line bg-page border-t">
      <div className="lg:border-line mx-auto max-w-300 px-5 pb-0 sm:px-10 lg:border-x">
        <Certificate />

        {/* Five columns only from lg: at md the brand cell's min-content pushed the grid 10px wide. */}
        <div className="border-line mt-20 grid border-y lg:grid-cols-[1.1fr_repeat(4,1fr)]">
          <div className="border-line flex items-center gap-3 border-b p-8 lg:border-r lg:border-b-0">
            <LogoMark className="size-12" />
            <span className="font-display text-brand text-3xl">DeployDex</span>
          </div>
          {COLUMNS.map((col) => (
            <div
              key={col.title}
              className="border-line border-b p-6 last:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
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
          <ExternalLink href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand">
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
      <Wordmark />
    </footer>
  );
}
