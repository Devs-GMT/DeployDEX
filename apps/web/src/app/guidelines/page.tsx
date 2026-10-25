import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { CONTACT_EMAIL, EXPLORER_URL } from "@/lib/config";
import { Em } from "@/components/ui/frame";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { Kit } from "@/components/kit/kit";
import { IconCheck } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Listing guidelines",
  description:
    "What gets listed on DeployDex, how to earn each trust check, and how to edit or delist a project.",
};

const RULES: [string, ReactNode][] = [
  [
    "Point it at your real contract.",
    "The address must be a deployed contract on BOT Chain. The registry checks the bytecode on-chain, so wallets and typos bounce.",
  ],
  [
    "One listing per contract.",
    "First come, first listed. If yours is taken by someone else, email us with proof and the curator will look at it.",
  ],
  [
    "Link a live app over https.",
    "Plain http, IP addresses and links with passwords in them are refused. Your app should load for a visitor with no wallet.",
  ],
  [
    "Say what it does, honestly.",
    "Name and tagline describe your own project. No borrowed brands, no fake partnerships, no promises of returns.",
  ],
  [
    "No scams, no drainers, no impersonation.",
    "The curator hides listings that put visitors at risk. Hidden projects stay on-chain but leave the directory.",
  ],
];

const SAMPLE = `# .deploydex: wallets that may list this repo on DeployDex
0xYourListerWalletAddressHere`;

function CheckBlock({
  id,
  title,
  children,
  guaranteed = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  guaranteed?: boolean;
}) {
  return (
    <section id={id} className="border-line scroll-mt-28 border-t py-8 first:border-t-0 first:pt-0">
      <h3 className="flex items-center gap-3 text-xl">
        <span
          aria-hidden
          className={
            guaranteed
              ? "bg-success grid size-7 shrink-0 place-items-center rounded-full text-white"
              : "border-brand/50 grid size-7 shrink-0 place-items-center rounded-full border-2 border-dashed"
          }
        >
          {guaranteed && <IconCheck className="size-4" />}
        </span>
        {title}
      </h3>
      <div className="text-ink/80 mt-3 space-y-3 pl-10 leading-relaxed">{children}</div>
    </section>
  );
}

export default function GuidelinesPage() {
  return (
    <div className="pb-24">
      <header className="border-line border-b">
        <div className="lg:border-line relative mx-auto grid max-w-300 items-end gap-8 px-5 pt-16 pb-12 sm:px-10 sm:pt-20 lg:grid-cols-[1fr_auto] lg:border-x">
          <div>
            <h1
              data-split
              className="max-w-[16ch] text-[clamp(2.4rem,5.6vw,4.25rem)] leading-[0.98] text-balance"
            >
              House rules. <Em>Short</Em> ones.
            </h1>
            <p className="text-ink/70 mt-5 max-w-[52ch] text-lg">
              DeployDex lists real BOT Chain contracts, then shows visitors how much more each
              builder has proven. Here is what we need from you, and how to earn every check.
            </p>
          </div>
          <div className="kit-group w-36 justify-self-end sm:w-44" aria-hidden>
            <Kit pose="curator" sizes="176px" priority />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-300 gap-14 px-5 pt-14 sm:px-10 lg:grid-cols-[14rem_1fr] lg:gap-20">
        <nav aria-label="On this page" className="text-sm lg:pt-2">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col">
            {[
              ["rules", "Listing rules"],
              ["checks", "Trust checks"],
              ["edit", "Edit or delist"],
              ["curator", "Hidden listings"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={`#${href}`} className="text-muted hover:text-ink font-medium">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-[68ch] min-w-0">
          <section id="rules" className="scroll-mt-28">
            <h2 className="text-3xl">Listing rules</h2>
            <ol className="mt-6 space-y-5">
              {RULES.map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <span aria-hidden className="bg-brand mt-2.5 size-2 shrink-0 rounded-full" />
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-ink/75 mt-1 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="checks" className="mt-20 scroll-mt-28">
            <h2 className="text-3xl">Trust checks</h2>
            <p className="text-ink/75 mt-3 leading-relaxed">
              Every project page has a Trust report. The first check is enforced by the contract.
              The others are optional, take a few minutes, and tell visitors the person who listed
              the project is the person who built it.
            </p>

            <div className="border-line bg-card mt-8 rounded-2xl border p-6 sm:p-8">
              <CheckBlock id="contract" title="Real contract on BOT Chain" guaranteed>
                <p>Automatic. A listing can&apos;t exist without deployed bytecode at its address.</p>
              </CheckBlock>

              <CheckBlock id="source" title="Source code verified">
                <p>
                  Publish your contract&apos;s source on the BOT Chain explorer: open your contract
                  address on{" "}
                  <ExternalLink href={EXPLORER_URL} className="text-brand-deep font-medium underline underline-offset-2">
                    BOT Scan
                  </ExternalLink>
                  , choose <strong className="font-medium">Contract → Verify &amp; publish</strong>,
                  and use the same compiler version and settings you deployed with (Remix shows them
                  under Solidity compiler).
                </p>
                <p>The check turns green within the hour.</p>
              </CheckBlock>

              <CheckBlock id="deployer" title="Deployed by the lister">
                <p>
                  Passes when the wallet that listed the project also deployed the contract. If a
                  teammate deployed it, that&apos;s fine. The report says who did, without judging.
                </p>
              </CheckBlock>

              <CheckBlock id="owner" title="Lister owns the contract">
                <p>
                  If your contract has an <code className="bg-panel border-line rounded border px-1.5 py-0.5 font-mono text-[0.85em]">owner()</code>{" "}
                  function (OpenZeppelin&apos;s <code className="bg-panel border-line rounded border px-1.5 py-0.5 font-mono text-[0.85em]">Ownable</code>{" "}
                  has one), list it from the owner wallet. We read it straight from the chain.
                </p>
              </CheckBlock>

              <CheckBlock id="repo" title="Repo names the lister">
                <p>
                  Add a file called{" "}
                  <code className="bg-panel border-line rounded border px-1.5 py-0.5 font-mono text-[0.85em]">.deploydex</code>{" "}
                  to the root of your public repo with the wallet you list from. One address per
                  line; lines starting with <code className="font-mono">#</code> are ignored.
                </p>
                <pre className="bg-charcoal text-page overflow-x-auto rounded-xl p-4 font-mono text-[13px] leading-relaxed">
                  <code>{SAMPLE}</code>
                </pre>
                <p>Push it to the default branch. GitHub info refreshes within the hour.</p>
              </CheckBlock>
            </div>
          </section>

          <section id="edit" className="mt-20 scroll-mt-28">
            <h2 className="text-3xl">Edit or delist</h2>
            <p className="text-ink/75 mt-3 leading-relaxed">
              Open <Link href="/my" className="text-brand-deep font-medium underline underline-offset-2">My dApps</Link>{" "}
              with the wallet you listed from. You can change the name, tagline, category, links and
              logo at any time. The contract address never changes.
            </p>
            <p className="text-ink/75 mt-3 leading-relaxed">
              <strong className="text-ink font-medium">Delist</strong> takes the project out of the
              directory for good. The record stays on-chain (blockchains don&apos;t forget), stars
              stop, and the contract can be listed again later as a fresh listing.
            </p>
          </section>

          <section id="curator" className="mt-20 scroll-mt-28">
            <h2 className="text-3xl">Hidden listings</h2>
            <p className="text-ink/75 mt-3 leading-relaxed">
              The curator, the wallet that deployed the registry, can hide a listing that breaks
              these rules. Spotted one? Use <em>Report this listing</em> on its page, or write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-deep font-medium underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              . Think a hide was a mistake? Same address.
            </p>
          </section>

          <div className="bg-charcoal mt-20 flex flex-wrap items-center justify-between gap-6 rounded-2xl p-6 text-white sm:p-8">
            <p className="font-display max-w-[24ch] text-2xl leading-tight">
              Got a contract on BOT Chain? You&apos;re one form away.
            </p>
            <ButtonLink href="/list" size="lg">
              List your dApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
