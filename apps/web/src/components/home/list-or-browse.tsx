import { ButtonLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { CursorTag } from "@/components/ui/decor";
import { Em, Section } from "@/components/ui/frame";

function MockForm({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`bg-panel rounded-2xl p-6 shadow-xl ${className ?? ""}`}>
      <p className="font-display text-2xl">Project details</p>
      <p className="text-muted text-xs">Tell us about the dApp you shipped.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          Name*
          <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 leading-9">
            Kit Swap
          </div>
        </div>
        <div>
          Category*
          <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 leading-9">
            Productivity
          </div>
        </div>
      </div>
      <div className="mt-4 text-[11px]">
        Contract address*
        <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 font-mono leading-9">
          0x3b3A…735A
        </div>
      </div>
      <div className="mt-4 text-[11px]">
        GitHub repo*
        <div className="border-line text-muted mt-1 h-9 rounded-lg border bg-white px-3 font-mono leading-9">
          owner/repo
        </div>
      </div>
      <div className="border-brand/40 bg-peach/70 text-muted mt-4 rounded-lg border border-dashed py-7 text-center text-xs">
        Drop your logo here
        <br />
        <span className="text-[10px]">PNG or SVG, https URL also works</span>
      </div>
      <div className="mt-5 flex justify-between text-xs">
        <span className="border-line rounded-lg border bg-white px-4 py-2">Back</span>
        <span className="bg-brand rounded-lg px-4 py-2 text-white">Next</span>
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

      <div className="reveal mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative h-112 overflow-hidden rounded-3xl bg-[#ff7a2e] px-6 pt-8 sm:px-12">
          <MockForm className="mx-auto max-w-lg" />
          <CursorTag className="top-2 right-6">Important dApp, Probably</CursorTag>
          <div
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-0 hidden w-36 sm:block sm:w-44"
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
