"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useProjects, useWeeklyStars } from "@/hooks/use-projects";
import { LogoAvatar } from "@/components/dapps/logo-avatar";
import { Halftone } from "@/components/ui/halftone";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { shortAddress } from "@/lib/format";
import { safeHttpsUrl } from "@/lib/validators";
import { Em, Section } from "@/components/ui/frame";
import { gsap, MQ_FULL, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { Dapp } from "@/lib/types";

/** Up to this many listings in total, the section shows a podium instead of the drag row. */
const PODIUM_MAX = 3;

/** Click-and-drag horizontal scroller (touch uses native scrolling). */
function DragScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setOverflows(el.scrollWidth - el.clientWidth > 8));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function down(e: React.PointerEvent) {
    if (e.pointerType === "touch" || !ref.current) return;
    drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d.down || !ref.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    ref.current.scrollLeft = d.left - dx;
  }
  function up() {
    drag.current.down = false;
  }
  function swallowClick(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div className="relative">
      {overflows && (
        <span className="absolute -top-9 right-5 rounded-md bg-[#ff7a2e] px-2.5 py-1 text-xs font-medium text-white sm:right-10">
          ⇆ Drag to see more
        </span>
      )}
      <div
        ref={ref}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onClickCapture={swallowClick}
        data-ms-track
        className="no-scrollbar mt-12 flex cursor-grab touch-pan-x snap-x gap-4 overflow-x-auto px-5 pb-4 select-none active:cursor-grabbing sm:px-10 lg:mt-10 lg:snap-none"
        tabIndex={0}
        aria-label="Most starred dApps"
      >
        {children}
      </div>
    </div>
  );
}

/** One ranked dApp: halftone header with logo and stars, then the tagline and links. */
function StarCard({ d, className }: { d: Dapp; className?: string }) {
  const slug = CATEGORIES.find((c) => c.id === d.category)?.slug ?? "other";
  const live = safeHttpsUrl(d.liveUrl);
  return (
    <article
      className={cn(
        "border-line bg-card relative overflow-hidden rounded-3xl border shadow-sm",
        className,
      )}
    >
      <div className="relative h-52 bg-[#ededed]">
        <div aria-hidden className="halftone-mask absolute inset-0 p-6 opacity-70">
          <Halftone shape={CATEGORY_ART[slug]!.shape} color="#9a9a9a" dot={2.2} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-linear-to-t from-white/90 to-transparent p-4 pt-10">
          <LogoAvatar name={d.name} src={d.logoUrl} className="size-11" />
          <div className="min-w-0">
            <p className="truncate font-medium">{d.name}</p>
            <p className="text-muted font-mono text-xs">{shortAddress(d.lister)}</p>
          </div>
          <span className="text-brand ml-auto font-mono text-sm font-medium">⭐ {d.stars}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-4 min-h-24 text-[15px]">“{d.tagline || d.name}”</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href={`/dapps/${d.id}`} className="hover:text-brand font-medium">
            Details
          </Link>
          {live ? (
            <ExternalLink href={live} className="text-brand font-medium hover:underline">
              Open ↗
            </ExternalLink>
          ) : (
            <span className="text-muted">No link</span>
          )}
        </div>
      </div>
    </article>
  );
}

// Podium columns left to right (#2, #1, #3) and how tall each plinth stands.
const PODIUM = [
  { rank: 2, plinth: "h-16", order: "md:order-1" },
  { rank: 1, plinth: "h-24", order: "md:order-2" },
  { rank: 3, plinth: "h-10", order: "md:order-3" },
];

/**
 * Early-stage layout: the top three on a podium. Ranks nobody holds yet are open spots,
 * so one or two listings look like a race that just started rather than an empty row.
 */
function Podium({ top }: { top: Dapp[] }) {
  return (
    <div className="mt-12 grid items-end gap-5 px-5 sm:px-10 md:grid-cols-3 lg:mt-10">
      {PODIUM.map(({ rank, plinth, order }) => {
        const d = top[rank - 1];
        return (
          <div
            key={rank}
            className={cn("reveal flex flex-col", order, rank === 1 ? "order-first" : "")}
          >
            {d ? (
              <StarCard d={d} />
            ) : (
              <div className="kit-group border-ink/20 hover:border-brand relative flex min-h-72 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-6 text-center transition-colors">
                <div aria-hidden className="w-28">
                  <Kit pose={rank === 1 ? "napping" : "dev"} sizes="112px" />
                </div>
                <p className="text-lg">{rank === 1 ? "No stars yet." : "Open spot"}</p>
                <p className="text-muted max-w-56 text-sm">
                  {rank === 1 ? "Be the first to get starred." : "List yours and climb the podium."}
                </p>
                <Link
                  href="/list"
                  className="text-brand-deep font-medium underline-offset-4 after:absolute after:inset-0 hover:underline"
                >
                  List your dApp →
                </Link>
              </div>
            )}
            <div
              aria-hidden
              className={cn(
                "mt-3 hidden items-start justify-center rounded-t-2xl pt-2 font-mono text-sm md:flex",
                plinth,
                rank === 1 ? "bg-brand text-white" : "bg-charcoal text-white/80",
              )}
            >
              #{rank}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Top projects by stars, straight from the contract. Real data only.
 * Up to three: a podium with open spots. More: a drag row that pins and scrolls sideways on desktop.
 */
export function MostStarred() {
  const { data } = useProjects();
  const { data: weekly } = useWeeklyStars();
  // "This week" only when the logs show real movement; otherwise be honest and show all-time.
  const weeklyTop = weekly
    ? (data ?? [])
        .filter((d) => (weekly.get(d.id) ?? 0) > 0)
        .sort((a, b) => (weekly.get(b.id) ?? 0) - (weekly.get(a.id) ?? 0))
    : [];
  const isWeekly = weeklyTop.length > 0;
  const top = (isWeekly ? weeklyTop : [...(data ?? [])].sort((a, b) => b.stars - a.stars)).slice(
    0,
    10,
  );
  // The podium is for a young registry as a whole, not for a quiet week on a busy one.
  const podium = (data?.length ?? 0) <= PODIUM_MAX;
  const root = useRef<HTMLDivElement>(null);

  // Desktop: pin the section and let vertical scroll walk the row sideways (only if it overflows).
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ_FULL, () => {
        const track = root.current?.querySelector<HTMLElement>("[data-ms-track]");
        if (!track) return;
        const max = () => track.scrollWidth - track.clientWidth;
        if (max() < 80) return;
        gsap.to(track, {
          scrollLeft: max,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 10%",
            end: () => `+=${max()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root, dependencies: [podium ? 0 : top.length], revertOnUpdate: true },
  );

  return (
    <Section innerClassName="!px-0 sm:!px-0 lg:!pt-16 lg:!pb-12">
      <div ref={root}>
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 sm:px-10">
          <div>
            <h2 data-split className="text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]">
              Built for <Em>builders</Em> who ship
            </h2>
            <p className="text-muted mt-3 text-lg">
              {isWeekly ? "Most starred this week" : "Most starred of all time"}, straight from the
              contract.
            </p>
          </div>
          <ButtonLink href="/dapps?s=stars" variant="secondary">
            See all dApps
          </ButtonLink>
        </div>

        {podium ? (
          <Podium top={[...(data ?? [])].sort((a, b) => b.stars - a.stars)} />
        ) : (
          <DragScroller>
            {top.map((d) => (
              <StarCard key={d.id} d={d} className="w-72 shrink-0 snap-start sm:w-80" />
            ))}
          </DragScroller>
        )}
      </div>
    </Section>
  );
}
