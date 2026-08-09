# AI school: agent context

Read this file first. It is an internal routing guide, not public documentation. Read only the linked project documents that match the task before changing code or copy.

## Product and hard limits

- AI school is a free UK educational site for non-technical learners. Keep it free for learners and for the owner: do not introduce paid products, paid Cloudflare plans, or a dependency that can create an unexpected bill.
- The live site is `https://ai-workflow.umfhero-961.workers.dev/`. The app root is this repository.
- Stack: React, TypeScript, Vinext, Cloudflare Workers, D1 and Google OAuth.

## Required reading by task

| If the task involves… | Read first | Why |
| --- | --- | --- |
| Any user-facing UI, layout, responsive behaviour, icons, animation or visual styling | [`design.md`](./design.md) | It is the source of truth for the pixel-art theme and interaction rules. Do not invent a separate visual language. |
| New lesson content, task design, course order, learning claims, lesson figures or learner-facing course copy | [`aicourse.md`](./aicourse.md) | It contains the course plan, teaching approach and current lesson direction. Use British English and the `stop-slopv4` skill for new course copy. |
| Any technical feature, API, database change, authentication, account data, cookie, third party, analytics, deployment, upload, search/discovery feature or public/social feature | [`security.md`](./security.md) | It is the required privacy, security and UK legal release checklist. Keep data minimal, enforce ownership server-side and update public Privacy/Terms pages when needed. |
| Friends, profiles, discovery, invitations, notifications, comparisons or other learner-to-learner functionality | [`friends.md`](./friends.md) **and** [`security.md`](./security.md) | Social functionality has additional privacy, child-safety and abuse-prevention requirements. |

Read more than one document whenever the change crosses boundaries. For example, a new account-facing UI needs both `design.md` and `security.md`.

## Current implementation facts

- Google OAuth uses PKCE and state validation. Sessions are HttpOnly and hashed in D1. Do not expose emails, OAuth values, tokens or secrets in pages, bundles or logs.
- Accounts must accept the current Terms version before account features continue. Keep acceptance versioned if Terms change.
- D1 schema is in `db/schema.ts`; generate and inspect a Drizzle migration for schema changes. The terms-acceptance table also initialises safely on first use because the connected deployment does not apply migrations automatically.
- Every published lesson must use the complete lesson shell: header, `sidebar-toggle`, `course-sidebar` (`id="course-contents"`), lesson reading area and bottom navigation. Do not ship a lesson with a reading area alone or a permanently visible contents panel. Reuse a working lesson shell, including the responsive `sidebarOpen` state, before adding lesson-specific tasks or visuals.

## Build, release and safety

- Run `npm test` and relevant lint checks before publishing. For every new or changed lesson shell, also inspect the live lesson in a browser: confirm the contents toggle is visible, closes the sidebar, reopens it and correctly changes its accessible label between “Hide contents” and “Show contents”.
- **Shared-work rule:** before starting work, sync with `main`. Once a feature is complete and its relevant checks pass, make one intentional commit and push it to `main` before handing off. Do not bundle another contributor's unrelated work, force-push, or leave a finished feature only on one machine; this keeps the shared baseline current and reduces merge conflicts.
- Production deploys through `git push origin main` and the connected GitHub build. Do **not** run Wrangler deployment commands or mutate the Cloudflare account: local Wrangler is linked to the employee account named **Hero Enterprise**.
- Do not enable paid Cloudflare products. If a change needs new external authority, credentials, spending or a legal decision, stop and ask the owner.
