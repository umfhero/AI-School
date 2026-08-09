# Friends feature — proposed plan

Status: not built. This is a starting brief for a more thorough planning pass, not a final spec — expect the data model, API shape and UI details below to be revised.

Read `overview.md` (project context, constraints, existing auth/progress system) and `design.md` (visual theme) before planning further — this feature must fit both.

## What was asked for

1. Search for other people, showing their profile picture.
2. Send and accept friend requests ("add friends").
3. A graph under the profile's "Consistency" section comparing your progress against a friend's.
4. A "level" on profiles, shown on the homepage header and in friend search results.
5. Emails hidden by default in search and friend lists — only visible once a friend request is accepted between the two accounts.
6. A notifications section for incoming friend requests.
7. The profile page should use the same header as the homepage, not its own separate-looking one.

## Hard constraints (from overview.md)

- Must stay free: Cloudflare Workers free plan, D1 free tier. No paid product, no service with a silent upgrade path. Check free-tier limits for anything new (D1 row/read/write caps) and design a hard stop rather than a bill if they're ever hit.
- Auth is Google OAuth already implemented directly in the Worker (`site/lib/server/auth.ts`, `site/app/api/auth/`) — users are keyed by Google subject ID in the `users` D1 table. Any friends feature builds on this, not a new identity system.
- D1 currently has three tables: `users`, `sessions`, `lesson_progress` (see `site/db/schema.ts`, migration in `site/drizzle/`). New tables need a new Drizzle migration, generated with `npm run db:generate`.
- Visual style must follow `design.md` (flat pixel-art theme) — new UI (search results, request cards, notification list, level badge, graph) should reuse its palette/border/shadow/icon conventions, not invent new ones.
- British English, no admin/CMS/payment/analytics scope creep beyond what's listed above.

## Privacy and safety requirements before launch

This feature handles profile, relationship and learning-activity data. Treat these as release blockers, not polish work.

- Never expose a learner's email address in search, profiles, friend lists, requests, notifications or comparison views. Remove the earlier idea that an accepted friendship reveals email addresses. Friendship only needs an internal user ID.
- Profiles must be private by default. Do not create a public member directory, public profile URLs or unauthenticated profile API. A learner must explicitly opt in before they can be found by another learner.
- Prefer an exact friend code or an invite link over broad name search. If name search is retained, search only opted-in display names, require a short query and return the minimum result: display name, chosen avatar and level.
- Let learners choose a display name and a generated pixel avatar for social surfaces. Do not automatically make a Google name or Google profile photo visible to other people.
- Only accepted friends may see comparison data. Start with a level and broad task totals or weekly totals. Do not share the detailed activity heatmap, exact timestamps or lesson answers by default.
- Provide remove friend, cancel request, decline request and block controls. A block must prevent future requests and remove the connection from both accounts.
- Rate-limit searches and friend requests, reject duplicate or self requests, and keep request state server-side. Do not trust a client-supplied user ID to authorise a comparison.
- Account deletion must remove the user's friendships, pending requests and notifications as well as sessions and learning progress. Other users should only see that the connection is no longer available.
- Record the data flow and complete a short privacy risk assessment before launch. If the service is likely to be accessed by under-18s, apply high-privacy defaults to every learner unless the product has an appropriate age approach.

## Rough shape (for the planning pass to confirm or replace)

**New data needed**, concept-level only:
- Friendships / friend requests: two users, a status (pending, accepted, maybe declined), who sent it, timestamps. Needs a decision on whether declined/cancelled requests are deleted or kept as a record.
- Notifications: at minimum "you have a friend request," tied to a user and a request. Needs a decision on read/unread state and whether other event types are ever needed later, or if this stays friend-request-only.
- Level: needs a decision on whether it's a stored/cached value or derived on read from existing progress data (simpler, no extra writes, but recompute cost on every profile view/search result — likely fine at this scale). A plausible starting formula is something derived from completed tasks (e.g. one level per N tasks), but the exact curve is an open question.

**New API surface needed**, concept-level only:
- Search users by name (not email) — must never return email in results, and should be efficient enough not to scan the whole `users` table unnecessarily as it grows (even though it's small now).
- Send / accept / decline a friend request.
- List a user's friends and pending incoming/outgoing requests.
- Notifications list (and marking as read).
- Comparison data for the graph — needs a decision on what's actually compared (likely `lesson_progress`/activity data for both accounts, same shape the profile heatmap already reads) and only allowed between accepted friends.

**UI surface needed**, concept-level only:
- A search entry point (profile page seems the natural home, given the "Consistency" graph lives there too).
- Search results list: photo, name, level, an add-friend action — no email.
- A notifications area for incoming requests (accept/decline inline).
- A comparison graph under "Consistency" on the profile page, gated to accepted friends only.
- A level badge, shown on the profile page and in the homepage's signed-in header/progress strip.
- Header unification: the profile page currently has its own nav (`app/profile/profile.module.css` `.nav`) separate from the homepage's `.home-nav` (`Brand` + `AuthButton` + CTA, in `app/page.tsx`/`globals.css`). These should become one shared header component both pages use, not two different implementations that happen to look similar — worth doing this as its own step before or alongside the friends UI, since notifications almost certainly live in that shared header.

## Open questions for the planning pass

- Level formula: what should it be based on, and what's a sensible curve given there's currently one course with 72 planned tasks?
- Graph: what's actually plotted (cumulative tasks over time? weekly activity counts side by side?) and over what time window?
- Can a friend request be cancelled by the sender, or only accepted/declined by the recipient?
- Are declined requests permanently blocked, or can the same request be sent again later?
- Notification delivery: polling (matching how `CourseProgress` already polls `/api/progress`) is almost certainly the right free-tier answer over anything real-time/websocket-based — confirm nothing fancier is implied.
- Rate limiting: should sending requests or searching be throttled to prevent spam, given accounts are free to create via Google sign-in?
- Should the shared header (point 7) be built first as its own piece of work, since several other items depend on it?
