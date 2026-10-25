"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Pulls its child gently towards the pointer while hovered (mouse/pen only, not under
 * reduced motion). Wrap primary CTAs with it; the child keeps its own hover styles.
 */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap
        .matchMedia()
        .add(
          "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          () => {
            const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
            const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              x((e.clientX - (r.left + r.width / 2)) * strength);
              y((e.clientY - (r.top + r.height / 2)) * strength);
            };
            const leave = () => {
              gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            return () => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            };
          },
        );
    },
    { scope: root },
  );

  return (
    <span ref={root} className="inline-block">
      {children}
    </span>
  );
}
