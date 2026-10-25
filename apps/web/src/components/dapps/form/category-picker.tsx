"use client";

import { CATEGORIES, CATEGORY_ART } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { CategoryArt } from "@/components/ui/category-art";
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
                "group kit-group relative flex cursor-pointer flex-col gap-1 overflow-hidden rounded-2xl border p-3 transition-[background-color,border-color,box-shadow]",
                "has-[:focus-visible]:outline-brand has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                selected
                  ? "border-brand bg-peach/40 shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_18%,transparent)]"
                  : "border-line bg-card hover:border-ink/25 hover:bg-panel",
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
              <span aria-hidden className="-mt-1 -ml-1 w-14">
                <CategoryArt slug={c.slug} still sizes="112px" />
              </span>
              <span className="text-sm leading-tight font-medium">{c.label}</span>
              <span className="text-muted text-[11px] leading-tight">{art.blurb}</span>
              {selected && (
                <span className="bg-brand absolute top-2 right-2 grid size-5 place-items-center rounded-full text-white">
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
