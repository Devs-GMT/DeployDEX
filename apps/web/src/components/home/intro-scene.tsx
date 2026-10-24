"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ_MOTION, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Intro panel choreography: the statement lights up word by word as you scroll through it,
 * the two documents fan out of a stack, and the cursor tag slides in once they settle.
 */
export function IntroScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ_MOTION, () => {
        const split = SplitText.create(q("[data-intro-text]"), { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              end: "center 40%",
              scrub: 0.6,
            },
          },
        );

        const docs = q("[data-intro-doc]");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              end: "center 45%",
              scrub: 0.8,
            },
          })
          .from(docs[0] ?? [], { x: 70, y: 40, rotation: 6 }, 0)
          .from(docs[1] ?? [], { x: -60, y: -30, rotation: -10 }, 0)
          // opacity, not autoAlpha: the panel may still be hidden by the global reveal here.
          .from(q("[data-intro-cursor]"), { x: -120, opacity: 0 }, 0.4);

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    // A real box (not display:contents) so ScrollTrigger can measure it.
    <div ref={root}>{children}</div>
  );
}
