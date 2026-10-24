"use client";

import Link from "next/link";
import { useRef } from "react";
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

/** Click-and-drag horizontal scroller (touch uses native scrolling). */
function DragScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

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
    <div
      ref={ref}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
      onClickCapture={swallowClick}
      data-ms-track
      className="no-scrollbar mt-12 flex cursor-grab touch-pan-x snap-x gap-4 overflow-x-auto px-5 pb-4 select-none active:cursor-grabbing sm:px-10 lg:snap-none"
      tabIndex={0}
      aria-label="Most starred dApps"
    >
      {children}
    </div>
  );
}

/** Top projects by stars, straight from the contract. Real data only. */
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
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root, dependencies: [top.length], revertOnUpdate: true },
  );

  return (
    <Section innerClassName="!px-0 sm:!px-0">
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

        {top.length === 0 ? (
          <div className="border-line bg-card/60 mx-5 mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed px-6 py-14 text-center sm:mx-10">
            <Kit pose="napping" className="w-36" />
            <p className="text-xl">No stars yet. Be the first to get starred.</p>
            <ButtonLink href="/list">List your dApp</ButtonLink>
          </div>
        ) : (
          <DragScroller>
            {top.map((d, i) => {
              const slug = CATEGORIES.find((c) => c.id === d.category)?.slug ?? "other";
              return (
                <article
                  key={d.id}
                  className="border-line bg-card relative w-72 shrink-0 snap-start overflow-hidden rounded-3xl border shadow-sm sm:w-80"
                >
                  {i === 2 && (
                    <span className="absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-md bg-[#ff7a2e] px-2.5 py-1 text-xs font-medium text-white">
                      ⇆ Draggable!
                    </span>
                  )}
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
                      <span className="text-brand ml-auto font-mono text-sm font-medium">
                        ⭐ {d.stars}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="line-clamp-4 min-h-24 text-[15px]">“{d.tagline || d.name}”</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <Link href={`/dapps/${d.id}`} className="hover:text-brand font-medium">
                        Details
                      </Link>
                      {safeHttpsUrl(d.liveUrl) ? (
                        <ExternalLink
                          href={safeHttpsUrl(d.liveUrl)!}
                          className="text-brand font-medium hover:underline"
                        >
                          Open ↗
                        </ExternalLink>
                      ) : (
                        <span className="text-muted">No link</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </DragScroller>
        )}
      </div>
    </Section>
  );
}
