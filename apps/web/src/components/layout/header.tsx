"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CATEGORIES } from "@/lib/categories";
import { ButtonLink } from "@/components/ui/button";
import { ConnectButton } from "@/components/web3/connect-button";
import { Kit } from "@/components/kit/kit";

function Menu({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5"
        aria-haspopup="true"
      >
        {label} <span aria-hidden className="text-xs">⌄</span>
      </button>
      <div className="invisible absolute top-full left-0 z-30 w-64 rounded-xl border border-line bg-card p-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}

const itemClass = "block rounded-lg px-3 py-2 text-sm hover:bg-panel";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-300 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium">
          <Kit pose="dev" className="size-8" />
          DeployDex
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          <Menu label="Explore">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/dapps?c=${c.slug}`} className={itemClass}>
                {c.label}
              </Link>
            ))}
          </Menu>
          <Menu label="Builders">
            <Link href="/list" className={itemClass}>List your dApp</Link>
            <Link href="/my" className={itemClass}>My dApps</Link>
            <Link href="/#faq" className={itemClass}>Guidelines</Link>
          </Menu>
          <Link href="/#about" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5">
            About
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ConnectButton />
          <ButtonLink href="/dapps" variant="secondary" size="sm">Browse dApps</ButtonLink>
          <ButtonLink href="/list" size="sm">List your dApp</ButtonLink>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg border border-line px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-page px-4 py-4 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            <Link href="/dapps" className={itemClass} onClick={() => setOpen(false)}>Browse dApps</Link>
            <Link href="/list" className={itemClass} onClick={() => setOpen(false)}>List your dApp</Link>
            <Link href="/my" className={itemClass} onClick={() => setOpen(false)}>My dApps</Link>
            <Link href="/#faq" className={itemClass} onClick={() => setOpen(false)}>FAQ</Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/dapps?c=${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-full bg-peach px-3 py-1 font-mono text-xs"
              >
                {c.label}
              </Link>
            ))}
          </div>
          <div className="mt-4"><ConnectButton variant="outline" /></div>
        </nav>
      )}
    </header>
  );
}
