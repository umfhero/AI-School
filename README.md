# AI Workflows

A free, practical course for building reliable AI-assisted software workflows.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

The course is available at `http://localhost:3000`.

## Checks

```bash
npm run lint
npm test
```

## Cloudflare Workers deployment

This repository is ready for Cloudflare Workers Builds.

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npm run deploy:built`
- Root directory: `/`

The Vinext build generates `dist/server/wrangler.json`; the deploy command uses
that generated manifest so the Worker and its static assets are uploaded
together.

For a manual deployment after authenticating Wrangler, run:

```bash
npm run deploy
```
