import type { ReactNode } from "react";
import { categoryById } from "@/lib/categories";
import { shortAddress } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { IconRepo, IconStar, IconVerified } from "@/components/ui/icons";
import { DappCover } from "./dapp-cover";

/**
 * The visual card shared by the showcase and the form's live preview, so builders
 * see exactly what they will publish. Data and actions come in as props and slots.
 */
export function DappCardFace({
  name,
  tagline,
  category,
  logoUrl,
  liveUrl,
  repo,
  stars,
  target,
  contractOk,
  repoOk,
  fresh = false,
  rank,
  title,
  actions,
  className,
}: {
  name: string;
  tagline: string;
  category: number;
  logoUrl?: string;
  /** Live site and repo, used to find the project's share image for the cover. */
  liveUrl?: string;
  repo?: string;
  stars: number;
  target?: string;
  contractOk: boolean;
  repoOk: boolean;
  fresh?: boolean;
  /** Position in a stars ranking; the top three get a ribbon. */
  rank?: number;
  /** Heading content (a link on the showcase, plain text in the preview). */
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const cat = categoryById(category);
  const podium = rank != null && rank <= 3 && stars > 0;

  return (
    <article
      className={cn(
        "group border-line bg-card relative flex h-full flex-col rounded-3xl border shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgb(120_45_0/0.35)]",
        className,
      )}
    >
      <div className="border-line relative aspect-[1.91/1] border-b">
        {/* Cover is clipped to the header so the star button's popovers below can overflow the card.
            1.91:1 is the og:image shape, so a project's share image fits without cropping. */}
        <DappCover
          name={name}
          logoUrl={logoUrl}
          category={category}
          liveUrl={liveUrl}
          repo={repo}
          className="rounded-t-[inherit]"
        />
        <div className="absolute top-3.5 left-4 flex gap-1.5">
          {podium && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-[11px] font-medium tabular-nums",
                rank === 1 ? "bg-brand text-white" : "bg-ink text-white",
              )}
            >
              #{rank} starred
            </span>
          )}
          {fresh && (
            <span className="bg-pink rounded-full px-2.5 py-1 text-[11px] font-medium text-white">
              New
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-[1.375rem] leading-tight">{title ?? name}</h3>
          <span
            className="text-brand-deep mt-1 inline-flex shrink-0 items-center gap-1 font-mono text-sm font-medium tabular-nums"
            aria-label={`${stars} stars`}
          >
            <IconStar className="text-brand size-4" />
            {stars}
          </span>
        </div>
        <p className="text-muted mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed">{tagline}</p>

        <div className="mt-4 mb-5 flex flex-wrap gap-1.5">
          <Chip>{cat.label}</Chip>
          {contractOk && (
            <Chip tone="green">
              <IconVerified className="mr-1 size-3.5" /> Contract
            </Chip>
          )}
          {repoOk && (
            <Chip tone="green">
              <IconRepo className="mr-1 size-3.5" /> Repo
            </Chip>
          )}
        </div>

        <div className="border-line mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-3 border-t border-dashed pt-4">
          <span className="text-muted font-mono text-xs whitespace-nowrap" title={target}>
            {target ? shortAddress(target) : "0x…"}
          </span>
          {actions}
        </div>
      </div>
    </article>
  );
}
