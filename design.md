# Homepage theming guidelines

Last updated: 8 August 2026

This documents the visual language applied to the homepage (`app/page.tsx` and the `.home-page`-scoped block in `app/globals.css`, between the `/* Luminous homepage */` and `/* Clearer lesson navigation */` comments). It replaced an earlier dark, glowing gradient theme that read as generic AI-SaaS design ("vibe coded"). Use this file as the exact reference when the same treatment is applied to `/profile` and the course/lesson pages later — copy the values, don't reinvent them.

## The core idea

Flat, high-contrast colour blocks with hard black-ink borders and offset shadows, in the spirit of retro 8-bit game UI (the reference point was codedex.io: flat pixel design mixed with pixel art). No smooth colour gradients as a decorative device, no blurred glows, no soft rounded pills. Genuine pixel-art iconography (hand-authored inline SVG) instead of Unicode glyphs or smooth vector icons.

## Colour palette

Defined as custom properties on `.home-page`:

| Token | Value | Use |
|---|---|---|
| `--home-bg` | `#f6f7fb` | Page background |
| ink (no token, literal) | `#0b1130` | Primary text, borders, dark button fills |
| dark navy alt | `#0c1231` | Alternate dark fill (e.g. `.button-primary`) |
| `--home-line` | `rgba(11, 17, 32, .08)` | Hairline dividers |
| `--home-muted` | `#5c6478` | Body/paragraph copy |
| muted tier 2 | `#7d8499` | Secondary labels |
| muted tier 3 | `#8991aa` | Tertiary labels, small print |
| muted tier 4 | `#98a0b3` | Faintest labels |
| heading dark | `#151a33` / `#232a45` | Emphasised numbers/headings inside cards |
| `--home-blue` | `#3561dc` | Accent 1 (links, primary tint) |
| `--home-violet` | `#6258e9` | Accent 2 (primary brand accent, "properly", progress fill) |
| `--home-pink` | `#c2469e` | Accent 3 (secondary flourish) |
| `--home-cyan` | `#1f9db8` | Accent 4 (rarely used) |
| success green | `#1f9d6e` / `#178a53` | Completed states |

Card/panel surfaces are white (`#ffffff`) or the page background, never a gradient wash.

## Borders, shadows, radius

Every interactive or card-like element uses the same formula: a solid ink border, a small radius, and a **hard offset shadow with zero blur** — `Npx Npx 0 <colour>`, never a soft/blurred `box-shadow`.

```css
/* Card (e.g. proof-stats, chapter-card) */
border: 2px solid #0b1130;
border-radius: 6px;
background: #ffffff;
box-shadow: 4px 4px 0 #0b1130;

/* Larger showcase element (workflow-console) */
border: 2px solid #0b1130;
border-radius: 8px;
box-shadow: 7px 7px 0 #0b1130;

/* Small pill/button */
border: 2px solid #0b1130;
border-radius: 5px;
box-shadow: 3px 3px 0 #0b1130; /* or an accent colour instead of ink */
```

Border-radius stays small everywhere (4–8px) — nothing pill-shaped, nothing softly rounded. Sharp and blocky over smooth.

### Pressed-button interaction

Buttons "press in" on interaction: the shadow shrinks and the element nudges toward it, like a physical button.

```css
.button {
  transition: transform .1s ease, box-shadow .1s ease;
}
.button:hover, .button:focus-visible {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--home-violet); /* was 5px 5px 0 */
}
.button:active {
  transform: translate(5px, 5px);
  box-shadow: 0 0 0 var(--home-violet); /* fully collapsed */
}
```

## No gradients — with one exception

Do not use `linear-gradient`/`radial-gradient` as a decorative colour wash: no gradient button fills, no gradient blobs/glows, no `background-clip: text` gradient text. Replace with a flat single colour.

The one sanctioned use of the `gradient()` function is a **hairline grid texture**, used to replace the old blurred glow blobs (`.hero-ambient`, `.home-final` background):

```css
background-color: rgba(98, 88, 233, .05); /* faint accent tint */
background-image:
  linear-gradient(rgba(11, 17, 32, .07) 1px, transparent 1px),
  linear-gradient(90deg, rgba(11, 17, 32, .07) 1px, transparent 1px);
background-size: 16px 16px;
```

This is a technical pattern (thin grid lines), not a colour-to-colour wash, so it doesn't read as generic. A functional loading-skeleton shimmer (`.home-progress-loading`, `.auth-loading`) is also left alone — that's a universal UX convention, not decorative gradient styling, so it's exempt.

## Pixel-art icons

Hand-authored inline SVG components in `app/page.tsx` (`PixelArrow`, `PixelSpark`, `PixelCheck`, `PixelMascot`), built as a grid of `<rect>` elements on a small `viewBox` (7×7 to 8×9), rendered with `shapeRendering="crispEdges"` so they stay blocky rather than antialiased:

```tsx
function PixelArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-arrow ${className}`.trim()}
      viewBox="0 0 8 8" width="11" height="11"
      fill="currentColor" aria-hidden="true" focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="1" width="1" height="1" />
      {/* ...more rects... */}
    </svg>
  );
}
```

`fill="currentColor"` lets the icon inherit the surrounding text colour; multi-tone sprites (like `PixelMascot`) set explicit `fill` per `<rect>` instead. Reuse the same component everywhere the same shape is needed rather than drawing one-off icons. Decorative sparks use a shared `.corner-spark` positioning class placed inside a `position: relative` container's padding area (never overlapping text) — see `.proof-section`, `.home-final`, `.home-footer` in `globals.css`.

Do not fetch external binary assets automatically. If richer sprite/animation packs are wanted later, [Kenney.nl](https://kenney.nl) is CC0/public domain, free, and needs no attribution — a good source to hand-pick from deliberately rather than something to wire up unprompted.

## Animation

Retro pixel animation reads as *stepped*, not smoothly eased — use the `steps()` timing function, not `ease`/`ease-in-out`, for any looping decorative animation:

```css
@keyframes home-spark-twinkle { 50% { opacity: .4; transform: scale(.75); } }

@media (prefers-reduced-motion: no-preference) {
  .pixel-spark { animation: home-spark-twinkle 1.4s steps(2) infinite; }
}
```

Always gate looping animation behind `@media (prefers-reduced-motion: no-preference)`.

## Copy rules (homepage)

No hyphens, en dashes or em dashes anywhere in visible homepage text (including `aria-label`/`title` attributes) — rephrase with a comma, "and", or two sentences instead. This does not apply to CSS class names, file paths or code, only to text a reader sees.

## What to avoid (recap)

- Gradient button fills, gradient text (`background-clip: text`), gradient glow blobs.
- Blurred `box-shadow`/`filter: drop-shadow(...)` used decoratively (soft glows).
- Large border-radius / pill-shaped buttons and badges.
- Unicode arrow/decoration glyphs (`→`, `↗`, `✨`, etc.) standing in for iconography — draw a pixel sprite instead.
- Hyphens and dashes in visible copy.

## Rollout

This has only been applied to the homepage. `/profile` and the course/lesson pages currently use a separate, older soft-light theme (see `app/profile/profile.module.css` and the `.course-sidebar`/`.lesson-reading` rules in `globals.css`) and were deliberately left untouched. When extending this pixel-art treatment to them, reuse the palette and border/shadow/icon patterns above rather than introducing new values.
