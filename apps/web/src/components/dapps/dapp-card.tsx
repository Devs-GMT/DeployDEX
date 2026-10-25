import Link from "next/link";
import { isNew } from "@/lib/format";
import type { Dapp } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/button";
import { IconExternal } from "@/components/ui/icons";
import { safeHttpsUrl, parseRepo } from "@/lib/validators";
import { Tilt } from "@/components/motion/tilt";
import { DappCardFace } from "./dapp-card-face";
import { StarButton } from "./star-button";

export function DappCard({ dapp, rank }: { dapp: Dapp; rank?: number }) {
  const liveUrl = safeHttpsUrl(dapp.liveUrl);
  return (
    // Subtle pointer tilt (desktop mouse only); the halftone art floats on its own depth layer.
    <Tilt max={4} className="h-full">
      <DappCardFace
        name={dapp.name}
        tagline={dapp.tagline}
        category={dapp.category}
        logoUrl={dapp.logoUrl}
        stars={dapp.stars}
        target={dapp.target}
        contractOk
        repoOk={!!parseRepo(dapp.repo)}
        fresh={isNew(dapp.listedAt)}
        rank={rank}
        title={
          <Link
            href={`/dapps/${dapp.id}`}
            className="hover:text-brand-deep after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {dapp.name}
          </Link>
        }
        actions={
          // Sits above the stretched title link so both controls stay clickable.
          <div className="relative z-10 flex items-center gap-2">
            {liveUrl ? (
              <ButtonLink
                href={liveUrl}
                variant="outline"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open <IconExternal className="size-3.5" />
                <span className="sr-only">{dapp.name} (opens in a new tab)</span>
              </ButtonLink>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                title="This listing has no safe https link"
              >
                No link
              </Button>
            )}
            <StarButton dapp={dapp} />
          </div>
        }
        className="has-[h3_a:focus-visible]:outline-brand has-[h3_a:focus-visible]:outline-2 has-[h3_a:focus-visible]:outline-offset-2"
      />
    </Tilt>
  );
}
