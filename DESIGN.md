# DeployDex design system

Mood: playful-but-premium startup site. Soft cloud sky, warm orange, a cute mascot in costumes, tidy cards. Own brand and art; no copying of the reference site's logo, mascot or images.

## Tokens
| Token | Value |
|---|---|
| page | #F6F6F6 |
| card | #FFFFFF |
| panel | #F9F9F9 |
| border | #E1E1E1 |
| text | #191919 |
| primary | #FF5C00 (hover #CC4A00) |
| peach chip | #FFDECC |
| pink accent | #FF405D on #FFE9EC ("New") |
| secondary button | #191919 |
Contrast: orange text on white is for large/bold only; use white on orange for buttons.

## Type
Body Geist. Headings Space Grotesk, weight 500. Small labels Geist Mono. Hero 36–56px, fluid via clamp.

## Components
- Buttons: 16px radius. Primary orange/white, secondary black, tertiary text link.
- Brand mark: Kit's head shaped as a "D" on a brand-orange tile (`components/ui/logo.tsx`, same art as `app/icon.svg` favicon). Header and footer lockups use it beside the "DeployDex" wordmark.
- Cards: white, 16px radius, 1px border. Logo top-left, orange star count top-right, peach category chip.
- dApp card cover (1.91:1, the og:image shape): the project's own share image (og:image/twitter:image of its live site, else a custom GitHub social preview) via `/api/preview`, with the logo as a small corner badge; otherwise the category's soft tint, the dot grid and the logo large in the middle (app-store tile). No gradients or wordmarks. `components/dapps/dapp-cover.tsx`.
- Top banner: slim, dismissible. Header: logo, mega-menus (Explore, Builders, About), right actions.
- Dark rounded panel for the intro statement.

## Kit (mascot)
Chubby orange tabby, white chest, round eyes, pink nose, one slightly bent ear, curly tail. Catchphrase: "Ship it. List it. Get starred."
Poses: dev (hero, list CTA) · hackathon · astro (dividers, flying) · inspector (checks, loading) · curator (directory, footer) · napping (empty states, footer wordmark) · party (success).
Motion: gentle float, tail wag on hover. Nothing else. Disabled under reduced motion.

## Layout
Max width 1200px, 16px mobile gutter, sections spaced 96px desktop / 64px mobile. Mobile first; certificate footer is full width on mobile.

## Copy voice
Friendly, a little cheeky, short sentences. Error messages say what to do next.

## Reference-led direction (docs/corgi ui)
Structure learned from the reference screenshots. We reuse the layout ideas, never their art, text or logo.
- **Blueprint frame**: visible hairline rails left/right of a 1200px column, a hairline above every section (`<Section>` in `components/ui/frame.tsx`).
- **Headlines**: tight tracking (-0.04em), one emphasised word in orange serif italic (`<Em>`, Instrument Serif).
- **3D buttons**: 4px darker bottom edge that presses in on `:active` (`buttonClasses`). Primary orange, secondary black, `light` on dark.
- **Charcoal sections** (`#333`, not black): "unique advantage" and the closing CTA.
- **Halftone art**: orange dot-screen icons per category (`<Halftone shape>`), used on category and dApp cards.
- **Painterly sky** hero (`<PainterlySky>`). The footer ends in an edge-to-edge DEPLOYDEX wordmark filled with the orange dot screen, cut off by the page bottom, with Napping Kit asleep on the letters.
- **Cursor tag** ("Important dApp, Probably") on form mockups, orange/gray frames around mock forms.
- **Tunnel graphic** + pink pill flow for the old-way vs DeployDex comparison.
- **Draggable carousel** for most-starred (real data only, empty state otherwise).
- Logo strip under the hero shows real listed projects; before any exist it shows value-prop wordmarks, never fake customers.

## Motion (GSAP + ScrollTrigger, native scroll)
Story: "Kit's launch day". Kit launches from the hero, inspects contracts on the way down, and lands on the certificate in the footer.

| Where | What |
|---|---|
| Global | Native scroll (CSS smooth anchors, no scroll library), orange scroll-progress bar (CSS scroll-driven), `.reveal` rise-in and `[data-split]` word reveals (IntersectionObserver + CSS) |
| Hero | On load only: Kit flies a curved path with a contrail and hovers top right, copy and Kit trio rise in. No scroll-linked work; the painted sky is still (its SVG filter is painted once). Logo strip speed follows scroll velocity |
| Intro | Statement lights up word by word; documents fan out |
| Categories | Cards fade up once (`.reveal`), pointer tilt with depth layers, counts count up |
| Why | Pinned: old way falls apart into a 404, tiles stream into Kit's portal |
| List it | Pinned: form types itself, Inspector Kit ticks the checks, cursor lands on Next |
| Most starred | Vertical scroll moves the row sideways (desktop, only when it overflows) |
| Closing | Kits fly into formation, confetti burst; magnetic primary CTAs |
| Footer | VERIFIED seal slams onto the certificate; wordmark letters rise and their dots print in as the page bottoms out |
| App pages | Calm: card tilt, star burst on a successful star. No pinning. |

Rules
- Pinning and scrubbed scenes only at `MQ_FULL` (≥1024px, motion allowed). Smaller screens get simple one-shot reveals. Reduced motion: nothing moves, all content is in its final state.
- The static markup is always the finished state. Animations use `from` toward it, so no-JS still reads correctly.
- Animate transform and opacity only.
- Kit idle life (blink, ear, tail, flames, breathing) is CSS on named SVG groups, offset per instance.
- `NEXT_PUBLIC_KIT_RASTER=1` swaps the SVG Kit for `/public/kit/<pose>.webp` renders (same pose names).
