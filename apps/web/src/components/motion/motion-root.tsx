"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MQ_MOTION, ScrollTrigger } from "@/lib/gsap";

const REVEAL = ".reveal";
/** Reveals that only apply below the desktop breakpoint (desktop has its own GSAP scene). */
const REVEAL_LITE = ".reveal-lite";
const SPLIT = "[data-split]";
const DESKTOP = "(min-width: 1024px)";
const STAGGER_MS = 90;
const WORD_STAGGER_MS = 50;
const DURATION_MS = 900;

/**
 * Wraps each word of `el` in a mask span so CSS can slide it up. Text nodes are swapped for
 * fragments and the originals kept, so `revert` puts back the exact nodes React rendered.
 */
function splitWords(el: HTMLElement) {
  const swaps: { original: Text; added: Node[] }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);

  let n = 0;
  for (const original of texts) {
    const added: Node[] = [];
    for (const part of original.data.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        added.push(document.createTextNode(part));
        continue;
      }
      const mask = document.createElement("span");
      mask.className = "split-w";
      const word = document.createElement("span");
      word.className = "split-i";
      word.style.transitionDelay = `${n++ * WORD_STAGGER_MS}ms`;
      word.textContent = part;
      mask.append(word);
      added.push(mask);
    }
    original.replaceWith(...added);
    swaps.push({ original, added });
  }

  return () => {
    for (const { original, added } of swaps) {
      added[0]?.parentNode?.insertBefore(original, added[0]);
      added.forEach((node) => node.parentNode?.removeChild(node));
    }
    el.classList.remove("split-in");
  };
}

/**
 * Global, opt-in scroll reveals so server components never need a client wrapper, done with
 * an IntersectionObserver and CSS transitions (no per-element ScrollTriggers):
 * - `.reveal` elements rise and fade in; ones entering together are staggered.
 * - `.reveal-lite` does the same, but only below the desktop breakpoint.
 * - `[data-split]` headings reveal word by word behind a mask.
 * Elements already on screen at load are left alone (no flash), content added later
 * (for example cards after on-chain data loads) is picked up by a MutationObserver.
 * Nothing is hidden before JS runs, and nothing moves under reduced motion.
 *
 * It also tags sections that are off screen with `data-offscreen`, which pauses their CSS
 * loops (Kit floats, twinkles, pings) in globals.css so idle sections cost no paint work.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section, footer, [data-pause]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      sections.forEach((s) => s.removeAttribute("data-offscreen"));
    };
  }, [pathname]);

  // Web fonts shift layout once they load; the GSAP scenes that remain need fresh positions.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia(MQ_MOTION).matches) return;
    const desktop = window.matchMedia(DESKTOP).matches;
    const seen = new WeakSet<Element>();
    const reverts: (() => void)[] = [];
    const timers = new Set<number>();

    const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.92;

    const settle = (el: HTMLElement) => {
      el.classList.remove("reveal-pending", "reveal-in");
      el.style.transitionDelay = "";
    };

    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          if (el.matches(SPLIT)) {
            el.classList.add("split-in");
            continue;
          }
          const delay = i++ * STAGGER_MS;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("reveal-in");
          const t = window.setTimeout(
            () => {
              timers.delete(t);
              settle(el);
            },
            delay + DURATION_MS + 50,
          );
          timers.add(t);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const collect = (root: ParentNode, selector: string) => {
      const found: HTMLElement[] = [];
      if (root instanceof HTMLElement && root.matches(selector)) found.push(root);
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => found.push(el));
      return found.filter((el) => !seen.has(el));
    };

    const register = (root: ParentNode, initial: boolean) => {
      const selector = desktop ? REVEAL : `${REVEAL}, ${REVEAL_LITE}`;
      for (const el of collect(root, selector)) {
        seen.add(el);
        if (initial && onScreen(el)) continue;
        el.classList.add("reveal-pending");
        io.observe(el);
      }
      for (const el of collect(root, SPLIT)) {
        seen.add(el);
        if (initial && onScreen(el)) continue;
        reverts.push(splitWords(el));
        io.observe(el);
      }
    };

    register(document, true);

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
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      document.querySelectorAll<HTMLElement>(".reveal-pending").forEach(settle);
      reverts.forEach((revert) => revert());
    };
  }, [pathname]);

  return null;
}
