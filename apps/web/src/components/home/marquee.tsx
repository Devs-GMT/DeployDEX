"use client";

import Link from "next/link";
import { useRef } from "react";
import { useProjects } from "@/hooks/use-projects";
import { LogoAvatar } from "@/components/dapps/logo-avatar";
import { gsap, MQ_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Dapp } from "@/lib/types";

// Shown until the registry has listings: value props, styled like a wordmark strip.
const PROPS = [
  { t: "BOT Chain", c: "font-display text-2xl" },
  { t: "REAL CONTRACTS", c: "font-mono text-lg tracking-[0.2em]" },
  { t: "GitHub linked", c: "em-serif text-3xl !text-ink" },
  { t: "On-chain stars", c: "font-display text-2xl" },
  { t: "gas only", c: "font-mono text-lg" },
  { t: "Ship it. List it.", c: "em-serif text-3xl !text-ink" },
  { t: "ZERO FEES", c: "font-mono text-lg tracking-[0.2em]" },
];

function Track({ children, reverse }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div data-track={reverse ? "reverse" : "forward"} className="flex w-max items-center gap-14 pr-14">
        {children}
        {children}
      </div>
    </div>
  );
}

function ProjectRow({ items, reverse }: { items: Dapp[]; reverse?: boolean }) {
  const base = items.length < 6 ? [...items, ...items, ...items] : items;
  return (
    <Track reverse={reverse}>
      {base.map((d, i) => (
        <Link
          key={`${d.id}-${i}`}
          href={`/dapps/${d.id}`}
          tabIndex={i >= items.length ? -1 : undefined}
          className="flex items-center gap-3 text-xl font-medium opacity-80 transition-opacity hover:opacity-100"
        >
          <LogoAvatar name={d.name} src={d.logoUrl} className="size-9" />
          {d.name}
        </Link>
      ))}
    </Track>
  );
}

/**
 * Logo strip under the hero (PRD §8.1): real listed projects in two rows scrolling in opposite
 * directions; value-prop wordmarks before any listing exists. Scrolling the page speeds the rows
 * up and flips their direction with the scroll direction.
 */
export function LogoStrip() {
  const root = useRef<HTMLDivElement>(null);
  const { data } = useProjects();
  const projects = data ?? [];
  const hasProjects = projects.length > 0;
  const half = Math.ceil(projects.length / 2);

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ_MOTION, () => {
        const loops = gsap.utils.toArray<HTMLElement>("[data-track]", root.current).map((el) => {
          const reverse = el.dataset.track === "reverse";
          return gsap.fromTo(
            el,
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration: 40, ease: "none", repeat: -1 },
          );
        });

        let boost = 1;
        let direction = 1;
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            direction = self.direction;
            boost = Math.min(1 + Math.abs(self.getVelocity()) / 260, 7);
          },
        });
        const tick = () => {
          boost += (1 - boost) * 0.05; // ease back to cruising speed
          loops.forEach((t) => t.timeScale(boost * direction));
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: root, dependencies: [hasProjects, projects.length], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      className="border-line bg-page relative space-y-5 border-t py-7"
      aria-label={hasProjects ? "Listed projects" : undefined}
    >
      {hasProjects ? (
        <>
          <ProjectRow items={projects.slice(0, half)} />
          {projects.length > 1 && <ProjectRow items={projects.slice(half)} reverse />}
        </>
      ) : (
        <div aria-hidden>
          <Track>
            {PROPS.map((p) => (
              <span key={p.t} className={`text-ink/80 whitespace-nowrap ${p.c}`}>
                {p.t}
              </span>
            ))}
          </Track>
        </div>
      )}
    </div>
  );
}
