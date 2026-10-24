"use client";

import { usePathname } from "next/navigation";
import {
  gsap,
  MQ_MOTION,
  muteTransitions,
  restoreTransitions,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/lib/gsap";

const REVEAL = ".reveal";
const SPLIT = "[data-split]";

/**
 * Global, opt-in scroll reveals so server components never need a client wrapper:
 * - `.reveal` elements rise and fade in (siblings entering together are staggered).
 * - `[data-split]` headings reveal word by word behind a mask.
 * Elements already on screen at load are left alone (no flash), content added later
 * (for example cards after on-chain data loads) is picked up by a MutationObserver.
 * Nothing is hidden before JS runs, so content is always visible if scripts fail.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ_MOTION, () => {
        const seen = new WeakSet<Element>();
        const splits: SplitText[] = [];

        const collect = (root: ParentNode, selector: string) => {
          const found: Element[] = [];
          if (root instanceof Element && root.matches(selector)) found.push(root);
          root.querySelectorAll(selector).forEach((el) => found.push(el));
          return found.filter((el) => !seen.has(el));
        };

        const onScreen = (el: Element) =>
          el.getBoundingClientRect().top < window.innerHeight * 0.92;

        const register = (root: ParentNode, initial: boolean) => {
          const reveals = collect(root, REVEAL).filter((el) => {
            seen.add(el);
            return !(initial && onScreen(el));
          });
          if (reveals.length) {
            muteTransitions(reveals);
            gsap.set(reveals, { autoAlpha: 0, y: 36 });
            ScrollTrigger.batch(reveals, {
              start: "top 90%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "power3.out",
                  stagger: 0.09,
                  overwrite: true,
                  onComplete: () => restoreTransitions(batch),
                }),
            });
          }

          collect(root, SPLIT).forEach((el) => {
            seen.add(el);
            if (initial && onScreen(el)) return;
            splits.push(
              SplitText.create(el, {
                type: "words",
                mask: "words",
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.words, {
                    yPercent: 110,
                    duration: 0.9,
                    ease: "power4.out",
                    stagger: 0.05,
                    scrollTrigger: { trigger: el, start: "top 88%", once: true },
                  }),
              }),
            );
          });
        };

        register(document, true);
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            m.addedNodes.forEach((node) => {
              if (node instanceof Element) register(node, false);
            });
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
          observer.disconnect();
          splits.forEach((s) => s.revert());
        };
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
