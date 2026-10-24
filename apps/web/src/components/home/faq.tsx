import { Section } from "@/components/ui/frame";

const FAQS: [string, string][] = [
  ["Is it free to list?", "Yes. You only pay the network gas fee for the transaction."],
  ["Why does it need a contract address?", "Every listing must point to a deployed contract on BOT Chain. The registry checks this on-chain, so wallets and random addresses can't be listed."],
  ["Can I edit my listing?", "Yes. The wallet that listed it can update the name, tagline, links, logo and category. The contract address can never change."],
  ["Can I list a testnet project?", "The registry checks code on the chain it's deployed on. Testnet projects belong in a testnet registry; the mainnet DeployDex lists mainnet contracts."],
  ["How do stars work?", "One star per wallet per project. You can unstar any time, and you can't star your own project."],
  ["Who can hide a listing?", "Only the curator (the registry deployer). Hidden projects disappear from the directory but stay on-chain."],
  ["Is this official?", "No. DeployDex is a community project built for the BOT Chain ecosystem."],
];

export function Faq() {
  return (
    <Section id="faq" innerClassName="max-w-3xl lg:border-x-0">
      <h2 data-split className="text-center text-[clamp(2.25rem,5vw,3.75rem)] leading-none">FAQ</h2>
      <div className="reveal mt-10 rounded-3xl border border-line bg-panel shadow-[0_10px_30px_-18px_rgba(0,0,0,0.3)]">
        <div className="divide-y divide-line px-6 sm:px-8">
          {FAQS.map(([q, a]) => (
            <details key={q} className="faq-item group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink/90">
                {q}
                <svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0 transition-transform group-open:rotate-180">
                  <path d="m4 7 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="mt-3 max-w-prose text-muted">{a}</p>
            </details>
          ))}
        </div>
        <p className="rounded-b-3xl bg-white py-5 text-center text-sm">
          Can&apos;t find an answer to your question?{" "}
          <a className="text-brand hover:underline" href="mailto:hello@deploydex.xyz">Get in touch</a>
        </p>
      </div>
    </Section>
  );
}
