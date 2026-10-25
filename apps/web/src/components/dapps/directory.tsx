"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { Kit } from "@/components/kit/kit";
import { Halftone } from "@/components/ui/halftone";
import { IconClose, IconSearch } from "@/components/ui/icons";
import { gsap, MQ_MOTION, useGSAP } from "@/lib/gsap";
import { DappCard } from "./dapp-card";
import { EmptyState } from "./empty-state";
import { FeaturedDapp } from "./featured-dapp";
import { OpenSeat } from "./open-seat";

/** Grid columns on wide screens; short last rows are topped up with open seats. */
const COLS = 3;

const SORTS = [
  { id: "stars", label: "Most starred" },
  { id: "new", label: "Newest" },
  { id: "updated", label: "Updated" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

const SHOWN_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "other");

export function Directory() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { data, isLoading, isError } = useProjects();
  const search = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);

  const q = params.get("q") ?? "";
  const cat = params.get("c") ?? "all";
  const sort = (SORTS.find((s) => s.id === params.get("s"))?.id ?? "stars") as SortId;
  const category = CATEGORIES.find((c) => c.slug === cat);
  const filtering = !!q.trim() || !!category;

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearFilters() {
    const next = new URLSearchParams(params.toString());
    next.delete("q");
    next.delete("c");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // "/" jumps to search, like most directories people already know.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        e.key !== "/" ||
        e.metaKey ||
        e.ctrlKey ||
        t?.closest("input, textarea, select, [contenteditable]")
      )
        return;
      e.preventDefault();
      search.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const all = useMemo(() => data ?? [], [data]);

  const counts = useMemo(() => {
    const m = new Map<number, number>();
    for (const d of all) m.set(d.category, (m.get(d.category) ?? 0) + 1);
    return m;
  }, [all]);

  const totalStars = useMemo(() => all.reduce((n, d) => n + d.stars, 0), [all]);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = all.filter(
      (d) =>
        (!category || d.category === category.id) &&
        (!needle || `${d.name} ${d.tagline}`.toLowerCase().includes(needle)),
    );
    return [...filtered].sort((a, b) =>
      sort === "stars"
        ? b.stars - a.stars
        : sort === "new"
          ? b.listedAt - a.listedAt
          : b.updatedAt - a.updatedAt,
    );
  }, [all, q, category, sort]);

  // Spotlight the leader only on the unfiltered, most-starred view, and only once it has earned a star.
  const featured =
    !filtering && sort === "stars" && items.length >= 3 && items[0]!.stars > 0 ? items[0]! : null;
  const grid = featured ? items.slice(1) : items;
  const seats = grid.length % COLS ? COLS - (grid.length % COLS) : 0;

  // Results settle in with a short stagger whenever the filter, search or sort changes.
  const view = params.toString();
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ_MOTION, () => {
        gsap.from("[data-dir-card]", {
          opacity: 0,
          y: 18,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.04,
          clearProps: "opacity,transform",
        });
      });
    },
    { scope: results, dependencies: [view, items.length], revertOnUpdate: true },
  );

  return (
    <div>
      {/* Search shelf: overlaps the sky band above it. Curator Kit sits on its top edge. */}
      <div className="relative z-30 -mt-14 sm:-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[6.5rem] right-4 hidden w-36 sm:block lg:-top-[8.25rem] lg:right-10 lg:w-44"
        >
          <Kit pose="curator" sizes="176px" priority />
        </div>
        <div className="border-line bg-card/95 rounded-[28px] border p-3 shadow-[0_24px_50px_-28px_rgb(120_45_0/0.35)] backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="group/search border-line bg-panel focus-within:border-brand/60 focus-within:bg-card relative flex h-12 flex-1 items-center gap-3 rounded-2xl border px-4 transition-colors sm:h-14">
              <IconSearch className="text-muted group-focus-within/search:text-brand size-5 shrink-0" />
              <span className="sr-only">Search dApps</span>
              <input
                ref={search}
                type="search"
                value={q}
                onChange={(e) => setParam("q", e.target.value || null)}
                placeholder="Search by name or what it does"
                className="placeholder:text-muted h-full min-w-0 flex-1 bg-transparent text-base outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {q ? (
                <button
                  type="button"
                  onClick={() => setParam("q", null)}
                  className="text-muted hover:text-ink grid size-8 place-items-center rounded-lg hover:bg-black/5"
                  aria-label="Clear search"
                >
                  <IconClose className="size-4" />
                </button>
              ) : (
                <kbd className="border-line text-muted hidden rounded-md border bg-white px-2 py-0.5 font-mono text-xs sm:block">
                  /
                </kbd>
              )}
            </label>

            <div
              role="group"
              aria-label="Sort by"
              className="bg-panel border-line flex h-12 shrink-0 items-center gap-1 rounded-2xl border p-1 sm:h-14"
            >
              {SORTS.map((s) => {
                const active = sort === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setParam("s", s.id === "stars" ? null : s.id)}
                    className={cn(
                      "h-full flex-1 rounded-xl px-4 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] md:flex-none",
                      active
                        ? "bg-ink text-white shadow-[0_4px_10px_-4px_rgb(0_0_0/0.5)]"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="group"
            aria-label="Categories"
            className="no-scrollbar -mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 md:flex-wrap md:overflow-visible"
          >
            <CategoryChip
              active={!category}
              onClick={() => setParam("c", null)}
              label="All"
              count={all.length}
            />
            {SHOWN_CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                active={category?.id === c.id}
                onClick={() => setParam("c", category?.id === c.id ? null : c.slug)}
                label={c.label}
                count={counts.get(c.id) ?? 0}
                shape={CATEGORY_ART[c.slug]!.shape}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-6 flex min-h-8 flex-wrap items-center justify-between gap-3 text-sm"
        aria-live="polite"
      >
        {REGISTRY_DEPLOYED && !isLoading && !isError && (
          <>
            <p className="text-muted">
              <span className="text-ink font-medium tabular-nums">{items.length}</span>{" "}
              {items.length === 1 ? "dApp" : "dApps"}
              {category && (
                <>
                  {" "}
                  in <span className="text-ink font-medium">{category.label}</span>
                </>
              )}
              {q.trim() && (
                <>
                  {" "}
                  matching <span className="text-ink font-medium">&ldquo;{q.trim()}&rdquo;</span>
                </>
              )}
              {!filtering && (
                <>
                  {" "}
                  · <span className="tabular-nums">{totalStars}</span>{" "}
                  {totalStars === 1 ? "star" : "stars"} given
                </>
              )}
            </p>
            {filtering && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-brand-deep font-medium underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </>
        )}
      </div>

      <div ref={results} className="mt-4">
        {!REGISTRY_DEPLOYED ? (
          <EmptyState
            title="Registry not configured"
            body="Set NEXT_PUBLIC_REGISTRY_* in .env.local after deploying DeployDex.sol."
            action={false}
          />
        ) : isLoading ? (
          <div
            role="status"
            aria-label="Loading dApps from BOT Chain"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Couldn't reach BOT Chain"
            body="Check your connection and refresh."
            action={false}
            pose="inspector"
          />
        ) : items.length === 0 ? (
          filtering ? (
            <EmptyState
              title="Kit searched every shelf."
              body="Nothing matches yet. Try another word, or browse all categories."
              action={false}
              extra={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-brand-deep font-medium underline underline-offset-4"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid gap-5">
            {featured && (
              <div data-dir-card>
                <FeaturedDapp dapp={featured} />
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((d, i) => (
                <div key={d.id} data-dir-card className="h-full">
                  <DappCard
                    dapp={d}
                    rank={sort === "stars" && !filtering ? i + (featured ? 2 : 1) : undefined}
                  />
                </div>
              ))}
              {Array.from({ length: Math.max(seats, filtering ? 0 : 1) }, (_, i) => (
                <OpenSeat
                  key={i}
                  compact={i > 0}
                  className={i > 0 ? "hidden lg:flex" : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  shape,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  shape?: (typeof CATEGORY_ART)[string]["shape"];
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-10 shrink-0 items-center gap-2 rounded-full border pr-3 pl-2 text-sm whitespace-nowrap transition-[background-color,border-color,color]",
        !shape && "pl-4",
        active ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-ink/25",
        !active && count === 0 && "text-muted",
      )}
    >
      {shape && (
        <span
          aria-hidden
          className={cn("size-6 rounded-full p-0.5", active ? "bg-white" : "bg-peach/60")}
        >
          <Halftone shape={shape} dot={3.4} />
        </span>
      )}
      {label}
      <span
        className={cn(
          "min-w-5 rounded-full px-1.5 text-center font-mono text-[11px] tabular-nums",
          active ? "bg-white/15 text-white" : "bg-panel text-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div aria-hidden className="border-line bg-card overflow-hidden rounded-3xl border">
      <div className="bg-panel dot-grid relative aspect-[1.91/1] animate-pulse">
        <span className="bg-line absolute -bottom-7 left-5 size-15 rounded-2xl border-[3px] border-white" />
      </div>
      <div className="grid gap-3 px-5 pt-10 pb-5">
        <span className="bg-line h-5 w-2/3 animate-pulse rounded-full" />
        <span className="bg-panel h-3.5 w-full animate-pulse rounded-full" />
        <span className="bg-panel h-3.5 w-4/5 animate-pulse rounded-full" />
        <div className="mt-3 flex gap-2">
          <span className="bg-peach/60 h-5 w-14 rounded-full" />
          <span className="bg-panel h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
