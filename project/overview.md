# AI school: agent context

Read this file first. It is an internal routing guide, not public documentation. Read only the linked project documents that match the task before changing code or copy.

## Product and hard limits

- AI school is a free UK educational site for non-technical learners. Keep it free for learners and for the owner: do not introduce paid products, paid Cloudflare plans, or a dependency that can create an unexpected bill.
- The live site is `https://ai-workflow.umfhero-961.workers.dev/`. The app root is this repository.
- Stack: React, TypeScript, Vinext, Cloudflare Workers, D1 and Google OAuth.

## Cloudflare Free-tier capacity constraints

These are hard operating constraints, not aspirational targets. Recalculate the per-user figures before adding any API call, database query, polling, analytics, public counter, upload or social feature. All limits are shared across the Cloudflare account, reset at **00:00 UTC** where stated, and traffic spikes do not carry into a quieter day.

| Resource | Free-plan limit | Planning rule for AI school |
| --- | ---: | --- |
| Worker invocations | 100,000/day | Plan for **5,000 daily active learning sessions** at most, keeping roughly 50% headroom for public visitors, crawlers, retries and spikes. Around 10,000 DAU is fragile; never treat the 100,000-request ceiling as usable capacity. |
| D1 rows read | 5,000,000/day | Indexed account/progress use is normally not the first limit. Avoid scans, unbounded lists, `COUNT(*)` on growing tables, and per-visit analytics queries. |
| D1 rows written | 100,000/day | A typical completed lesson currently causes several progress saves. Batch/debounce new high-frequency writes and account for index writes. |
| D1 storage | 5 GB total | Current text-only accounts and progress are likely sustainable for roughly 0.5–1 million accounts, not indefinitely. Tables **and indexes** count. Sessions accumulate unless deliberately cleaned up. |

- Static asset requests are free; SSR pages and API routes consume Worker invocations. Do not make a public page dynamic or add client API calls without adding them to the request estimate.
- A typical signed-in lesson session currently makes approximately 8–12 Worker invocations, 20–40 D1 row reads and 4–8 D1 row writes. Treat these as a baseline to update, not a guarantee.
- The shared header makes one additional `GET /api/notifications` request for signed-in visitors. Plan for roughly 9–13 Worker invocations and 22–45 D1 reads per signed-in lesson session before a notification is opened; opening a notification adds one D1 write for its private read state. Do not add polling or real-time delivery without recalculating the busiest-day impact.
- D1 does not have a monthly free allowance to smooth usage: the practical capacity is determined by the busiest day. As a loose guide, a 5,000-DAU service supports roughly 15,000–40,000 MAU depending on how often learners return.

### Public counts, caching and failure safety

- `GET /api/community` powers the homepage “signed up” number. Its response must remain a public aggregate only: never add emails, identities or other account data, and do not cache personal API responses.
- The direct `SELECT COUNT(*) FROM users` is safe for the current small audience but can become a D1 read bottleneck as the users table grows. Before audience growth, replace it with a pre-computed public aggregate or a **deployment-verified** cache with a direct-D1 fallback.
- Do **not** make the count dependent on `caches.default` in this Vinext Worker without proving the exact deployed route works. An unverified Cache API integration caused a production `1101 Worker threw exception`, leaving the homepage stuck on “... signed up”. A cache outage must degrade to a fresh count, never a failed endpoint.
- After any change to this route, verify both `/api/community` returns JSON and the live homepage resolves the count. A successful Git push is not proof that the connected Cloudflare build is serving the new Worker.

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
- Notifications are available to signed-in learners through the shared `SiteHeader` bell and `/notifications`. `GET /api/notifications` returns only the requesting account's inbox and is `no-store`; `PATCH /api/notifications` can mark only a notification delivered to that same account as read and requires a same-origin request.
- `notifications` stores broadcasts once (`audience = all`) or a future individual delivery (`recipient_user_id`); `notification_reads` stores private per-account read state. Never fan a broadcast out into one row per user. Keep inbox queries indexed, newest-first and capped at 50 items, and never include emails or another learner's data in notification content or API responses.
- Use the server-only `createNotification` helper in `lib/server/notifications.ts` for future course launches, course changes and friend-request events. Do not add a learner-controlled publishing route. The helper validates internal links and the runtime initialiser creates the notification tables and indexes safely while the connected deployment is catching up with the Drizzle migrations (`0002_careful_vampiro.sql` and `0003_vengeful_sandman.sql`).
- Notification read records are included in account export and deleted with the account. Keep the Privacy page accurate for any new notification data or delivery channel.
- A one-off, idempotent global preview broadcast is currently configured in `lib/server/notifications.ts`: title `Hello!` with lorem ipsum body. It is for visual testing only. Remove the seed after approval; removing it from source does not delete the already-created production notification, so ask the owner before arranging any production data cleanup.
- Every published lesson must use `app/course/LessonTemplate.tsx`. This component owns the header, responsive contents sidebar, reading area, progress loading, lesson completion, account controls, XP celebration and bottom navigation. Do not copy this shell into a lesson file or replace it with a reading area on its own.

## Canonical lesson template

The reference implementation is `/course/chapter-1/lesson-1`. A new lesson route should have a small metadata `page.tsx` and a `LessonClient.tsx` that wraps its teaching sections in `LessonTemplate`.

- Pass the lesson ID, route, chapter number, title, completion copy and every required task ID into `LessonTemplate`. Add the same task IDs to `courseData.ts` and the allowlist in `app/api/progress/route.ts`, otherwise progress cannot be saved and the lesson cannot complete.
- Put lesson sections directly inside `LessonTemplate`. Start with the first numbered section, and do not add a separate lesson title or dotted rule above it.
- Use `.lesson-image-template` for sourced figures. Keep the image, teaching caption and original source link in the same figure, and use an image that directly explains the surrounding point.
- Give every concept lesson at least one original SVG diagram through `app/course/LessonDiagram.tsx`. The shared frame owns the heading and caption, with a dark default tone and a transparent paper tone for artwork that should sit directly on the page. Keep lesson-specific SVG content in the lesson route, use crisp pixel geometry and flat fills, give the diagram a useful teaching caption, and make the `viewBox` responsive. Do not add offset backing panels behind individual SVG cards. If a wide SVG becomes unreadable on a phone, provide a mobile arrangement of the same diagram rather than shrinking desktop text. Keep moving markers in a dedicated rail or empty connector lane so they never cross a card or label. Motion must show a real sequence, state or movement and disappear under `prefers-reduced-motion: reduce`. Add a hidden text equivalent when the diagram carries information not repeated in visible lesson copy.
- Keep the shared course contents sidebar in `LessonTemplate`. It uses the homepage's ink borders, pastel yellow and violet accents, and changes completed chapters and lessons to the shared green state. Use the existing pixel icons or CSS pixel geometry for status controls rather than text glyphs.
- Put every learner task on the page where it is introduced. `app/course/InlineLessonTask.tsx` is the working multiple choice example, including answer selection, feedback, saved completion and the green completed state. Sorting and left to right matching tasks should follow the same inline structure.
- Do not add a task side panel, task drawer, bottom sheet, `task-open` workspace state or a separate close control. The course contents sidebar is the only lesson sidebar.
- Keep task completion separate from XP. A completed task saves its task ID, while XP is awarded only when the learner uses the final lesson completion button after every required task is complete.
- Keep lesson-specific copy, images and task data in the lesson file. Put shared shell behaviour, progress rules and reusable interaction patterns in the shared course components, so a future template change applies to every lesson at once.
- A task-free orientation should omit `requiredTaskIds`, use `taskCount: 0` in `courseData.ts` and keep an empty lesson set in the progress API allowlist. Its final completion button is ready as soon as progress has loaded.

## Build, release and safety

- Run `npm test` and relevant lint checks before publishing. For every new or changed lesson shell, also inspect the live lesson in a browser: confirm the contents toggle is visible, closes the sidebar, reopens it and correctly changes its accessible label between “Hide contents” and “Show contents”.
- **Shared-work rule:** before starting work, sync with `main`. Once a feature is complete and its relevant checks pass, make one intentional commit and push it to `main` before handing off. Do not bundle another contributor's unrelated work, force-push, or leave a finished feature only on one machine; this keeps the shared baseline current and reduces merge conflicts.
- Production deploys through `git push origin main` and the connected GitHub build. Do **not** run Wrangler deployment commands or mutate the Cloudflare account: local Wrangler is linked to the employee account named **Hero Enterprise**.
- A release is complete only after the live route/page affected by the change has been checked. If the public site shows a Cloudflare `1101` error, do not assume a later push has deployed; inspect the connected build or ask the owner to trigger/review it. Do not use local Wrangler to work around it.
- Do not enable paid Cloudflare products. If a change needs new external authority, credentials, spending or a legal decision, stop and ask the owner.
