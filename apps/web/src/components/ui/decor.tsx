import { cn } from "@/lib/utils";
import { Kit } from "@/components/kit/kit";

/** Fluffy vector cloud. Purely decorative. */
export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 100" aria-hidden className={cn("h-auto", className)}>
      <path
        d="M40 90 C10 90 8 52 36 50 C34 24 70 14 88 34 C100 8 148 8 156 40 C186 28 214 48 200 74 C226 76 226 90 200 90Z"
        fill="#fff"
      />
    </svg>
  );
}

export function Sparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("absolute size-4 animate-twinkle text-brand", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <path d="M12 0 14 10 24 12 14 14 12 24 10 14 0 12 10 10Z" fill="currentColor" />
    </svg>
  );
}

/** Astro Kit flying across the page between sections. */
export function FlyingKit({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div aria-hidden className="pointer-events-none relative h-24 overflow-hidden">
      <div
        className={cn("absolute top-2 w-20 animate-fly", className)}
        style={{ animationDelay: `${delay}s` }}
      >
        <Kit pose="astro" />
      </div>
    </div>
  );
}

/**
 * Hand-painted looking sky: soft blurred cloud masses run through an SVG
 * turbulence filter so the edges look brushed rather than vector-clean.
 */
export function PainterlySky({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg className="absolute size-0">
        <filter id="paint" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </svg>
      <div className="absolute inset-0 bg-linear-to-b from-[#9ec6e4] via-[#c9dcea] to-[#eef0f0]" />
      <div className="absolute inset-0 [filter:url(#paint)]">
        <div className="absolute -top-10 -left-24 h-72 w-136 rounded-[50%] bg-white/80 blur-2xl" />
        <div className="absolute top-24 left-[22%] h-48 w-112 rounded-[50%] bg-[#f4f2ee]/90 blur-2xl" />
        <div className="absolute top-8 right-[8%] h-60 w-120 rounded-[50%] bg-white/75 blur-2xl" />
        <div className="absolute top-72 -left-10 h-56 w-160 rounded-[50%] bg-white/85 blur-xl" />
        <div className="absolute top-80 right-[-5%] h-64 w-176 rounded-[50%] bg-[#fdf3e8]/90 blur-xl" />
        <div className="absolute top-60 left-[40%] h-40 w-96 rounded-[50%] bg-[#ffe3c9]/60 blur-2xl" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-page" />
    </div>
  );
}

/** "Important dApp, Probably" style cursor + blue pill tag. */
export function CursorTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute z-10 flex items-start gap-1", className)}>
      <svg viewBox="0 0 16 22" className="mt-3 -mr-2 size-4 drop-shadow">
        <path d="M1 1 15 12 8 13 5 21Z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="rounded-full bg-[#2563eb] px-3 py-1 text-sm font-medium text-white shadow-lg">{children}</span>
      <span className="mt-6 -ml-2 grid size-5 place-items-center rounded-full bg-[#22c55e] text-xs text-white shadow">+</span>
    </div>
  );
}
