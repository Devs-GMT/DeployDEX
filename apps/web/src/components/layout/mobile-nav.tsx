"use client";

import Link from "next/link";
import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { ABOUT_HREF, BUILDERS_LINKS, EXPLORE_SHORTCUTS } from "@/lib/nav";
import { ConnectButton } from "@/components/web3/connect-button";
import { ButtonLink } from "@/components/ui/button";
import { Halftone } from "@/components/ui/halftone";
import { IconChevronDown } from "@/components/ui/icons";

const summaryClass =
  "flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium [&::-webkit-details-marker]:hidden";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div id="mobile-nav" className="border-t border-line bg-page lg:hidden">
      <nav
        aria-label="Mobile"
        className="mx-auto max-h-[calc(100dvh-4rem)] max-w-300 overflow-y-auto px-5 py-2 sm:px-10"
      >
        <details className="group border-b border-line">
          <summary className={summaryClass}>
            Explore
            <IconChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <div className="pb-4">
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/dapps?c=${c.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-panel"
                >
                  <span className="size-5 shrink-0">
                    <Halftone shape={CATEGORY_ART[c.slug]!.shape} dot={3.2} />
                  </span>
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXPLORE_SHORTCUTS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={onClose}
                  className="rounded-full bg-peach px-3 py-1 font-mono text-xs text-brand hover:bg-brand hover:text-white"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </details>

        <details className="group border-b border-line">
          <summary className={summaryClass}>
            Builders
            <IconChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <div className="pb-4">
            {BUILDERS_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="block rounded-lg px-2 py-2 hover:bg-panel"
              >
                <span className="block text-sm font-medium">{l.label}</span>
                <span className="block text-xs text-muted">{l.description}</span>
              </Link>
            ))}
          </div>
        </details>

        <Link
          href={ABOUT_HREF}
          onClick={onClose}
          className="flex items-center justify-between border-b border-line py-3 text-sm font-medium"
        >
          About
        </Link>

        <div className="mt-4 grid gap-2 pb-2">
          <div className="grid">
            <ConnectButton variant="outline" />
          </div>
          <ButtonLink
            href="/dapps"
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            Browse dApps
          </ButtonLink>
          <ButtonLink href="/list" className="w-full" onClick={onClose}>
            List your dApp
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}
