import { useId } from "react";

/**
 * Hand-painted sky in depth layers (far, mid, near). Blurred cloud masses run through an SVG
 * turbulence filter so edges look brushed, not vector-clean. It is a still painting: nothing
 * animates it, so the costly filter is painted once. Do not tween the filtered layers on scroll;
 * that re-runs the filter every frame.
 */
export function Sky() {
  const id = `paint${useId().replace(/:/g, "")}`;
  const paint = { filter: `url(#${id})` };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute size-0">
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </svg>

      <div className="absolute inset-0 bg-linear-to-b from-[#8fbde0] via-[#c6dcec] to-[#f1efe9]" />
      <div className="absolute -top-56 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,206,140,0.75),rgba(255,206,140,0)_62%)]" />

      {/* far: thin high clouds */}
      <div className="absolute inset-0" style={paint}>
        <div className="absolute top-6 -left-20 h-40 w-120 rounded-[50%] bg-white/70 blur-xl" />
        <div className="absolute top-16 right-[6%] h-36 w-112 rounded-[50%] bg-white/65 blur-xl" />
        <div className="absolute top-44 left-[34%] h-28 w-96 rounded-[50%] bg-[#fff6ea]/70 blur-xl" />
      </div>

      {/* mid: soft banks at the sides */}
      <div className="absolute inset-0" style={paint}>
        <div className="absolute top-64 -left-16 h-52 w-136 rounded-[50%] bg-white/85 blur-xl" />
        <div className="absolute top-72 -right-24 h-60 w-152 rounded-[50%] bg-[#fdf3e8]/90 blur-xl" />
        <div className="absolute top-[26rem] left-[38%] h-32 w-96 rounded-[50%] bg-[#ffe3c9]/55 blur-xl" />
      </div>

      {/* near: big foreground banks */}
      <div className="absolute bottom-0 -left-[12%] h-[52%] w-[62%]" style={paint}>
        <div className="absolute bottom-[-18%] left-0 h-[90%] w-full rounded-[50%] bg-white blur-lg" />
        <div className="absolute bottom-[18%] left-[18%] h-[60%] w-[55%] rounded-[50%] bg-white/95 blur-lg" />
      </div>
      <div className="absolute -right-[12%] bottom-0 h-[48%] w-[60%]" style={paint}>
        <div className="absolute right-0 bottom-[-20%] h-[90%] w-full rounded-[50%] bg-[#fffaf3] blur-lg" />
        <div className="absolute right-[20%] bottom-[16%] h-[56%] w-[50%] rounded-[50%] bg-white/95 blur-lg" />
      </div>

      <div className="to-page absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent" />
    </div>
  );
}
