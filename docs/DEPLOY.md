# Deploy guide

## 0. Current state
- Testnet registry (chain 968): `0x5863636C9308E1318ef4F159bD5019c67C2F6b83` (set in `apps/web/.env.local`), redeployed with `delist()`. The old one, `0x3b3ABC68c8Af9C769612f13E03EBfb9091Cb735A`, is retired.
- Mainnet registry (chain 677): `0xCeA0C0db0F86d75CeE6e8d70e2b20488Fa5cD884`, curator `0x15621E6FdaB1f6f3f6FDa6284aF93ca6815c7E6a`. Production runs on it (`NEXT_PUBLIC_CHAIN=mainnet`). Starts empty: list each dApp again with its **mainnet** contract address.

## 0.1 Redeploy the testnet registry (delist upgrade)
A contract can't be upgraded in place, so the new registry starts empty and the old listings are listed again.
1. Remix: compile `contracts/DeployDex.sol` (0.8.20+), MetaMask on testnet 968, deploy. The deployer is the curator.
2. Put the new address in `apps/web/.env.local` (`NEXT_PUBLIC_REGISTRY_TESTNET`) and on Vercel, then update section 0.
3. Seed from the original lister wallet `0x15621E6FdaB1f6f3f6FDa6284aF93ca6815c7E6a` through `/list` (stars don't carry over):

| Name | Contract | Category | Tagline | Live URL | Repo | Logo |
|---|---|---|---|---|---|---|
| Velora | `0xcaE9f3569486094b86Fc8b85024050B58815ddFe` | AI | Safely authorize AI agents through programmable blockchain policies. | https://velora-policies.my.id/ | bayuapriansyah/velora | https://github.com/bayuapriansyah/velora/raw/main/public/velora.png |
| Asetra | `0x1893bd849B656fE9eBFf8392340C30FE04268C37` | RWA | Real-world assets, made programmable. | https://www.asetra-rwa.my.id | bayuapriansyah/Asetra | https://www.asetra-rwa.my.id/Asetra.png |
| ChefBOT | `0x939878F4aA5564B91aFa1e8758A100F14AAbcB85` | Fun & Lifestyle | Pick. Cook. Stamp on-chain. | https://chef-bot.my.id | Devs-GMT/ChefBOT | https://github.com/Devs-GMT/ChefBOT/raw/main/app/icon.svg |

4. Run point 10 of `contracts/test-notes.md` (delist with wallet A, star blocked, contract can be listed again), then star from wallet B so `/stats` has a Chain log entry.
5. When testnet passes, go to section 2. Mainnet needs each dApp's **mainnet** contract address: `list()` checks the code exists on the registry's own chain, so the testnet addresses above won't list there.

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
5. Contact email, docs and faucet links live in `src/lib/config.ts` (`CONTACT_EMAIL`, `BOT_CHAIN_DOCS`, `BOT_CHAIN_FAUCET`).

## 5. Launch checklist
- [ ] Mainnet address in README, footer shows it, visible on scan.botchain.ai
- [ ] Live URL works on mobile and desktop
- [ ] At least a few real listings
- [ ] Demo clip: list, checks pass, star from the second wallet
- [ ] X post tagging @BOTChain_ai
- [x] Official BOT Chain logo in place (`components/ui/bot-chain-logo.tsx`)
