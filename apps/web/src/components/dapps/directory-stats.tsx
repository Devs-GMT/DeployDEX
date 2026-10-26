"use client";

import Link from "next/link";
import { IconArrowRight } from "@/components/ui/icons";
import { useProjects } from "@/hooks/use-projects";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { CountUp } from "@/components/motion/count-up";

/** Three live numbers for the showcase's sky band. Renders nothing until the registry answers. */
export function DirectoryStats() {
  const { data } = useProjects();
  if (!REGISTRY_DEPLOYED || !data) return null;

  const stars = data.reduce((n, d) => n + d.stars, 0);
  const shelves = new Set(data.map((d) => d.category)).size;
  const stats = [
    { n: data.length, label: data.length === 1 ? "dApp listed" : "dApps listed" },
    { n: stars, label: stars === 1 ? "star given" : "stars given" },
    { n: shelves, label: shelves === 1 ? "shelf in use" : "shelves in use" },
  ];

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <dl className="contents">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-baseline gap-2 rounded-2xl border border-white/70 bg-white/60 px-4 py-2.5 backdrop-blur-sm"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-2xl tabular-nums">
              <CountUp value={s.n} />
            </dd>
            <span aria-hidden className="text-ink/70 text-sm">
              {s.label}
            </span>
          </div>
        ))}
      </dl>
      <Link
        href="/stats"
        className="text-ink hover:text-brand-deep focus-visible:outline-brand group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2"
      >
        See all stats
        <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </Link>
    </div>
  );
}
