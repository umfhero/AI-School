# AI workflow course project handover

Last updated: 9 August 2026

## Start here

This repository contains a free course called **AI workflow course**. The homepage brand is **AI school**. It takes a non-technical learner from what AI is and where people use it through to building substantial projects without relying on one long, increasingly confused chat. The course then moves through project memory, model choice, agents, reusable skills, parallel work and shipping.

The public website is live at:

`https://ai-workflow.umfhero-961.workers.dev/`

The GitHub repository is:

`https://github.com/umfhero/AI-workflow.git`

The application is in this repository root. Run development, testing and Git commands here. This `overview.md` file is the project handover and should be read before inspecting the code.

## Product direction

The course must remain free for learners and free for the owner to run. Do not add a paid product, payment flow or service that can silently move onto paid usage. Before adding any hosted dependency, check its current official free limits and design a hard stop when those limits are reached.

The audience has no assumed technical background. Lessons should explain the problem in ordinary language, show the workflow visually, then give the learner a small task that proves they understood it. Course writing must use British English and the `stop-slopv4` writing skill. Avoid generic AI copy, dramatic fragments and inflated claims.

The visual direction is split deliberately:

- The homepage and `/profile` (as of 8 August 2026) use a flat pixel-art theme: a near-white background (`#f6f7fb`), dark ink text (`#0b1130`), a blue-to-violet-to-pink accent scale (`#3561dc` / `#6258e9` / `#c2469e`), solid ink borders, hard zero-blur offset shadows instead of soft glows, small sharp corners instead of pill shapes, and hand-authored pixel-art SVG icons (`site/app/components/PixelIcons.tsx`) instead of Unicode arrow glyphs or gradient text. The full palette, border/shadow formulas and icon technique are documented in `site/design.md` — read that file before touching either page's visual styling rather than re-deriving values. This retired an earlier dark, glowing style influenced by Lovable and Zite, and before that a soft-light-but-still-gradient-heavy version; both were replaced in favour of a more distinctive, less generic-AI-product look. It should still feel specific to this course, use the full width of the page and avoid generic card grids, overlapping flat shapes or decorative assets covering content.
- The course/lesson pages still use the older soft-light theme (not yet converted to the pixel-art style above).
- Lesson pages use a structured reading layout with a course sidebar, clear sections and task-owned visual demonstrations.
- Side views use the full pane without an empty frame around them. Text must stay readable, and each visual should be interactive where the subject benefits from it.
- On mobile, the course sidebar starts closed and a task visual opens as a bottom sheet over roughly the lower half of the screen.
- A mobile bottom sheet must actually be draggable to full screen, half and closed, not just look like one. Make the whole header bar the drag surface and put `touch-action: none` on that whole bar, not only a thin grab-bar pill. Both built lessons implement this correctly; reuse that pattern for any new side view instead of re-deriving it.
- Respect `prefers-reduced-motion` whenever animation is added.

The course should not copy Codédex assets or layout. `references/Learn Python - For Beginners.html` is only a visual reference for the feeling of a progress-led course.

## Planned course structure

The current course map has 25 lessons and 75 tasks. Chapter 1 has five lessons because the AI introduction comes before Context rot; the remaining five chapters each have four lessons. Totals are derived from `site/app/course/courseData.ts`.

1. The basics
   - AI?
   - Context rot
   - Your project brain
   - Files and handovers
   - A clean first workflow
2. Pick the right model
   - What models change
   - Speed, cost and reasoning
   - Context windows
   - A simple model test
3. Build with an agent
   - Write the task brief
   - Let the agent inspect
   - Make the change
   - Review what happened
4. Skills and repeatable work
   - What a skill is
   - Write your first skill
   - Use templates well
   - Improve it from results
5. Fleets and parallel work
   - When parallel work helps
   - Divide the jobs
   - Write clean handovers
   - Merge without chaos
6. Ship it properly
   - Verification
   - Source control
   - Deployment
   - Maintaining the system

Lessons 1.1 and 1.2 have been built. The remaining lesson names are a working plan rather than finished content.

## What has been built

### Homepage

The homepage at `/` is complete enough to use publicly. It includes:

- The AI school name and custom icon set.
- A direct explanation of what the course teaches and that no technical background is required.
- Course figures showing one course, 25 lessons and a price of £0.
- A workflow console that previews `overview.md`, one-task execution, verification and handover.
- A short author section explaining the first-class deterministic AI dissertation, university award and later AI role at Cloudflare.
- Google sign-in and a signed-in progress strip showing the learner's current position.
- Working links into the first lesson.
- Favicons, mobile icons, a web manifest and social preview images.

### Lesson 1.1, AI?

The first lesson is live at `/course/basics/ai`. It introduces a non-technical learner to AI as a family of tools that can work with language, images, code and other information. It covers browser chats (ChatGPT, Claude and Gemini), project folders, IDEs such as VS Code and Cursor, and more agent-led tools.

- Section 1 explains that AI is a useful first-pass assistant rather than a magic box, why agentic AI has lowered the threshold for making software, and why a fast first version is not the same as a useful product.
- It explicitly frames the course as building workflows that reduce hallucinations: keep important facts outside a chat, give the model suitable context and make its work checkable.
- Section 2 explains models, settings, guardrails, training ranges and search as one way to reduce stale information.
- Task 1 is a randomised matching exercise. Its visual connectors are measured from the actual cards, so the links stay accurate at desktop and mobile widths.
- Task 2 orders browser chat, IDE and non-IDE agent setups. Both tasks use the full side-view surface, including the mobile bottom sheet.

After every task is complete, the learner must use **Complete lesson · +100 XP**. This saves an explicit lesson completion timestamp, awards XP once, shows the pixel-style completion notice and unlocks the next lesson.

### Lesson 1.2, Context rot

The second lesson is live at `/course/basics/context-rot`. It follows the intended lesson template:

- A large, readable course sidebar with all six planned chapters.
- A sidebar open and close control.
- A reading column with a title, sections, content and tasks.
- One back-to-home control in the bottom-left lesson footer.
- A final **Complete lesson · +100 XP** action once all three tasks are complete. The bottom `Next lesson` control stays disabled until that explicit completion is saved. There is no built Lesson 1.3 route yet.
- A resizable desktop side view and a mobile bottom sheet.
- Side views stay closed until the learner starts the task that owns them.
- Closing a side view leaves a `Resume task visual` control for the active task.

The three tasks are:

1. `diagnose`: a long recipe conversation where the learner finds the first reply that stops following the original pantry and dietary rules. Its side view uses large ChatGPT-style message bubbles.
2. `compare`: a web chat comparison. Learners switch between one large, growing course-launch GPT thread and a project view where each clean chat inherits only the shared project context. The Weeknight meals project is reserved for Task 3, so the examples do not repeat.
3. `build`: a manual, click-through VS Code-style workspace, available only after the learner opens Task 3. It starts without `overview.md`, shows the file as the project source of truth, then shows a fresh Copilot-style chat asking `@overview.md` for a recipe and receiving a context-aware answer. There is no duplicate workspace preview in the reading section.

Completing a task plays a brief success sound and confetti (unless the learner prefers reduced motion), then closes the task side view. Answers remain hidden until the learner has opened the task visual. Completing the lesson awards the separate 100 XP lesson reward once.

The lesson uses the exact Chroma Repeated Words figure from `https://www.trychroma.com/research/context-rot`. The figure, Chroma source, ChatGPT, Claude, Gemini and the individual models named under the chart all link to their original websites. Saved research files are available in `references/context-rot/`.

### Current research position

Do not say that an AI model literally becomes less intelligent during a conversation. The accurate teaching point is that performance can become less reliable when the input grows and useful facts compete with later instructions, corrections and unrelated work.

A large context window means the model can receive a lot of text. It does not mean the model uses every part with equal reliability. Starting a new chat is not a complete solution either, because a clean chat cannot know project facts that only exist in the old conversation. The course teaches learners to keep stable project facts in a small external source of truth, then open a clean chat for each proper task.

The local research pack contains:

- `references/context-rot/chroma-context-rot.html`
- `references/context-rot/lost-in-the-middle.pdf`
- `references/context-rot/ruler.pdf`
- `references/context-rot/claude-project-instructions.html`

## Technical architecture

The application uses React 19, Vinext, TypeScript and Cloudflare Workers. The Vinext build creates a Worker-compatible server bundle and static assets in `site/dist/`.

Important files are:

- `site/app/page.tsx`: homepage content and structure.
- `site/app/globals.css`: homepage, lesson, responsive and visual styles.
- `site/app/course/courseData.ts`: the shared six-chapter, 25-lesson course map and task totals.
- `site/app/course/basics/ai/LessonClient.tsx` and `LessonVisuals.tsx`: Lesson 1.1 reading, two tasks, save state, responsive side view and actual-card-position matching connectors.
- `site/app/course/basics/context-rot/LessonClient.tsx`: Lesson 1.2 reading, tasks, progress state, sidebar and side-view controls, including the pointer-driven mobile bottom-sheet drag (open to full screen, half or closed).
- `site/app/course/basics/context-rot/LessonVisuals.tsx`: recipe chat, animated workflow comparison and `overview.md` workspace.
- `site/app/components/AuthButton.tsx`: Google sign-in, name, profile photo and sign-out UI.
- `site/app/components/SiteHeader.tsx`: the shared top navigation (brand, sign-in/profile, course CTA) rendered identically on the homepage and profile page — a genuine shared component, not two look-alike implementations.
- `site/app/components/ExperienceBadge.tsx`: signed-in header level and XP display, refreshed after progress changes.
- `site/app/components/LessonXpCelebration.tsx`: fixed, reduced-motion-aware pixel completion notice below the lesson header.
- `site/app/components/PixelIcons.tsx`: shared hand-authored pixel-art SVG icons (arrow, spark, check, mascot), used across the homepage, profile page and `CourseProgress`.
- `site/app/profile/ProfileClient.tsx`: signed-in learner profile, course overview and activity heatmap.
- `site/app/profile/profile.module.css`: profile layout and responsive activity heatmap styling.
- `site/app/components/CourseProgress.tsx`: homepage course progress.
- `site/design.md`: the pixel-art visual theme reference (palette, borders/shadows, icon technique, animation convention). Read before any homepage or profile styling change.
- `site/lib/server/auth.ts`: OAuth cookies, sessions, profile lookup and D1 access.
- `site/app/api/auth/`: Google login start, callback, current user and logout routes.
- `site/app/api/progress/route.ts`: lesson-scoped saved progress, explicit lesson completion, XP state and an authenticated self-reset action for testing.
- `site/db/schema.ts`: D1 schema for users, sessions and lesson progress.
- `site/drizzle/0000_lively_sandman.sql`: current database migration.
- `site/wrangler.jsonc`: Worker and D1 configuration.
- `site/.openai/hosting.json`: logical D1 binding used by the site build.
- `site/tests/rendered-html.test.mjs`: current server-render checks.

## Google login setup

Google OAuth is implemented directly in the Worker. It does not use Firebase, Auth0 or another paid authentication service.

The flow uses OAuth state checks and PKCE. A successful callback requests the Google `openid email profile` scopes, stores the user's verified email, display name and profile photo in D1, then creates a 30-day session. The browser receives an HttpOnly, SameSite=Lax cookie called `aw_session`; the raw session token is not stored in D1 because the server stores its SHA-256 hash.

The required Worker secrets are:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Do not write their values into this file, source control or chat. They belong in the Cloudflare Worker's secret settings.

The Google Cloud OAuth client should be a Web application. Its production settings should include:

- Authorised origin: `https://ai-workflow.umfhero-961.workers.dev`
- Authorised redirect URI: `https://ai-workflow.umfhero-961.workers.dev/api/auth/google/callback`

For local login testing, add these separately:

- Authorised origin: `http://localhost:3000`
- Authorised redirect URI: `http://localhost:3000/api/auth/google/callback`

Relevant routes are:

- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`
- `GET /api/auth/me`
- `POST /api/auth/logout`

The UI already reads the Google name and profile photo. If the photo is missing, it falls back to the user's initial.

## Progress storage

Cloudflare D1 stores account and progress data. The logical binding is `DB`, the database name is `ai-workflow`, and `site/wrangler.jsonc` currently records database ID `4a3fa6da-2fc6-4e51-80f9-eb48b7953986`.

The database has three tables:

- `users`: Google subject ID, email, name and profile picture URL.
- `sessions`: hashed session ID, user ID and 30-day expiry.
- `lesson_progress`: user ID, lesson ID, completed task IDs and last update time.

`GET /api/progress` returns the signed-in user, lesson map, aggregate completed tasks, daily activity and server-derived experience. `PUT /api/progress` accepts only same-origin requests from a signed-in user, filters task IDs through a per-lesson allow-list and upserts the result. The existing `completed_tasks` field stores backward-compatible JSON: legacy rows are task arrays; current rows store task IDs, their completion timestamps, `lessonCompletedAt` and `xpAwarded`.

The built allow-lists are `basics/ai` (`identify`, `order`) and `basics/context-rot` (`diagnose`, `compare`, `build`). A lesson must have all of its tasks and receive an explicit `completeLesson: true` request before it is marked complete. That operation is idempotent and awards 100 XP once. Current levels are chapter-based: 100 XP for every explicitly completed lesson in the chapter. The header badge, profile and completion notice all use the same server-derived experience.

For the current test account only, the profile exposes **Reset test progress**. It calls the authenticated self-reset action, deletes only that account's `lesson_progress` rows and returns the profile to 0 tasks and 0 XP. It must not reset other users. Started tasks, open visuals and sidebar preferences remain local UI state.

The course sidebar reads the lesson completion timestamps. A finished lesson gets a green highlight, ✓ and `COMPLETE`; a fully finished chapter gets the same treatment in its chapter header.

## Cloudflare and deployment

The public Worker name is `ai-workflow`, with the `DB` D1 binding. Cloudflare observability is disabled in `site/wrangler.jsonc` to avoid unnecessary usage.

The working publishing path is the GitHub-connected Cloudflare build:

- Production branch: `main`
- Repository root: `/`
- Build command: `npm run build`
- Deploy command: `npm run deploy:built`

Pushing `main` has been updating the public Worker successfully.

There is an important account boundary. The owner has explicitly said never to touch the Cloudflare account named **Hero Enterprise**, because it is an employee account. The current local Wrangler session reports the email `umfhero@gmail.com` but the account name `Hero Enterprise`. Do not run `wrangler deploy`, `npm run deploy` or any Cloudflare mutation from that session. A manual deployment already failed with Cloudflare error 10181 because the configured D1 database was not found in that account, and no further manual attempt should be made.

Use the connected GitHub deployment until the owner deliberately signs Wrangler into a confirmed personal Cloudflare account whose account name is not Hero Enterprise. Before any future manual deployment, run `npx wrangler whoami` as a read-only check and stop if it lists Hero Enterprise. Do not change Cloudflare login state without asking the owner.

The cost rule is strict: do not enable a paid Workers plan, paid D1 plan or any other paid Cloudflare product. The intended behaviour is for free-plan requests to fail or wait when a quota is reached, rather than creating a bill.

## Local development

Requirements:

- Node.js 22.13.0 or newer.
- Dependencies installed from `site/package-lock.json`.

From `C:\Users\umfhe\Desktop\AI-workflow\site`:

```powershell
npm install
npm run dev
```

The local site should open at `http://localhost:3000`.

Run checks with:

```powershell
npm run lint
npm test
```

`npm test` builds the production application and runs three server-render tests for the homepage, AI? and Context rot lessons. These checks cover basic content and links, but they do not exercise OAuth, D1 or client-side visual interactions.

## What still needs to be done

The next work should be completed in this order:

1. Build Lesson 1.3, `Your project brain`, using the AI? and Context rot shells as the template.
2. Extract the duplicated lesson shell and sidebar into shared course components before more lesson routes are added.
3. Extend the lesson allow-list and progress integration when each new lesson is built. Keep task IDs unique within a lesson and retain the explicit final completion step.
4. Connect the Context rot `Next lesson` control to Lesson 1.3 when that route exists, then make availability follow saved lesson completion rather than static paths.
5. Add client-side interaction tests for matching links, task completion, lesson completion/XP, the fixed notice position and the mobile bottom sheet.
6. Add an authentication and D1 integration test path that does not require real Google credentials.
7. Resolve the personal Cloudflare account and D1 ownership before allowing manual deployments. Keep using the GitHub-connected deployment until then.
8. Write the remaining 23 lessons and their tasks. Keep each lesson grounded in original sources, and link named products, models, research and images to their original pages.

There is a profile page at `/profile`, reached by clicking the signed-in profile in the top navigation. It shows the active AI workflows course, task count, 12-week activity heatmap and links back into the first lesson. There is no admin interface, content management system, payment system, analytics service or video library. Do not add these unless the owner asks for them.

A friends/social feature (search for other learners, send and accept friend requests, a profile level, notifications, a progress-comparison graph) has been requested and is being scoped. `site/friends.md` holds the proposed plan — read it before starting any implementation, since the data model, privacy rules (emails stay hidden until a friend request is accepted) and header changes it describes are not yet finalised or built.

## Instructions for the next chat

Read this file first, then inspect only the files needed for the requested task. Preserve the existing homepage direction, lesson shell, Google login and D1 progress work. Do not restart the project or replace Vinext.

Use sub-agents in every new chat whenever the work can be divided into independent tasks. Give them separate files or clearly bounded research, implementation, review and testing jobs so they can work in parallel without overwriting each other. Keep tightly coupled changes with the main agent, then have the main agent integrate the results, run the final checks and publish the finished version.

Before changing course copy, use `stop-slopv4`. Before changing the homepage or profile page's visual styling, read `site/design.md` first and reuse its values rather than inventing new ones. Before changing the website, use the site-building instructions. Test the production build and lint before pushing. Publish through `git push origin main`, then confirm the connected Worker updated with a read-only request. Do not use the local Wrangler session while it points at Hero Enterprise.

If no more specific task has been given, the next concrete job is to design and build Lesson 1.3, `Your project brain`, while first extracting the shared lesson shell so the remaining lessons are easier to add.
