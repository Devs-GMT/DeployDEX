import type { Metadata } from "next";
import { Em } from "@/components/ui/frame";
import { DexStats } from "@/components/stats/dex-stats";

export const metadata: Metadata = {
  title: "Dex stats",
  description: "Live numbers from the DeployDex registry on BOT Chain: listings per week, shelves and stars.",
};

export default function StatsPage() {
  return (
    <div className="pb-24">
      <header className="border-line border-b">
        <div className="lg:border-line mx-auto max-w-300 px-5 pt-16 pb-12 sm:px-10 sm:pt-20 lg:border-x">
          <h1
            data-split
            className="max-w-[16ch] text-[clamp(2.4rem,5.6vw,4.25rem)] leading-[0.98] text-balance"
          >
            The Dex <Em>by the numbers.</Em>
          </h1>
          <p className="text-ink/70 mt-5 max-w-[52ch] text-lg">
            Read straight from the registry contract on BOT Chain. No analytics, no database, just
            what the chain says.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-300 px-5 pt-12 sm:px-10">
        <DexStats />
      </div>
    </div>
  );
}
