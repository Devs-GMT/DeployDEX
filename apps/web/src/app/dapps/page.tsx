import { Suspense } from "react";
import type { Metadata } from "next";
import { Directory } from "@/components/dapps/directory";
import { Em } from "@/components/ui/frame";
import { PainterlySky, Sparkle } from "@/components/ui/decor";
import { Halftone } from "@/components/ui/halftone";
import { DirectoryStats } from "@/components/dapps/directory-stats";

export const metadata: Metadata = {
  title: "Browse dApps",
  description: "Every listing points to a real BOT Chain contract. Search, filter and star.",
};

export default function DappsPage() {
  return (
    <div>
      {/* Sky band. The directory's search shelf rises out of its bottom edge. */}
      <section className="relative overflow-hidden">
        <PainterlySky />
        <Sparkle className="top-16 left-[8%]" />
        <Sparkle className="top-32 right-[38%] size-3" delay={1.2} />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 right-[18%] hidden size-44 rotate-12 opacity-50 lg:block"
        >
          <Halftone shape="spark" dot={2.2} />
        </div>
        <div className="relative mx-auto max-w-300 px-5 pt-16 pb-28 sm:px-10 sm:pt-20 sm:pb-32 lg:border-x lg:border-white/40">
          <h1
            data-split
            className="max-w-[14ch] text-[clamp(2.6rem,6.4vw,4.75rem)] leading-[0.98] text-balance"
          >
            Every BOT Chain dApp, <Em>on one shelf.</Em>
          </h1>
          <p className="text-ink/70 mt-5 max-w-[46ch] text-lg">
            Each listing points to a real contract, checked on-chain. Search it, filter it, star
            what you love.
          </p>
          <DirectoryStats />
        </div>
      </section>

      <div className="lg:border-line mx-auto max-w-300 px-5 pb-20 sm:px-10 lg:border-x">
        <Suspense fallback={null}>
          <Directory />
        </Suspense>
      </div>
    </div>
  );
}
