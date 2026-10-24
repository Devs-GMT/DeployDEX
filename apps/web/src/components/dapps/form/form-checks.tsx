"use client";

import { cn } from "@/lib/utils";
import { Kit } from "@/components/kit/kit";
import { IconAlert, IconCheck, IconSpinner } from "@/components/ui/icons";

export type CheckState = "idle" | "checking" | "ok" | "error" | "warn";

export interface CheckItem {
  id: string;
  label: string;
  detail?: string;
  state: CheckState;
}

function StatusIcon({ state }: { state: CheckState }) {
  if (state === "ok") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
        <IconCheck className="size-3" />
      </span>
    );
  }
  if (state === "checking") {
    return (
      <span className="grid size-5 shrink-0 place-items-center text-muted">
        <IconSpinner className="size-3.5" />
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-pink-soft text-pink">
        <IconAlert className="size-3" />
      </span>
    );
  }
  if (state === "warn") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-peach text-brand-deep">
        <IconAlert className="size-3" />
      </span>
    );
  }
  return <span className="mt-1 ml-2 size-1.5 shrink-0 rounded-full bg-line" aria-hidden />;
}

export function FormChecks({ items }: { items: CheckItem[] }) {
  const passed = items.filter((i) => i.state === "ok").length;
  const failed = items.filter((i) => i.state === "error").length;
  const total = items.length;

  return (
    <section className="rounded-2xl border border-line bg-card p-4" aria-labelledby="checks-title">
      <div className="flex items-center gap-3">
        <Kit pose="inspector" className="w-16 shrink-0" float />
        <div className="min-w-0">
          <h2 id="checks-title" className="text-base">
            Listing checks
          </h2>
          <p className="font-mono text-xs text-muted">
            {passed} of {total} passed
            {failed > 0 && ` · ${failed} to fix`}
          </p>
        </div>
      </div>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={passed}
        aria-label="Listing checks passed"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300"
          style={{ width: `${total ? (passed / total) * 100 : 0}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2">
            <StatusIcon state={item.state} />
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm leading-snug",
                  item.state === "idle" && "text-muted",
                  item.state === "ok" && "text-ink",
                  item.state === "error" && "text-pink",
                  item.state === "warn" && "text-brand-deep",
                )}
              >
                {item.label}
              </p>
              {item.detail && <p className="mt-0.5 text-xs text-muted">{item.detail}</p>}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
        Nothing is written on-chain until you confirm in your wallet.
      </p>
    </section>
  );
}
