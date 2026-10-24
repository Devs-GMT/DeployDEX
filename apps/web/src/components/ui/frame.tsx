import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page section with the "blueprint" frame: a hairline above, and visible
 * column rails on the left and right of the content column.
 */
export function Section({
  children,
  dark = false,
  className,
  innerClassName,
  id,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-t",
        dark ? "border-white/10 bg-charcoal text-white" : "border-line",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-300 px-5 py-16 sm:px-10 sm:py-24 lg:border-x",
          dark ? "border-white/10" : "border-line",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Serif-italic orange emphasis used inside headlines. */
export function Em({ children }: { children: ReactNode }) {
  return <span className="em-serif">{children}</span>;
}

export function SectionHead({
  title,
  sub,
  action,
  dark,
}: {
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 data-split className="text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]">
          {title}
        </h2>
        {sub && (
          <p className={cn("reveal mt-3 max-w-xl text-lg", dark ? "text-white/70" : "text-muted")}>{sub}</p>
        )}
      </div>
      {action && <div className="reveal">{action}</div>}
    </div>
  );
}
