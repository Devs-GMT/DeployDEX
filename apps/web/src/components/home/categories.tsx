"use client";

import Link from "next/link";
import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { useProjects } from "@/hooks/use-projects";
import { Halftone } from "@/components/ui/halftone";
import { buttonClasses } from "@/components/ui/button";
import { Section, SectionHead } from "@/components/ui/frame";
import { Em } from "@/components/ui/frame";

export function Categories() {
  const { data } = useProjects();
  const count = (id: number) => (data ? data.filter((d) => d.category === id).length : null);
  const cats = CATEGORIES.filter((c) => c.slug !== "other");

  return (
    <Section id="categories">
      <SectionHead
        title={<>A showcase for every <Em>kind</Em> of build</>}
        sub="Seven shelves, one registry. Pick a category and start browsing."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c) => {
          const n = count(c.id);
          const art = CATEGORY_ART[c.slug]!;
          return (
            <Link
              key={c.id}
              href={`/dapps?c=${c.slug}`}
              className="reveal group flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44 rounded-b-3xl bg-white p-6 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.25)]">
                <div aria-hidden className="absolute -top-2 -right-2 size-36 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Halftone shape={art.shape} />
                </div>
                <div className="absolute bottom-5 left-6 max-w-[70%]">
                  <h3 className="text-2xl leading-none">{c.label}</h3>
                  <p className="mt-1.5 text-sm text-muted">{art.blurb}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-5 p-5">
                <div>
                  <p className="text-center text-sm text-muted">On the shelf right now</p>
                  <div className="mt-3 flex justify-center">
                    <span className="rounded-md bg-peach px-3 py-1 font-mono text-sm text-brand">
                      {n === null ? "—" : `${n} dApp${n === 1 ? "" : "s"}`}
                    </span>
                  </div>
                </div>
                <span className={buttonClasses("primary", "md", "w-full")}>Browse {c.label} →</span>
              </div>
            </Link>
          );
        })}
        <Link
          href="/list"
          className="reveal group flex flex-col justify-between rounded-3xl bg-charcoal p-7 text-white transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <span className="font-mono text-xs text-white/60">Your build, your shelf</span>
          <div>
            <h3 className="text-3xl leading-[1.05]">Don&apos;t see <Em>yours?</Em></h3>
            <p className="mt-2 text-sm text-white/70">List it under Other and make a new shelf.</p>
          </div>
          <span className={buttonClasses("light", "md", "mt-6 w-full")}>List your dApp</span>
        </Link>
      </div>
    </Section>
  );
}
