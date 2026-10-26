import { ButtonLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { CursorTag } from "@/components/ui/decor";
import { Halftone, type HalftoneShape } from "@/components/ui/halftone";
import { Em, Section } from "@/components/ui/frame";
import type { ReactNode } from "react";
import { ListScene } from "./list-scene";

const CHECKS = [
  "Deployed contract on BOT Chain",
  "Not already listed",
  "GitHub repo is public",
  "Live URL is https://",
];

const MINI: { name: string; shape: HalftoneShape; stars: number }[] = [
  { name: "Kit Swap", shape: "coin", stars: 42 },
  { name: "Paw DAO", shape: "people", stars: 31 },
  { name: "Yarn Quest", shape: "gamepad", stars: 18 },
  { name: "Nap Agent", shape: "spark", stars: 9 },
];

/** Field value that ListScene "types" in. Static text when there is no animation. */
function Typed({ children }: { children: ReactNode }) {
  return (
    <span data-type className="inline-block">
      {children}
    </span>
  );
}

function MockForm({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`bg-panel rounded-2xl p-6 shadow-xl ${className ?? ""}`}>
      <p className="font-display text-2xl">Project details</p>
      <p className="text-muted text-xs">Tell us about the dApp you shipped.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          Name*
          <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 leading-9">
            <Typed>Kit Swap</Typed>
          </div>
        </div>
        <div>
          Category*
          <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 leading-9">
            <Typed>Productivity</Typed>
          </div>
        </div>
      </div>
      <div className="mt-4 text-[11px]">
        Contract address*
        <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 font-mono leading-9">
          <Typed>0x3b3A…735A</Typed>
        </div>
      </div>
      <div className="mt-4 text-[11px]">
        GitHub repo*
        <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 font-mono leading-9">
          <Typed>owner/repo</Typed>
        </div>
      </div>
      <div
        data-logo-drop
        className="border-brand/40 bg-peach/70 text-muted mt-4 rounded-lg border border-dashed py-7 text-center text-xs"
      >
        Drop your logo here
        <br />
        <span className="text-[10px]">PNG or SVG, https URL also works</span>
      </div>
      <div className="mt-5 flex justify-between text-xs">
        <span className="border-line rounded-lg border bg-white px-4 py-2">Back</span>
        <span data-list-next className="bg-brand inline-block rounded-lg px-4 py-2 text-white">
          Next
        </span>
      </div>
    </div>
  );
}

/** A tiny directory: search, chips and four listing cards. */
function MockDirectory({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`bg-panel rounded-2xl p-5 shadow-xl ${className ?? ""}`}>
      <div className="border-line text-muted flex h-10 items-center rounded-xl border bg-white px-3 text-xs">
        Search by name or what it does
        <span className="border-line ml-auto rounded border px-1.5 font-mono text-[10px]">/</span>
      </div>
      <div className="mt-3 flex gap-1.5 text-[10px]">
        <span className="bg-ink rounded-full px-2.5 py-1 text-white">All</span>
        <span className="border-line rounded-full border bg-white px-2.5 py-1">AI</span>
        <span className="border-line rounded-full border bg-white px-2.5 py-1">Community</span>
        <span className="border-line rounded-full border bg-white px-2.5 py-1">Fun</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {MINI.map((m) => (
          <div key={m.name} className="border-line overflow-hidden rounded-xl border bg-white">
            <div className="bg-panel dot-grid relative h-14">
              <div className="absolute -top-1 right-1 size-14">
                <Halftone shape={m.shape} dot={2.6} />
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-[11px]">
              <span className="font-medium">{m.name}</span>
              <span className="text-brand-deep font-mono">★ {m.stars}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Copy({
  title,
  body,
  best,
  cta,
}: {
  title: string;
  body: string;
  best: string;
  cta: ReactNode;
}) {
  return (
    <div className="max-w-md">
      <h3 className="text-2xl leading-tight">{title}</h3>
      <p className="text-muted mt-4">{body}</p>
      <p className="mt-6 font-medium">Best for:</p>
      <p className="text-muted mt-1">{best}</p>
      {cta}
    </div>
  );
}

const face =
  "bg-card border-line grid items-center gap-10 rounded-[2rem] border p-4 sm:p-6 lg:grid-cols-2 lg:p-8";

/**
 * One card, two faces. Static (no JS, reduced motion): both faces stacked. With motion,
 * ListScene turns it into a 3D card: desktop scrubs the "List it" demo and then flips to
 * "Browse it"; smaller screens flip with a List/Browse toggle.
 */
export function ListOrBrowse() {
  return (
    <Section>
      <ListScene>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 data-split className="text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]">
            <Em>List it</Em> in a minute or just browse
          </h2>
          <div
            data-flip-steps
            aria-hidden
            hidden
            className="bg-panel border-line items-center gap-1 rounded-full border p-1 font-mono text-xs"
          >
            <span data-flip-step="front" className="rounded-full px-3 py-1.5 transition-colors">
              01 List
            </span>
            <span data-flip-step="back" className="rounded-full px-3 py-1.5 transition-colors">
              02 Browse
            </span>
          </div>
          <div
            data-flip-toggle
            role="group"
            aria-label="Show"
            hidden
            className="bg-panel border-line items-center gap-1 rounded-full border p-1 text-sm"
          >
            <button
              type="button"
              data-flip-to="front"
              aria-pressed="true"
              className="rounded-full px-4 py-1.5 font-medium transition-colors"
            >
              List it
            </button>
            <button
              type="button"
              data-flip-to="back"
              aria-pressed="false"
              className="rounded-full px-4 py-1.5 font-medium transition-colors"
            >
              Browse
            </button>
          </div>
        </div>

        <div data-flip-stage className="mt-12">
          <div data-flip-card className="relative">
            <div data-flip-face="front" className={face}>
              <div className="relative h-112 overflow-hidden rounded-3xl bg-tangerine px-6 pt-8 sm:px-12 lg:h-[34rem]">
                <MockForm className="mx-auto max-w-lg" />
                <div
                  data-checks
                  aria-hidden
                  className="absolute bottom-6 left-4 w-56 rounded-2xl bg-white/95 p-3 text-[11px] shadow-xl sm:left-6"
                >
                  <p className="font-display mb-1.5 text-sm">Inspector Kit says</p>
                  <ul className="space-y-1">
                    {CHECKS.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span
                          data-check
                          className="bg-success grid size-4 place-items-center rounded-full text-[9px] text-white"
                        >
                          ✓
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-list-cursor className="absolute right-8 bottom-6 lg:bottom-10">
                  <CursorTag className="relative">Important dApp, Probably</CursorTag>
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1 right-1 hidden w-24 rotate-[-8deg] sm:block sm:w-32"
                >
                  <Kit pose="inspector" float sizes="128px" />
                </div>
              </div>
              <Copy
                title="List it: fill 6 fields, we check the contract, you're live."
                body="Name, tagline, category, contract, live URL and repo. DeployDex checks the contract on BOT Chain and the repo on GitHub while you type."
                best="Builders who already shipped something and want eyes on it."
                cta={
                  <ButtonLink href="/list" size="lg" className="mt-8">
                    Start listing →
                  </ButtonLink>
                }
              />
            </div>

            <div data-flip-face="back" className={`${face} mt-8`}>
              <div className="order-2 lg:order-1">
                <Copy
                  title="Browse it: filter by category, open the app, star what you love."
                  body="No wallet needed to look around. Connect only when you want to star something, and your star lives on-chain."
                  best="Curious users, other builders, and anyone hunting the next great dApp."
                  cta={
                    <ButtonLink href="/dapps" variant="secondary" size="lg" className="mt-8">
                      Browse dApps
                    </ButtonLink>
                  }
                />
              </div>
              <div className="relative order-1 h-112 overflow-hidden rounded-3xl bg-smoke pt-8 pl-6 sm:pl-12 lg:order-2 lg:h-[34rem]">
                <MockDirectory className="max-w-md" />
                <div data-flip-kit className="absolute right-4 bottom-0 w-44 sm:w-56">
                  <span className="absolute -top-16 right-6 rounded-full bg-white px-4 py-2 text-sm shadow-lg after:absolute after:-bottom-1.5 after:left-6 after:size-3 after:rotate-45 after:bg-white">
                    Just browsing is fine
                  </span>
                  <Kit pose="curator" float sizes="224px" title="Curator Kit holding a clipboard" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ListScene>
    </Section>
  );
}
