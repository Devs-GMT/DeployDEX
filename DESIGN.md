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
- Cards: white, 16px radius, 1px border. Logo top-left, orange star count top-right, peach category chip.
- Top banner: slim, dismissible. Header: logo, mega-menus (Explore, Builders, About), right actions.
- Dark rounded panel for the intro statement.

## Kit (mascot)
Chubby orange tabby, white chest, round eyes, pink nose, one slightly bent ear, curly tail. Catchphrase: "Ship it. List it. Get starred."
Poses: dev (hero, list CTA) · hackathon · astro (dividers, flying) · inspector (checks, loading) · curator (directory, footer) · napping (empty states) · party (success).
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
- **Painterly sky** hero (`<PainterlySky>`) and a painted countryside under the footer (`<Landscape>`).
- **Cursor tag** ("Important dApp, Probably") on form mockups, orange/gray frames around mock forms.
- **Tunnel graphic** + pink pill flow for the old-way vs DeployDex comparison.
- **Draggable carousel** for most-starred (real data only, empty state otherwise).
- Logo strip under the hero shows real listed projects; before any exist it shows value-prop wordmarks, never fake customers.
