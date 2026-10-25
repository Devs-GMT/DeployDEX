"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { safeHttpsUrl } from "@/lib/validators";

/** Project logo with a fallback avatar showing the project's initial. */
export function LogoAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const safeSrc = safeHttpsUrl(src);
  const base = "size-12 shrink-0 rounded-xl";
  if (safeSrc && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied host
      <img
        src={safeSrc}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={cn(base, "border border-line bg-white object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(base, "grid place-items-center bg-peach font-display text-xl text-[#7a2d00]", className)}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
