# AI workflow course project handover

Last updated: 8 August 2026

## Start here

This repository contains a free course called **AI workflow course**. The homepage brand is **AI school**. It teaches beginners how to build substantial projects with AI without relying on one long, increasingly confused chat. The course starts with project memory and context management, then moves through model choice, agents, reusable skills, parallel work and shipping.

The public website is live at:

`https://ai-workflow.umfhero-961.workers.dev/`

The GitHub repository is:

`https://github.com/umfhero/AI-workflow.git`

The application is inside `site/`. Run development, testing and Git commands from that directory. This `overview.md` file sits one level above the application so a new chat can read the project handover before inspecting the code.

## Product direction

The course must remain free for learners and free for the owner to run. Do not add a paid product, payment flow or service that can silently move onto paid usage. Before adding any hosted dependency, check its current official free limits and design a hard stop when those limits are reached.

The audience has no assumed technical background. Lessons should explain the problem in ordinary language, show the workflow visually, then give the learner a small task that proves they understood it. Course writing must use British English and the `stop-slopv4` writing skill. Avoid generic AI copy, dramatic fragments and inflated claims.

The visual direction is split deliberately:

- The homepage uses a soft light theme (as of 8 August 2026), matching the palette already used on `/profile` and the course lesson pages: a near-white background (`#f6f7fb`), dark ink text (`#0b1130`), and a blue-to-violet-to-pink accent gradient (`#3561dc` → `#6258e9` → `#c2469e`) carried through the hero glow, buttons, workflow console mock-up and progress bar. It previously used a dark, glowing style influenced by Lovable and Zite; that direction was retired in favour of visual consistency across the site. It should still feel specific to this course, use the full width of the page and avoid generic card grids, overlapping flat shapes or decorative assets covering content.
- Lesson pages use a structured reading layout with a course sidebar, clear sections and task-owned visual demonstrations.
- Side views use the full pane without an empty frame around them. Text must stay readable, and each visual should be interactive where the subject benefits from it.
- On mobile, the course sidebar starts closed and a task visual opens as a bottom sheet over roughly the lower half of the screen.
- Respect `prefers-reduced-motion` whenever animation is added.

The course should not copy Codédex assets or layout. `references/Learn Python - For Beginners.html` is only a visual reference for the feeling of a progress-led course.

## Planned course structure

The current course map assumes six chapters, four lessons per chapter and three tasks per lesson, which gives 24 lessons and 72 tasks. These totals are currently hardcoded in parts of the interface.

1. The basics
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

Only Lesson 1.1, Context rot, has been built. The remaining lesson names are a working plan rather than finished content.

## What has been built

### Homepage

The homepage at `/` is complete enough to use publicly. It includes:

- The AI school name and custom icon set.
- A direct explanation of what the course teaches and that no technical background is required.
- Course figures showing one course, 24 lessons and a price of £0.
- A workflow console that previews `overview.md`, one-task execution, verification and handover.
- A short author section explaining the first-class deterministic AI dissertation, university award and later AI role at Cloudflare.
- Google sign-in and a signed-in progress strip showing the learner's current position.
- Working links into the first lesson.
- Favicons, mobile icons, a web manifest and social preview images.

### Lesson 1.1, Context rot

The first lesson is live at `/course/basics/context-rot`. It now follows the intended lesson template:

- A large, readable course sidebar with all six planned chapters.
- A sidebar open and close control.
- A reading column with a title, sections, content and tasks.
- One back-to-home control in the bottom-left lesson footer.
- A disabled `Next lesson` button until all three tasks are complete. There is no Lesson 1.2 route yet.
- A resizable desktop side view and a mobile bottom sheet.
- Side views stay closed until the learner starts the task that owns them.
- Closing a side view leaves a `Resume task visual` control for the active task.

The three tasks are:

1. `diagnose`: a long recipe conversation where the learner finds the first reply that stops following the original pantry and dietary rules. Its side view uses large ChatGPT-style message bubbles.
2. `compare`: a web chat comparison. Learners switch between one large, growing course-launch GPT thread and a project view where each clean chat inherits only the shared project context. The Weeknight meals project is reserved for Task 3, so the examples do not repeat.
3. `build`: a manual, click-through VS Code-style workspace, available only after the learner opens Task 3. It starts without `overview.md`, shows the file as the project source of truth, then shows a fresh Copilot-style chat asking `@overview.md` for a recipe and receiving a context-aware answer. There is no duplicate workspace preview in the reading section.

Completing a task plays a brief success sound and confetti (unless the learner prefers reduced motion), then closes the task side view. Answers remain hidden until the learner has opened the task visual.

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
- `site/app/course/basics/context-rot/LessonClient.tsx`: lesson reading, tasks, progress state, sidebar and side-view controls.
- `site/app/course/basics/context-rot/LessonVisuals.tsx`: recipe chat, animated workflow comparison and `overview.md` workspace.
- `site/app/components/AuthButton.tsx`: Google sign-in, name, profile photo and sign-out UI.
- `site/app/profile/ProfileClient.tsx`: signed-in learner profile, course overview and activity heatmap.
- `site/app/profile/profile.module.css`: profile layout and responsive activity heatmap styling.
- `site/app/components/CourseProgress.tsx`: homepage course progress.
- `site/lib/server/auth.ts`: OAuth cookies, sessions, profile lookup and D1 access.
- `site/app/api/auth/`: Google login start, callback, current user and logout routes.
- `site/app/api/progress/route.ts`: saved task progress for Lesson 1.1.
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

`GET /api/progress` returns the signed-in user, completed tasks and daily activity. `PUT /api/progress` accepts only same-origin requests from a signed-in user, filters task IDs through an allow-list and upserts the result. The existing `completed_tasks` field stores a backward-compatible JSON value: legacy rows are task arrays; new rows use task IDs plus their completion timestamps. Legacy rows use their recorded `updated_at` time as the best available activity date so the profile does not show an empty history.

Progress is currently limited to lesson ID `basics/context-rot` and task IDs `diagnose`, `compare` and `build`. The homepage divides these completed tasks by the planned total of 72, so it is only a temporary overall progress calculation. Started tasks, the currently open visual and sidebar preferences are local UI state and are not saved.

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

`npm test` builds the production application and runs two server-render tests for the homepage and Context rot lesson. These checks currently cover basic content and links, but they do not exercise OAuth, D1 or client-side visual interactions.

## What still needs to be done

The next work should be completed in this order:

1. Build Lesson 1.2, `Your project brain`, using Lesson 1.1 as the layout and interaction template.
2. Move the chapter, lesson and task definitions out of `LessonClient.tsx` into shared course data so each new route does not duplicate the whole shell.
3. Generalise progress storage for every lesson and task. Replace the hardcoded `basics/context-rot` lesson ID, three-task allow-list and 72-task homepage calculation with data derived from the course map.
4. Make sidebar lessons real links, then implement current, complete, available and locked states from saved progress.
5. Connect the `Next lesson` button to Lesson 1.2 once that route exists.
6. Add client-side interaction tests for starting each task, opening its assigned visual, switching Task 2 modes, saving progress and using the mobile bottom sheet.
7. Add an authentication and D1 integration test path that does not require real Google credentials.
8. Resolve the personal Cloudflare account and D1 ownership before allowing manual deployments. Keep using the GitHub-connected deployment until then.
9. Write the remaining 23 lessons and their tasks. Keep each lesson grounded in original sources, and link named products, models, research and images to their original pages.

There is a profile page at `/profile`, reached by clicking the signed-in profile in the top navigation. It shows the active AI workflows course, task count, 12-week activity heatmap and links back into the first lesson. There is no admin interface, content management system, payment system, analytics service or video library. Do not add these unless the owner asks for them.

## Instructions for the next chat

Read this file first, then inspect only the files needed for the requested task. Preserve the existing homepage direction, lesson shell, Google login and D1 progress work. Do not restart the project or replace Vinext.

Use sub-agents in every new chat whenever the work can be divided into independent tasks. Give them separate files or clearly bounded research, implementation, review and testing jobs so they can work in parallel without overwriting each other. Keep tightly coupled changes with the main agent, then have the main agent integrate the results, run the final checks and publish the finished version.

Before changing course copy, use `stop-slopv4`. Before changing the website, use the site-building instructions. Test the production build and lint before pushing. Publish through `git push origin main`, then confirm the connected Worker updated with a read-only request. Do not use the local Wrangler session while it points at Hero Enterprise.

If no more specific task has been given, the next concrete job is to design and build Lesson 1.2, `Your project brain`, while first extracting the shared lesson shell and course map so the next 22 lessons are easier to add.
