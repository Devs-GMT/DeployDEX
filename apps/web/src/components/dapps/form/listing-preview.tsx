"use client";

import { parseRepo, safeHttpsUrl, type DappFormValues } from "@/lib/validators";
import { isAddress } from "viem";
import { DappCardFace } from "@/components/dapps/dapp-card-face";
import { IconExternal } from "@/components/ui/icons";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

/**
 * The exact card the showcase will render, fed by the form as you type. Only the chrome
 * differs: a "Preview" tag and inert, decorative actions.
 */
export function ListingPreview({
  values,
  contractOk,
  repoOk,
}: {
  values: DappFormValues;
  contractOk: boolean;
  repoOk: boolean;
}) {
  const live = safeHttpsUrl(values.liveUrl);
  // The cover looks up the share image once typing settles, not on every keystroke.
  const coverUrl = useDebouncedValue(values.liveUrl, 700);
  const coverRepo = useDebouncedValue(values.repo, 700);

  return (
    <section aria-label="Listing preview" className="relative">
      <p className="text-muted mb-2 flex items-center gap-2 font-mono text-[11px] tracking-widest">
        <span className="bg-brand size-1.5 rounded-full" aria-hidden />
        LIVE PREVIEW
      </p>
      <DappCardFace
        name={values.name.trim() || "Your dApp"}
        tagline={values.tagline.trim() || "One line about what you built."}
        category={values.category}
        logoUrl={values.logoUrl}
        liveUrl={coverUrl}
        repo={coverRepo}
        stars={0}
        target={isAddress(values.target) ? values.target : undefined}
        contractOk={contractOk}
        repoOk={repoOk && !!parseRepo(values.repo)}
        fresh
        actions={
          <span
            aria-hidden
            className={`border-line inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium ${live ? "" : "text-muted"}`}
          >
            Open <IconExternal className="size-3.5" />
          </span>
        }
      />
    </section>
  );
}
