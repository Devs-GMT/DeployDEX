import { useId } from "react";
import { cn } from "@/lib/utils";

export type HalftoneShape =
  | "rocket"
  | "spark"
  | "shield"
  | "coin"
  | "code"
  | "chat"
  | "flag"
  | "people"
  | "building"
  | "clock"
  | "gamepad"
  | "star";

const PATHS: Record<HalftoneShape, { d: string; evenodd?: boolean }> = {
  rocket: {
    d: "M50 4C69 20 73 48 67 70H33C27 48 31 20 50 4ZM33 56 15 78l18-4ZM67 56l18 22-18-4ZM41 76h18L50 98Z",
  },
  spark: {
    d: "M42 6 50 40 84 48 50 56 42 90 34 56 0 48 34 40ZM80 6 84 20 98 24 84 28 80 42 76 28 62 24 76 20Z",
  },
  shield: {
    d: "M50 4 90 18V50C90 76 72 90 50 98 28 90 10 76 10 50V18Z",
  },
  coin: {
    d: "M50 8a42 42 0 1 0 .01 0ZM50 24a26 26 0 1 1-.01 0Z",
    evenodd: true,
  },
  code: {
    d: "M34 20 8 50l26 30 8-8L24 50l18-22ZM66 20l26 30-26 30-8-8 18-22-18-22ZM54 14 40 86l9 2 14-72Z",
  },
  chat: { d: "M10 14H90V68H46L24 90V68H10Z" },
  flag: { d: "M22 6H30V96H22ZM30 10H84L70 32 84 54H30Z" },
  people: {
    d: "M50 8a15 15 0 1 0 .01 0ZM20 90C20 58 80 58 80 90ZM18 34a10 10 0 1 0 .01 0ZM82 34a10 10 0 1 0 .01 0Z",
  },
  building: {
    d: "M50 4 94 26H6ZM12 32H88V42H12ZM20 48H32V78H20ZM44 48H56V78H44ZM68 48H80V78H68ZM8 84H92V96H8Z",
  },
  clock: {
    d: "M50 6a44 44 0 1 0 .01 0ZM46 22H54V48H72V56H46Z",
    evenodd: true,
  },
  gamepad: {
    d: "M24 28H76C94 28 100 70 86 78 76 84 70 70 62 66H38C30 70 24 84 14 78 0 70 6 28 24 28ZM26 44V50H20V58H26V64H34V58H40V50H34V44ZM66 46a5 5 0 1 0 .01 0ZM78 56a5 5 0 1 0 .01 0Z",
    evenodd: true,
  },
  star: {
    d: "M50 4 62 36 96 38 70 60 78 94 50 76 22 94 30 60 4 38 38 36Z",
  },
};

/** Orange dot-screen illustration (the "halftone" look). Decorative. */
export function Halftone({
  shape,
  className,
  color = "#FF5C00",
  dot = 2.6,
}: {
  shape: HalftoneShape;
  className?: string;
  color?: string;
  dot?: number;
}) {
  const id = useId().replace(/:/g, "");
  const p = PATHS[shape];
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("size-full", className)}>
      <defs>
        <pattern id={`p${id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="3" cy="3" r={dot} fill={color} />
        </pattern>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <mask id={`m${id}`}>
          <rect width="100" height="100" fill={`url(#g${id})`} />
        </mask>
      </defs>
      <path
        d={p.d}
        fill={`url(#p${id})`}
        fillRule={p.evenodd ? "evenodd" : "nonzero"}
        mask={`url(#m${id})`}
      />
    </svg>
  );
}
