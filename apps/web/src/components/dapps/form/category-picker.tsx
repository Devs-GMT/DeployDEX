"use client";

import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Halftone } from "@/components/ui/halftone";
import { IconCheck } from "@/components/ui/icons";

/** Visual radio group: one card per category, still a native radio for keyboard users. */
export function CategoryPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (id: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Category</legend>
      <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CATEGORIES.map((c) => {
          const art = CATEGORY_ART[c.slug]!;
          const selected = value === c.id;
          return (
            <label
              key={c.id}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                selected
                  ? "border-brand bg-peach/40"
                  : "border-line bg-card hover:border-line hover:bg-panel",
              )}
            >
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={selected}
                onChange={() => onChange(c.id)}
                className="sr-only"
              />
              <span className="size-6" aria-hidden>
                <Halftone shape={art.shape} dot={3.2} />
              </span>
              <span className="text-sm leading-tight font-medium">{c.label}</span>
              <span className="text-[11px] leading-tight text-muted">{art.blurb}</span>
              {selected && (
                <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-brand text-white">
                  <IconCheck className="size-3" />
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
