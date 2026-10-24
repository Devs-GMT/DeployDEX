# Architecture

- **Registry contract** (`contracts/DeployDex.sol`) is the only database. Reads go straight to BOT Chain RPC via viem (public, no wallet needed). Writes go through MetaMask via wagmi.
- **Chains**: mainnet 677 (rpc.botchain.ai, scan.botchain.ai), testnet 968 (rpc.bohr.life, scan.bohr.life). Selected by `NEXT_PUBLIC_CHAIN`; addresses in `src/lib/config.ts`.
- **GitHub**: browser calls `/api/github/[owner]/[repo]`, a route handler that fetches repo info + README, uses optional `GITHUB_TOKEN`, caches 1h. On 403/rate-limit the UI shows the saved repo link only.
- **Validation**: client checks `getCode(address)`, duplicate via `idOfTarget`, repo exists, https URL. Contract re-enforces code length and uniqueness.
- **States**: no MetaMask, wrong network, tx pending/rejected/failed, empty category, unknown id, broken logo (initial avatar).
