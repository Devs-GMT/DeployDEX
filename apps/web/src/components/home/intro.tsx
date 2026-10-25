import { ButtonLink } from "@/components/ui/button";
import { CursorTag } from "@/components/ui/decor";
import { Em } from "@/components/ui/frame";
import { StarField } from "@/components/illustrations/star-field";
import { IntroScene } from "./intro-scene";

function Doc({ className, title }: { className?: string; title: string }) {
  return (
    <div aria-hidden className={`text-ink rounded-xl bg-white p-4 shadow-2xl ${className ?? ""}`}>
      <p className="font-display text-base">{title}</p>
      <p className="text-muted text-[9px]">Please provide the details of your project.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <div className="text-[8px]">Contract address*</div>
          <div className="border-line bg-panel text-muted mt-1 h-6 rounded border px-1.5 font-mono text-[8px] leading-6">
            0x3b3A…735A
          </div>
        </div>
        <div>
          <div className="text-[8px]">GitHub repo*</div>
          <div className="border-line bg-panel text-muted mt-1 h-6 rounded border px-1.5 font-mono text-[8px] leading-6">
            owner/repo
          </div>
        </div>
      </div>
      <div className="border-brand/40 bg-peach/60 text-muted mt-3 rounded border border-dashed py-4 text-center text-[8px]">
        Drop your logo here
      </div>
      <div className="bg-brand mt-3 ml-auto w-fit rounded px-3 py-1 text-[8px] text-white">
        Next
      </div>
    </div>
  );
}

export function Intro() {
  return (
    <section id="about" className="border-line border-t">
      <div className="lg:border-line mx-auto max-w-300 px-3 py-6 sm:px-5 lg:border-x">
        <IntroScene>
          <div className="reveal bg-charcoal relative overflow-hidden rounded-3xl text-white">
            <StarField className="opacity-60" />
            <div
              aria-hidden
              className="absolute -top-40 left-1/3 size-130 rounded-full border border-white/10"
            />
            <div
              aria-hidden
              className="absolute -top-24 left-[40%] size-90 rounded-full border border-white/5"
            />
            <div className="relative grid items-center gap-10 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p
                  data-intro-text
                  className="text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.12] tracking-[-0.04em]"
                >
                  <Em>DeployDex</Em> is an on-chain directory where every listing points to a real
                  BOT Chain contract. That means no fake projects, no dead links, and a community
                  that can verify what you built.
                </p>
                <ButtonLink href="/list" size="lg" className="mt-9">
                  List your dApp
                </ButtonLink>
              </div>
              <div aria-hidden className="relative hidden h-80 lg:block">
                <div data-intro-doc className="absolute top-2 left-10 w-72 rotate-[-8deg] will-change-transform">
                  <Doc title="Project details" />
                </div>
                <div data-intro-doc className="absolute top-24 left-44 w-72 rotate-[5deg] will-change-transform">
                  <Doc title="Certificate of Deployment" />
                </div>
                <div data-intro-cursor className="absolute top-4 left-0">
                  <CursorTag className="relative">Super long &amp; boring contract</CursorTag>
                </div>
              </div>
            </div>
          </div>
        </IntroScene>
      </div>
    </section>
  );
}
