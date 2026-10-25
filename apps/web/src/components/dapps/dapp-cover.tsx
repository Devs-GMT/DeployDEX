"use client";

import { useState } from "react";
import { CATEGORY_ART, categoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { usePreviewImage } from "@/hooks/use-preview-image";
import { LogoAvatar } from "./logo-avatar";

/**
 * Cover for a listing. When the project's site (or repo) declares a share image, that image
 * fills the cover with the logo as a small badge in its corner. Otherwise the cover is calm and
 * on-brand: the category's soft tint, the site's dot grid, and the project logo large in the
 * middle, like an app-store tile. Fills its parent; the parent sets the size and clipping.
 */
export function DappCover({
  name,
  logoUrl,
  category,
  liveUrl,
  repo,
  size = "md",
  className,
}: {
  name: string;
  logoUrl?: string;
  category: number;
  liveUrl?: string;
  repo?: string;
  /** Logo tile size: cards use md, the project page lg. */
  size?: "md" | "lg";
  className?: string;
}) {
  const preview = usePreviewImage(liveUrl, repo);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [broken, setBroken] = useState<string | null>(null);
  const tint = CATEGORY_ART[categoryById(category).slug]!.tint;
  const src = preview.data && preview.data !== broken ? preview.data : null;
  const showing = !!src && loaded === src;

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: `color-mix(in srgb, var(${tint}) 55%, var(--color-card))` }}
    >
      <div aria-hidden className="dot-grid absolute inset-0" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-card)_75%,transparent),transparent)]"
      />
      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-500",
          showing && "opacity-0",
        )}
      >
        <LogoAvatar
          name={name || "?"}
          src={logoUrl}
          className={cn(
            "border-card border-4 shadow-[0_14px_30px_-14px_rgb(120_45_0/0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1",
            size === "lg" ? "size-28 rounded-[28px] text-5xl" : "size-20 rounded-3xl text-3xl",
          )}
        />
      </div>
      {src && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary listing host, loaded as-is */}
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
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
          {showing && (
            <LogoAvatar
              name={name || "?"}
              src={logoUrl}
              className="border-card absolute bottom-3 left-3 size-10 rounded-xl border-2 text-base shadow-[0_6px_16px_-6px_rgb(0_0_0/0.4)]"
            />
          )}
        </>
      )}
    </div>
  );
}
