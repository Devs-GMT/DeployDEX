"use client";

import { CATEGORY_ART, categoryById } from "@/lib/categories";
import { parseRepo, type DappFormValues } from "@/lib/validators";
import { Chip } from "@/components/ui/chip";
import { Halftone } from "@/components/ui/halftone";
import { LogoAvatar } from "@/components/dapps/logo-avatar";

/** Mirrors the directory card so builders see what they are about to publish. */
export function ListingPreview({
  values,
  contractOk,
  repoOk,
}: {
  values: DappFormValues;
  contractOk: boolean;
  repoOk: boolean;
}) {
  const category = categoryById(values.category);
  const art = CATEGORY_ART[category.slug]!;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card" aria-label="Listing preview">
      <div className="relative h-24 border-b border-line bg-white">
        <div aria-hidden className="absolute -top-2 right-2 size-24 opacity-90">
          <Halftone shape={art.shape} />
        </div>
        <span className="absolute top-2.5 left-3 rounded-full bg-ink/85 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white">
          PREVIEW
        </span>
        <LogoAvatar
          name={values.name || "?"}
          src={values.logoUrl}
          className="absolute -bottom-5 left-4 size-12 border-2 border-white shadow-sm"
        />
      </div>
      <div className="px-4 pt-7 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-lg leading-tight">{values.name.trim() || "Your dApp"}</h3>
          <span className="shrink-0 font-mono text-sm text-brand" aria-label="0 stars">
            ★ 0
          </span>
        </div>
        <p className="mt-1 line-clamp-2 min-h-9 text-sm text-muted">
          {values.tagline.trim() || "One line about what you built."}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Chip>{category.label}</Chip>
          {contractOk && <Chip tone="green">✓ Contract</Chip>}
          {repoOk && parseRepo(values.repo) && <Chip tone="green">✓ GitHub</Chip>}
        </div>
      </div>
    </article>
  );
}
