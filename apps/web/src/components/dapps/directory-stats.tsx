"use client";

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
    <dl className="mt-8 flex flex-wrap gap-3">
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
  );
}
