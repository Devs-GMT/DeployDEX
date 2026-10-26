import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

/** Chunky "3D" buttons: a darker bottom edge that presses in on :active. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-[15px]",
    size === "lg" && "h-13 px-7 text-base",
    variant !== "ghost" && "border-b-4 active:translate-y-0.5 active:border-b-2",
    variant === "primary" && "border-brand-deep bg-brand text-white hover:bg-brand-hover",
    variant === "secondary" && "border-black bg-ink text-white hover:bg-ink-soft",
    variant === "outline" && "border-line bg-card text-ink shadow-sm hover:bg-panel",
    variant === "light" && "border-line-strong bg-white text-ink hover:bg-panel",
    variant === "ghost" && "text-ink hover:bg-black/5",
    className,
  );
}

interface Common {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant,
  size,
  className,
  ...props
}: Common & ComponentProps<"button">) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

export function ExternalLink({ children, ...props }: ComponentProps<"a">) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
