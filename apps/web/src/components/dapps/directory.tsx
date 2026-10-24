"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { DappCard } from "./dapp-card";
import { EmptyState } from "./empty-state";

const SORTS = [
  { id: "stars", label: "Most starred" },
  { id: "new", label: "Newest" },
  { id: "updated", label: "Recently updated" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export function Directory() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { data, isLoading, isError } = useProjects();

  const q = params.get("q") ?? "";
  const cat = params.get("c") ?? "all";
  const sort = (SORTS.find((s) => s.id === params.get("s"))?.id ?? "stars") as SortId;

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const category = CATEGORIES.find((c) => c.slug === cat);
    const filtered = (data ?? []).filter(
      (d) =>
        (!category || d.category === category.id) &&
        (!needle || `${d.name} ${d.tagline}`.toLowerCase().includes(needle)),
    );
    return filtered.sort((a, b) =>
      sort === "stars" ? b.stars - a.stars : sort === "new" ? b.listedAt - a.listedAt : b.updatedAt - a.updatedAt,
    );
  }, [data, q, cat, sort]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
      active ? "border-brand bg-brand text-white" : "border-line bg-card hover:bg-panel",
    );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setParam("q", e.target.value || null)}
          placeholder="Search dApps…"
          aria-label="Search dApps"
          className="h-11 w-full rounded-xl border border-line bg-card px-4 text-sm md:max-w-sm"
        />
        <label className="flex items-center gap-2 text-sm md:ml-auto">
          Sort
          <select
            value={sort}
            onChange={(e) => setParam("s", e.target.value)}
            className="h-11 rounded-xl border border-line bg-card px-3"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Categories">
        <button type="button" className={chip(cat === "all")} onClick={() => setParam("c", null)}>All</button>
        {CATEGORIES.filter((c) => c.slug !== "other").map((c) => (
          <button key={c.id} type="button" className={chip(cat === c.slug)} onClick={() => setParam("c", c.slug)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!REGISTRY_DEPLOYED ? (
          <EmptyState
            title="Registry not configured"
            body="Set NEXT_PUBLIC_REGISTRY_* in .env.local after deploying DeployDex.sol."
            action={false}
          />
        ) : isLoading ? (
          <p className="py-16 text-center text-sm text-muted" role="status">Loading dApps from BOT Chain…</p>
        ) : isError ? (
          <EmptyState title="Couldn't reach BOT Chain" body="Check your connection and refresh." action={false} />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => <DappCard key={d.id} dapp={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
