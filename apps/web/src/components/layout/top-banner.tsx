"use client";

import Link from "next/link";
import { useState } from "react";

export function TopBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative bg-brand px-10 py-2.5 text-center text-sm text-white">
      <Link href="/dapps" className="hover:underline">
        Introducing <strong>DeployDex</strong> — the home of BOT Chain dApps →
      </Link>
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => setOpen(false)}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
