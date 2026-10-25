"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Scrolling is native (no smooth-scroll library): the browser's own wheel smoothing, CSS
 * `scroll-behavior: smooth` for in-page anchors, and `scrub` easing in the GSAP scenes.
 * This only recomputes every ScrollTrigger position when a new page lays out.
 */
export function ScrollRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
