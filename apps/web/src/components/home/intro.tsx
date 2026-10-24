import { ButtonLink } from "@/components/ui/button";
import { CursorTag } from "@/components/ui/decor";
import { Em } from "@/components/ui/frame";

function Doc({ className, title }: { className?: string; title: string }) {
  return (
    <div aria-hidden className={`rounded-xl bg-white p-4 text-ink shadow-2xl ${className ?? ""}`}>
      <p className="font-display text-base">{title}</p>
      <p className="text-[9px] text-muted">Please provide the details of your project.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div><div className="text-[8px]">Contract address*</div><div className="mt-1 h-6 rounded border border-line bg-panel px-1.5 font-mono text-[8px] leading-6 text-muted">0x3b3A…735A</div></div>
        <div><div className="text-[8px]">GitHub repo*</div><div className="mt-1 h-6 rounded border border-line bg-panel px-1.5 font-mono text-[8px] leading-6 text-muted">owner/repo</div></div>
      </div>
      <div className="mt-3 rounded border border-dashed border-brand/40 bg-peach/60 py-4 text-center text-[8px] text-muted">Drop your logo here</div>
      <div className="mt-3 ml-auto w-fit rounded bg-brand px-3 py-1 text-[8px] text-white">Next</div>
    </div>
  );
}

export function Intro() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-300 px-3 py-6 sm:px-5 lg:border-x lg:border-line">
        <div className="reveal relative overflow-hidden rounded-3xl bg-charcoal text-white">
          <div aria-hidden className="absolute -top-40 left-1/3 size-130 rounded-full border border-white/10" />
          <div className="relative grid items-center gap-10 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.12] tracking-[-0.04em]">
                <Em>DeployDex</Em> is an on-chain directory where every listing points to a real
                BOT Chain contract. That means no fake projects, no dead links, and a community
                that can verify what you built.
              </p>
              <ButtonLink href="/list" size="lg" className="mt-8">List your dApp</ButtonLink>
            </div>
            <div aria-hidden className="relative hidden h-72 lg:block">
              <Doc title="Project details" className="absolute top-2 left-10 w-72 rotate-[-8deg]" />
              <Doc title="Certificate of Deployment" className="absolute top-20 left-40 w-72 rotate-[4deg]" />
              <CursorTag className="top-6 left-4">Super long &amp; boring contract</CursorTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
