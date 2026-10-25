import type { HalftoneShape } from "@/components/ui/halftone";

// Index order must match `enum Category` in contracts/DeployDex.sol
export const CATEGORIES = [
  { id: 0, slug: "ai", label: "AI" },
  { id: 1, slug: "rwa", label: "RWA" },
  { id: 2, slug: "community", label: "Community" },
  { id: 3, slug: "productivity", label: "Productivity" },
  { id: 4, slug: "fun-lifestyle", label: "Fun & Lifestyle" },
  { id: 5, slug: "dev-tools", label: "Dev tools" },
  { id: 6, slug: "hackathon", label: "Hackathon" },
  { id: 7, slug: "other", label: "Other" },
] as const;

export type Category = (typeof CATEGORIES)[number];

export const categoryById = (id: number): Category => CATEGORIES[id] ?? CATEGORIES[7];

/** Halftone illustration, blurb and soft tint (a color token, for card covers) per category. */
export const CATEGORY_ART: Record<string, { shape: HalftoneShape; blurb: string; tint: string }> = {
  ai: { shape: "spark", blurb: "Agents, models and smart tools", tint: "--color-peach" },
  rwa: { shape: "building", blurb: "Real-world assets, on-chain", tint: "--color-sky" },
  community: { shape: "people", blurb: "DAOs, social and groups", tint: "--color-pink-soft" },
  productivity: { shape: "clock", blurb: "Get more done, on-chain", tint: "--color-peach" },
  "fun-lifestyle": {
    shape: "gamepad",
    blurb: "Games, art and good vibes",
    tint: "--color-pink-soft",
  },
  "dev-tools": { shape: "code", blurb: "Build faster on BOT Chain", tint: "--color-sky" },
  hackathon: { shape: "flag", blurb: "Fresh from the build week", tint: "--color-peach" },
  other: { shape: "star", blurb: "Everything else worth a look", tint: "--color-panel" },
};
