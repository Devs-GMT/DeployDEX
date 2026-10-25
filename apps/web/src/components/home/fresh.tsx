"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { DappCard } from "@/components/dapps/dapp-card";
import { EmptyState } from "@/components/dapps/empty-state";
import { LogoAvatar } from "@/components/dapps/logo-avatar";
import { OpenSeat } from "@/components/dapps/open-seat";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { categoryById } from "@/lib/categories";
import { timeAgo } from "@/lib/format";
import { safeHttpsUrl } from "@/lib/validators";
import type { Dapp } from "@/lib/types";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Em, Section, SectionHead } from "@/components/ui/frame";
import { FlyingKit } from "@/components/ui/decor";
import { Kit } from "@/components/kit/kit";

/** Up to this many listings, Fresh shows a launch log instead of a card grid. */
const LOG_MAX = 4;
const GRID_COLS = 4;

/**
 * Early-stage layout: a launch log, newest first, on a dotted rail. Deliberately a different
 * shape from the podium above, so a small registry doesn't show the same cards twice.
 */
function LaunchLog({ items }: { items: Dapp[] }) {
  return (
    <ol className="before:border-line relative grid grid-cols-1 gap-3 before:absolute before:top-4 before:bottom-4 before:left-[1.4rem] before:border-l-2 before:border-dashed sm:before:left-[1.65rem]">
      {items.map((d, i) => {
        const live = safeHttpsUrl(d.liveUrl);
        return (
          <li key={d.id} className="reveal relative flex items-center gap-3 sm:gap-4">
            <span
              aria-hidden
              className={`border-page relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-4 font-mono text-[11px] sm:size-13 ${i === 0 ? "bg-brand text-white" : "bg-charcoal text-white/80"}`}
            >
              {i === 0 ? "new" : `#${i + 1}`}
            </span>
            <article className="border-line bg-card hover:border-ink/25 relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border p-3.5 transition-colors sm:gap-4 sm:p-5">
              <LogoAvatar name={d.name} src={d.logoUrl} category={d.category} className="size-10 sm:size-12" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg leading-tight">
                  <Link
                    href={`/dapps/${d.id}`}
                    className="hover:text-brand-deep after:absolute after:inset-0 after:content-['']"
                  >
                    {d.name}
                  </Link>
                </h3>
                <p className="text-muted truncate text-sm">{d.tagline}</p>
                {/* Phones: time and link move under the name so the name gets the full width. */}
                <p className="mt-1.5 flex items-center gap-3 text-xs sm:hidden">
                  <span className="text-muted font-mono">listed {timeAgo(d.listedAt)}</span>
                  {live && (
                    <ExternalLink href={live} className="text-brand-deep relative z-10 font-medium">
                      Open ↗<span className="sr-only"> {d.name} (opens in a new tab)</span>
                    </ExternalLink>
                  )}
                </p>
              </div>
              <Chip className="hidden md:inline-flex">{categoryById(d.category).label}</Chip>
              <span className="text-muted hidden font-mono text-xs whitespace-nowrap sm:inline">
                listed {timeAgo(d.listedAt)}
              </span>
              {live && (
                <ExternalLink
                  href={live}
                  className="text-brand-deep relative z-10 hidden text-sm font-medium hover:underline sm:inline"
                >
                  Open ↗<span className="sr-only"> {d.name} (opens in a new tab)</span>
                </ExternalLink>
              )}
            </article>
          </li>
        );
      })}
      <li className="relative flex items-center gap-3 sm:gap-4">
        <span
          aria-hidden
          className="border-ink/25 bg-page relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 border-dashed font-mono text-sm sm:size-13"
        >
          +
        </span>
        <Link
          href="/list"
          className="border-ink/20 hover:border-brand text-muted hover:text-ink flex flex-1 items-center justify-between gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors sm:p-5"
        >
          <span>
            <span className="text-ink font-medium">Next deploy lands here.</span> Shipped something
            on BOT Chain? List it in a minute.
          </span>
          <span className="text-brand-deep shrink-0 font-medium">List yours →</span>
        </Link>
      </li>
    </ol>
  );
}

export function Fresh() {
  const { data, isLoading } = useProjects();
  const items = [...(data ?? [])].sort((a, b) => b.listedAt - a.listedAt).slice(0, 8);
  const seats = items.length % GRID_COLS ? GRID_COLS - (items.length % GRID_COLS) : 0;

  return (
    <Section>
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 -left-3 hidden w-24 opacity-80 lg:block"
      >
        <Kit pose="astro" float sizes="96px" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-56 right-0 hidden w-20 opacity-70 xl:block"
      >
        <Kit pose="astro" className="[animation-delay:-2.5s]" float sizes="80px" />
      </div>
      <SectionHead
        title={
          <>
            Fresh <Em>deploys</Em>
          </>
        }
        sub="The newest listings, straight off the chain."
        action={
          <ButtonLink href="/dapps?s=new" variant="secondary">
            See all →
          </ButtonLink>
        }
      />
      <div className="mt-12">
        {isLoading && REGISTRY_DEPLOYED ? (
          <p className="text-muted py-10 text-center text-sm" role="status">
            Loading…
          </p>
        ) : items.length === 0 ? (
          <div className="dot-grid border-line bg-card/60 rounded-3xl border border-dashed">
            <EmptyState />
          </div>
        ) : items.length <= LOG_MAX ? (
          <div className="mx-auto max-w-4xl">
            <LaunchLog items={items} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((d) => (
              <DappCard key={d.id} dapp={d} />
            ))}
            {Array.from({ length: seats }, (_, i) => (
              <OpenSeat key={i} compact={i > 0} className="hidden lg:flex" />
            ))}
          </div>
        )}
      </div>
      <div className="mt-10">
        <FlyingKit delay={-6} />
      </div>
    </Section>
  );
}
