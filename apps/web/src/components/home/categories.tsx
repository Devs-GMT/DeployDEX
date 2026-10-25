"use client";

import Link from "next/link";
import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { Halftone } from "@/components/ui/halftone";
import { buttonClasses } from "@/components/ui/button";
import { Em, Section, SectionHead } from "@/components/ui/frame";
import { Tilt } from "@/components/motion/tilt";
import { CountUp } from "@/components/motion/count-up";

// Each print sits slightly askew; alternate columns drop a little on wide screens so the
// cards read as prints laid on a table rather than a spreadsheet.
const LAY = [
  "-rotate-[1.4deg]",
  "rotate-[1.1deg] lg:translate-y-8",
  "-rotate-[0.6deg]",
  "rotate-[1.6deg] lg:translate-y-8",
  "rotate-[0.8deg]",
  "-rotate-[1.2deg] lg:translate-y-8",
  "rotate-[0.5deg]",
  "-rotate-[1.8deg] lg:translate-y-8",
];

export function Categories() {
  const { data } = useProjects();
  const count = (id: number) => (data ? data.filter((d) => d.category === id).length : null);
  const cats = CATEGORIES.filter((c) => c.slug !== "other");

  return (
    <Section id="categories" className="overflow-x-clip" innerClassName="relative isolate">
      <div aria-hidden className="halftone-field pointer-events-none absolute inset-0 -z-10" />
      <SectionHead
        title={
          <>
            A showcase for every <Em>kind</Em> of build
          </>
        }
        sub="Seven shelves, one registry. Pick a category and start browsing."
      />
      <div className="relative mt-14 grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c, i) => {
          const n = count(c.id);
          const art = CATEGORY_ART[c.slug]!;
          return (
            <div key={c.id} className={cn("reveal relative hover:z-20", LAY[i])}>
              <Tilt className="h-full">
                <Link
                  href={`/dapps?c=${c.slug}`}
                  className="group border-line bg-card relative flex h-full flex-col rounded-3xl border shadow-[0_22px_40px_-28px_rgb(120_45_0/0.5)] transition-shadow hover:shadow-[0_30px_60px_-28px_rgb(120_45_0/0.55)]"
                >
                  {/* Two offset dot screens, like a slightly misregistered print; the art bleeds off the card. */}
                  <div
                    aria-hidden
                    data-depth="18"
                    className="pointer-events-none absolute -top-9 -right-5 size-40 sm:size-44"
                  >
                    <div className="size-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Halftone
                        shape={art.shape}
                        color="var(--color-pink)"
                        dot={2.2}
                        className="absolute inset-0 translate-x-1.5 translate-y-1.5 opacity-60 mix-blend-multiply transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-2.5"
                      />
                      <Halftone shape={art.shape} dot={2.8} className="relative" />
                    </div>
                  </div>
                  <div className="relative flex h-44 flex-col justify-between rounded-t-3xl p-6">
                    <span className="text-muted font-mono text-xs tracking-widest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="max-w-[72%]">
                      <h3 className="text-2xl leading-none">{c.label}</h3>
                      <p className="text-muted mt-1.5 text-sm">{art.blurb}</p>
                    </div>
                  </div>
                  <div className="border-line flex flex-1 flex-col justify-between gap-5 border-t border-dashed p-5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-muted">On the shelf</span>
                      <span className="bg-peach text-brand-deep rounded-md px-2.5 py-1 font-mono text-sm">
                        {n === null ? (
                          "—"
                        ) : n === 0 ? (
                          "Be the first"
                        ) : (
                          <>
                            <CountUp value={n} /> dApp{n === 1 ? "" : "s"}
                          </>
                        )}
                      </span>
                    </div>
                    <span className={buttonClasses("primary", "md", "w-full")}>
                      Browse {c.label} →
                    </span>
                  </div>
                </Link>
              </Tilt>
            </div>
          );
        })}
        <div className={cn("reveal relative hover:z-20", LAY[7])}>
          <Tilt className="h-full">
            <Link
              href="/list"
              className="group bg-charcoal relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-3xl p-7 text-white transition-shadow hover:shadow-xl"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -bottom-10 size-44 opacity-80"
              >
                <Halftone shape="star" dot={2.4} />
              </div>
              <span className="relative font-mono text-xs text-white/60">
                Your build, your shelf
              </span>
              <div className="relative">
                <h3 className="text-3xl leading-[1.05]">
                  Don&apos;t see <Em>yours?</Em>
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  List it under Other and make a new shelf.
                </p>
              </div>
              <span className={buttonClasses("light", "md", "relative mt-6 w-full")}>
                List your dApp
              </span>
            </Link>
          </Tilt>
        </div>
      </div>
    </Section>
  );
}
