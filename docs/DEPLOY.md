# Deploy guide

## 0. Current state
- Testnet registry (chain 968): `0x3b3ABC68c8Af9C769612f13E03EBfb9091Cb735A` (set in `apps/web/.env.local`).
- Mainnet registry (chain 677): not deployed yet.

## 1. Test on testnet (2 wallets)
1. `npm run dev`, open http://localhost:3000, connect wallet A (MetaMask on chain 968, it auto-switches).
2. `/list`: use a real contract address (for example the registry address above), a real `owner/repo`, an https live URL. Wait for the 4 checks, press **List on BOT Chain**.
3. The project shows in `/dapps`, the home page and the footer counter.
4. Switch to wallet B, open the project, press **Star**. Count goes to 1. Press **Unstar**. Count goes to 0.
5. Wallet A sees **Your project** instead of Star. Edit it from `/my`.
6. Run the full checklist in `contracts/test-notes.md` for the revert cases.

## 2. Deploy the registry to mainnet (Remix)
1. Open `contracts/DeployDex.sol` in Remix, compiler 0.8.20+ (no `viaIR` needed).
2. MetaMask on BOT Chain mainnet: chain ID 677, RPC `https://rpc.botchain.ai`, explorer `https://scan.botchain.ai`. Fund the deployer with BOT for gas.
3. Deploy. The deployer becomes the **curator** (can hide listings). Use a wallet you control long-term.
4. Copy the address into:
   - `apps/web/.env.local` and Vercel: `NEXT_PUBLIC_REGISTRY_MAINNET`
   - `README.md` (the "Mainnet registry" line)
5. Check it is visible on `https://scan.botchain.ai/address/<address>`.

## 3. Seed the directory
Before sharing the link, list your own deployed hackathon projects from the real mainnet wallet so judges do not see an empty site. Each needs: name, tagline (80 chars max), category, contract, https live URL, GitHub repo, optional logo URL.

## 4. Vercel
1. Push the repo to GitHub (nothing secret is committed; `.env*.local` is git-ignored).
2. Vercel: New Project, import the repo, **Root Directory = `apps/web`**, framework Next.js.
3. Environment variables (Production):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_CHAIN` | `mainnet` |
| `NEXT_PUBLIC_REGISTRY_MAINNET` | your mainnet address |
| `NEXT_PUBLIC_REGISTRY_TESTNET` | testnet address (optional) |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://deploydex.xyz` (used by sitemap and social cards) |
| `GITHUB_TOKEN` | optional, a fine-grained token with no scopes (public data only). Server only, never prefix with `NEXT_PUBLIC_`. |

4. Deploy, then add your custom domain in Project Settings, Domains.
5. Update the footer/contact placeholders: `hello@deploydex.xyz` (header/footer/FAQ/project page) and the Faucet link.

## 5. Launch checklist
- [ ] Mainnet address in README, footer shows it, visible on scan.botchain.ai
- [ ] Live URL works on mobile and desktop
- [ ] At least a few real listings
- [ ] Demo clip: list, checks pass, star from the second wallet
- [ ] X post tagging @BOTChain_ai
- [x] Official BOT Chain logo in place (`components/ui/bot-chain-logo.tsx`)
