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
        tone === "peach" && "bg-peach text-peach-ink",
        tone === "pink" && "bg-pink-soft text-pink",
        tone === "neutral" && "border border-line bg-panel text-muted",
        tone === "green" && "bg-success-soft text-success",
        className,
      )}
    >
      {children}
    </span>
  );
}
