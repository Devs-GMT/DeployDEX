DeployDex — PRD (MVP)

One-liner: The public showcase of BOT Chain dApps — list your project with its contract, live link and GitHub repo, and let the community browse and ⭐ star the best ones. Hosted by Kit, our orange tabby cat.

Category: Community · Productivity · Feasibility: 🟢 Easy · Target build time: ~4.5 hours · Build Week: 1

1. Must-haves (definition of done)

[ ] MetaMask wallet connect — Connect button, short address shown, auto-switch/add BOT Chain mainnet (chain ID 677)
[ ] 1 core feature works — List a dApp (with a real BOT Chain contract) → it appears in the directory → another wallet stars it → star count updates from the contract
[ ] GitHub connection — project pages show live public repo info (section 3)
[ ] Mascot Kit in hero, empty states, success moments and footer (section 2)
[ ] Home page with 5+ sections — 9 sections, see section 8
[ ] Mainnet deployment — Contract on BOT Chain mainnet, address in README + footer, visible on scan.botchain.ai
[ ] Live website — Public URL (GitHub Pages + custom domain), works on mobile and desktop
[ ] BOT Chain footer — Clickable BOT Chain logo → botchain.ai + View on explorer → mainnet contract (section 11)

2. Meet Kit — the DeployDex cat 🐱

Who: Kit is a chubby orange tabby cat with a white chest, big round eyes, tiny pink nose, one slightly bent ear and a curly tail. Kit loves shipping things and knocking bugs off tables. Catchphrase: "Ship it. List it. Get starred."

Style: soft 3D / clay-toy render (or clean vector illustration), warm studio lighting, orange #FF5C00 tones that match the brand — friendly and a little cheeky. Your own original character (not based on any existing mascot).

Costumes (one per use, same cat):

Dev Kit — hoodie + laptop (hero, "List your dApp")
Hackathon Kit — headband + energy drink (Hackathon category)
Astro Kit — tiny helmet + jetpack, used as the flying cats floating between sections
Inspector Kit — magnifying glass (verification checks, "checking your contract…")
Curator Kit — beret + clipboard (directory / featured)
Napping Kit — curled up asleep (empty states)
Party Kit — party hat + confetti (listing success, first star)

Where Kit appears: hero (three Kits on the sky), flying Astro Kits as section dividers, verification loader (Inspector Kit), success toast (Party Kit), empty states (Napping Kit: "No dApps here yet — be the first!"), 404 (Kit peeking from a cardboard box: "This dApp ran off."), closing CTA (5 costumes in a row), footer (Kit holding the certificate).

Make it: model/draw once (Spline/Blender or vector), export 7 transparent WebP poses (< 150 KB each). Light CSS motion only: gentle float, tail wag on hover; respect reduced motion.

3. User flow

Step 1 · Browse (no wallet needed) — directory grid of project cards; search box; category chips All · AI · RWA · Community · Productivity · Fun & Lifestyle · Dev tools · Hackathon; sort Most starred · Newest · Recently updated.
Step 2 · Project card — logo, name, tagline, category chip, ⭐ count, badges (✓ Contract on BOT Chain · ✓ GitHub repo), buttons [Open app ↗] [⭐ Star].
Step 3 · Project page (?p=12) — big header (logo, name, tagline, category, ⭐), links (Live app ↗, GitHub ↗, Explorer ↗), contract address (copy), GitHub panel (repo description, main language, ★ GitHub stars, last commit date, open issues, README preview of the first ~20 lines), on-chain info (listed by 0xAB…, listed on date).
Step 4 · List your dApp — [List your dApp] → form: name, tagline (≤ 80 chars), category, contract address, live URL, GitHub repo (owner/repo or URL), logo image URL (optional) → live checks with Inspector Kit:
✓ Address is a deployed contract on BOT Chain mainnet (or testnet toggle)
✓ Not already listed
✓ GitHub repo exists and is public (shows its name + description)
✓ Live URL starts with https://
→ [List on BOT Chain] → MetaMask → Party Kit success: "Your dApp is live in the Dex!" + [Share on X]
Step 5 · Star — [⭐ Star] → MetaMask → count +1; [Unstar] available.
Step 6 · My dApps — projects you listed (edit links/tagline/logo; the contract address can't change) + projects you starred.

4. Core logic

Real contracts only: before submitting, the frontend calls getCode(address) on BOT Chain; the contract also enforces addr.code.length > 0, so wallets/random addresses can't be listed.
One listing per contract address (first come); the lister can update name, tagline, links, logo and category later, never the contract address.
Stars: one per wallet per project; unstar allowed; listers can't star their own project.
GitHub: browser calls the public GitHub REST API (/repos/{owner}/{repo}, /repos/{owner}/{repo}/readme) — no key, 60 requests/hour per visitor; cache results in the browser for 1 hour; if rate-limited, show the saved repo link only.
Optional "✓ Owner" badge: if the contract has an owner() function that returns the lister's wallet, show "✓ Listed by the contract owner" (read-only check from the frontend).
Spam: the curator (deployer) can hide a listing (hidden projects disappear from the directory but stay on-chain); anyone can [Report] (UI only, emails/links to the curator).

5. Smart contract (Solidity ^0.8.20)

enum Category { AI, RWA, Community, Productivity, FunLifestyle, DevTools, Hackathon, Other }
struct Project { address lister; address target; string name; string tagline; Category category; string liveUrl; string repo; string logoUrl; uint32 stars; bool hidden; uint64 listedAt; uint64 updatedAt; }
Project[] public projects; mapping(address => uint256) public idOfTarget; mapping(uint256 => mapping(address => bool)) public starred; mapping(address => uint256[]) listedBy; address public curator;
function list(address target, string name, string tagline, Category category, string liveUrl, string repo, string logoUrl) external returns (uint256 id) — requires target.code.length > 0, not already listed, length caps
function update(uint256 id, string name, string tagline, Category category, string liveUrl, string repo, string logoUrl) external — lister only
function star(uint256 id) external · function unstar(uint256 id) external — once per wallet, not the lister
function setHidden(uint256 id, bool hidden) external — curator only
Views: getProject(id), getProjects(from, count), listedOf(addr), isStarred(id, addr), total()
Events: Listed(id, lister, target, category), Updated(id), Starred(id, by, stars), Unstarred(id, by, stars), Hidden(id, hidden)
No tokens, payments. Note: code.length checks the chain the registry is deployed on — deploy the registry on mainnet for mainnet dApps.

6. Tech stack

Single index.html + /kit mascot images + ethers.js v6 (CDN) — no backend, no database; GitHub public API from the browser
Remix → testnet first (chain ID 968, RPC https://rpc.bohr.life, scan.bohr.life) → mainnet (chain ID 677, RPC https://rpc.botchain.ai, scan.botchain.ai)
Hosting: GitHub Pages + custom domain
Seed it: list your own deployed hackathon projects first so the directory isn't empty for judges

7. UI direction (based on the Corgi reference)

Mood: playful-but-premium startup site — soft cloud sky, warm orange, a cute mascot in costumes, tidy cards and forms
Colours: page #F6F6F6, cards #FFFFFF, soft panels #F9F9F9, borders #E1E1E1, text #191919, primary orange #FF5C00 (hover #CC4A00), peach chips #FFDECC, pink accent #FF405D on #FFE9EC ("New" tags), secondary button black #191919
Type: body Geist (free), headings in a geometric grotesk / mono-flavoured display (e.g. "Space Grotesk" or "Geist Mono" for small labels) at weight 500; hero 36–56px
Buttons: 16px-radius rounded rectangles — primary orange with white text (List your dApp), secondary black (Browse dApps), tertiary text link (Log in → Connect wallet)
Top banner: slim dismissible bar "Introducing DeployDex — the home of BOT Chain dApps →"
Header: logo left; mega-menus: Explore ⌄ (by category) · Builders ⌄ (List your dApp, My dApps, Guidelines) · About; right: [Connect wallet] text link, black [Browse dApps], orange [List your dApp]
Cards: white, 16px radius, 1px #E1E1E1 border, logo top-left, orange ⭐ count top-right, peach category chip
Illustrations: cloud-sky hero, flying Astro Kits, document/certificate illustrations, a cursor labelled "Important dApp, Probably" (playful nod to the reference's humour)
Your own brand, mascot and art — not Corgi's logo, dog mascot or images

8. Home page (9 sections, based on the Corgi reference)

Section 1 · Hero — cloud-sky background, three Kits (Dev, Hackathon, Astro) floating, headline "The home of BOT Chain dApps.", subtext "List your project in a minute. Get discovered. Get starred." + "Built for builders, by builders.", orange CTA [List your dApp] + black [Browse dApps]; under it a logo marquee of listed projects scrolling in two rows (read from the contract)
Section 2 · Intro statement — dark rounded panel with one big mono-flavoured line: "DeployDex is an on-chain directory where every listing points to a real BOT Chain contract." + two certificate/document illustrations + [List your dApp]
Section 3 · Explore by category — "A showcase for every kind of build" + cards with a Kit costume and live counts: AI · RWA · Community · Productivity · Fun & Lifestyle · Dev tools · Hackathon — each card [Browse →]
Section 4 · Why DeployDex (like "Our Unique Advantage") — comparison: The old way (scattered tweets → spreadsheets → dead links → "is this even deployed?") vs DeployDex (one on-chain registry → ✓ real contract check → ✓ GitHub linked → ⭐ community stars), with a glowing tunnel/portal graphic and a row of project logos
Section 5 · List in a minute or just browse — mock form card ("Project details": name, contract, repo, category with Back/Next) beside Inspector Kit checking a contract; the cursor tag "Important dApp, Probably"; two paths: List it "Fill 6 fields, we check the contract, you're live." · Browse it "Filter by category, open the app, star what you love."
Section 6 · Most starred this week (instead of testimonials) — looping carousel of top projects from the contract: logo, name, tagline, ⭐ count, lister short address, [Open ↗] — real data only
Section 7 · Fresh deploys — grid of the 8 newest listings with "New" pink tags + [See all →]; Astro Kits flying around the edges
Section 8 · FAQ — "Is it free to list?" (only gas) · "Why does it need a contract address?" · "Can I edit my listing?" · "Can I list a testnet project?" · "How do stars work?" · "Who can hide a listing?" · "Is this official?" (community project) — + "Get in touch" link
Section 9 · Closing CTA — "Ship it. List it. Get starred." + line "Move fast, deploy on BOT Chain, get discovered." + orange [List your dApp] + black [Browse dApps]; below, five Kits in costumes in a row (Dev, Hackathon, Curator, Astro, Party)
Then the footer (section 11).

9. States to handle

No MetaMask → "Install MetaMask" (browsing works); wrong network → "Switch to BOT Chain"
Not connected → browsing works; List / Star ask to connect
Form checks: not a contract ("This address has no contract on BOT Chain") · already listed (link to the existing listing) · repo not found / private · bad URL · too-long tagline
GitHub rate limit (403) → show cached info or just the repo link: "GitHub is taking a nap — try again soon" (Napping Kit)
Starring your own project → button hidden ("Your project")
Already starred → [Unstar]
Broken logo URL → fallback avatar with the project's initial
Tx pending (Inspector Kit) / rejected / failed → message + retry
Empty category → Napping Kit "No dApps here yet — be the first!"; unknown ?p= → Kit in a box "This dApp ran off."

10. Out of scope (MVP)

Reviews/comments, paid featured spots, analytics/TVL, automatic GitHub OAuth verification, contract source verification, multi-chain listings, deleting listings, tokens/NFTs, backend database.

11. Footer (required — creative version)

Concept: a "Certificate of Deployment" (a nod to the reference's Certificate of Insurance), held up by Kit.

Above the link columns: a white certificate card with an orange border stripe and a small seal, slightly tilted, with Curator Kit peeking over the top edge holding it:
Title "Certificate of Deployment"
Network: the BOT Chain logo + "BOT Chain" — clickable → https://botchain.ai (new tab)
Chain ID: 677 · Registry contract: 0x12ab…9f3c (mono, copy)
dApps listed: live count from the contract
Orange button [View on explorer ↗] → https://scan.botchain.ai/address/<MAINNET_CONTRACT_ADDRESS> (new tab)
Hover: certificate straightens and Kit's tail wags
Link columns (like the reference): Explore (All dApps · Categories · Most starred · Fresh deploys) · Builders (List your dApp · My dApps · Listing guidelines · GitHub) · Resources (BOT Chain docs · Explorer · Faucet · FAQ) · Company (About · Contact · X)
Bottom row: legal links (Privacy · Terms) + small disclosure: "DeployDex is a community directory. Listings are submitted by builders — always do your own research before using a dApp."
Contract address in one config constant; on mobile the certificate is full-width above stacked columns

12. Build plan (~4.5h)

0:00–0:40 — Contract (list with code-length check, update, star/unstar, hide, views) in Remix; test on testnet with 2 wallets + a test contract
0:40–1:25 — Make Kit: 7 costume poses as transparent WebP
1:25–3:00 — Frontend: directory (search, filters, sort), project cards + page with GitHub panel (+ cache), list form with live checks, star/unstar, My dApps, states
3:00–3:45 — 9-section home page (logo marquee, categories, comparison, carousels) + certificate footer
3:45–4:10 — Mainnet deploy, address constant, GitHub Pages + domain; list your own deployed projects as seed data
4:10–4:30 — README, demo clip (list → checks pass → star from 2nd wallet), X post tagging @BOTChain_ai

13. Submission checklist

[ ] Mainnet contract address
[ ] Live website link (seeded with real listings)
[ ] GitHub repo with DeployDex.sol + /kit images + plain-English README
[ ] X post with demo clip featuring Kit, tagging @BOTChain_ai
