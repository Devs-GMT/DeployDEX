"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ_FULL, MQ_LITE, useGSAP } from "@/lib/gsap";

/**
 * "List it" demo: the mock form fills itself in as you scroll, Inspector Kit's checks tick
 * one by one, then the cursor moves onto Next and it pulses.
 * Desktop pins the row and scrubs the sequence; smaller screens play it once on enter.
 * The static markup is the finished state, so no-JS and reduced motion still read correctly.
 * (Uses opacity rather than autoAlpha because the row sits inside a global `.reveal`.)
 */
export function ListScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      const build = (tl: gsap.core.Timeline) => {
        q("[data-type]").forEach((field, i) => {
          tl.fromTo(
            field,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "steps(12)" },
            i === 0 ? 0 : ">-0.05",
          );
        });
        tl.from(q("[data-logo-drop]"), { scale: 0.92, opacity: 0.4, duration: 0.4 }, ">")
          .from(q("[data-checks]"), { y: 30, opacity: 0, duration: 0.4 }, "<")
          .from(
            q("[data-check]"),
            { scale: 0, opacity: 0, duration: 0.25, stagger: 0.3, ease: "back.out(2)" },
            ">",
          )
          .from(
            q("[data-list-cursor]"),
            { x: -160, y: -120, opacity: 0, duration: 0.6, ease: "power2.inOut" },
            ">-0.1",
          )
          .to(q("[data-list-next]"), { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1 }, ">");
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add(MQ_FULL, () => {
        build(
          gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 15%",
              end: "+=110%",
              pin: true,
              scrub: 0.6,
            },
          }),
        );
      });
      mm.add(MQ_LITE, () => {
        build(
          gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } }),
        );
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
