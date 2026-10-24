# DeployDex — agent guide

On-chain directory of BOT Chain dApps. Mascot: Kit the orange tabby. Full spec: `docs/PRD.md`. Visual rules: `DESIGN.md`. Data flow: `docs/ARCHITECTURE.md`.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · wagmi + viem · TanStack Query · zod. npm workspaces: `apps/web`, `contracts` (Solidity, deployed via Remix).

## Commands (repo root)
- `npm run dev` — dev server
- `npm run check` — typecheck + lint + build. Run before every commit.

## Read first
Next 16 differs from older versions. Before using a Next API, read the matching guide in `apps/web/node_modules/next/dist/docs/`.

## Conventions
- Server Components by default; add `"use client"` only on wallet/interactive leaves.
- No `any`. Validate external input (forms, GitHub responses, URL params) with zod.
- One config source: `src/lib/config.ts` (registry address, chain). Never hardcode addresses elsewhere.
- ABI lives in `src/lib/abi.ts` as `as const`, and must match `contracts/DeployDex.sol`.
- Listing strings are untrusted: render as text, require `https://` for URLs, `rel="noopener noreferrer"` on external links.
- `GITHUB_TOKEN` is server-only; GitHub is accessed through `/api/github/...`.
- Every animation honors `prefers-reduced-motion`. Keep a11y: labels, focus rings, contrast.
- Design tokens come from `globals.css` `@theme`; no ad-hoc hex values in components.
- Kit poses: `components/kit/` (`<Kit pose="dev" />`). Pose names: dev, hackathon, astro, inspector, curator, napping, party.
- Browsing must work with no wallet and no MetaMask.
- Conventional commits. Small, reviewable changes.

## Out of scope (MVP)
Reviews, paid spots, analytics, OAuth, source verification, multi-chain, deleting listings, tokens, database.
