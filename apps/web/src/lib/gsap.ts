// Single place that registers GSAP plugins. Import from client components only.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin, useGSAP);

/** Full motion: desktop-sized screen and the user has not asked for reduced motion. */
export const MQ_FULL = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
/** Smaller screens with motion allowed: lighter variants only, no pinning. */
export const MQ_LITE = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";
/** Any screen size, motion allowed. */
export const MQ_MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * CSS transitions on a property GSAP animates (e.g. Tailwind `transition-all` on buttons/cards)
 * make GSAP read half-transitioned values and freeze elements in their "from" state.
 * Disable transitions while GSAP drives the element; `restoreTransitions` hands them back.
 */
export const muteTransitions = (targets: gsap.TweenTarget) => gsap.set(targets, { transition: "none" });
export const restoreTransitions = (targets: gsap.TweenTarget) => gsap.set(targets, { clearProps: "transition" });

export { gsap, ScrollTrigger, SplitText, useGSAP };
