import { ButtonLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { PainterlySky, Sparkle } from "@/components/ui/decor";
import { Halftone } from "@/components/ui/halftone";
import { Em } from "@/components/ui/frame";
import { LogoStrip } from "./marquee";
import { CHAIN } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <PainterlySky />

      {/* flying Astro Kit, top right */}
      <div aria-hidden className="pointer-events-none absolute -top-4 right-[3%] w-44 rotate-[18deg] animate-float sm:w-72">
        <Kit pose="astro" />
      </div>
      {/* dot-screen sparkle, bottom left (our take on the halftone hand in the reference) */}
      <div aria-hidden className="pointer-events-none absolute bottom-28 left-[6%] hidden size-44 -rotate-12 md:block">
        <Halftone shape="spark" />
      </div>
      <Sparkle className="top-40 left-[14%]" />
      <Sparkle className="top-28 right-[34%] size-5" delay={1} />

      <div className="relative mx-auto max-w-300 px-5 pt-20 pb-20 text-center sm:pt-28 sm:pb-24">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 font-mono text-xs backdrop-blur">
          <span className="size-1.5 rounded-full bg-[#22c55e]" /> Live on {CHAIN.name} · chain {CHAIN.id}
        </div>
        <h1 className="mx-auto max-w-4xl text-[clamp(2.75rem,7.5vw,5.25rem)] leading-[0.98]">
          The home of
          <br />
          BOT Chain <Em>dApps.</Em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70 sm:text-xl">
          List your project in a minute. Get discovered. Get starred.
          <br />
          Built for builders, by builders.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/list" size="lg">List your dApp</ButtonLink>
          <ButtonLink href="/dapps" variant="secondary" size="lg">Browse dApps</ButtonLink>
        </div>
        <div className="mx-auto mt-14 flex w-fit items-end gap-3 sm:hidden" aria-hidden>
          <Kit pose="dev" className="w-32" float />
        </div>
        <div className="mx-auto mt-14 hidden w-fit items-end gap-2 sm:flex" aria-hidden>
          <Kit pose="hackathon" className="w-40" float />
          <Kit pose="dev" className="w-60 [animation-delay:-1.5s]" float />
          <Kit pose="party" className="w-40 [animation-delay:-3s]" float />
        </div>
      </div>
      <LogoStrip />
    </section>
  );
}
