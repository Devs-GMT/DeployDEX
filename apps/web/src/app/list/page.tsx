import type { Metadata } from "next";
import { DappForm } from "@/components/dapps/dapp-form";

export const metadata: Metadata = {
  title: "List your dApp",
  description: "Fill 6 fields, we check the contract, you're live.",
};

export default function ListPage() {
  return (
    <div className="mx-auto max-w-300 px-5 py-12 sm:px-10 lg:border-x lg:border-line">
      <h1 className="text-4xl">List your dApp</h1>
      <p className="mt-2 mb-8 text-muted">Only gas. Every listing must point to a real BOT Chain contract.</p>
      <DappForm mode={{ kind: "create" }} />
    </div>
  );
}
