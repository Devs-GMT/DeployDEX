import { cn } from "@/lib/utils";

/**
 * DeployDex mark: Kit's head shaped as a "D" (flat left side, round right side, two ears and a
 * tabby stripe) on a brand-orange tile. Same artwork as app/icon.svg, which is the favicon.
 * Decorative by default; pass `title` when the mark stands alone without the wordmark.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="64" height="64" rx="16" style={{ fill: "var(--color-brand)" }} />
      <path
        style={{ fill: "var(--color-card)" }}
        d="M14 24 L16.5 9.5 L26.5 19 H35 L45.5 10 L46.6 21.6 C50.6 25.4 52 30 52 35 C52 45.5 44.5 53 33 53 H18 C15.8 53 14 51.2 14 49 Z"
      />
      <g style={{ fill: "var(--color-brand)" }}>
        <rect x="28.4" y="19" width="1.9" height="5" rx="0.95" />
        <rect x="31.6" y="19" width="1.9" height="6.4" rx="0.95" />
        <rect x="34.8" y="19" width="1.9" height="5" rx="0.95" />
      </g>
      <g style={{ fill: "var(--color-ink)" }}>
        <ellipse cx="27" cy="35.5" rx="2.6" ry="3.4" />
        <ellipse cx="39.5" cy="35.5" rx="2.6" ry="3.4" />
      </g>
      <path d="M31.4 41.2 h4.2 l-2.1 2.4 z" style={{ fill: "var(--color-pink)" }} />
    </svg>
  );
}
