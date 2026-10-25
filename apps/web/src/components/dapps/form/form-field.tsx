"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconAlert } from "@/components/ui/icons";

export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-card px-4 text-sm text-ink transition-colors placeholder:text-muted/70 focus:border-brand/60 disabled:bg-panel disabled:text-muted aria-[invalid=true]:border-pink/60 aria-[invalid=true]:bg-pink-soft/20";

/** Shared ARIA wiring so every input is described by its hint and error text. */
export function fieldProps(
  id: string,
  options: { error?: string | null; hasHint?: boolean } = {},
) {
  const describedBy = [options.hasHint ? `${id}-hint` : null, options.error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    "aria-invalid": options.error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;
}

export function FieldCounter({ value, max }: { value: number; max: number }) {
  const over = value > max;
  return (
    <span className={cn("font-mono text-xs", over ? "font-medium text-pink" : "text-muted")}>
      {value}/{max} bytes
    </span>
  );
}

export function FormField({
  id,
  label,
  hint,
  error,
  counter,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string | null;
  counter?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {counter}
      </div>
      {children}
      <div className="min-h-4 text-xs leading-relaxed">
        {error ? (
          <p id={`${id}-error`} className="flex items-start gap-1.5 text-pink">
            <IconAlert className="mt-px size-3.5 shrink-0" />
            <span>
              <span className="sr-only">Error: </span>
              {error}
            </span>
          </p>
        ) : hint ? (
          <div id={`${id}-hint`} className="text-muted">
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  );
}
