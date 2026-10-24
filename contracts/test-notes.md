# Manual Remix test script (testnet 968, two wallets A and B)
1. Deploy `DeployDex.sol`. Deploy any small contract (e.g. a Storage contract) as `TARGET`.
2. A: `list(TARGET, "Demo", "Short tagline", 6, "https://example.com", "owner/repo", "")` -> ok, `total()` = 1.
3. A: `list(<A's own wallet address>, ...)` -> reverts `NotAContract`.
4. A: list `TARGET` again -> reverts `AlreadyListed(0)`.
5. A: `star(0)` -> reverts `SelfStar`. B: `star(0)` -> ok, stars = 1. B: `star(0)` again -> `AlreadyStarred`.
6. B: `update(0, ...)` -> `NotLister`. A: `update(0, ...)` -> ok.
7. B: `unstar(0)` -> stars = 0. B: `unstar(0)` again -> `NotStarred`.
8. B: `setHidden(0, true)` -> `NotCurator`. Deployer: ok, `getProject(0).hidden` = true.
9. Tagline of 81 chars -> `TooLong`. Empty name -> `EmptyName`.
