"use client";

import { useState } from "react";
import { CATEGORY_ART, categoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { safeHttpsUrl } from "@/lib/validators";

/** A listing's image served through our /api/image proxy (see that route for why). */
export function proxiedImage(src: string, kind: "logo" | "cover" = "logo") {
  return `/api/image?kind=${kind}&url=${encodeURIComponent(src)}`;
}

/**
 * Project logo, loaded through our image proxy so it shows even where the builder's host is
 * blocked. Without a logo, or when it fails, the default is an app-icon tile: the category's
 * soft tint with its 3D prop (bulb for AI, coin for RWA, ...). Decorative: the name is always
 * printed next to it.
 */
export function LogoAvatar({
  name,
  src,
  category,
  className,
}: {
  /** Kept for callers and debugging; the tile itself is decorative. */
  name: string;
  src?: string;
  /** Picks the default tile; falls back to "Other". */
  category?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState<string | null>(null);
  const safeSrc = safeHttpsUrl(src);
  const base = "size-12 shrink-0 rounded-xl";

  if (safeSrc && broken !== safeSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- proxied listing image, any host
      <img
        src={proxiedImage(safeSrc)}
        alt=""
        aria-hidden
        data-name={name}
        loading="lazy"
        decoding="async"
        onError={() => setBroken(safeSrc)}
        className={cn(base, "border-line border bg-white object-cover", className)}
      />
    );
  }

  const slug = categoryById(category ?? 7).slug;
  const tint = CATEGORY_ART[slug]!.tint;
  return (
    <span
      aria-hidden
      data-name={name}
      className={cn(base, "border-line grid place-items-center overflow-hidden border", className)}
      style={{ backgroundColor: `color-mix(in srgb, var(${tint}) 70%, var(--color-card))` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static 256px category icon */}
      <img
        src={`/category/icons/${slug}.webp`}
        alt=""
        width={256}
        height={256}
        draggable={false}
        decoding="async"
        className="size-[82%] object-contain drop-shadow-[0_3px_4px_rgb(90_40_10/0.18)]"
      />
    </span>
  );
}
