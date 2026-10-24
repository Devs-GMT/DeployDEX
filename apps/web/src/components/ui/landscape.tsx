const CYPRESS: [number, number][] = [[148, 188], [166, 196], [296, 202], [1170, 200], [1196, 190], [1240, 206]];
const TREES: [number, number][] = [[520, 226], [610, 238], [820, 238], [930, 232], [1320, 200]];

/** Hand-painted style countryside at golden hour, used at the very bottom of the footer. */
export function Landscape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden className={className}>
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f6f6" />
          <stop offset="1" stopColor="#fbe6c4" />
        </linearGradient>
        <linearGradient id="ls-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9bb04a" />
          <stop offset="1" stopColor="#5f7a2e" />
        </linearGradient>
        <linearGradient id="ls-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7e9a3a" />
          <stop offset="1" stopColor="#456327" />
        </linearGradient>
        <filter id="ls-paint" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
        </filter>
        <filter id="ls-blur"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      <rect width="1440" height="360" fill="url(#ls-sky)" />
      <g data-ls="clouds" filter="url(#ls-blur)" opacity="0.9">
        <ellipse cx="260" cy="150" rx="220" ry="70" fill="#f3d79b" />
        <ellipse cx="380" cy="120" rx="150" ry="60" fill="#ecc58a" />
        <ellipse cx="1000" cy="170" rx="260" ry="60" fill="#f4dba4" />
        <ellipse cx="1120" cy="140" rx="160" ry="50" fill="#ebc283" />
      </g>
      <g data-ls="hills" filter="url(#ls-paint)">
        <path d="M0 250 C200 190 330 220 520 236 C700 250 860 200 1040 226 C1200 248 1320 214 1440 230 V360 H0Z" fill="url(#ls-hill1)" />
        <path d="M0 296 C220 262 420 300 640 288 C860 276 1060 252 1440 292 V360 H0Z" fill="url(#ls-hill2)" />
        <path d="M120 360 C260 316 330 312 520 322 C640 330 760 306 900 296" fill="none" stroke="#c49a63" strokeWidth="9" strokeLinecap="round" />
        {/* houses */}
        <g>
          <rect x="190" y="206" width="76" height="44" fill="#cba77a" />
          <path d="M182 208 228 172 274 208Z" fill="#b8572b" />
          <rect x="216" y="226" width="14" height="24" rx="6" fill="#6b4425" />
        </g>
        <g>
          <rect x="1040" y="224" width="96" height="52" fill="#d2b183" />
          <path d="M1030 226 1088 184 1146 226Z" fill="#b24f26" />
          <rect x="1078" y="248" width="16" height="28" rx="7" fill="#5e3a1f" />
        </g>
        {/* cypress + trees */}
        {CYPRESS.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y + 60} C${x - 14} ${y + 20} ${x - 6} ${y - 10} ${x} ${y - 30} C${x + 6} ${y - 10} ${x + 14} ${y + 20} ${x} ${y + 60}Z`} fill="#2f4a22" />
        ))}
        {TREES.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="26" fill="#4a6a2a" />
        ))}
        <circle cx="1350" cy="190" r="48" fill="#3c5a22" />
        <circle cx="1390" cy="214" r="38" fill="#4b6c2b" />
      </g>
    </svg>
  );
}
