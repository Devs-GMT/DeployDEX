import Link from "next/link";
import { categoryById } from "@/lib/categories";
import { shortAddress } from "@/lib/format";
import type { Dapp } from "@/lib/types";
import { parseRepo, safeHttpsUrl } from "@/lib/validators";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CategoryArt } from "@/components/ui/category-art";
import {
  IconArrowRight,
  IconExternal,
  IconRepo,
  IconStar,
  IconVerified,
} from "@/components/ui/icons";
import { Tilt } from "@/components/motion/tilt";
import { LogoAvatar } from "./logo-avatar";
import { StarButton } from "./star-button";

/** Wide charcoal spotlight for the most-starred dApp, shown above the grid when nothing is filtered. */
export function FeaturedDapp({ dapp }: { dapp: Dapp }) {
  const cat = categoryById(dapp.category);
  const liveUrl = safeHttpsUrl(dapp.liveUrl);

  return (
    <Tilt max={2}>
      <article className="bg-charcoal relative grid overflow-hidden rounded-[28px] text-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative z-10 flex flex-col gap-5 p-7 sm:p-10">
          <div className="flex items-center gap-2">
            <span className="bg-brand rounded-full px-2.5 py-1 font-mono text-[11px] font-medium">
              #1 starred
            </span>
            <span className="font-mono text-xs text-white/60">{cat.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <LogoAvatar
              name={dapp.name}
              src={dapp.logoUrl}
              className="size-18 rounded-2xl border-[3px] border-white/90 text-3xl"
            />
            <h2 className="min-w-0 text-[clamp(2rem,4vw,3rem)] leading-[1.02] [overflow-wrap:anywhere]">
              <Link href={`/dapps/${dapp.id}`} className="hover:text-peach">
                {dapp.name}
              </Link>
            </h2>
          </div>
          <p className="max-w-[46ch] text-lg leading-relaxed text-white/75">{dapp.tagline}</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip tone="green">
              <IconVerified className="mr-1 size-3.5" /> Contract {shortAddress(dapp.target)}
            </Chip>
            {parseRepo(dapp.repo) && (
              <Chip tone="green">
                <IconRepo className="mr-1 size-3.5" /> {dapp.repo}
              </Chip>
            )}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            {liveUrl && (
              <ButtonLink href={liveUrl} variant="light" target="_blank" rel="noopener noreferrer">
                Open app <IconExternal className="size-4" />
              </ButtonLink>
            )}
            <ButtonLink
              href={`/dapps/${dapp.id}`}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Details <IconArrowRight />
            </ButtonLink>
            <div className="ml-auto">
              <StarButton dapp={dapp} size="md" />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="dot-grid-light relative min-h-56 overflow-hidden border-t border-white/10 md:border-t-0 md:border-l"
        >
          <div data-depth="18" className="absolute inset-x-[12%] top-[6%] bottom-0">
            <CategoryArt slug={cat.slug} sizes="(min-width: 768px) 420px, 80vw" />
          </div>
          <div
            data-depth="30"
            className="text-ink absolute right-6 bottom-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_14px_30px_-12px_rgb(0_0_0/0.5)]"
          >
            <IconStar className="text-brand size-6" />
            <span className="font-display text-3xl tabular-nums">{dapp.stars}</span>
            <span className="text-muted text-sm">stars</span>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
