"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { LogoAvatar } from "@/components/dapps/logo-avatar";
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
      <div className={`flex w-max items-center gap-14 pr-14 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {children}
        {children}
      </div>
    </div>
  );
}

function ProjectRow({ items }: { items: Dapp[] }) {
  const base = items.length < 6 ? [...items, ...items, ...items] : items;
  return (
    <Track>
      {base.map((d, i) => (
        <Link key={`${d.id}-${i}`} href={`/dapps/${d.id}`} className="flex items-center gap-3 text-xl font-medium opacity-80 transition-opacity hover:opacity-100">
          <LogoAvatar name={d.name} src={d.logoUrl} className="size-9" />
          {d.name}
        </Link>
      ))}
    </Track>
  );
}

/** Logo strip under the hero. Real listed projects once they exist, value props before that. */
export function LogoStrip() {
  const { data } = useProjects();
  const hasProjects = !!data && data.length > 0;
  return (
    <div className="relative border-t border-line bg-page py-7" aria-label={hasProjects ? "Listed projects" : undefined}>
      {hasProjects ? (
        <ProjectRow items={data} />
      ) : (
        <div aria-hidden>
          <Track>
            {PROPS.map((p) => (
              <span key={p.t} className={`whitespace-nowrap text-ink/80 ${p.c}`}>{p.t}</span>
            ))}
          </Track>
        </div>
      )}
    </div>
  );
}
