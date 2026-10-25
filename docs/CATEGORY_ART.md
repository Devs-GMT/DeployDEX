# Category art: Kit in a costume per category

Each category gets its own Kit render, used on dApp card covers, the home category cards, the
filter chips on /dapps, the category picker in /list, the Explore menu and the featured dApp.
Until a render exists the site shows the closest existing pose (`CATEGORY_ART[slug].kit` in
`apps/web/src/lib/categories.ts`), so nothing breaks while the set is in progress.

## Steps

1. Generate each image with the prompts below. **Attach an existing Kit render as the style
   reference** (e.g. `apps/web/public/kit/dev.webp`, ideally also `curator.webp`) so the face,
   fur, stripes and lighting match. In Midjourney use it as `--cref` and `--sref`; in ChatGPT /
   other tools upload it and say "same character, same 3D style as the reference".
2. Remove the background if the tool can't export transparency (any background remover works).
3. Save as `apps/web/art-src/category/<slug>.png`. Slugs: `ai`, `rwa`, `community`,
   `productivity`, `fun-lifestyle`, `dev-tools`, `hackathon` (optional), `other` (optional).
4. From `apps/web`: `node scripts/category-art.mjs`. It trims, centres, builds the 1024/512/256
   webp files in `public/category/` and switches those categories over automatically.
5. Check `/dapps`, the home page and `/list`, then commit `public/category/*` and
   `src/lib/category-art-ready.ts` (the raw PNGs are git-ignored).

## Spec

- Square, at least 1024 × 1024, **transparent background**, PNG.
- One Kit, full body, **sitting**, centred, filling about 80% of the frame, nothing cropped.
- Kit faces slightly **toward the left** (the art sits on the right side of card covers).
- No text, no logos, no real brands, no extra characters unless the prompt asks.
- Props are small and readable at 120px: one or two, held close to the body.

## Style anchor (paste at the start of every prompt)

> Cute chibi orange tabby kitten mascot named Kit, 3D render, soft clay / vinyl toy look, big
> glossy brown eyes, pink blush cheeks, cream belly, muzzle and paws with pink toe pads, darker
> orange tabby stripes, fluffy tail curled to the side. Sitting, full body, centred, body turned
> slightly to the left, friendly happy expression. Soft studio lighting, gentle rim light,
> subtle contact shadow, isolated on a transparent background. Same character and style as the
> reference image. No text.

## Prompts per category

| Slug | Costume and props (append to the style anchor) |
|---|---|
| `ai` | Kit wears a small headset with a glowing orange LED; beside it sits a tiny friendly round robot buddy with a screen face; a few soft glowing sparkle particles float around. |
| `rwa` | Kit wears a little gold-rimmed monocle and a tiny bow tie; it hugs a small toy house with an orange roof, and a shiny gold coin with an embossed star leans against its paw. |
| `community` | Kit wears a cosy hoodie and holds a small orange megaphone up happily; two tiny speech bubbles (blank, no text) and small hearts float beside it. |
| `productivity` | Kit wears round glasses and holds a small clipboard checklist with three green ticks; a tiny round alarm clock sits next to it. |
| `fun-lifestyle` | Kit wears a backwards cap and holds a chunky game controller, tongue slightly out in concentration; a small paint palette with bright blobs rests beside it. |
| `dev-tools` | Kit wears a tool belt and a small safety visor pushed up on its head; it holds a little wrench, and a tiny terminal window with a blinking cursor (no text) floats beside it. |
| `hackathon` (optional) | Kit wears a red headband and holds an energy drink can, a small laptop with stickers open beside it, a little stopwatch on the floor. (The existing pose already covers this.) |
| `other` (optional) | Kit peeks out of an open cardboard box with a small question-mark balloon tied to it. |

## Tips

- Generate 3–4 options per category and pick the one whose face is closest to the reference.
- Keep the same tool and settings for the whole set so they look like one family.
- If a prop comes out too large or detailed, ask for "smaller, simpler prop, fewer details".
