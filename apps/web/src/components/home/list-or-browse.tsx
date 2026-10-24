import { ButtonLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { CursorTag } from "@/components/ui/decor";
import { Em, Section } from "@/components/ui/frame";
import type { ReactNode } from "react";
import { ListScene } from "./list-scene";

const CHECKS = [
  "Deployed contract on BOT Chain",
  "Not already listed",
  "GitHub repo is public",
  "Live URL is https://",
];

/** Field value that ListScene "types" in. Static text when there is no animation. */
function Typed({ children, live }: { children: ReactNode; live?: boolean }) {
  return live ? (
    <span data-type className="inline-block">
      {children}
    </span>
  ) : (
    <>{children}</>
  );
}

function MockForm({ className, live }: { className?: string; live?: boolean }) {
  return (
    <div aria-hidden className={`bg-panel rounded-2xl p-6 shadow-xl ${className ?? ""}`}>
      <p className="font-display text-2xl">Project details</p>
      <p className="text-muted text-xs">Tell us about the dApp you shipped.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          Name*
          <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 leading-9">
            <Typed live={live}>Kit Swap</Typed>
          </div>
        </div>
        <div>
          Category*
          <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 leading-9">
            <Typed live={live}>Productivity</Typed>
          </div>
        </div>
      </div>
      <div className="mt-4 text-[11px]">
        Contract address*
        <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 font-mono leading-9">
          <Typed live={live}>0x3b3A…735A</Typed>
        </div>
      </div>
      <div className="mt-4 text-[11px]">
        GitHub repo*
        <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 font-mono leading-9">
          <Typed live={live}>owner/repo</Typed>
        </div>
      </div>
      <div
        data-logo-drop={live ? "" : undefined}
        className="border-brand/40 bg-peach/70 text-muted mt-4 rounded-lg border border-dashed py-7 text-center text-xs"
      >
        Drop your logo here
        <br />
        <span className="text-[10px]">PNG or SVG, https URL also works</span>
      </div>
      <div className="mt-5 flex justify-between text-xs">
        <span className="border-line rounded-lg border bg-white px-4 py-2">Back</span>
        <span
          data-list-next={live ? "" : undefined}
          className="bg-brand inline-block rounded-lg px-4 py-2 text-white"
        >
          Next
        </span>
      </div>
    </div>
  );
}

export function ListOrBrowse() {
  return (
    <Section>
      <h2 data-split className="text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]">
        <Em>List it</Em> in a minute or just browse
      </h2>

      <ListScene>
        <div className="reveal mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative h-112 overflow-hidden rounded-3xl bg-[#ff7a2e] px-6 pt-8 sm:px-12 lg:h-[37rem]">
            <MockForm className="mx-auto max-w-lg" live />
            <div
              data-checks
              aria-hidden
              className="absolute bottom-6 left-4 w-56 rounded-2xl bg-white/95 p-3 text-[11px] shadow-xl backdrop-blur sm:left-6"
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
              <Kit pose="inspector" float />
            </div>
          </div>
          <div className="max-w-md">
            <h3 className="text-2xl leading-tight">
              List it: fill 6 fields, we check the contract, you&apos;re live.
            </h3>
            <p className="text-muted mt-4">
              Name, tagline, category, contract, live URL and repo. DeployDex checks the contract on
              BOT Chain and the repo on GitHub while you type.
            </p>
            <p className="mt-6 font-medium">Best for:</p>
            <p className="text-muted mt-1">
              Builders who already shipped something and want eyes on it.
            </p>
            <ButtonLink href="/list" size="lg" className="mt-8">
              Start listing →
            </ButtonLink>
          </div>
        </div>
      </ListScene>

      <div className="reveal mt-20 grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 max-w-md lg:order-1">
          <h3 className="text-2xl leading-tight">
            Browse it: filter by category, open the app, star what you love.
          </h3>
          <p className="text-muted mt-4">
            No wallet needed to look around. Connect only when you want to star something, and your
            star lives on-chain.
          </p>
          <p className="mt-6 font-medium">Best for:</p>
          <p className="text-muted mt-1">
            Curious users, other builders, and anyone hunting the next great dApp.
          </p>
          <ButtonLink href="/dapps" variant="secondary" size="lg" className="mt-8">
            Browse dApps
          </ButtonLink>
        </div>
        <div className="relative order-1 h-112 overflow-hidden rounded-3xl bg-[#dcdcdc] pt-8 pl-6 sm:pl-12 lg:order-2">
          <MockForm className="max-w-md" />
          <div className="absolute right-4 bottom-0 w-44 sm:w-56">
            <span className="absolute -top-16 right-6 rounded-full bg-white px-4 py-2 text-sm shadow-lg after:absolute after:-bottom-1.5 after:left-6 after:size-3 after:rotate-45 after:bg-white">
              Just browsing is fine
            </span>
            <Kit pose="curator" float title="Curator Kit holding a clipboard" />
          </div>
        </div>
      </div>
    </Section>
  );
}
