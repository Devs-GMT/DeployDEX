"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { ABOUT_HREF, BUILDERS_LINKS, EXPLORE_SHORTCUTS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { ConnectButton } from "@/components/web3/connect-button";
import { LogoMark } from "@/components/ui/logo";
import { Halftone } from "@/components/ui/halftone";
import { IconChevronDown } from "@/components/ui/icons";
import { MobileNav } from "@/components/layout/mobile-nav";

type MenuId = "explore" | "builders";

const triggerClass =
  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-panel hover:text-ink";

function Menu({
  id,
  label,
  open,
  onOpen,
  onScheduleClose,
  onClose,
  onToggle,
  panelClassName,
  children,
}: {
  id: MenuId;
  label: string;
  open: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onClose: () => void;
  onToggle: () => void;
  panelClassName?: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onOpen();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        const active = document.activeElement;
        if (panelRef.current?.contains(active) && active !== triggerRef.current) return;
        onScheduleClose();
      }}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={`menu-${id}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown") return;
          e.preventDefault();
          onOpen();
          requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus());
        }}
        className={cn(triggerClass, open && "bg-panel text-ink")}
      >
        {label}
        <IconChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        ref={panelRef}
        id={`menu-${id}`}
        className={cn(
          "absolute top-full left-0 z-40 pt-2 transition-[opacity,transform,visibility] duration-150 ease-out",
          panelClassName,
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="border-line bg-card overflow-hidden rounded-2xl border p-2 shadow-[0_24px_48px_-24px_rgba(25,25,25,0.35)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sheetTop, setSheetTop] = useState(64);
  const [lastPath, setLastPath] = useState(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileOpenRef = useRef(false);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openNow = useCallback(
    (id: MenuId) => {
      cancelClose();
      setOpenMenu(id);
    },
    [cancelClose],
  );

  const closeNow = useCallback(() => {
    cancelClose();
    setOpenMenu(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, [cancelClose]);

  const toggle = useCallback(
    (id: MenuId) => {
      cancelClose();
      setOpenMenu((current) => (current === id ? null : id));
    },
    [cancelClose],
  );

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      // The mobile sheet is portalled to <body>, so taps inside it are not "outside".
      if (
        headerRef.current &&
        !headerRef.current.contains(target) &&
        !document.getElementById("mobile-nav")?.contains(target)
      ) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      if (mobileOpenRef.current) {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="border-line sticky top-0 z-40 border-b bg-white/95"
    >
      <div className="mx-auto flex h-16 max-w-350 items-center gap-4 px-5 sm:px-10">
        <Link
          href="/"
          className="font-display flex shrink-0 items-center gap-2 text-lg font-medium"
          onClick={closeNow}
        >
          <LogoMark />
          DeployDex
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          <Menu
            id="explore"
            label="Explore"
            open={openMenu === "explore"}
            onOpen={() => openNow("explore")}
            onScheduleClose={scheduleClose}
            onClose={closeNow}
            onToggle={() => toggle("explore")}
            panelClassName="w-[min(620px,calc(100vw-4rem))]"
          >
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((c) => {
                const art = CATEGORY_ART[c.slug]!;
                return (
                  <Link
                    key={c.id}
                    href={`/dapps?c=${c.slug}`}
                    onClick={closeNow}
                    className="hover:bg-panel flex items-start gap-3 rounded-xl px-7 py-2.5 transition-colors"
                  >
                    <span className="mt-0.5 size-6 shrink-0">
                      <Halftone shape={art.shape} dot={3.2} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{c.label}</span>
                      <span className="text-muted block text-xs">{art.blurb}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="border-line mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-3 pt-3 pb-1 text-sm">
              {EXPLORE_SHORTCUTS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={closeNow}
                  className="text-muted hover:text-ink transition-colors"
                >
                  {s.label}
                </Link>
              ))}
              <Link
                href="/dapps"
                onClick={closeNow}
                className="text-brand hover:text-brand-hover ml-auto inline-flex items-center gap-1 font-medium"
              >
                Browse all dApps →
              </Link>
            </div>
          </Menu>

          <Menu
            id="builders"
            label="Builders"
            open={openMenu === "builders"}
            onOpen={() => openNow("builders")}
            onScheduleClose={scheduleClose}
            onClose={closeNow}
            onToggle={() => toggle("builders")}
            panelClassName="w-80"
          >
            {BUILDERS_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeNow}
                className="hover:bg-panel block rounded-xl px-3 py-2.5 transition-colors"
              >
                <span className="block text-sm font-medium">{l.label}</span>
                <span className="text-muted block text-xs">{l.description}</span>
              </Link>
            ))}
          </Menu>

          <Link href={ABOUT_HREF} onClick={closeNow} className={triggerClass}>
            About
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ConnectButton />
          <ButtonLink
            href="/dapps"
            variant="secondary"
            size="sm"
            className="hidden xl:inline-flex"
            aria-current={pathname === "/dapps" ? "page" : undefined}
          >
            Browse dApps
          </ButtonLink>
          <ButtonLink
            href="/list"
            size="sm"
            aria-current={pathname === "/list" ? "page" : undefined}
          >
            List your dApp
          </ButtonLink>
        </div>

        {/* Bare two-line hamburger (no box): the short line grows on hover, and both lines
            fold into an ✕ when the menu opens. 44px tap target. */}
        <button
          ref={mobileTriggerRef}
          id="mobile-nav-trigger"
          type="button"
          className="group -mr-2.5 ml-auto grid size-11 place-items-center rounded-full lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            // The sheet starts right under the header, wherever it sits (the top banner
            // may still be on screen); page scroll is locked while it is open.
            setSheetTop(headerRef.current?.getBoundingClientRect().bottom ?? 64);
            setMobileOpen((v) => !v);
          }}
        >
          <span aria-hidden className="relative block h-3 w-6">
            <span
              className={cn(
                "bg-ink absolute top-0 right-0 h-0.5 w-6 rounded-full transition-[top,rotate,translate] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
                mobileOpen && "top-1/2 -translate-y-1/2 rotate-45",
              )}
            />
            <span
              className={cn(
                "bg-ink absolute right-0 bottom-0 h-0.5 rounded-full transition-[bottom,width,rotate,translate,background-color] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
                mobileOpen
                  ? "bottom-1/2 w-6 translate-y-1/2 -rotate-45"
                  : "group-hover:bg-brand w-3.5 group-hover:w-6",
              )}
            />
          </span>
        </button>
      </div>

      <MobileNav
        open={mobileOpen}
        triggerId="mobile-nav-trigger"
        top={sheetTop}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
