"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ_FULL, MQ_LITE, MQ_MOTION, useGSAP } from "@/lib/gsap";

/**
 * "List it or browse" as one flipping card.
 * - Desktop: the card pins; scrolling fills the mock form in, ticks Inspector Kit's checks,
 *   moves the cursor onto Next, then turns the card over to the "Browse it" face.
 * - Smaller screens: the demo plays once on enter and a List/Browse toggle flips the card.
 * - Static markup (no JS, reduced motion) shows both faces stacked, so nothing is hidden.
 * The face that is turned away is made `inert` so keyboard and screen readers skip it.
 */
export function ListScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q<HTMLElement>("[data-flip-stage]")[0];
      const card = q<HTMLElement>("[data-flip-card]")[0];
      const front = q<HTMLElement>('[data-flip-face="front"]')[0];
      const back = q<HTMLElement>('[data-flip-face="back"]')[0];
      if (!stage || !card || !front || !back) return;

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

      /** Which face is showing, from the card's current rotation. */
      const sync = () => {
        const showingBack = Math.abs(Number(gsap.getProperty(card, "rotationY"))) > 90;
        front.inert = showingBack;
        back.inert = !showingBack;
        q<HTMLElement>("[data-flip-step]").forEach((el) => {
          const on = (el.dataset.flipStep === "back") === showingBack;
          el.classList.toggle("bg-ink", on);
          el.classList.toggle("text-white", on);
        });
        q<HTMLButtonElement>("[data-flip-to]").forEach((b) => {
          const on = (b.dataset.flipTo === "back") === showingBack;
          b.setAttribute("aria-pressed", String(on));
          b.classList.toggle("bg-ink", on);
          b.classList.toggle("text-white", on);
        });
      };

      const mm = gsap.matchMedia();

      // Turn the stacked faces into a two-sided card (any screen, motion allowed).
      mm.add(MQ_MOTION, () => {
        const height = () => Math.max(front.offsetHeight, back.offsetHeight);
        gsap.set(stage, { perspective: 2000 });
        gsap.set(card, { transformStyle: "preserve-3d", height });
        gsap.set(front, { backfaceVisibility: "hidden", height: "100%" });
        gsap.set(back, {
          position: "absolute",
          inset: 0,
          marginTop: 0,
          rotationY: 180,
          backfaceVisibility: "hidden",
        });
        sync();
        return () => {
          front.inert = false;
          back.inert = false;
        };
      });

      mm.add(MQ_FULL, () => {
        const steps = q<HTMLElement>("[data-flip-steps]")[0];
        if (steps) {
          steps.hidden = false;
          steps.style.display = "flex";
        }
        const tl = build(
          gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 12%",
              end: "+=160%",
              pin: true,
              scrub: 0.8,
            },
          }),
        );
        tl.to(
          card,
          { rotationY: 180, duration: 1.4, ease: "power2.inOut", onUpdate: sync },
          ">+0.3",
        ).from(
          q("[data-flip-kit]"),
          { y: 60, opacity: 0, duration: 0.5, ease: "back.out(1.6)" },
          ">-0.2",
        );
        return () => {
          if (steps) {
            steps.hidden = true;
            steps.style.display = "";
          }
        };
      });

      mm.add(MQ_LITE, () => {
        build(gsap.timeline({ scrollTrigger: { trigger: front, start: "top 70%", once: true } }));
        const toggle = q<HTMLElement>("[data-flip-toggle]")[0];
        if (!toggle) return;
        toggle.hidden = false;
        toggle.style.display = "flex";
        const onClick = (e: MouseEvent) => {
          const to = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-flip-to]")?.dataset
            .flipTo;
          if (!to) return;
          gsap.to(card, {
            rotationY: to === "back" ? 180 : 0,
            duration: 0.6,
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: sync,
          });
        };
        toggle.addEventListener("click", onClick);
        return () => {
          toggle.removeEventListener("click", onClick);
          toggle.hidden = true;
          toggle.style.display = "";
        };
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
