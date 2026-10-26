"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { ABOUT_HREF, BUILDERS_LINKS, EXPLORE_SHORTCUTS, type NavLink } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@/components/web3/connect-button";
import { ButtonLink } from "@/components/ui/button";
import { CategoryArt } from "@/components/ui/category-art";
import { IconArrowRight } from "@/components/ui/icons";

const LINKS: NavLink[] = [
  { label: "Browse dApps", href: "/dapps", description: "Every listing, one shelf" },
  ...BUILDERS_LINKS.filter((l) => l.href !== "/list"),
  { label: "About", href: ABOUT_HREF, description: "What DeployDex is" },
];

/**
 * Full-screen mobile menu under the header (the header's hamburger morphs into its close
 * button). Rendered into <body>, because the sticky header's backdrop blur would otherwise
 * trap a fixed element inside the header box. A modal: page scroll is locked, Tab cycles
 * between the menu button and the sheet, Esc (handled by Header) closes it. Entrance is a
 * CSS fade plus staggered links; reduced motion makes it instant.
 */
export function MobileNav({
  open,
  onClose,
  triggerId,
  top,
}: {
  open: boolean;
  onClose: () => void;
  /** Viewport y of the header's bottom edge; the sheet fills the screen below it. */
  top: number;
  /** The header's menu button, kept in the focus loop since it doubles as the close button. */
  triggerId: string;
}) {
  const pathname = usePathname();
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !sheet.current) return;
      const trigger = document.getElementById(triggerId);
      const items = [
        ...(trigger ? [trigger] : []),
        ...sheet.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (!items.length) return;
      // The button sits in the header and the sheet at the end of <body>, with the page in
      // between, so the browser's own Tab order can't be trusted: always step through the list.
      e.preventDefault();
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = at === -1 ? 0 : (at + (e.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next]?.focus();
    };
    document.addEventListener("keydown", trap);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", trap);
    };
  }, [open, triggerId]);

  if (!open) return null;

  let step = 0;
  const stagger = () => ({ animationDelay: `${60 + step++ * 45}ms` });
  const current = (href: string) => (href === pathname ? "page" : undefined);

  return createPortal(
    <div
      ref={sheet}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      style={{ top }}
      className="sheet-in bg-page fixed inset-x-0 bottom-0 z-30 flex flex-col lg:hidden"
    >
      <div aria-hidden className="halftone-field pointer-events-none absolute inset-0" />

      <nav
        aria-label="Mobile"
        className="relative flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-6 sm:px-10"
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.href} className="nav-item-in border-line border-b" style={stagger()}>
              <Link
                href={l.href}
                onClick={onClose}
                aria-current={current(l.href)}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <span>
                  <span className="font-display group-aria-[current=page]:text-brand block text-[1.75rem] leading-tight tracking-[-0.04em]">
                    {l.label}
                  </span>
                  {l.description && (
                    <span className="text-muted mt-0.5 block text-sm">{l.description}</span>
                  )}
                </span>
                <IconArrowRight className="text-muted group-hover:text-brand size-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>

        <p
          className="nav-item-in text-muted mt-7 font-mono text-[11px] tracking-widest"
          style={stagger()}
        >
          SHELVES
        </p>
        <div className="nav-item-in mt-3 flex flex-wrap gap-2" style={stagger()}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/dapps?c=${c.slug}`}
              onClick={onClose}
              className="border-line bg-card hover:border-ink/25 flex h-10 items-center gap-2 rounded-full border pr-3.5 pl-1.5 text-sm transition-colors"
            >
              <CategoryArt slug={c.slug} crop sizes="64px" className="bg-peach/70 size-7" />
              {c.label}
            </Link>
          ))}
        </div>
        <div className="nav-item-in mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={stagger()}>
          {EXPLORE_SHORTCUTS.filter((s) => s.href !== "/dapps").map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={onClose}
              className="text-brand-deep font-medium underline-offset-4 hover:underline"
            >
              {s.label} →
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-line relative shrink-0 border-t bg-white/90 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-10">
        <div className={cn("grid gap-2 sm:grid-cols-2")}>
          <div className="grid">
            <ConnectButton variant="outline" />
          </div>
          <ButtonLink
            href="/list"
            className="w-full"
            onClick={onClose}
            aria-current={current("/list")}
          >
            List your dApp
          </ButtonLink>
        </div>
      </div>
    </div>,
    document.body,
  );
}
