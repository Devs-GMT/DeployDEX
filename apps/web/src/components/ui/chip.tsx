import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Chip({
  children,
  tone = "peach",
  className,
}: {
  children: ReactNode;
  tone?: "peach" | "pink" | "neutral" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs",
        tone === "peach" && "bg-peach text-[#7a2d00]",
        tone === "pink" && "bg-pink-soft text-pink",
        tone === "neutral" && "border border-line bg-panel text-muted",
        tone === "green" && "bg-[#e6f6ec] text-[#14693a]",
        className,
      )}
    >
      {children}
    </span>
  );
}
