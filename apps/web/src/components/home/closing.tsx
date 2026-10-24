import { ButtonLink } from "@/components/ui/button";
import { Kit, type KitPose } from "@/components/kit/kit";
import { Em, Section } from "@/components/ui/frame";

const ROW: { pose: KitPose; delay: string }[] = [
  { pose: "dev", delay: "0s" },
  { pose: "hackathon", delay: "-1s" },
  { pose: "curator", delay: "-2s" },
  { pose: "astro", delay: "-3s" },
  { pose: "party", delay: "-4s" },
];

export function Closing() {
  return (
    <Section dark innerClassName="text-center">
      <div aria-hidden className="reveal mx-auto flex max-w-2xl items-end justify-center gap-1 sm:gap-3">
        {ROW.map(({ pose, delay }) => (
          <div key={pose} className="w-16 animate-float sm:w-28" style={{ animationDelay: delay }}>
            <Kit pose={pose} className="-rotate-6" />
          </div>
        ))}
      </div>
      <h2 className="reveal mx-auto mt-10 max-w-4xl text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02]">
        Ship it. List it. <Em>Get starred.</Em>
      </h2>
      <p className="reveal mt-4 text-lg text-white/70">Move fast, deploy on BOT Chain, get discovered.</p>
      <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/dapps" variant="light" size="lg">Browse dApps</ButtonLink>
        <ButtonLink href="/list" size="lg">List your dApp</ButtonLink>
      </div>
    </Section>
  );
}
