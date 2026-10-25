"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useProjects } from "@/hooks/use-projects";
import { LogoAvatar } from "@/components/dapps/logo-avatar";
import { gsap, MQ_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Dapp } from "@/lib/types";

// Value props styled like a wordmark strip: the whole strip before any listing exists,
// and the filler between real projects while the registry is still small.
const PROPS = [
  { t: "BOT Chain", c: "font-display text-2xl" },
  { t: "REAL CONTRACTS", c: "font-mono text-lg tracking-[0.2em]" },
  { t: "GitHub linked", c: "em-serif text-3xl !text-ink" },
  { t: "On-chain stars", c: "font-display text-2xl" },
  { t: "gas only", c: "font-mono text-lg" },
  { t: "Ship it. List it.", c: "em-serif text-3xl !text-ink" },
  { t: "ZERO FEES", c: "font-mono text-lg tracking-[0.2em]" },
];

/** From this many listings on, the strip shows two rows of projects only. */
const TWO_ROWS_AT = 8;

type Loops = Set<gsap.core.Tween>;

/**
 * One looping row. A single set of items is measured and repeated as many times as it takes
 * to cover the viewport plus one, then the track slides by exactly one set width, so the loop
 * is seamless and never shows an empty tail, however few items there are.
 */
function Row({
  children,
  reverse,
  loops,
}: {
  children: ReactNode;
  reverse?: boolean;
  loops: Loops;
}) {
  const track = useRef<HTMLDivElement>(null);
  const set = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = set.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setWidth(w);
      setCopies(Math.max(2, Math.ceil(window.innerWidth / Math.max(w, 1)) + 1));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!width) return;
      gsap.matchMedia().add(MQ_MOTION, () => {
        const t = gsap.fromTo(
          track.current,
          { x: reverse ? -width : 0 },
          { x: reverse ? 0 : -width, duration: Math.max(18, width / 45), ease: "none", repeat: -1 },
        );
        loops.add(t);
        return () => loops.delete(t);
      });
    },
    { scope: track, dependencies: [width, reverse], revertOnUpdate: true },
  );

  const setClass = "flex shrink-0 items-center gap-14 pr-14";
  return (
    <div className="overflow-hidden">
      <div ref={track} className="flex w-max">
        <div ref={set} className={setClass}>
          {children}
        </div>
        {Array.from({ length: copies - 1 }, (_, i) => (
          <div key={i} aria-hidden inert className={setClass}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectLink({ d }: { d: Dapp }) {
  return (
    <Link
      href={`/dapps/${d.id}`}
      className="flex items-center gap-3 text-xl font-medium whitespace-nowrap opacity-80 transition-opacity hover:opacity-100"
    >
      <LogoAvatar name={d.name} src={d.logoUrl} className="size-9" />
      {d.name}
    </Link>
  );
}

function Wordmark({ p }: { p: (typeof PROPS)[number] }) {
  return (
    <span aria-hidden className={`text-ink/80 whitespace-nowrap ${p.c}`}>
      {p.t}
    </span>
  );
}

/** Early-stage strip: each real project followed by a value-prop wordmark, then an open slot. */
function MixedItems({ projects }: { projects: Dapp[] }) {
  const words = PROPS.slice(0, Math.max(projects.length, 4));
  const n = Math.max(projects.length, words.length);
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="contents">
          {projects[i] && <ProjectLink d={projects[i]} />}
          {words[i] && <Wordmark p={words[i]} />}
        </span>
      ))}
      <Link
        href="/list"
        className="border-brand/50 text-brand-deep hover:bg-peach/60 flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 text-base font-medium whitespace-nowrap transition-colors"
      >
        Your dApp here →
      </Link>
    </>
  );
}

/**
 * Logo strip under the hero (PRD §8.1).
 * - No listings: value-prop wordmarks.
 * - A few listings: one row mixing real projects with wordmarks and an open "your dApp here" slot.
 * - Plenty of listings: real projects in two rows scrolling in opposite directions.
 * Scrolling the page speeds the rows up and flips their direction with the scroll direction;
 * the loops pause entirely while the strip is off screen.
 */
export function LogoStrip() {
  const root = useRef<HTMLDivElement>(null);
  const [loops] = useState<Loops>(() => new Set());
  const { data } = useProjects();
  const projects = data ?? [];
  const twoRows = projects.length >= TWO_ROWS_AT;
  const half = Math.ceil(projects.length / 2);

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ_MOTION, () => {
        let boost = 1;
        let direction = 1;
        const tick = () => {
          boost += (1 - boost) * 0.05; // ease back to cruising speed
          loops.forEach((t) => t.timeScale(boost * direction));
        };
        const run = (on: boolean) => {
          loops.forEach((t) => (on ? t.play() : t.pause()));
          if (on) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        };
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => run(self.isActive),
          onUpdate: (self) => {
            direction = self.direction;
            boost = Math.min(1 + Math.abs(self.getVelocity()) / 260, 7);
          },
        });
        run(st.isActive);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="border-line bg-page relative space-y-5 border-t py-7"
      aria-label={projects.length ? "Listed projects" : undefined}
    >
      {twoRows ? (
        <>
          <Row loops={loops}>
            {projects.slice(0, half).map((d) => (
              <ProjectLink key={d.id} d={d} />
            ))}
          </Row>
          <Row loops={loops} reverse>
            {projects.slice(half).map((d) => (
              <ProjectLink key={d.id} d={d} />
            ))}
          </Row>
        </>
      ) : projects.length ? (
        <Row loops={loops}>
          <MixedItems projects={projects} />
        </Row>
      ) : (
        <div aria-hidden>
          <Row loops={loops}>
            {PROPS.map((p) => (
              <Wordmark key={p.t} p={p} />
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
