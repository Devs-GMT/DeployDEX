import type { Metadata } from "next";
import { DappForm } from "@/components/dapps/dapp-form";
import { Kit } from "@/components/kit/kit";
import { Em } from "@/components/ui/frame";
import { Halftone } from "@/components/ui/halftone";
import { Sparkle } from "@/components/ui/decor";

export const metadata: Metadata = {
  title: "List your dApp",
  description: "Fill 6 fields, we check the contract, you're live.",
};

const FACTS = ["3 steps", "~1 minute", "Only gas, zero fees"];

export default function ListPage() {
  return (
    <div>
      <section className="bg-peach/45 border-line relative overflow-hidden border-b">
        <div aria-hidden className="halftone-field pointer-events-none absolute inset-0" />
        <Sparkle className="top-10 left-[46%]" />
        <Sparkle className="right-[30%] bottom-10 size-3" delay={1.4} />
        <div className="lg:border-line relative mx-auto grid max-w-300 items-end gap-6 px-5 pt-12 sm:px-10 sm:pt-16 lg:grid-cols-[1fr_auto] lg:border-x">
          <div className="pb-10 sm:pb-12">
            <p className="text-brand-deep font-mono text-xs tracking-widest">LIST YOUR DAPP</p>
            <h1 className="mt-3 max-w-[16ch] text-[clamp(2.4rem,5.4vw,4rem)] leading-[0.98] text-balance">
              Put your build <Em>on the shelf.</Em>
            </h1>
            <p className="text-ink/70 mt-4 max-w-[48ch] text-lg">
              Every listing must point to a real BOT Chain contract. Inspector Kit checks it, and
              your GitHub repo, while you type.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {FACTS.map((f) => (
                <li
                  key={f}
                  className="border-ink/10 rounded-full border bg-white/80 px-3 py-1 font-mono text-xs"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden className="relative hidden w-56 self-end lg:block">
            <div className="absolute -top-6 -left-16 size-36 -rotate-12 opacity-70">
              <Halftone shape="shield" dot={2.4} />
            </div>
            <Kit pose="inspector" float priority sizes="224px" />
          </div>
        </div>
      </section>

      <div className="lg:border-line mx-auto max-w-300 px-5 py-10 sm:px-10 sm:py-12 lg:border-x">
        <DappForm mode={{ kind: "create" }} />
      </div>
    </div>
  );
}
