# Homepage theming guidelines

Last updated: 8 August 2026

This documents the visual language applied to the homepage (`app/page.tsx` and the `.home-page`-scoped block in `app/globals.css`, between the `/* Luminous homepage */` and `/* Clearer lesson navigation */` comments). It replaced an earlier dark, glowing gradient theme that read as generic AI-SaaS design ("vibe coded"). Use this file as the exact reference when the same treatment is applied to `/profile` and the course/lesson pages later — copy the values, don't reinvent them.

## The core idea

Flat, high-contrast colour blocks with hard black-ink borders and offset shadows, in the spirit of retro 8-bit game UI (the reference point was codedex.io: flat pixel design mixed with pixel art). No smooth colour gradients as a decorative device, no blurred glows, no soft rounded pills. Genuine pixel-art iconography (hand-authored inline SVG) instead of Unicode glyphs or smooth vector icons.

## Colour palette

Defined as custom properties on `.home-page`:

| Token                   | Value                   | Use                                                        |
| ----------------------- | ----------------------- | ---------------------------------------------------------- |
| `--home-bg`             | `#f6f7fb`               | Page background                                            |
| ink (no token, literal) | `#0b1130`               | Primary text, borders, dark button fills                   |
| dark navy alt           | `#0c1231`               | Alternate dark fill (e.g. `.button-primary`)               |
| `--home-line`           | `rgba(11, 17, 32, .08)` | Hairline dividers                                          |
| `--home-muted`          | `#5c6478`               | Body/paragraph copy                                        |
| muted tier 2            | `#7d8499`               | Secondary labels                                           |
| muted tier 3            | `#8991aa`               | Tertiary labels, small print                               |
| muted tier 4            | `#98a0b3`               | Faintest labels                                            |
| heading dark            | `#151a33` / `#232a45`   | Emphasised numbers/headings inside cards                   |
| `--home-blue`           | `#3561dc`               | Accent 1 (links, primary tint)                             |
| `--home-violet`         | `#6258e9`               | Accent 2 (primary brand accent, "properly", progress fill) |
| `--home-pink`           | `#c2469e`               | Accent 3 (secondary flourish)                              |
| `--home-cyan`           | `#1f9db8`               | Accent 4 (rarely used)                                     |
| success green           | `#1f9d6e` / `#178a53`   | Completed states                                           |

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
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}
.button:hover,
.button:focus-visible {
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
background-color: rgba(98, 88, 233, 0.05); /* faint accent tint */
background-image:
  linear-gradient(rgba(11, 17, 32, 0.07) 1px, transparent 1px),
  linear-gradient(90deg, rgba(11, 17, 32, 0.07) 1px, transparent 1px);
background-size: 16px 16px;
```

This is a technical pattern (thin grid lines), not a colour-to-colour wash, so it doesn't read as generic. A functional loading-skeleton shimmer (`.home-progress-loading`, `.auth-loading`) is also left alone — that's a universal UX convention, not decorative gradient styling, so it's exempt.

## Pixel-art icons

Hand-authored inline SVG components in `app/components/PixelIcons.tsx` (`PixelArrow`, `PixelSpark`, `PixelCheck`, `PixelMascot`), built as a grid of `<rect>` elements on a small `viewBox` (7×7 to 8×9), rendered with `shapeRendering="crispEdges"` so they stay blocky rather than antialiased. Import from that shared file rather than redefining an icon locally — it's already used by the homepage, `CourseProgress.tsx` and the profile page. `PixelArrow` points right by default; rotate it with a CSS `transform` (e.g. `rotate(-90deg)` for up, `rotate(180deg)` for left) rather than drawing a new direction:

```tsx
function PixelArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-arrow ${className}`.trim()}
      viewBox="0 0 8 8"
      width="11"
      height="11"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="1" width="1" height="1" />
      {/* ...more rects... */}
    </svg>
  );
}
```

`fill="currentColor"` lets the icon inherit the surrounding text colour; multi-tone sprites (like `PixelMascot`) set explicit `fill` per `<rect>` instead. Reuse the same component everywhere the same shape is needed rather than drawing one-off icons.

Two placements for decorative sparks, depending on how much room the container has:

- **Spacious section** (generous padding, e.g. `.proof-section`, `.home-final`, `.home-footer` in `globals.css`): a `.corner-spark` class sits _inside_ the container's own padding, near a corner but with a positive offset (e.g. `top: 32px; right: 28px`), so it never reaches as far as the actual content.
- **Dense card** (tight padding, e.g. the profile page's `.courseCard`/`.activityCard`/`.next` in `profile.module.css`): perch the spark _outside_ the card's corner instead, with a small negative offset (e.g. `top: -14px; right: -10px`, sized up a little from the icon's default via `width`/`height`, like the profile page's `.cornerSpark`) — the same technique the homepage's `PixelMascot` uses to perch on the workflow console's corner. This guarantees no overlap with card content regardless of how tightly packed the card is.

Both need `position: relative` on the container and `position: absolute` on the spark.

Do not fetch external binary assets automatically. If richer sprite/animation packs are wanted later, [Kenney.nl](https://kenney.nl) is CC0/public domain, free, and needs no attribution — a good source to hand-pick from deliberately rather than something to wire up unprompted.

## Animation

Retro pixel animation reads as _stepped_, not smoothly eased — use the `steps()` timing function, not `ease`/`ease-in-out`, for any looping decorative animation:

```css
@keyframes home-spark-twinkle {
  50% {
    opacity: 0.4;
    transform: scale(0.75);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .pixel-spark {
    animation: home-spark-twinkle 1.4s steps(2) infinite;
  }
}
```

Always gate looping animation behind `@media (prefers-reduced-motion: no-preference)`.

## Copy rules (homepage)

No hyphens, en dashes or em dashes anywhere in visible homepage text (including `aria-label`/`title` attributes) — rephrase with a comma, "and", or two sentences instead. This does not apply to CSS class names, file paths or code, only to text a reader sees.

## Lesson readability

Each lesson paragraph directly inside a lesson section needs a visible gap below it. Use a `19px` bottom margin alongside the existing `1.75` line height, through the shared `.lesson-reading section > p:not(.reading-kicker)` rule in `app/globals.css`. Do not remove this spacing for a new lesson or add a one-off override, because the gap separates ideas in long teaching sections and prevents the copy from reading as one block.

## A specific gotcha: overriding shared components

`AuthButton.tsx` (`.auth-sign-in`, `.auth-user`) is shared between the dark lesson header and the light homepage/profile pages, so it has a dark base style plus a `.home-page .auth-sign-in` override for the light context. The homepage retheme once only overrode `background`/`border-radius` and left the base rule's near-white `color` in place, producing invisible white-on-white text — a real bug that shipped and had to be fixed later. When overriding a shared component's colours for a specific page context, override every colour-related property together (`color`, `background`, `border`, any child element's colours), not just the ones that visibly differ at a glance — a partial override can leave an inherited value that only becomes illegible in the new context.

## What to avoid (recap)

- Gradient button fills, gradient text (`background-clip: text`), gradient glow blobs.
- Blurred `box-shadow`/`filter: drop-shadow(...)` used decoratively (soft glows).
- Large border-radius / pill-shaped buttons and badges.
- Unicode arrow/decoration glyphs (`→`, `↗`, `✨`, etc.) standing in for iconography — draw a pixel sprite instead.
- Hyphens and dashes in visible copy.

## Shared header

The homepage and `/profile` render the exact same top navigation via `app/components/SiteHeader.tsx` (brand logo/wordmark, `AuthButton`, a "Start learning" CTA) — this is a genuinely shared component, not two implementations styled to look alike. Its CSS (`.home-nav`, `.site-brand`, `.home-nav-links`, `.nav-cta`, and the light `.auth-sign-in`/`.auth-user` treatment, scoped under `.home-nav` rather than a page wrapper) lives in `globals.css` and is intentionally _not_ scoped under `.home-page`, so it renders identically regardless of which page mounts it. The `--home-*` colour tokens and `--home-gutter` spacing token live on `:root` for the same reason — any page can use them, not just the homepage. If a third page adopts this header, just render `<SiteHeader />`; don't recreate the markup.

Two gotchas hit while building it, worth avoiding next time:

- **Internal links must use a plain `<a href>`, not `next/link`'s `<Link>`.** This app's Vinext/Cloudflare Worker deployment needs native navigation — `ProfileClient.tsx` already had an `eslint-disable @next/next/no-html-link-for-pages` comment saying so, but `SiteHeader.tsx` was first written with `<Link>` anyway (copied from the pre-refactor homepage nav, which had the same bug) and clicking the brand logo silently failed to navigate. Every new internal link in this codebase should be `<a href="...">`, with that same eslint-disable comment at the top of the file if it links to `/`.
- **A shared header must not be nested inside a page's own padded wrapper.** `/profile`'s `<main>` had its own horizontal `padding`, and placing `<SiteHeader />` inside it squeezed the header inward instead of edge-to-edge like the homepage. The fix: the outermost page element should carry no padding of its own (matching `.home-page`'s pattern) — give padding to an inner content wrapper instead, so the header, rendered as a direct child of the unpadded outer element, can size itself independently.

## Rollout

Applied so far: the homepage, and `/profile` (`app/profile/profile.module.css` and `ProfileClient.tsx`, as of 8 August 2026 — same palette, hard-shadow/border formulas and pixel-icon swaps as the homepage, translated into that page's CSS module, plus the shared `SiteHeader` described above).

The course/lesson pages (`.course-sidebar`/`.lesson-reading` and related rules in `globals.css`) still use the separate, older soft-light theme and were deliberately left untouched. When extending this pixel-art treatment to them, reuse the palette, border/shadow/icon patterns and shared header above rather than introducing new values.
