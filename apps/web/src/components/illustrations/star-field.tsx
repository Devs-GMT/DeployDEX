import { cn } from "@/lib/utils";

// Deterministic pseudo-random stars (same markup on server and client).
function stars(count: number, seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    x: +(rnd() * 100).toFixed(2),
    y: +(rnd() * 100).toFixed(2),
    r: +(0.4 + rnd() * 1.4).toFixed(2),
    o: +(0.25 + rnd() * 0.6).toFixed(2),
    twinkle: rnd() > 0.82,
  }));
}

const STARS = stars(70, 42);

/**
 * Night-sky dots with a few twinkling stars and a faint constellation, for dark sections.
 * Still stars are one static SVG. Twinkling ones are small HTML dots: a CSS animation on an
 * SVG circle repaints the whole (section-sized) SVG every frame, while opacity/transform on an
 * HTML element runs on the compositor.
 */
export function StarField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {STARS.map((st, i) =>
          st.twinkle ? null : (
            <circle key={i} cx={st.x} cy={st.y} r={st.r / 6} fill="#fff" opacity={st.o} />
          ),
        )}
        <path d="M70 18 L76 26 L84 22 L90 32 L82 40" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.15" />
      </svg>
      {STARS.map((st, i) =>
        st.twinkle ? (
          <span
            key={i}
            className="animate-twinkle absolute block rounded-full bg-white"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: `${st.r * 1.6}px`,
              height: `${st.r * 1.6}px`,
              animationDelay: `${(i % 7) * 0.4}s`,
            }}
          />
        ) : null,
      )}
    </div>
  );
}
