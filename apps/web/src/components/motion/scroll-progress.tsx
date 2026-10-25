"use client";

import { useRef } from "react";
import { gsap, MQ_MOTION, useGSAP } from "@/lib/gsap";

/**
 * Thin orange bar at the very top that fills as you scroll the page. Decorative.
 * Browsers with CSS scroll-driven animations run it natively (`.scroll-progress` in
 * globals.css, no JS per frame); others fall back to a GSAP scrub.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;
    gsap.matchMedia().add(MQ_MOTION, () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );
    });
  });

  return (
    <div
      ref={bar}
      aria-hidden
      className="scroll-progress bg-brand pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0"
    />
  );
}
