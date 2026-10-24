"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Pointer-follow 3D tilt for cards. Mouse/pen only (no touch), off under reduced motion.
 * Children tagged `data-depth="n"` float n px towards the viewer for a parallax feel.
 */
export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
          const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
          const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
          const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el);

          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * max);
            ry(px * max);
            layers.forEach((l) =>
              gsap.to(l, {
                x: px * Number(l.dataset.depth),
                y: py * Number(l.dataset.depth),
                duration: 0.5,
                overwrite: "auto",
              }),
            );
          };
          const leave = () => {
            rx(0);
            ry(0);
            gsap.to(layers, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
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
    <div ref={root} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
