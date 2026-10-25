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
10. Deploy a second small contract as `TARGET2` and list it as A. B: `delist(1)` -> `NotLister`. A: `delist(1)` -> ok, `delisted(1)` = true, `getProject(1).hidden` = true, `idOfTarget(TARGET2)` = (false, 0). A: `delist(1)` again -> `IsDelisted`. B: `star(1)` -> `IsDelisted`. Deployer: `setHidden(1, false)` -> `IsDelisted`. B: `list(TARGET2, ...)` -> ok (new id).
