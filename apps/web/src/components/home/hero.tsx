import { ButtonLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { Sparkle } from "@/components/ui/decor";
import { Halftone } from "@/components/ui/halftone";
import { Em } from "@/components/ui/frame";
import { Sky } from "@/components/illustrations/sky";
import { CHAIN } from "@/lib/config";
import { LogoStrip } from "./marquee";
import { HeroScene } from "./hero-scene";
import { Magnetic } from "@/components/motion/magnetic";

export function Hero() {
  return (
    <>
      <HeroScene>
        <Sky />

        {/* Kit's flight path and contrail (drawn by HeroScene). Hidden until JS animates it. */}
        <svg
          aria-hidden
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <path
            data-hero-path
            d="M120 860 C 300 640, 420 520, 640 470 S 1040 360, 1170 180 S 1380 -60, 1560 -160"
            fill="none"
            stroke="none"
          />
          <path
            data-hero-trail
            d="M120 860 C 300 640, 420 520, 640 470 S 1040 360, 1170 180 S 1380 -60, 1560 -160"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.85"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="1 22"
            className="invisible"
          />
        </svg>

        {/* Astro Kit. Without JS it simply hovers top right. */}
        <div
          data-hero-kit
          aria-hidden
          className="pointer-events-none absolute top-2 right-1 z-10 w-20 sm:top-10 sm:right-[6%] sm:w-56"
        >
          <div className="rotate-[18deg]">
            <Kit pose="astro" float sizes="(min-width: 640px) 224px, 80px" />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute bottom-40 left-[5%] hidden size-40 -rotate-12 opacity-80 md:block"
        >
          <Halftone shape="spark" />
        </div>
        <Sparkle className="top-40 left-[14%]" />
        <Sparkle className="top-28 right-[34%] size-5" delay={1} />
        <Sparkle className="top-[22rem] right-[12%] size-3" delay={2} />

        <div className="relative mx-auto max-w-300 px-5 pt-20 pb-10 text-center sm:pt-28">
          <div>
            <div
              data-hero-badge
              className="border-line mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border bg-white/90 px-3 py-1 font-mono text-xs"
            >
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-live/60" />
                <span className="relative size-2 rounded-full bg-live" />
              </span>
              Live on {CHAIN.name} · chain {CHAIN.id}
            </div>
            <h1
              data-hero-title
              className="mx-auto max-w-4xl text-[clamp(2.75rem,7.5vw,5.75rem)] leading-[0.98]"
            >
              The home of
              <br />
              BOT Chain <Em>dApps.</Em>
            </h1>
            <p data-hero-sub className="text-ink/70 mx-auto mt-6 max-w-xl text-lg sm:text-xl">
              List your project in a minute. Get discovered. Get starred.
              <br />
              Built for builders, by builders.
            </p>
            <div data-hero-cta className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <ButtonLink href="/list" size="lg">
                  List your dApp
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="/dapps" variant="secondary" size="lg">
                Browse dApps
              </ButtonLink>
            </div>
          </div>

          <div
            data-hero-trio
            aria-hidden
            className="mx-auto mt-12 flex w-fit items-end gap-1 sm:gap-3"
          >
            <div className="w-24 sm:w-40">
              <Kit pose="hackathon" float sizes="(min-width: 640px) 160px, 96px" />
            </div>
            <div className="w-36 sm:w-60">
              <Kit
                pose="dev"
                float
                priority
                sizes="(min-width: 640px) 240px, 144px"
                className="[animation-delay:-1.5s]"
              />
            </div>
            <div className="w-24 sm:w-40">
              <Kit
                pose="inspector"
                float
                sizes="(min-width: 640px) 160px, 96px"
                className="[animation-delay:-3s]"
              />
            </div>
          </div>
        </div>
      </HeroScene>
      <LogoStrip />
    </>
  );
}
