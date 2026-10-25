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

## Motion conventions (GSAP)
- Import GSAP only from `src/lib/gsap.ts` (registers ScrollTrigger, SplitText, MotionPath, DrawSVG, useGSAP) and only in client components.
- Use `useGSAP` with a scope ref and `gsap.matchMedia()`: `MQ_FULL` for pinned/scrubbed scenes, `MQ_LITE` for small screens, `MQ_MOTION` for any motion. Never animate under reduced motion.
- Server sections stay server components; wrap them in a small `*-scene.tsx` client component that animates tagged nodes (`data-*`).
- Opt-in reveals: add `className="reveal"` (or `reveal-lite` for phones only) or `data-split` and `MotionRoot` handles it with IntersectionObserver + CSS, not GSAP. Do not hide content in CSS before JS runs.
- Keep GSAP for scroll-scrubbed/pinned desktop scenes; on phones prefer one-shot CSS (no scroll-linked tweens).
- Pitfall 1: elements with Tailwind `transition-all`/`transition-transform` must not be tweened directly. Use `muteTransitions()`/`restoreTransitions()` or tween a wrapper.
- Pitfall 2: inside a `.reveal` container use `opacity`, not `autoAlpha`. While the container is hidden its children inherit `visibility: hidden` and autoAlpha records 0 as the start.
- Check scenes with `node apps/web/scripts/shots.mjs <url> <outDir> <width> [--at=…|--sections] [--reduced]` against a production build.

## Out of scope (MVP)
Reviews, paid spots, analytics, OAuth, source verification, multi-chain, deleting listings, tokens, database.
