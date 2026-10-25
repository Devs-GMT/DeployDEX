"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ_FULL, useGSAP } from "@/lib/gsap";

/**
 * "Prints on a table": the category cards start as one fanned deck in the middle of the grid
 * and are dealt out to their slots as the section scrolls through (desktop, scrubbed, no pin),
 * while each card's halftone dots "print in" by growing from nothing.
 * Smaller screens use the cheap CSS reveal instead (`.reveal-lite` on each card, run by
 * MotionRoot). Reduced motion: the final layout, untouched.
 * Tweens the `[data-cat-card]` wrappers, never the Tilt or transition-styled elements inside.
 */
export function CategoriesScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const grid = q<HTMLElement>("[data-cat-grid]")[0];
      if (!grid) return;
      const cards = q<HTMLElement>("[data-cat-card]");
      const dots = q<SVGCircleElement>("[data-ht]");
      const mm = gsap.matchMedia();

      mm.add(MQ_FULL, () => {
        // offsetLeft/Top ignore transforms, so refreshes measure the real slots.
        const toCenter = (c: HTMLElement, axis: "x" | "y") =>
          axis === "x"
            ? grid.offsetWidth / 2 - (c.offsetLeft + c.offsetWidth / 2)
            : grid.offsetHeight / 2 - (c.offsetTop + c.offsetHeight / 2);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: "top 88%",
            end: "top 22%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        cards.forEach((c, i) => {
          tl.from(
            c,
            {
              x: () => toCenter(c, "x"),
              y: () => toCenter(c, "y"),
              rotation: (i - (cards.length - 1) / 2) * 5,
              scale: 0.86,
              ease: "power2.out",
              duration: 1,
            },
            i * 0.07,
          );
        });
        tl.from(dots, { attr: { r: 0 }, ease: "power1.out", duration: 0.7, stagger: 0.06 }, 0.35);
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
