# AI school

A free course that teaches beginners how to build real projects with AI, without losing the thread in one long, increasingly confused chat. It starts with project memory and context management, then works through model choice, agents, reusable skills, parallel work and shipping.

Live site: https://ai-workflow.umfhero-961.workers.dev/

## Free, and staying that way

No payment flow, no paid tier, nothing that quietly upgrades to a bill. It runs on the Cloudflare Workers free plan and D1 free tier, with hard stops designed in rather than a card on file.

## Look and feel

The homepage and profile page use a flat, high-contrast pixel-art style inspired by retro 8-bit game UI:

- Solid ink borders (`#0b1130`) with small radii, never pill-shaped
- Hard, zero-blur offset shadows (`4px 4px 0 #0b1130`) instead of soft glows
- A blue-to-violet-to-pink accent scale (`#3561dc` / `#6258e9` / `#c2469e`) on a near-white background
- Hand-authored pixel SVG icons (`app/components/PixelIcons.tsx`), no Unicode arrows or gradient text
- Stepped, not eased, animation for anything decorative

The full palette, border/shadow formulas and icon conventions live in [`design.md`](./design.md) — the reference to follow before touching either page's styling.

## Course structure

Six chapters, four lessons each, three tasks per lesson (24 lessons, 72 tasks). Only Chapter 1's first lesson, **Context rot**, is built so far; the rest is a working plan.

## Tech stack

React 19, TypeScript and Vinext, deployed to Cloudflare Workers with a D1 database. Sign-in is Google OAuth implemented directly in the Worker, no third-party auth service.

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Run checks with `npm run lint` and `npm test`.

## Who's building this

Made by Majid ([@umfhero](https://github.com/umfhero)).

## More detail

- [`overview.md`](./overview.md) — full project handover: architecture, auth, progress storage, deployment and what's left to build
- [`design.md`](./design.md) — the pixel-art visual theme in full
- [`friends.md`](./friends.md) — proposed (not yet built) friends feature plan
