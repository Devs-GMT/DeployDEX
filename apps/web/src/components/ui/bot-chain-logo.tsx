import { cn } from "@/lib/utils";

/**
 * Placeholder BOT Chain mark. Replace the SVG with the official logo asset
 * (put it in /public/botchain.svg) before launch.
 */
export function BotChainLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-6", className)}>
      <path d="M16 2 28 9v14l-12 7L4 23V9z" fill="#191919" />
      <path d="M11 12h7a3 3 0 0 1 0 6h-7zm0 6h8a3 3 0 0 1 0 6h-8z" fill="#FF5C00" />
    </svg>
  );
}
