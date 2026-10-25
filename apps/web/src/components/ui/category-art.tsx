import { CATEGORY_ART } from "@/lib/categories";
import { CATEGORY_ART_READY } from "@/lib/category-art-ready";
import { cn } from "@/lib/utils";
import { Kit } from "@/components/kit/kit";

/** Responsive sources for a category render in /public/category (built by scripts/category-art.mjs). */
function srcSet(slug: string) {
  return `/category/${slug}-256.webp 256w, /category/${slug}-512.webp 512w, /category/${slug}.webp 1024w`;
}

/**
 * Kit dressed for a category (AI, RWA, ...). Shows the category's own HD render once it exists
 * in /public/category, else the closest existing Kit pose. Decorative.
 * - `still`: no idle breathing or contact shadow (grids, chips, form tiles); hovering a
 *   `.kit-group` ancestor still makes Kit hop.
 * - `crop`: a round head-and-shoulders badge for small chips; size it with `className`.
 */
export function CategoryArt({
  slug,
  sizes = "160px",
  still = false,
  crop = false,
  className,
}: {
  slug: string;
  sizes?: string;
  still?: boolean;
  crop?: boolean;
  className?: string;
}) {
  const art = CATEGORY_ART[slug] ?? CATEGORY_ART.other!;
  const ready = CATEGORY_ART_READY.includes(slug);
  const quiet = still || crop;
  const figure = ready ? (
    <span
      className={cn(
        "kit-pic",
        !quiet && "kit-pic-shadow",
        quiet && "kit-still",
        crop ? "absolute top-[2%] left-1/2 w-[175%] -translate-x-1/2" : className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static HD renders with a hand-built srcset */}
      <img
        src={`/category/${slug}-512.webp`}
        srcSet={srcSet(slug)}
        sizes={sizes}
        width={1024}
        height={1024}
        alt=""
        aria-hidden
        draggable={false}
        decoding="async"
        loading="lazy"
      />
    </span>
  ) : (
    <Kit
      pose={art.kit}
      sizes={sizes}
      shadow={!quiet}
      className={cn(
        quiet && "kit-still",
        crop ? "absolute top-[2%] left-1/2 w-[175%] -translate-x-1/2" : className,
      )}
    />
  );

  if (!crop) return figure;
  return (
    <span
      aria-hidden
      className={cn("relative block shrink-0 overflow-hidden rounded-full", className)}
    >
      {figure}
    </span>
  );
}
