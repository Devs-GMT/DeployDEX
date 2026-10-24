import { useId } from "react";
import { cn } from "@/lib/utils";
import { KIT_RASTER } from "@/lib/config";

export type KitPose =
  | "dev"
  | "hackathon"
  | "astro"
  | "inspector"
  | "curator"
  | "napping"
  | "party";

const INK = "#2a1a12";
const STRIPE = "#B94A06";

type Ids = { fur: string; cream: string; shade: string };

/** Soft clay-toy gradients shared by every pose. */
function Defs({ ids }: { ids: Ids }) {
  return (
    <defs>
      <radialGradient id={ids.fur} cx="38%" cy="28%" r="85%">
        <stop offset="0" stopColor="#FFC07A" />
        <stop offset="0.45" stopColor="#FF9238" />
        <stop offset="1" stopColor="#E2600C" />
      </radialGradient>
      <radialGradient id={ids.cream} cx="40%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FFE4C8" />
      </radialGradient>
      <filter id={ids.shade} x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

function GroundShadow({ ids, rx = 54 }: { ids: Ids; rx?: number }) {
  return <ellipse cx="100" cy="193" rx={rx} ry="6" fill="#000" opacity="0.16" filter={`url(#${ids.shade})`} />;
}

/** Curly striped tail. Wags on hover via .kit-tail. */
function Tail({ ids }: { ids: Ids }) {
  const d = "M140 168 C186 172 196 124 170 114 C154 108 148 126 162 130";
  return (
    <g className="kit-tail">
      <path d={d} stroke={`url(#${ids.fur})`} strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d={d} stroke={STRIPE} strokeOpacity="0.55" strokeWidth="15" strokeLinecap="butt" strokeDasharray="3.5 11" fill="none" />
      <circle cx="162" cy="130" r="7.5" fill={`url(#${ids.cream})`} />
    </g>
  );
}

function Ears({ ids, hidden = false }: { ids: Ids; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <g>
      {/* left ear, straight */}
      <path d="M56 66 C50 40 54 24 62 18 C78 24 92 38 98 52Z" fill={`url(#${ids.fur})`} />
      <path d="M64 56 C62 42 64 32 67 29 C76 34 84 42 88 50Z" fill="#FFADA0" />
      {/* right ear, slightly bent tip */}
      <g className="kit-ear">
      <path d="M144 66 C150 42 148 28 142 20 L130 28 C116 36 106 44 102 52Z" fill={`url(#${ids.fur})`} />
      <path d="M142 20 L154 26 L146 36Z" fill="#E2600C" />
      <path d="M136 56 C138 44 138 36 136 32 C128 36 120 42 116 50Z" fill="#FFADA0" />
      </g>
    </g>
  );
}

type EyeMood = "open" | "happy" | "closed";

function Face({ ids, mood = "open", cx = 100, cy = 84, s = 1 }: { ids: Ids; mood?: EyeMood; cx?: number; cy?: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-100 -84)`}>
      {/* forehead + cheek tabby stripes */}
      <g stroke={STRIPE} strokeOpacity="0.6" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M100 44 v13" />
        <path d="M88 46 l4 11" />
        <path d="M112 46 l-4 11" />
        <path d="M58 82 h10" />
        <path d="M59 92 l9 -1" />
        <path d="M142 82 h-10" />
        <path d="M141 92 l-9 -1" />
      </g>
      {/* muzzle */}
      <ellipse cx="100" cy="103" rx="25" ry="17" fill={`url(#${ids.cream})`} />
      <circle cx="88" cy="104" r="12" fill={`url(#${ids.cream})`} />
      <circle cx="112" cy="104" r="12" fill={`url(#${ids.cream})`} />
      {/* eyes */}
      {mood === "open" && (
        <g className="kit-blink">
          <ellipse cx="75" cy="84" rx="10.5" ry="12.5" fill={INK} />
          <ellipse cx="125" cy="84" rx="10.5" ry="12.5" fill={INK} />
          <ellipse cx="75" cy="86" rx="7" ry="8.5" fill="#7a3d12" opacity="0.55" />
          <ellipse cx="125" cy="86" rx="7" ry="8.5" fill="#7a3d12" opacity="0.55" />
          <circle cx="79" cy="78" r="4.4" fill="#fff" />
          <circle cx="129" cy="78" r="4.4" fill="#fff" />
          <circle cx="72" cy="91" r="2" fill="#fff" opacity="0.9" />
          <circle cx="122" cy="91" r="2" fill="#fff" opacity="0.9" />
        </g>
      )}
      {mood === "happy" && (
        <g stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M65 88 q10 -14 20 0" />
          <path d="M115 88 q10 -14 20 0" />
        </g>
      )}
      {mood === "closed" && (
        <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M65 86 q10 9 20 0" />
          <path d="M115 86 q10 9 20 0" />
        </g>
      )}
      {/* blush */}
      <ellipse cx="60" cy="102" rx="8" ry="5" fill="#FF7E8B" opacity="0.45" />
      <ellipse cx="140" cy="102" rx="8" ry="5" fill="#FF7E8B" opacity="0.45" />
      {/* nose + mouth */}
      <path d="M93.5 94 h13 q1 7 -6.5 11 q-7.5 -4 -6.5 -11Z" fill="#FF6F95" />
      <path d="M95 96.5 q5 -2 8 0" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {mood === "happy" ? (
        <path d="M88 108 q12 16 24 0 q-12 5 -24 0Z" fill="#8a2f3b" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <path d="M100 105 v5 M100 110 q-7 7 -14 1 M100 110 q7 7 14 1" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      )}
      {/* whiskers */}
      <g stroke={INK} strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round">
        <path d="M70 108 l-24 -5 M70 113 l-24 3 M72 118 l-20 9" />
        <path d="M130 108 l24 -5 M130 113 l24 3 M128 118 l20 9" />
      </g>
    </g>
  );
}

function Head({ ids }: { ids: Ids }) {
  return (
    <g>
      <ellipse cx="100" cy="82" rx="50" ry="43" fill={`url(#${ids.fur})`} />
      {/* glossy rim light */}
      <path d="M62 56 C74 40 98 36 118 40" stroke="#fff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Sitting body, paws, belly. */
function Body({ ids, suit }: { ids: Ids; suit?: React.ReactNode }) {
  return (
    <g>
      <path
        d="M50 152 C46 114 70 98 100 98 C130 98 154 114 150 152 C148 180 130 191 100 191 C70 191 52 180 50 152Z"
        fill={`url(#${ids.fur})`}
      />
      <g stroke={STRIPE} strokeOpacity="0.5" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M54 130 q9 1 13 9" />
        <path d="M52 146 q9 0 14 8" />
        <path d="M146 130 q-9 1 -13 9" />
        <path d="M148 146 q-9 0 -14 8" />
      </g>
      {suit ?? <ellipse cx="100" cy="156" rx="27" ry="33" fill={`url(#${ids.cream})`} />}
      {/* front paws */}
      <g>
        <ellipse cx="79" cy="186" rx="15" ry="9" fill={`url(#${ids.cream})`} />
        <ellipse cx="121" cy="186" rx="15" ry="9" fill={`url(#${ids.cream})`} />
        <g stroke="#E2B28A" strokeWidth="1.6" strokeLinecap="round">
          <path d="M73 184 v5 M79 183 v6 M85 184 v5" />
          <path d="M115 184 v5 M121 183 v6 M127 184 v5" />
        </g>
      </g>
    </g>
  );
}

function Dev({ ids }: { ids: Ids }) {
  return (
    <g>
      <Tail ids={ids} />
      {/* hood behind head */}
      <path d="M46 84 C40 34 160 34 154 84 C154 106 142 116 130 118 L70 118 C58 116 46 106 46 84Z" fill="#3a4151" />
      <Body
        ids={ids}
        suit={
          <g>
            <path d="M52 150 C50 122 72 110 100 110 C128 110 150 122 148 150 L150 186 C130 194 70 194 50 186Z" fill="#4b5568" />
            <path d="M64 124 C76 116 124 116 136 124" stroke="#fff" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M88 118 v22 M112 118 v22" stroke="#e6e8ee" strokeWidth="3" strokeLinecap="round" />
            <circle cx="88" cy="142" r="3" fill="#e6e8ee" />
            <circle cx="112" cy="142" r="3" fill="#e6e8ee" />
          </g>
        }
      />
      <Head ids={ids} />
      <Ears ids={ids} />
      <Face ids={ids} />
      {/* hood rim over forehead sides */}
      <path d="M50 78 C48 56 62 44 76 40" stroke="#4b5568" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M150 78 C152 56 138 44 124 40" stroke="#4b5568" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* laptop */}
      <rect x="62" y="146" width="76" height="44" rx="6" fill="#cfd3dc" />
      <rect x="62" y="146" width="76" height="44" rx="6" fill="none" stroke="#fff" strokeOpacity="0.7" />
      <circle cx="100" cy="168" r="6.5" fill="#FF5C00" />
      <path d="M97 166 q3 -4 6 0" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="78" cy="150" rx="11" ry="7" fill={`url(#${ids.cream})`} />
      <ellipse cx="122" cy="150" rx="11" ry="7" fill={`url(#${ids.cream})`} />
    </g>
  );
}

function Hackathon({ ids }: { ids: Ids }) {
  return (
    <g>
      <Tail ids={ids} />
      <Body ids={ids} />
      <Head ids={ids} />
      <Ears ids={ids} />
      <Face ids={ids} />
      {/* headband */}
      <path d="M52 66 C80 48 120 48 148 66 L146 79 C120 62 80 62 54 79Z" fill="#FF405D" />
      <path d="M54 70 C80 53 120 53 146 70" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" />
      <path d="M143 70 l16 -8 l-3 18Z M143 72 l14 14 l-18 -4Z" fill="#E02E48" />
      <path d="M100 58 l3 7 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1Z" fill="#fff" />
      {/* energy drink */}
      <g transform="rotate(8 146 150)">
        <rect x="130" y="124" width="26" height="52" rx="7" fill="#17a862" />
        <rect x="130" y="124" width="26" height="12" rx="6" fill="#d7dce3" />
        <rect x="134" y="132" width="5" height="40" rx="2.5" fill="#fff" opacity="0.3" />
        <path d="M146 140 l-7 14 h8 l-5 14 14 -18 h-9 l5 -10Z" fill="#FFD43B" />
      </g>
      <ellipse cx="132" cy="156" rx="9" ry="7" fill={`url(#${ids.cream})`} />
    </g>
  );
}

function Astro({ ids }: { ids: Ids }) {
  return (
    <g>
      {/* jetpack + flames behind */}
      <g>
        <rect x="30" y="118" width="22" height="52" rx="10" fill="#aeb4c2" />
        <rect x="148" y="118" width="22" height="52" rx="10" fill="#aeb4c2" />
        <rect x="34" y="126" width="6" height="34" rx="3" fill="#fff" opacity="0.45" />
        <rect x="152" y="126" width="6" height="34" rx="3" fill="#fff" opacity="0.45" />
        <g className="kit-flame">
          <path d="M32 170 q9 30 18 0Z" fill="#FFB400" />
          <path d="M36 170 q5 16 10 0Z" fill="#FF5C00" />
        </g>
        <g className="kit-flame" style={{ animationDelay: "-0.12s" }}>
          <path d="M150 170 q9 30 18 0Z" fill="#FFB400" />
          <path d="M154 170 q5 16 10 0Z" fill="#FF5C00" />
        </g>
      </g>
      <Tail ids={ids} />
      <Body
        ids={ids}
        suit={
          <g>
            <path d="M52 150 C50 122 72 110 100 110 C128 110 150 122 148 150 L150 186 C130 194 70 194 50 186Z" fill="#eef1f7" />
            <path d="M52 168 H148" stroke="#FF5C00" strokeWidth="6" />
            <rect x="84" y="126" width="32" height="22" rx="6" fill="#d5dae6" />
            <circle cx="93" cy="137" r="4" fill="#FF405D" />
            <circle cx="107" cy="137" r="4" fill="#3b82f6" />
          </g>
        }
      />
      <Head ids={ids} />
      <Ears ids={ids} />
      <Face ids={ids} />
      {/* helmet */}
      <circle cx="100" cy="82" r="58" fill="#cfeaff" fillOpacity="0.28" stroke="#fff" strokeWidth="5" />
      <path d="M58 52 C70 34 96 28 118 34" stroke="#fff" strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M142 112 q8 -12 6 -26" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="62" y="128" width="76" height="12" rx="6" fill="#aeb4c2" />
    </g>
  );
}

function Inspector({ ids }: { ids: Ids }) {
  return (
    <g>
      <Tail ids={ids} />
      <Body ids={ids} />
      <Head ids={ids} />
      <Ears ids={ids} hidden={false} />
      <Face ids={ids} />
      {/* deerstalker cap */}
      <path d="M54 64 C60 30 140 30 146 64 C128 52 72 52 54 64Z" fill="#a98763" />
      <path d="M60 52 L72 40 M80 44 L88 34 M100 40 L108 31 M120 41 L126 36" stroke="#6f5538" strokeWidth="2" opacity="0.6" />
      <path d="M52 64 C80 54 120 54 148 64 C150 70 136 70 128 68 C108 64 92 64 72 68 C64 70 50 70 52 64Z" fill="#6f5538" />
      <circle cx="100" cy="34" r="5" fill="#6f5538" />
      {/* magnifying glass */}
      <g>
        <path d="M156 160 L180 188" stroke="#2a1a12" strokeWidth="10" strokeLinecap="round" />
        <circle cx="146" cy="136" r="26" fill="#cfeaff" fillOpacity="0.5" stroke="#2a1a12" strokeWidth="7" />
        <path className="kit-glint" d="M132 124 q6 -9 16 -9" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="124" cy="154" rx="9" ry="7" fill={`url(#${ids.cream})`} />
      </g>
    </g>
  );
}

function Curator({ ids }: { ids: Ids }) {
  return (
    <g>
      <Tail ids={ids} />
      <Body ids={ids} />
      <Head ids={ids} />
      <Ears ids={ids} />
      <Face ids={ids} />
      {/* beret */}
      <g transform="rotate(-9 96 52)">
        <ellipse cx="96" cy="52" rx="44" ry="17" fill="#8a3fa8" />
        <ellipse cx="90" cy="46" rx="26" ry="8" fill="#a65bc4" opacity="0.7" />
        <circle cx="96" cy="34" r="4.5" fill="#6d2b88" />
      </g>
      {/* round glasses */}
      <g stroke="#2a1a12" strokeWidth="2.6" fill="#fff" fillOpacity="0.15">
        <circle cx="75" cy="84" r="14" />
        <circle cx="125" cy="84" r="14" />
        <path d="M89 84 h22" fill="none" />
      </g>
      {/* clipboard */}
      <g className="kit-sway">
      <g transform="rotate(8 150 154)">
        <rect x="126" y="120" width="48" height="62" rx="6" fill="#b3763a" />
        <rect x="132" y="130" width="36" height="46" rx="2" fill="#fff" />
        <rect x="140" y="116" width="20" height="10" rx="3" fill="#6b6f78" />
        <path d="M137 142 h26 M137 152 h26 M137 162 h17" stroke="#c8ccd4" strokeWidth="3" strokeLinecap="round" />
        <path d="M139 168 l3 3 6 -7" stroke="#17a862" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <ellipse cx="128" cy="160" rx="9" ry="7" fill={`url(#${ids.cream})`} />
      </g>
    </g>
  );
}

function Party({ ids }: { ids: Ids }) {
  return (
    <g>
      <Tail ids={ids} />
      <Body ids={ids} />
      <Head ids={ids} />
      <Ears ids={ids} />
      <Face ids={ids} mood="happy" />
      {/* party hat */}
      <g transform="rotate(10 100 40)">
        <path d="M78 54 L100 6 L122 54Z" fill="#FF405D" />
        <path d="M84 42 L116 42 M89 30 L111 30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M80 50 L120 50" stroke="#FFD43B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="6" r="7" fill="#FFD43B" />
      </g>
      {/* confetti */}
      <g className="kit-confetti">
        <rect x="24" y="44" width="9" height="9" rx="2" fill="#FFD43B" transform="rotate(20 28 48)" />
        <rect x="168" y="58" width="9" height="9" rx="2" fill="#3b82f6" transform="rotate(-18 172 62)" />
        <rect x="36" y="112" width="8" height="8" rx="2" fill="#FF405D" transform="rotate(35 40 116)" />
        <rect x="162" y="104" width="8" height="8" rx="2" fill="#17a862" transform="rotate(10 166 108)" />
        <circle cx="20" cy="86" r="4.5" fill="#3b82f6" />
        <circle cx="180" cy="30" r="4.5" fill="#FF8A2B" />
        <circle cx="46" cy="22" r="3.5" fill="#FF405D" />
        <circle cx="154" cy="10" r="3.5" fill="#17a862" />
        <path d="M30 70 q6 -8 12 0 t12 0" stroke="#FF405D" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M148 44 q6 -8 12 0 t12 0" stroke="#FFD43B" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** Curled-up sleeping pose: its own body, not a sitting cat with closed eyes. */
function Napping({ ids }: { ids: Ids }) {
  return (
    <g>
      <GroundShadow ids={ids} rx={74} />
      <g className="kit-breathe">
      {/* body loaf */}
      <path d="M26 156 C22 120 62 104 108 106 C156 108 184 128 178 160 C174 184 140 190 100 190 C60 190 30 184 26 156Z" fill={`url(#${ids.fur})`} />
      <g stroke={STRIPE} strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M112 112 q-4 14 -2 28" />
        <path d="M132 114 q-3 14 0 28" />
        <path d="M152 120 q-2 12 2 26" />
        <path d="M92 110 q-3 10 -1 20" />
      </g>
      {/* tail wrapped around the front */}
      <g className="kit-tail">
        <path d="M176 156 C176 186 120 196 62 186" stroke={`url(#${ids.fur})`} strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M176 156 C176 186 120 196 62 186" stroke={STRIPE} strokeOpacity="0.55" strokeWidth="15" strokeDasharray="3.5 11" fill="none" />
        <circle cx="58" cy="186" r="7.5" fill={`url(#${ids.cream})`} />
      </g>
      {/* head resting on paws */}
      <g transform="translate(-4 38)">
        <Ears ids={ids} />
        <Head ids={ids} />
        <Face ids={ids} mood="closed" />
      </g>
      <ellipse cx="66" cy="168" rx="17" ry="9" fill={`url(#${ids.cream})`} />
      <ellipse cx="116" cy="170" rx="17" ry="9" fill={`url(#${ids.cream})`} />
      </g>
      {/* zzz */}
      <g className="kit-zzz" fill={INK} fontFamily="ui-monospace, monospace" fontWeight="700">
        <text x="150" y="70" fontSize="26">Z</text>
        <text x="172" y="46" fontSize="19">z</text>
        <text x="186" y="26" fontSize="13">z</text>
      </g>
    </g>
  );
}

/** Kit the orange tabby, in a soft clay-toy vector style. Poses map to costumes in DESIGN.md. */
export function Kit({
  pose,
  className,
  float = false,
  title,
}: {
  pose: KitPose;
  className?: string;
  float?: boolean;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const ids: Ids = { fur: `${uid}f`, cream: `${uid}c`, shade: `${uid}s` };
  const sitting = pose !== "napping";
  // Deterministic per-instance offset (same on server and client) so a row of Kits never blinks in sync.
  const offset = -([...uid].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 50) / 10;

  if (KIT_RASTER) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- optional 3D renders dropped into /public/kit
      <img
        src={`/kit/${pose}.webp`}
        alt={title ?? ""}
        aria-hidden={title ? undefined : true}
        className={cn("h-auto w-full", float && "animate-float", className)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("kit-hover kit-idle h-auto w-full overflow-visible", float && "animate-float", className)}
      style={{ "--kit-delay": `${offset}s` } as React.CSSProperties}
    >
      <Defs ids={ids} />
      {sitting && <GroundShadow ids={ids} />}
      {pose === "dev" && <Dev ids={ids} />}
      {pose === "hackathon" && <Hackathon ids={ids} />}
      {pose === "astro" && <Astro ids={ids} />}
      {pose === "inspector" && <Inspector ids={ids} />}
      {pose === "curator" && <Curator ids={ids} />}
      {pose === "party" && <Party ids={ids} />}
      {pose === "napping" && <Napping ids={ids} />}
    </svg>
  );
}
