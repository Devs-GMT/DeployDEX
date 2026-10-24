import Link from "next/link";
import { CATEGORIES, CATEGORY_ART, categoryById } from "@/lib/categories";
import { isNew } from "@/lib/format";
import type { Dapp } from "@/lib/types";
import { Chip } from "@/components/ui/chip";
import { Button, ButtonLink } from "@/components/ui/button";
import { safeHttpsUrl, parseRepo } from "@/lib/validators";
import { Halftone } from "@/components/ui/halftone";
import { LogoAvatar } from "./logo-avatar";
import { StarButton } from "./star-button";
import { Tilt } from "@/components/motion/tilt";

export function DappCard({ dapp }: { dapp: Dapp }) {
  const cat = categoryById(dapp.category);
  const liveUrl = safeHttpsUrl(dapp.liveUrl);
  const art = CATEGORY_ART[(CATEGORIES.find((c) => c.id === dapp.category) ?? cat).slug]!;
  return (
    // Subtle pointer tilt (desktop mouse only); the halftone art floats on its own depth layer.
    <Tilt max={4} className="h-full">
      <article className="group border-line bg-card flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-shadow hover:shadow-xl">
        <div className="border-line relative h-28 border-b bg-white">
          <div aria-hidden data-depth="10" className="absolute -top-3 right-3 size-28 opacity-90">
            <div className="size-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Halftone shape={art.shape} />
            </div>
          </div>
          {isNew(dapp.listedAt) && (
            <span className="from-pink absolute top-3 left-3 rounded-full bg-linear-to-r to-[#ff8a3d] px-3 py-1 text-xs font-medium text-white">
              New
            </span>
          )}
          <LogoAvatar
            name={dapp.name}
            src={dapp.logoUrl}
            className="absolute -bottom-6 left-5 size-14 border-2 border-white shadow-md"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 px-5 pt-9 pb-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 truncate text-xl leading-tight">
              <Link href={`/dapps/${dapp.id}`} className="hover:text-brand">
                {dapp.name}
              </Link>
            </h3>
            <span
              className="text-brand shrink-0 font-mono text-sm font-medium"
              aria-label={`${dapp.stars} stars`}
            >
              ⭐ {dapp.stars}
            </span>
          </div>
          <p className="text-muted line-clamp-2 min-h-10 text-sm">{dapp.tagline}</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip>{cat.label}</Chip>
            <Chip tone="green">✓ Contract</Chip>
            {parseRepo(dapp.repo) && <Chip tone="green">✓ GitHub</Chip>}
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            {liveUrl ? (
              <ButtonLink
                href={liveUrl}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open app ↗
              </ButtonLink>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                title="This listing has no safe https link"
              >
                Link unavailable
              </Button>
            )}
            <StarButton dapp={dapp} />
          </div>
        </div>
      </article>
    </Tilt>
  );
}
