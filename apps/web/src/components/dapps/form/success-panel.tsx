"use client";

import Link from "next/link";
import { Kit } from "@/components/kit/kit";

export function SuccessPanel({ editing, name }: { editing: boolean; name: string }) {
  const text = encodeURIComponent(
    `I just listed ${name} on DeployDex — the home of BOT Chain dApps. Ship it. List it. Get starred. @BOTChain_ai`,
  );
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-card p-10 text-center"
      role="status"
    >
      <Kit pose="party" className="w-44" />
      <h2 className="text-2xl">{editing ? "Listing updated!" : "Your dApp is live in the Dex!"}</h2>
      <p className="max-w-md text-sm text-muted">
        {editing
          ? "Your changes are on-chain."
          : "Kit already put a fresh star on the shelf. Tell the timeline."}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          className="inline-flex h-11 items-center rounded-xl bg-ink px-5 text-sm font-medium text-white"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/intent/tweet?text=${text}`}
        >
          Share on X
        </a>
        <Link
          href="/my"
          className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-medium"
        >
          My dApps
        </Link>
      </div>
    </div>
  );
}
