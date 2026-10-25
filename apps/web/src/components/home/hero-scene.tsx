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
 * - On scroll (desktop): as the hero scrolls away the near clouds part like curtains, the sky
 *   layers drift at different speeds and Kit blasts off the top of the screen. No pin, so the
 *   page keeps one less pin-spacer and the scroll stays light.
 * - Smaller screens get the load animation only (no scroll-linked work); Kit swoops into its corner
 *   instead of flying the desktop path, which would cross the headline on a narrow screen.
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
        // Launch: Kit flies the curved path across the sky while its contrail draws.
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
        const scene = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        });
        scene
          .to(q("[data-hero-near-left]"), { xPercent: -38, yPercent: 10, scale: 1.25 }, 0)
          .to(q("[data-hero-near-right]"), { xPercent: 38, yPercent: 10, scale: 1.25 }, 0)
          .to(q("[data-hero-mid]"), { yPercent: -10, scale: 1.08 }, 0)
          .to(q("[data-hero-far]"), { yPercent: -4 }, 0)
          .to(q("[data-hero-sun]"), { scale: 1.25, autoAlpha: 0.6 }, 0)
          .to(q("[data-hero-copy]"), { yPercent: -14, autoAlpha: 0.15, scale: 0.96 }, 0)
          .to(q("[data-hero-trio] > *"), { y: -40, stagger: 0.04 }, 0);
        if (path && kit && trail) {
          scene
            .to(
              kit,
              {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0.7, end: 1 },
                immediateRender: false,
              },
              0,
            )
            .to(trail, { drawSVG: "0% 100%", immediateRender: false }, 0);
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
