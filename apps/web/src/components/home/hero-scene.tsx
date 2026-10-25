"use client";

import { useRef, type ReactNode } from "react";
import {
  gsap,
  MQ_FULL,
  MQ_LITE,
  MQ_MOTION,
  muteTransitions,
  restoreTransitions,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/lib/gsap";

/**
 * Hero choreography. The markup is server-rendered by Hero; this only animates tagged nodes.
 * - On load: Astro Kit launches from the bottom-left along a curved path, its contrail draws,
 *   the headline rises word by word, then the copy, buttons and the Kit trio land on the clouds.
 *   Kit stops in the top right and keeps floating (its CSS float); the contrail stays drawn.
 * - No scroll-linked work: the hero scrolls away like any section and the sky stays a still
 *   painting, so its SVG filter is painted once and never again.
 * - Smaller screens: Kit swoops into its corner instead of flying the desktop path, which would
 *   cross the headline on a narrow screen.
 * - Reduced motion: nothing moves; the still painting and copy are already in place.
 */
export function HeroScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ_MOTION, () => {
        const split = SplitText.create(q("[data-hero-title]"), { type: "words", mask: "words" });

        const ctas = q("[data-hero-cta] > *");
        muteTransitions(ctas);
        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => restoreTransitions(ctas),
        });
        intro
          .from(q("[data-hero-badge]"), { autoAlpha: 0, y: -16, duration: 0.6 })
          .from(
            split.words,
            { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.07 },
            "<0.1",
          )
          .from(q("[data-hero-sub]"), { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.55")
          .from(ctas, { autoAlpha: 0, y: 18, scale: 0.94, stagger: 0.08, duration: 0.6 }, "-=0.5")
          .from(
            q("[data-hero-trio] > *"),
            { autoAlpha: 0, y: 90, duration: 0.9, ease: "back.out(1.6)", stagger: 0.12 },
            "-=0.45",
          );

        return () => split.revert();
      });

      mm.add(MQ_FULL, () => {
        const path = q<SVGPathElement>("[data-hero-path]")[0];
        const kit = q("[data-hero-kit]")[0];
        const trail = q("[data-hero-trail]")[0];
        // Launch: Kit flies the curved path into the top right while its contrail draws.
        if (path && kit && trail) {
          gsap.set(trail, { autoAlpha: 1 });
          gsap
            .timeline({ delay: 0.2, defaults: { duration: 2.4, ease: "power2.inOut" } })
            .fromTo(
              kit,
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0, end: 0.7 },
              },
            )
            .fromTo(trail, { drawSVG: "0% 0%" }, { drawSVG: "0% 70%" }, 0);
        }
      });

      mm.add(MQ_LITE, () => {
        // Phones: the desktop path would cross the headline, so Kit just swoops into its
        // corner from off-screen top right, with no contrail.
        gsap.from(q("[data-hero-kit]"), {
          x: 140,
          y: -110,
          rotation: 35,
          autoAlpha: 0,
          duration: 1.3,
          delay: 0.5,
          ease: "power3.out",
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="border-line relative overflow-hidden border-t">
      {children}
    </section>
  );
}
