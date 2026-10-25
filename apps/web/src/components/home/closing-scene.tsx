"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ_MOTION, useGSAP } from "@/lib/gsap";

const COLORS = ["#FF5C00", "#FFD43B", "#FF405D", "#3b82f6", "#17a862", "#ffffff"];
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
}));

/**
 * Closing choreography: the five Kits fly in from both sides into formation, then a
 * confetti burst pops from behind the headline. Plays once when the section comes into view.
 */
export function ClosingScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MQ_MOTION, () => {
        const kits = q("[data-close-kit]");
        const mid = (kits.length - 1) / 2;
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } })
          .from(kits, {
            x: (i) => (i - mid) * 260,
            y: (i) => -60 - Math.abs(i - mid) * 40,
            rotation: (i) => (i - mid) * 22,
            opacity: 0,
            duration: 1.1,
            ease: "back.out(1.4)",
            stagger: { each: 0.08, from: "center" },
          })
          .fromTo(
            q("[data-confetti]"),
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
            {
              keyframes: {
                y: [0, () => -gsap.utils.random(140, 320), () => gsap.utils.random(120, 260)],
                easeEach: "power1.out",
              },
              x: () => gsap.utils.random(-480, 480),
              rotation: () => gsap.utils.random(-540, 540),
              opacity: 0,
              scale: () => gsap.utils.random(0.6, 1.3),
              duration: 1.8,
              ease: "power2.out",
              stagger: 0.008,
            },
            "-=0.5",
          );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 z-0">
        {PIECES.map((p, i) => (
          <span
            key={i}
            data-confetti
            className={`absolute block size-2.5 opacity-0 ${p.round ? "rounded-full" : "rounded-[2px]"}`}
            style={{ background: p.color }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
