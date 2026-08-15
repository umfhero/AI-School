# Previous AI workflow course archive

This file records what the first version of the AI workflow course actually taught before the curriculum reset on 15 August 2026. It is a content backup, not a plan for the replacement course. Planned lessons that were never published have been removed.

The retired lesson source remains available in Git history, with commit `804b52c` containing the final visual version. Curriculum research and the proposed replacement order are recorded in [aicourse-research.md](./aicourse-research.md).

## Course shape before the reset

The published course contained a task free introduction, five lessons in Chapter 1 and four lessons in Chapter 2. The introduction awarded 500 XP, Lesson 1.1 had two tasks, and the other eight lessons had three tasks each.

The course tried to move from basic AI usage into project memory, model choice and agent work. In practice, it repeated project memory several times, introduced project folders and coding tools before prompt fundamentals, and left source control and practical verification in unpublished later chapters.

## Course introduction

### Title

Learn to work with AI, without losing the thread.

### What it covered

- The course was for non technical beginners who wanted to build work that lasted beyond one chat.
- AI was described as pattern based software rather than human intelligence.
- The lesson introduced hallucinations, checking evidence and keeping responsibility for the result.
- It previewed models, context, agents, project memory, reusable skills, parallel work and shipping.
- It described the original six chapter path before the learner had practised any of those ideas.
- It ended with a short explanation of using evidence to judge AI output.

### Visuals and interaction

- An interactive six chapter course map.
- A task free completion card worth 500 XP.

### Sections

1. A practical course for work that lasts beyond one chat.
2. For curious beginners who want a calmer way to build.
3. AI is stupid, even when it sounds confident.
4. Six chapters, one connected workflow.
5. Use AI with enough evidence to trust the result.

## Chapter 1: The basics

### Lesson 1.1: AI?

#### What it covered

- AI as software that learns patterns from data and works with language, images, code and other information.
- AI as a fast assistant that can still invent facts, miss constraints or produce confident weak work.
- The difference between creating a fast first version and creating something that people use.
- Web chat products, including ChatGPT, Claude and Gemini.
- The fact that products combine models with their own settings, guardrails, search and information sources.
- The difference between a quick question and an ongoing project.
- Project folders, IDEs, Visual Studio Code and Cursor.
- Command line or agent focused tools such as OpenCode, Claude Code and Codex.
- A suggested learning order from web chat, to an IDE, to a non IDE agent.

#### Visuals

- An interactive AI workbench showing how a vague request, a clear brief and a checked workflow change the result.
- A chart comparing growth in apps created with flatter growth in app usage.

#### Tasks

1. **Match the setups.** Match web AI, IDE, project folder and non IDE agent descriptions.
2. **Order the setups.** Put web chat, IDE and non IDE agents into the intended beginner order.

### Lesson 1.2: Context rot

#### What it covered

- How one conversation becomes crowded when old requests, corrections and unrelated work collect in it.
- Context rot as inconsistent use of the right information, rather than a permanent loss of model capability.
- The difference between a long mixed conversation and a fresh task chat with only relevant facts.
- Why more context can make a simple task less reliable.
- The idea of moving durable project facts out of a chat and into `overview.md`.
- A practical comparison between three popular web chat tools.

#### Visuals and sources

- A context pressure control that compared a short chat, accumulated old work and a fresh task chat.
- A research figure based on Chroma's Context Rot work.
- A simulated conversation and project file view.
- Sources from Chroma Research and the Lost in the Middle paper by Liu and colleagues.

#### Tasks

1. **Find the drift.** Locate where a conversation stopped following an important rule.
2. **Compare the workflows.** Compare one crowded chat with a clean task based workflow.
3. **Make the file.** Create an `overview.md` file for a small example project.

### Lesson 1.3: Your project brain

#### What it covered

- `overview.md` as a small source of truth that a fresh chat can read.
- Six facts the file should answer: goal, audience, constraints, current state, settled decisions and next action.
- Keeping the file short enough to read and update.
- The damage caused by old facts that remain after a decision changes.
- Updating the file when the project learns something worth keeping.
- Reading the file as a stranger would, so missing context becomes visible.

#### Visuals

- A project brain preview for a study planner.
- An interactive project memory diagram that compared a chat alone with several chats loading the same `overview.md` file.

#### Tasks

1. **Pick the facts.** Select the six facts that belong in a project overview.
2. **Keep it useful.** Choose the maintenance habit that keeps the file accurate.
3. **Check your file.** Answer four questions from the learner's own project file rather than memory.

### Lesson 1.4: Files and handovers

#### What it covered

- The difference between a chat, a file and a project folder.
- A simple project structure containing `overview.md`, notes, application files and `handover.md`.
- Giving instructions, research, drafts and decisions a file that another session can find.
- A handover as a short record of what changed, what remains, where to start and what is uncertain.
- Writing for a colleague, a future chat or the learner returning after a break.

#### Visuals

- A project folder preview showing the purpose of four files or folders.
- An interactive handover viewer that compared reconstructing old work with continuing from a saved record.

#### Tasks

1. **Pick the home.** Decide where an important project decision should be kept.
2. **Keep the useful parts.** Select the information that belongs in a handover and reject the full chat transcript.
3. **Write a handover.** Record what changed, what remains and where the next person should start.

### Lesson 1.5: A clean first workflow

#### What it covered

- A five part routine: define, give context, change, check and record.
- Giving a fresh chat the project brain and only the files needed for the current task.
- Making one contained change, checking it against the task and recording what the next task needs.
- Spending a few minutes on structure at the start to avoid a larger repair later.
- Treating the workflow as a practical habit rather than a fixed rulebook.

#### Visuals

- An interactive workflow diagram that stepped through define, load, change, check and record.
- A compact course map that connected the Chapter 1 habits.

#### Tasks

- A five question true or false chapter quiz.
- The stored progress used three completion markers named `define`, `check` and `update` when the learner passed the quiz.

## Chapter 2: Pick the right model

### Lesson 2.1: What models change

#### What it covered

- The model as the engine inside an AI product.
- Differences in writing, reasoning, code, image understanding and instruction following.
- The effect of the surrounding product, including search, tools, safety rules, memory and interface.
- Choosing the capability that matches the task rather than treating one model as universally best.
- Hosted products and APIs compared with open weight models that can run through a local or controlled system.
- The extra responsibility involved in running model weights, including hardware, setup, security, updates and maintenance.
- Leaderboards as a way to form a shortlist rather than a final decision.
- Current model information from Artificial Analysis and LLM Stats.

#### Visuals

- An interactive model factor control for writing, reasoning and image review.
- A live model ranking panel with speed, price, context and benchmark information.
- Provider and model logos for OpenAI, Anthropic, Gemini, DeepSeek, Qwen and Ollama.
- Hosted and open weight deployment comparisons.

#### Tasks

1. **Match the strength.** Match requests to writing, reasoning, code or image capability.
2. **Match the measure.** Match jobs to the first leaderboard measure worth checking.
3. **Match the constraint.** Match situations to hosted or controlled deployment priorities.

### Lesson 2.2: Speed, cost and reasoning

#### What it covered

- Time to first output and output speed as different parts of perceived speed.
- Faster models for live or repetitive work, and slower reasoning modes for tasks with dependent steps.
- Waiting longer as a poor substitute for checking correctness.
- Free plans, subscriptions and API usage.
- Price per token compared with the real cost of completing a task, including retries and review.
- Matching model spend and checking effort to the consequence of a wrong answer.

#### Visuals

- A Stanford AI Index chart of estimated model training costs.
- An interactive decision console comparing quick, everyday and high consequence work.
- A three path cost diagram for free plans, subscriptions and API usage.
- A consequence ladder for low, medium and high consequence tasks.

#### Tasks

1. **Match the pace.** Match work to a suitable speed and reasoning priority.
2. **Match the cost.** Match payment routes to their practical cost behaviour.
3. **Match the consequence.** Match task consequences to model effort and review.

### Lesson 2.3: Context windows

#### What it covered

- Tokens as pieces of information rather than a simple word count.
- The context window as the combined space for input and output.
- Larger capacity as useful for long documents, code and conversation history.
- Capacity and reliability as separate questions.
- How old plans, corrections and unrelated material can compete with the current instruction.
- Why a concise project brain still matters when a model accepts a large amount of context.
- Clearing a conversation as a controlled reset, followed by reloading the project overview, task and relevant files.

#### Visuals and sources

- A transformer attention diagram by Zhang and colleagues.
- An interactive context viewer with clean, noisy and cleared states.
- A large noisy context compared with a small relevant one.
- A four stage context clearing diagram.
- Definitions from Google and Anthropic documentation.

#### Tasks

1. **Match the context.** Match examples to what fits inside the active request.
2. **Match signal and noise.** Separate useful task material from distracting history.
3. **Clear and reload.** Put the safe context reset into the correct order.

### Lesson 2.4: A simple model test

#### What it covered

- Choosing a bounded task that can be checked without guessing.
- Giving two models the same prompt, source material and similar settings.
- Writing pass conditions before seeing the answers.
- Criteria such as correct facts, length, citations and absence of invented details.
- Comparing evidence instead of tone or brand preference.
- Recording task, model, mode, date, prompt, result and decision so the test can be repeated.
- Treating a model decision as local to the tested task and settings.

#### Visuals

- A benchmark history chart from the International AI Safety Report.
- An interactive model test bench that ran two example models against shared criteria.
- A reusable model test record.

#### Tasks

1. **Define success.** Match a task with visible pass conditions.
2. **Read the result.** Judge outputs against the shared criteria.
3. **Record the decision.** Select the information needed to repeat the comparison.

## What should be reused

- The full lesson shell with its header, responsive contents toggle, reading area and bottom navigation.
- The flat pixel style, hard borders, offset shadows and shared pixel icons.
- The pattern of one clear concept followed by an on page interactive diagram.
- Responsive side tasks that open only when a lesson needs practice.
- Completion, saved progress and XP behaviour, once the new curriculum decides where tasks belong.
- Downloaded charts, diagrams, model logos and source records, when they support a lesson in the replacement course.

## What should not carry forward automatically

- The old six chapter navigation.
- The separate course introduction and its 500 XP gate.
- The Chapter 1 project named “Build your project brain”.
- Repeated explanations of `overview.md` across several lessons.
- IDE and command line agent material inside the first beginner lesson.
- Task counts chosen before the new lesson outcomes are clear.
- Any planned Chapter 3 to Chapter 6 copy from the earlier outline.
