"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ_FULL, useGSAP } from "@/lib/gsap";

/**
 * "Old way vs DeployDex" as a pinned scene (desktop only):
 * 1. the old-way pills crack loose and fall, the "Is this even deployed?" doc slides away,
 * 2. the old card dims while the tunnel card comes forward,
 * 3. the floating tiles stream into Kit's portal, which flares as each one lands.
 * Smaller screens and reduced motion keep the static layout (with the global reveal).
 *
 * Uses `opacity`, not `autoAlpha`, for elements inside the revealed grid: while the grid is
 * still hidden by the reveal, its children inherit `visibility: hidden`, and autoAlpha would
 * record 0 as their starting value.
 */
export function WhyScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(MQ_FULL, () => {
        const portal = q("[data-why-portal]")[0];
        const tiles = q("[data-why-tile]");

        // Distance from a tile to the portal centre, re-measured on every refresh.
        const toPortal = (axis: "x" | "y") => (_: number, el: Element) => {
          if (!portal) return 0;
          const a = el.getBoundingClientRect();
          const b = portal.getBoundingClientRect();
          return axis === "x"
            ? b.left + b.width / 2 - (a.left + a.width / 2)
            : b.top + b.height / 2 - (a.top + a.height / 2);
        };

        gsap
          .timeline({
            defaults: { ease: "power2.in" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 12%",
              end: "+=130%",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(q("[data-why-pill]"), {
            keyframes: { rotation: [0, -4, 5, 0] },
            duration: 0.25,
            stagger: 0.05,
            ease: "none",
          })
          .to(q("[data-why-pill]"), {
            y: () => gsap.utils.random(220, 320),
            rotation: () => gsap.utils.random(-50, 50),
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
          })
          .to(q("[data-why-link]"), { scaleX: 0, opacity: 0, duration: 0.3 }, "<")
          .to(q("[data-why-doc]"), { yPercent: 120, rotation: 8, duration: 0.6 }, "<0.2")
          .to(
            q("[data-why-ghost]"),
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "<0.1",
          )
          .to(
            q("[data-why-old]"),
            { opacity: 0.55, scale: 0.96, duration: 0.5, ease: "none" },
            "<0.1",
          )
          .to(q("[data-why-new]"), { scale: 1.03, duration: 0.5, ease: "power1.out" }, "<")
          .to(
            tiles,
            {
              x: toPortal("x"),
              y: toPortal("y"),
              scale: 0.15,
              rotation: 0,
              opacity: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "power2.in",
            },
            "<0.2",
          )
          .to(
            portal ?? [],
            { scale: 1.18, duration: 0.25, ease: "power1.out", yoyo: true, repeat: 3 },
            "<0.3",
          )
          .to(
            q("[data-why-glow]"),
            { autoAlpha: 1, scale: 1.4, duration: 0.6, ease: "power1.out" },
            "<",
          )
          .to(q("[data-why-highlight]"), { color: "#ff5c00", duration: 0.3 }, ">-0.2");
      });
    },
    { scope: root },
  );

  // relative + z-10 keeps the cards above the section's star field.
  return (
    <div ref={root} className="relative z-10">
      {children}
    </div>
  );
}
