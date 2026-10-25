import { ButtonLink } from "@/components/ui/button";
import { Kit, type KitPose } from "@/components/kit/kit";
import { Em, Section } from "@/components/ui/frame";
import { StarField } from "@/components/illustrations/star-field";
import { Magnetic } from "@/components/motion/magnetic";
import { ClosingScene } from "./closing-scene";

// Float delays are static class names so Tailwind can see them.
const ROW: { pose: KitPose; delay: string }[] = [
  { pose: "dev", delay: "[animation-delay:0s]" },
  { pose: "hackathon", delay: "[animation-delay:-1s]" },
  { pose: "curator", delay: "[animation-delay:-2s]" },
  { pose: "astro", delay: "[animation-delay:-3s]" },
  { pose: "party", delay: "[animation-delay:-4s]" },
];

export function Closing() {
  return (
    <Section dark className="overflow-hidden" innerClassName="text-center">
      <StarField className="opacity-50" />
      <ClosingScene>
        <div aria-hidden className="mx-auto flex max-w-2xl items-end justify-center gap-1 sm:gap-3">
          {ROW.map(({ pose, delay }) => (
            // GSAP moves the wrapper; the Kit inside keeps its own CSS float.
            <div key={pose} data-close-kit className="w-16 sm:w-28">
              <Kit pose={pose} float className={`-rotate-6 ${delay}`} />
            </div>
          ))}
        </div>
        <h2
          data-split
          className="mx-auto mt-10 max-w-4xl text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02]"
        >
          Ship it. List it. <Em>Get starred.</Em>
        </h2>
        <p className="reveal mt-4 text-lg text-white/70">
          Move fast, deploy on BOT Chain, get discovered.
        </p>
        <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dapps" variant="light" size="lg">
            Browse dApps
          </ButtonLink>
          <Magnetic>
            <ButtonLink href="/list" size="lg">
              List your dApp
            </ButtonLink>
          </Magnetic>
        </div>
      </ClosingScene>
    </Section>
  );
}
