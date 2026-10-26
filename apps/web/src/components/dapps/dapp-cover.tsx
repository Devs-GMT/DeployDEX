"use client";

import { useState } from "react";
import { CATEGORY_ART, categoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { usePreviewImage } from "@/hooks/use-preview-image";
import { CategoryArt } from "@/components/ui/category-art";
import { LogoAvatar, proxiedImage } from "./logo-avatar";

/**
 * Cover for a listing. When the project's site (or repo) declares a share image, that image
 * fills the cover. Otherwise: the category's soft tint and dot grid with Kit in the category's
 * costume on the right. Either way the project logo sits as a tile bottom-left.
 * Fills its parent; the parent sets the size and clipping.
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
  /** Cards use md, the project page lg. */
  size?: "md" | "lg";
  className?: string;
}) {
  const preview = usePreviewImage(liveUrl, repo);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [broken, setBroken] = useState<string | null>(null);
  const slug = categoryById(category).slug;
  const tint = CATEGORY_ART[slug]!.tint;
  const src = preview.data && preview.data !== broken ? preview.data : null;
  const showing = !!src && loaded === src;

  return (
    <div
      className={cn("kit-group absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: `color-mix(in srgb, var(${tint}) 60%, var(--color-card))` }}
    >
      <div aria-hidden className="dot-grid absolute inset-0" />
      <div
        aria-hidden
        className={cn(
          "absolute top-[6%] right-[2%] aspect-square h-[104%] transition-opacity duration-500",
          showing && "opacity-0",
        )}
      >
        <CategoryArt
          slug={slug}
          still
          sizes={
            size === "lg" ? "(min-width: 768px) 360px, 60vw" : "(min-width: 1024px) 220px, 50vw"
          }
        />
      </div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary listing host, loaded as-is
        <img
          key={src}
          src={proxiedImage(src, "cover")}
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
      )}
      <LogoAvatar
        name={name || "?"}
        category={category}
        src={logoUrl}
        className={cn(
          "border-card absolute border-4 shadow-[0_14px_30px_-14px_rgb(120_45_0/0.45)]",
          size === "lg"
            ? "bottom-6 left-6 size-24 rounded-[26px] text-4xl"
            : "bottom-4 left-4 size-16 rounded-2xl text-2xl",
        )}
      />
    </div>
  );
}
