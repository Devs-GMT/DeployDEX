# DeployDex

The public showcase of BOT Chain dApps. List your project with its contract, live link and GitHub repo, and let the community browse and ⭐ star the best ones. Hosted by Kit, our orange tabby cat.

> Ship it. List it. Get starred.

## How it works (plain English)
1. A smart contract (`contracts/DeployDex.sol`) stores every listing on BOT Chain.
2. The website reads that contract. You don't need a wallet to browse.
3. To list or star, connect MetaMask. The site switches you to BOT Chain.
4. A listing must point to a real deployed contract. The contract itself rejects wallets and random addresses.

**Testnet registry (968):** `0x3b3ABC68c8Af9C769612f13E03EBfb9091Cb735A`
**Mainnet registry (677):** _not deployed yet_ — set in `apps/web/.env.local`, shown in the site footer.

## Project layout
| Path | What |
|---|---|
| `contracts/DeployDex.sol` | The registry (Solidity ^0.8.20, deployed with Remix) |
| `apps/web` | Next.js 16 + TypeScript + Tailwind v4 + wagmi/viem site |
| `docs/` | PRD, architecture, deploy notes |
| `CLAUDE.md`, `DESIGN.md` | Rules for coding agents and the design system |

## Run locally
```bash
npm install
cp apps/web/.env.example apps/web/.env.local   # then fill in the registry address
npm run dev
```
`npm run check` runs typecheck + lint + build.

## Deploy the contract (Remix)
1. Open `contracts/DeployDex.sol` in [Remix](https://remix.ethereum.org), compile with 0.8.20+.
2. Add BOT Chain testnet to MetaMask (chain ID 968, RPC `https://rpc.bohr.life`) and deploy. Follow `contracts/test-notes.md`.
3. Repeat on mainnet (chain ID 677, RPC `https://rpc.botchain.ai`).
4. Put the addresses in `NEXT_PUBLIC_REGISTRY_TESTNET` / `NEXT_PUBLIC_REGISTRY_MAINNET`, and set `NEXT_PUBLIC_CHAIN=mainnet` for production.

The registry checks `target.code.length` on the chain it lives on, so deploy a registry per network.

## Deploy the site (Vercel)
Import the repo, set root directory `apps/web`, add the env vars from `.env.example` (`GITHUB_TOKEN` is optional and server-only; set `NEXT_PUBLIC_SITE_URL` to the production URL), then add your custom domain.

## Status
Built: contract, web3 wiring, directory, project page, list/edit form with live checks, star/unstar, My dApps with delist, Trust report (verified source, deployer, owner, repo claim), listing guidelines, on-chain stats, 9-section home, certificate footer, Kit HD poses and per-category Kit art.
Next: two-wallet test on testnet, mainnet deploy, seed listings. Step-by-step in `docs/DEPLOY.md`.
