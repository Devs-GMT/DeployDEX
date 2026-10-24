import { Kit } from "@/components/kit/kit";
import { Em, Section } from "@/components/ui/frame";
import { WhyLogos } from "./why-logos";

const OLD = [
  { t: "Scattered tweets", i: "✎" },
  { t: "Spreadsheets", i: "▦" },
  { t: "Dead links", i: "⛓" },
];

const TILES: { c: string; pos: string }[] = [
  { c: "✓", pos: "left-[6%] top-[22%] -rotate-12" },
  { c: "⭐", pos: "left-[22%] bottom-[16%] rotate-6" },
  { c: "</>", pos: "left-[34%] top-[38%] -rotate-6" },
  { c: "0x", pos: "right-[30%] top-[40%] rotate-6" },
  { c: "✓", pos: "right-[14%] top-[22%] rotate-12" },
  { c: "⭐", pos: "right-[6%] bottom-[18%] -rotate-12" },
];

function Pill({ children, icon }: { children: React.ReactNode; icon: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-4 border-[#ffb3c0] bg-[#ffe3e8] px-5 py-2.5 text-xl text-[#d0213d] shadow-[0_0_0_4px_rgba(255,64,93,0.12)]">
      <span aria-hidden className="text-base">{icon}</span>
      {children}
    </span>
  );
}

function OldWay() {
  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-3xl bg-panel">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute top-14 left-0 flex w-max items-center gap-0 -translate-x-8">
          {OLD.map((o, i) => (
            <div key={o.t} className="flex items-center">
              <Pill icon={o.i}>{o.t}</Pill>
              {i < OLD.length - 1 && <span aria-hidden className="h-1 w-8 bg-[#ffb3c0]" />}
            </div>
          ))}
        </div>
        <div aria-hidden className="absolute bottom-0 left-1/2 w-72 -translate-x-1/2 rotate-[-2deg] rounded-t-lg bg-white p-5 shadow-lg">
          <p className="font-display text-xl text-ink/40">Is this even deployed?</p>
          <div className="mt-3 h-px bg-line" />
          <div className="mt-3 flex gap-2"><div className="h-5 flex-1 rounded bg-line" /><div className="h-5 w-12 rounded bg-line" /></div>
          <div className="mt-2 h-3 w-2/3 rounded bg-line" />
          <div className="mt-2 h-3 w-1/2 rounded bg-line" />
        </div>
      </div>
    </div>
  );
}

function Tunnel() {
  return (
    <div className="relative h-80 overflow-hidden rounded-3xl bg-white">
      <svg viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="tun" x1="0" x2="1">
            <stop offset="0" stopColor="#f08fc0" />
            <stop offset="0.28" stopColor="#8ab4ff" />
            <stop offset="0.52" stopColor="#b57bff" />
            <stop offset="0.78" stopColor="#ff9d63" />
            <stop offset="1" stopColor="#fff2e6" />
          </linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <rect width="600" height="320" fill="url(#tun)" />
        <g filter="url(#soft)" fill="#2c3a5e">
          <path d="M-10 -10H610V44C530 54 470 112 400 116H200C130 112 70 54 -10 44Z" />
          <path d="M-10 330H610V276C530 266 470 208 400 204H200C130 208 70 266 -10 276Z" />
        </g>
      </svg>
      {TILES.map((t, i) => (
        <span
          key={i}
          aria-hidden
          className={`absolute grid size-12 place-items-center rounded-2xl border-2 border-white/80 bg-white font-mono text-sm shadow-lg ${t.pos}`}
        >
          {t.c}
        </span>
      ))}
      <div className="absolute top-1/2 left-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/30 p-3 backdrop-blur-sm">
        <div className="grid size-full place-items-center overflow-hidden rounded-full bg-white shadow-xl">
          <Kit pose="dev" className="mt-3 w-24" title="Kit, the DeployDex cat" />
        </div>
      </div>
    </div>
  );
}

export function Why() {
  return (
    <Section dark>
      <h2 className="reveal text-center text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]">
        Our unique <Em>advantage</Em>
      </h2>
      <div className="reveal mt-12 grid gap-5 lg:grid-cols-2">
        <div>
          <OldWay />
          <h3 className="mt-5 text-xl">The old way</h3>
          <p className="mt-2 text-white/70">
            Scattered tweets, spreadsheets that nobody updates, links that died last month, and the
            eternal question: is this even deployed?
          </p>
        </div>
        <div>
          <Tunnel />
          <h3 className="mt-5 text-xl">DeployDex</h3>
          <p className="mt-2 text-white/70">
            One on-chain registry. Every listing passes a <strong className="text-white">real contract check</strong>,
            links its GitHub repo, and collects community stars you can verify yourself.
          </p>
        </div>
      </div>
      <WhyLogos />
    </Section>
  );
}
