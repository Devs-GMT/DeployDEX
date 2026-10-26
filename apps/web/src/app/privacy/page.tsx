import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 px-4 py-12">
      <h1 className="text-4xl">Privacy</h1>
      <p>DeployDex has no backend database and no accounts. We don&apos;t collect personal data.</p>
      <p>
        Wallet addresses you connect are only used in your browser to read and write the public
        registry on BOT Chain. Anything you list is public on-chain. Delisting removes it from DeployDex, but the record
        stays on the chain.
      </p>
      <p>
        Repository info (including a repo&apos;s <code>.deploydex</code> file) is fetched from
        GitHub&apos;s public API through our server and cached for an hour. Contract verification
        and deployer info come from the public BOT Chain explorer the same way. Project logos and card images are fetched by our server from the URLs builders
        provide (or the share image their site declares) and served from DeployDex, so your browser
        never contacts those sites.
      </p>
    </article>
  );
}
