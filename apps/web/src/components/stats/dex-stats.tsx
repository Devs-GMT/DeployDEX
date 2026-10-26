"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useStarActivity } from "@/hooks/use-star-activity";
import { useIsClient } from "@/hooks/use-is-client";
import { CATEGORIES } from "@/lib/categories";
import { EXPLORER_URL, REGISTRY_DEPLOYED } from "@/lib/config";
import { shortAddress, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Dapp } from "@/lib/types";
import { CategoryArt } from "@/components/ui/category-art";
import { Kit } from "@/components/kit/kit";
import { IconPencil, IconRocket, IconStar } from "@/components/ui/icons";
import { EmptyState } from "@/components/dapps/empty-state";

const WEEKS = 12;
const DAY = 86_400;
const SHELVES = CATEGORIES.filter((c) => c.slug !== "other");

const shortDay = (t: number) =>
  new Date(t * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function Num({ children }: { children: ReactNode }) {
  return <span className="text-ink font-mono font-medium tabular-nums">{children}</span>;
}

function Panel({
  title,
  sub,
  children,
  className,
}: {
  title: string;
  sub: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-line bg-card rounded-2xl border p-6 sm:p-8", className)}>
      <h2 className="text-2xl">{title}</h2>
      <p className="text-muted mt-1 text-sm">{sub}</p>
      {children}
    </section>
  );
}

/** Weekly listings as columns. One series, so no legend; hover or focus a week for its count. */
function WeeklyChart({ dapps, now }: { dapps: Dapp[]; now: number }) {
  const weeks = useMemo(() => {
    const end = Math.ceil(now / DAY) * DAY;
    return Array.from({ length: WEEKS }, (_, i) => {
      const from = end - (WEEKS - i) * 7 * DAY;
      const to = from + 7 * DAY;
      return { from, to, n: dapps.filter((d) => d.listedAt >= from && d.listedAt < to).length };
    });
  }, [dapps, now]);
  const max = Math.max(1, ...weeks.map((w) => w.n));
  const peak = weeks.reduce((best, w, i) => (w.n > weeks[best]!.n ? i : best), 0);
  const ticks = [0, Math.ceil(max / 2), max].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <>
      <div className="relative mt-8 h-56 pl-7 lg:h-72" aria-hidden>
        {/* recessive gridlines with tick labels */}
        {ticks.map((t) => (
          <div
            key={t}
            className="border-line absolute right-0 left-7 border-t"
            style={{ bottom: `${(t / max) * 100}%` }}
          >
            <span className="text-muted absolute -top-2 -left-7 w-5 text-right font-mono text-[11px] tabular-nums">
              {t}
            </span>
          </div>
        ))}
        <div className="relative flex h-full items-end gap-[2px]">
          {weeks.map((w, i) => {
            const labelled = w.n > 0 && (i === peak || i === WEEKS - 1);
            return (
              <div key={w.from} className="group relative flex h-full flex-1 items-end justify-center">
                {labelled && (
                  <span
                    className="text-ink absolute font-mono text-xs font-medium tabular-nums"
                    style={{ bottom: `calc(${(w.n / max) * 100}% + 6px)` }}
                  >
                    {w.n}
                  </span>
                )}
                <div
                  className={cn(
                    "w-full max-w-6 rounded-t-[4px] transition-colors",
                    w.n > 0 ? "bg-brand group-hover:bg-brand-hover" : "bg-transparent",
                  )}
                  style={{ height: `${(w.n / max) * 100}%` }}
                />
                {/* tooltip; the hit target is the whole column, not just the bar */}
                <div className="bg-ink pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg group-hover:block">
                  <span className="font-mono tabular-nums">{w.n}</span> listed · {shortDay(w.from)}–
                  {shortDay(w.to - DAY)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-muted mt-2 flex pl-7 font-mono text-[11px]" aria-hidden>
        {weeks.map((w, i) => (
          <span key={w.from} className="flex-1 text-center whitespace-nowrap">
            {i % 3 === 0 || i === WEEKS - 1 ? shortDay(w.from) : ""}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>New listings per week, last {WEEKS} weeks</caption>
        <thead>
          <tr>
            <th scope="col">Week starting</th>
            <th scope="col">Listings</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((w) => (
            <tr key={w.from}>
              <td>{shortDay(w.from)}</td>
              <td>{w.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** Category shelves: one hue for magnitude, value at each bar's tip, empty shelves invite a first. */
function Shelves({ dapps }: { dapps: Dapp[] }) {
  const rows = SHELVES.map((c) => ({
    ...c,
    n: dapps.filter((d) => d.category === c.id).length,
    stars: dapps.filter((d) => d.category === c.id).reduce((s, d) => s + d.stars, 0),
  })).sort((a, b) => b.n - a.n || b.stars - a.stars);
  const max = Math.max(1, ...rows.map((r) => r.n));

  return (
    <ul className="mt-6 space-y-3">
      {rows.map((r) => (
        <li key={r.slug}>
          <Link
            href={`/dapps?c=${r.slug}`}
            className="group hover:bg-panel -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
          >
            <CategoryArt slug={r.slug} crop sizes="64px" className="bg-peach/70 size-8" />
            <span className="w-24 shrink-0 truncate text-sm font-medium sm:w-32">{r.label}</span>
            <span className="relative flex h-6 flex-1 items-center">
              {r.n > 0 ? (
                <>
                  <span
                    className="bg-brand group-hover:bg-brand-hover h-3.5 rounded-r-[4px] transition-colors"
                    style={{ width: `${Math.max(6, (r.n / max) * 82)}%` }}
                  />
                  <span className="text-ink ml-2 font-mono text-xs font-medium tabular-nums">
                    {r.n}
                  </span>
                </>
              ) : (
                <span className="text-muted text-xs whitespace-nowrap">Be the first</span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

type LogItem = {
  key: string;
  time: number;
  icon: "rocket" | "star" | "edit";
  text: ReactNode;
  href: string;
  external?: boolean;
};

function ChainLog({ dapps, now }: { dapps: Dapp[]; now: number }) {
  const stars = useStarActivity();
  const byId = useMemo(() => new Map(dapps.map((d) => [d.id, d])), [dapps]);

  const items = useMemo(() => {
    const out: LogItem[] = [];
    for (const d of dapps) {
      out.push({
        key: `l${d.id}`,
        time: d.listedAt,
        icon: "rocket",
        text: (
          <>
            <strong className="font-medium text-white">{d.name}</strong> listed by{" "}
            <span className="font-mono">{shortAddress(d.lister)}</span>
          </>
        ),
        href: `/dapps/${d.id}`,
      });
      if (d.updatedAt - d.listedAt > 60) {
        out.push({
          key: `u${d.id}`,
          time: d.updatedAt,
          icon: "edit",
          text: (
            <>
              <strong className="font-medium text-white">{d.name}</strong> got a tune-up
            </>
          ),
          href: `/dapps/${d.id}`,
        });
      }
    }
    for (const e of stars.data ?? []) {
      const d = byId.get(e.id);
      if (!d) continue; // hidden or delisted
      out.push({
        key: e.key,
        time: e.time,
        icon: "star",
        text: (
          <>
            <span className="font-mono">{shortAddress(e.by)}</span>{" "}
            {e.kind === "star" ? "starred" : "unstarred"}{" "}
            <strong className="font-medium text-white">{d.name}</strong>
          </>
        ),
        href: `${EXPLORER_URL}/tx/${e.tx}`,
        external: true,
      });
    }
    return out.sort((a, b) => b.time - a.time).slice(0, 12);
  }, [dapps, stars.data, byId]);

  return (
    <section className="bg-charcoal relative mt-6 rounded-2xl p-6 text-white sm:p-8" aria-labelledby="log-title">
      <div aria-hidden className="kit-group pointer-events-none absolute -top-14 right-6 w-24 sm:right-10 sm:w-28">
        <Kit pose="astro" sizes="112px" />
      </div>
      <h2 id="log-title" className="pr-28 text-2xl">
        Chain log
      </h2>
      <p className="mt-1 pr-28 text-sm text-white/65">
        Fresh from the registry. Stars cover the last 7 days
        {stars.data === null ? " (star history is unavailable right now)" : ""}.
      </p>
      <ol className="mt-6 divide-y divide-white/10">
        {items.map((it) => {
          const Icon = { star: IconStar, edit: IconPencil, rocket: IconRocket }[it.icon];
          const row = (
            <>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full",
                  it.icon === "star" ? "bg-brand text-white" : "bg-white/10 text-white/85",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm text-white/75">{it.text}</span>
              <time
                dateTime={new Date(it.time * 1000).toISOString()}
                className="shrink-0 font-mono text-xs text-white/55 tabular-nums"
              >
                {timeAgo(it.time, now)}
              </time>
            </>
          );
          const cls = "flex items-center gap-3 py-3 transition-colors hover:text-white";
          return (
            <li key={it.key}>
              {it.external ? (
                <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {row}
                  <span className="sr-only">(opens the transaction in a new tab)</span>
                </a>
              ) : (
                <Link href={it.href} className={cls}>
                  {row}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function DexStats() {
  const mounted = useIsClient();
  const { data, isLoading, isError, dataUpdatedAt } = useProjects();
  // "Now" is when the chain was read, so the numbers and their timestamps agree.
  const now = Math.floor(dataUpdatedAt / 1000);
  const dapps = useMemo(() => data ?? [], [data]);

  if (!REGISTRY_DEPLOYED) {
    return <EmptyState title="The registry isn't deployed yet." body="Stats show up once it is." />;
  }
  if (!mounted || isLoading) {
    return (
      <p role="status" className="text-muted py-20 text-center text-sm">
        Counting the shelves…
      </p>
    );
  }
  if (isError) {
    return (
      <EmptyState
        title="Kit couldn't reach BOT Chain."
        body="The RPC didn't answer. Give it a minute and refresh."
        action={false}
      />
    );
  }
  if (dapps.length === 0) return <EmptyState />;

  const builders = new Set(dapps.map((d) => d.lister.toLowerCase())).size;
  const stars = dapps.reduce((s, d) => s + d.stars, 0);
  const filled = SHELVES.filter((c) => dapps.some((d) => d.category === c.id)).length;
  const top = [...dapps].sort((a, b) => b.stars - a.stars)[0];
  const thisWeek = dapps.filter((d) => now - d.listedAt < 7 * DAY).length;

  return (
    <div>
      <p className="text-ink/80 max-w-[58ch] text-xl leading-relaxed sm:text-2xl">
        <Num>{dapps.length}</Num> dApp{dapps.length === 1 ? "" : "s"} listed by{" "}
        <Num>{builders}</Num> builder{builders === 1 ? "" : "s"}, <Num>{stars}</Num> star
        {stars === 1 ? "" : "s"} given, <Num>{filled}</Num> of {SHELVES.length} shelves stocked.
        {top && top.stars > 0 && (
          <>
            {" "}
            Most loved so far:{" "}
            <Link href={`/dapps/${top.id}`} className="text-brand-deep font-medium underline underline-offset-4">
              {top.name}
            </Link>
            .
          </>
        )}
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Listings per week"
          sub={
            <>
              Last {WEEKS} weeks · <Num>{thisWeek}</Num> new in the past 7 days
            </>
          }
        >
          <WeeklyChart dapps={dapps} now={now} />
        </Panel>
        <Panel
          className="lg:col-span-5"
          title="Shelves"
          sub="Listings per category, biggest first"
        >
          <Shelves dapps={dapps} />
        </Panel>
      </div>

      <div className="mt-20">
        <ChainLog dapps={dapps} now={now} />
      </div>
    </div>
  );
}
