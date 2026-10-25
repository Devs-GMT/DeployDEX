"use client";

import { useState } from "react";
import { CATEGORY_ART, categoryById } from "@/lib/categories";
import { coverArt } from "@/lib/preview";
import { cn } from "@/lib/utils";
import { usePreviewImage } from "@/hooks/use-preview-image";
import { Halftone } from "@/components/ui/halftone";

/**
 * Cover art for a listing: the project's own share image when its site (or repo) has one,
 * over a generative poster (brand mesh seeded by the contract, the project name as an
 * oversized wordmark bleeding off the bottom, the category halftone as a small accent), so
 * every card differs and nothing is ever blank while the image loads or when there is none.
 * Fills its parent; the parent sets the size and clipping.
 */
export function DappCover({
  name,
  seed,
  category,
  liveUrl,
  repo,
  className,
}: {
  name: string;
  /** Stable per listing (the contract address); picks the generative colors. */
  seed: string;
  category: number;
  liveUrl?: string;
  repo?: string;
  className?: string;
}) {
  const preview = usePreviewImage(liveUrl, repo);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [broken, setBroken] = useState<string | null>(null);
  const art = CATEGORY_ART[categoryById(category).slug]!;
  const poster = coverArt(seed);
  const src = preview.data && preview.data !== broken ? preview.data : null;
  const showing = !!src && loaded === src;

  return (
    <div aria-hidden className={cn("@container absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0" style={poster.style} />
      <div className="halftone-field absolute inset-0 opacity-60" />
      <p
        className={cn(
          "font-display absolute right-4 -bottom-[0.18em] left-24 truncate text-right text-[clamp(3rem,9cqw,5.5rem)] leading-none tracking-[-0.06em]",
          poster.dark ? "text-card/15" : "text-card/80",
        )}
      >
        {name}
      </p>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary listing host, loaded as-is
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(src)}
          onError={() => setBroken(src)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 ease-out group-hover:scale-[1.03]",
            showing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <div
        data-depth="10"
        className={cn(
          "absolute -top-2 -right-2 size-20 transition-transform duration-700 ease-out group-hover:-rotate-6",
          showing && "opacity-0",
        )}
      >
        <Halftone shape={art.shape} />
      </div>
    </div>
  );
}
