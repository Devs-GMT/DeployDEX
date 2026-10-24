import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 px-4 py-12">
      <h1 className="text-4xl">Terms</h1>
      <p>
        DeployDex is a community directory, not an official BOT Chain product. Listings are
        submitted by builders and are not audited or endorsed.
      </p>
      <p>Always do your own research before interacting with any dApp or contract.</p>
      <p>
        The curator may hide listings that are spam or abusive. Hidden listings stay on-chain but
        disappear from the directory.
      </p>
    </article>
  );
}
