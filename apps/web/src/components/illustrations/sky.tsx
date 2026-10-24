/**
 * Hand-painted sky in separate depth layers so the hero scene can move them at different speeds.
 * Blurred cloud masses run through an SVG turbulence filter so edges look brushed, not vector-clean.
 * Layers are tagged with data attributes that HeroScene animates; without JS it is a still painting.
 */
export function Sky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute size-0">
        <filter id="paint" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </svg>

      <div className="absolute inset-0 bg-linear-to-b from-[#8fbde0] via-[#c6dcec] to-[#f1efe9]" />
      <div
        data-hero-sun
        className="absolute -top-56 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,206,140,0.75),rgba(255,206,140,0)_62%)]"
      />

      {/* far: thin high clouds */}
      <div data-hero-far className="absolute inset-0 [filter:url(#paint)]">
        <div className="absolute top-6 -left-20 h-40 w-120 rounded-[50%] bg-white/70 blur-2xl" />
        <div className="absolute top-16 right-[6%] h-36 w-112 rounded-[50%] bg-white/65 blur-2xl" />
        <div className="absolute top-44 left-[34%] h-28 w-96 rounded-[50%] bg-[#fff6ea]/70 blur-2xl" />
      </div>

      {/* mid: soft banks drifting at the sides */}
      <div data-hero-mid className="absolute inset-0 [filter:url(#paint)]">
        <div className="absolute top-64 -left-16 h-52 w-136 rounded-[50%] bg-white/85 blur-xl" />
        <div className="absolute top-72 -right-24 h-60 w-152 rounded-[50%] bg-[#fdf3e8]/90 blur-xl" />
        <div className="absolute top-[26rem] left-[38%] h-32 w-96 rounded-[50%] bg-[#ffe3c9]/55 blur-2xl" />
      </div>

      {/* near: big foreground banks that part like curtains on scroll */}
      <div data-hero-near-left className="absolute bottom-0 -left-[12%] h-[52%] w-[62%] [filter:url(#paint)]">
        <div className="absolute bottom-[-18%] left-0 h-[90%] w-full rounded-[50%] bg-white blur-lg" />
        <div className="absolute bottom-[18%] left-[18%] h-[60%] w-[55%] rounded-[50%] bg-white/95 blur-lg" />
      </div>
      <div data-hero-near-right className="absolute -right-[12%] bottom-0 h-[48%] w-[60%] [filter:url(#paint)]">
        <div className="absolute right-0 bottom-[-20%] h-[90%] w-full rounded-[50%] bg-[#fffaf3] blur-lg" />
        <div className="absolute right-[20%] bottom-[16%] h-[56%] w-[50%] rounded-[50%] bg-white/95 blur-lg" />
      </div>

      <div className="to-page absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent" />
    </div>
  );
}
