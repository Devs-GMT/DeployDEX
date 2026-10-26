# Deploy guide

## 0. Current state

| Network | Chain ID | Registry | Used by |
|---|---|---|---|
| BOT Chain mainnet | `677` | `0xCeA0C0db0F86d75CeE6e8d70e2b20488Fa5cD884` | Production (`NEXT_PUBLIC_CHAIN=mainnet`) |
| BOT Chain testnet | `968` | `0x5863636C9308E1318ef4F159bD5019c67C2F6b83` | Local testing |

A registry can't be upgraded in place. A new deploy starts empty: listings and stars don't carry over, so each dApp is listed again.

## 1. Test on testnet (2 wallets)
1. In `apps/web/.env.local` set `NEXT_PUBLIC_CHAIN=testnet` and `NEXT_PUBLIC_REGISTRY_TESTNET`.
2. `npm run dev`, open http://localhost:3000, connect wallet A (MetaMask auto-switches to chain 968).
3. `/list`: a real testnet contract, a real `owner/repo`, an https live URL. Wait for the 4 checks, press **List on BOT Chain**.
4. The project shows in `/dapps`, the home page, `/stats` and the footer counter.
5. Switch to wallet B, open the project, press **Star** (count goes to 1), then **Unstar** (back to 0).
6. Wallet A sees **Your project** instead of Star. Edit and delist it from `/my`.
7. Run the full checklist in `contracts/test-notes.md` for the revert cases.

## 2. Deploy the registry (Remix)
1. Open `contracts/DeployDex.sol` in [Remix](https://remix.ethereum.org), compiler 0.8.20+ (no `viaIR` needed).
2. MetaMask on the target network, with BOT for gas:
   - Mainnet: chain ID 677, RPC `https://rpc.botchain.ai`, explorer `https://scan.botchain.ai`
   - Testnet: chain ID 968, RPC `https://rpc.bohr.life`, explorer `https://scan.bohr.life`
3. Deploy. The deployer becomes the **curator** (can hide listings), so use a wallet you control long-term.
4. Put the address in `apps/web/.env.local` and on Vercel (`NEXT_PUBLIC_REGISTRY_MAINNET` or `NEXT_PUBLIC_REGISTRY_TESTNET`), and update the contracts table in `README.md` and section 0 above.
5. Check it on the explorer: `<explorer>/address/<address>`.

## 3. Vercel
1. Push the repo to GitHub (nothing secret is committed; `.env*.local` is git-ignored).
2. Vercel: New Project, import the repo, **Root Directory = `apps/web`**, framework Next.js.
3. Environment variables (Production):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_CHAIN` | `mainnet` |
| `NEXT_PUBLIC_REGISTRY_MAINNET` | `0xCeA0C0db0F86d75CeE6e8d70e2b20488Fa5cD884` |
| `NEXT_PUBLIC_REGISTRY_TESTNET` | testnet address (optional) |
| `NEXT_PUBLIC_SITE_URL` | production URL, e.g. `https://deploy-dex.vercel.app` (sitemap and social cards) |
| `GITHUB_TOKEN` | optional, a fine-grained token with no scopes (public data only). Server only, never prefix with `NEXT_PUBLIC_`. |

4. Deploy. `NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after changing any of them**.
5. Optional: add a custom domain in Project Settings, Domains, and update `NEXT_PUBLIC_SITE_URL`.
6. Contact email, docs and faucet links live in `src/lib/config.ts` (`CONTACT_EMAIL`, `BOT_CHAIN_DOCS`, `BOT_CHAIN_FAUCET`).

## 4. List dApps on mainnet
List through `/list` on the live site. Each listing needs: name, tagline (80 bytes max), category, contract address, https live URL, GitHub repo, optional logo URL.

The contract address must exist on **mainnet**: `list()` checks the code on the registry's own chain, so testnet-only addresses are rejected. A contract deployed from the same wallet at the same nonce can have the same address on both chains; check on the explorer that it is the right contract before listing, since the address can't be edited later (only delisted).

## 5. Launch checklist
- [ ] Footer shows chain 677 and the mainnet registry; registry visible on scan.botchain.ai
- [ ] `NEXT_PUBLIC_SITE_URL` set: `/sitemap.xml` and the og:image use the production URL
- [ ] Live URL works on mobile and desktop
- [ ] At least a few real listings, and a star from a second wallet so `/stats` has a Chain log entry
- [ ] Demo clip: list, checks pass, star from the second wallet
- [ ] X post tagging @BOTChain_ai
- [x] Official BOT Chain logo in place (`components/ui/bot-chain-logo.tsx`)
