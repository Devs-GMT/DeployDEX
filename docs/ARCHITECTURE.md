# Architecture

- **Registry contract** (`contracts/DeployDex.sol`) is the only database. Reads go straight to BOT Chain RPC via viem (public, no wallet needed). Writes go through MetaMask via wagmi.
- **Chains**: mainnet 677 (rpc.botchain.ai, scan.botchain.ai), testnet 968 (rpc.bohr.life, scan.bohr.life). Selected by `NEXT_PUBLIC_CHAIN`; addresses in `src/lib/config.ts`.
- **GitHub**: browser calls `/api/github/[owner]/[repo]`, a route handler that fetches repo info + README, uses optional `GITHUB_TOKEN`, caches 1h. On 403/rate-limit the UI shows the saved repo link only.
- **Validation**: client checks `getCode(address)`, duplicate via `idOfTarget`, repo exists, https URL. Contract re-enforces code length and uniqueness.
- **States**: no MetaMask, wrong network, tx pending/rejected/failed, empty category, unknown id, broken logo (initial avatar).

## Deviations from the PRD (intentional)
- **Hosting:** Next.js 16 on Vercel instead of one `index.html` on GitHub Pages. Benefit: a server-side GitHub proxy (`/api/github/...`) with an optional token, 1h cache.
- **Project URL:** `/dapps/[id]` instead of `?p=12`.
- **Contract:** `idOfTarget(addr)` is a function returning `(found, id)` so id 0 is distinguishable from "not listed". Added `starredOf(addr)` for "My dApps". Strings are `memory` params to avoid "stack too deep".
- **Network:** chosen by `NEXT_PUBLIC_CHAIN` (mainnet 677 / testnet 968), each with its own registry address. No per-listing testnet toggle because `code.length` is checked on the registry's own chain.
- **Delist (was out of scope):** `delist(id)` lets the lister take a project out for good. It sets `hidden`, records `delisted[id]` and frees the target for a new listing; star, update and un-hide revert with `IsDelisted`. Because it reuses `hidden`, the `Project` struct (and its ABI) is unchanged, so readers of older registries keep working.
- **Most starred:** "this week" is computed from `Starred`/`Unstarred` events over the last 7 days; if logs are unavailable or empty it falls back to all-time and is labelled as such.

## Security notes
- Everything read from the chain is untrusted. Links and logo URLs pass through `safeHttpsUrl()` (https only, no credentials) before reaching `href`/`src`; failing values render as "Link unavailable" or the initial avatar. Covered by `validators.test.ts`.

## Tests
- `contracts/test/DeployDex.t.sol` (Foundry, `cd contracts && forge test`): 16 tests.
- `apps/web/src/lib/validators.test.ts` (Vitest, `npm test`): 15 tests.
