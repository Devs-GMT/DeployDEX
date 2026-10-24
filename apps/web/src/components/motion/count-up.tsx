"use client";

import { useRef } from "react";
import { gsap, MQ_MOTION, useGSAP } from "@/lib/gsap";

/**
 * A number that counts up from 0 when it scrolls into view. The real value is rendered
 * by the server, so it is correct with JS off and for screen readers (the animated span
 * is aria-hidden; the label carries the value).
 */
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ_MOTION, () => {
        const node = el.current;
        if (!node || value === 0) return;
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
          onUpdate: () => {
            node.textContent = `${Math.round(counter.n)}${suffix}`;
          },
        });
      });
    },
    { dependencies: [value], revertOnUpdate: true },
  );

  return (
    <span className={className} aria-label={`${value}${suffix}`}>
      <span ref={el} aria-hidden>
        {value}
        {suffix}
      </span>
    </span>
  );
}
