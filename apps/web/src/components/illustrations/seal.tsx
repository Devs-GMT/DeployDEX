import { useId } from "react";
import { cn } from "@/lib/utils";

/** Rubber-stamp style "VERIFIED · ON-CHAIN" seal with a ridged edge and circular lettering. */
export function Seal({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  // 28 ridges around the rim.
  const ridges = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r1 = 46;
    const r2 = 49.5;
    return `M${(50 + Math.cos(a) * r1).toFixed(2)} ${(50 + Math.sin(a) * r1).toFixed(2)} L${(50 + Math.cos(a) * r2).toFixed(2)} ${(50 + Math.sin(a) * r2).toFixed(2)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("text-brand", className)}>
      <defs>
        <path id={`ring${id}`} d="M50 50 m-33 0 a33 33 0 1 1 66 0 a33 33 0 1 1 -66 0" />
      </defs>
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d={ridges} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 2.5"
      />
      <text
        fontFamily="ui-monospace, monospace"
        fontSize="8.2"
        fontWeight="700"
        letterSpacing="1.6"
        fill="currentColor"
      >
        <textPath href={`#ring${id}`}>VERIFIED · ON-CHAIN · BOT CHAIN ·</textPath>
      </text>
      <path
        d="M40 51 l7 7 l14 -16"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
