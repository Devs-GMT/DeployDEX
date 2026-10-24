import { Suspense } from "react";
import type { Metadata } from "next";
import { Directory } from "@/components/dapps/directory";
import { Kit } from "@/components/kit/kit";

export const metadata: Metadata = {
  title: "Browse dApps",
  description: "Every listing points to a real BOT Chain contract. Search, filter and star.",
};

export default function DappsPage() {
  return (
    <div className="mx-auto max-w-300 px-5 py-12 sm:px-10 lg:border-x lg:border-line">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Browse dApps</h1>
          <p className="mt-2 text-muted">A showcase for every kind of build on BOT Chain.</p>
        </div>
        <Kit pose="curator" className="hidden w-28 sm:block" />
      </div>
      <Suspense fallback={null}>
        <Directory />
      </Suspense>
    </div>
  );
}
