# AI course curriculum research

This file records the curriculum audit behind the next version of AI school. It compares the current [course outline](./aicourse.md) with six roadmap.sh learning maps, then proposes an order that takes a complete beginner from web chat to a repeatable, checked workflow.

This is a research record, not the active course outline. The agreed pathway now lives in `aicourse.md`.

Research captured on 15 August 2026.

## Short answer

The current course has the right destination and most of the right material, but the learner reaches several ideas before their prerequisites. The main problems are:

1. Lesson 1.1 moves from web chat into IDEs and command line agents before the learner has practised writing a useful request.
2. Context rot appears before a basic lesson on prompts, source material and output requirements, so the learner is asked to manage a workflow they have not yet used deliberately.
3. The dependable workflow is split between Chapter 1, the model test in Chapter 2, the task brief in Chapter 3, and verification and Git in Chapter 6.
4. Source control, permissions, secrets and tests arrive too late. A learner should have a safe checkpoint and a way to check work before an agent edits project files.
5. The course jumps from a single agent to skills and fleets without first explaining tools, permissions and the agent loop.

Most existing lessons can move into a clearer sequence, while a small number of new lessons can fill the gaps between web use, project work and agent work.

## What deterministic means here

Owner correction, 15 August 2026: the earlier framing in this section was too weak. The course owner researched deterministic AI for his dissertation and now works on deterministic AI at Cloudflare. AI answers can be narrowed materially. The useful question is not whether a model is probabilistic in isolation. It is how tightly the complete system restricts the outputs and actions it will accept.

A deterministic AI system can combine:

- fixed and versioned inputs;
- a pinned model, mode and generation settings where the platform exposes them;
- narrower sampling, seeds or deterministic decoding where supported;
- constrained decoding, grammars, schemas and enumerated values;
- a small set of permitted tools with typed inputs and outputs;
- deterministic code around the model for routing, calculation and validation;
- retries with an explicit stopping rule;
- rejection of outputs that fail the contract;
- tests and recorded evidence for the accepted result.

Exact token-for-token reproduction is one form of determinism, but it is not the only useful form. A system can allow variation inside a bounded field while guaranteeing that the response has the required structure, uses an approved action and either passes validation or fails safely. The course should teach the learner to decide what may vary, narrow everything else and measure the remaining boundary.

Cloudflare Workers AI documentation provides a practical example: JSON Mode accepts a JSON Schema and returns an error when the requested structure cannot be met. The documentation also warns that a model may fail a complex schema, which is why validation and failure handling remain part of the deterministic path. Source: [Cloudflare Workers AI JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/).

## Sources and method

I inspected the topic diagrams and supporting copy on each roadmap page. The lists below group and paraphrase the concepts, rather than copying the roadmaps word for word. Product names are retained where they describe the tools included by the source.

- [Claude Code roadmap](https://roadmap.sh/claude-code)
- [Vibe coding roadmap](https://roadmap.sh/vibe-coding)
- [AI engineer roadmap](https://roadmap.sh/ai-engineer)
- [Prompt engineering roadmap](https://roadmap.sh/prompt-engineering)
- [AI agents roadmap](https://roadmap.sh/ai-agents)
- [Forward deployed engineer roadmap](https://roadmap.sh/forward-deployed-engineer)

These roadmaps target different readers. The Claude Code and vibe coding maps are closest to the practical building journey in AI school. The prompt engineering map fills the missing web usage foundations. The AI engineer and AI agents maps explain what belongs after those foundations. The forward deployed engineer map is an advanced professional roadmap, so it is most useful for its approach to scoping, delivery and communication, rather than its technical prerequisites.

## Source scan

### Claude Code roadmap

The Claude Code roadmap starts with the difference between vibe coding, coding agents and the agent loop, then introduces the available interfaces and payment routes. Its core topics are:

- setup through the command line, desktop app, editor integrations and mobile channels;
- ways to pay, including subscriptions and API usage;
- the difference between models, modes, tools, context, skills, plugins, hooks, subagents and MCP;
- project instructions in `CLAUDE.md`, including file locations and a maintainable structure;
- a working loop that includes planning, permissions, session management, resume and rewind;
- deliberate model choice, including different capability and cost levels;
- context inspection, clearing, compaction, memory and project initialisation;
- common commands, shortcuts and ways to reference files or run shell commands;
- creating skills, subagents and hooks, with attention to their inputs and outputs;
- context cost, thinking effort, prompt caching and the cost of extensions;
- headless work, worktrees, scheduled jobs, agent teams and other scaling methods;
- security, tool connections, model configuration and output styles.

Curriculum implication: project instructions, planning, permissions, context management and one agent come before subagents, hooks, plugins and teams. The current AI school order broadly agrees, although it needs permissions and source control before the first agent change.

### Vibe coding roadmap

The vibe coding roadmap is more useful for beginners because it describes working habits as well as tools. It covers:

- the vibe coding mindset and a range of chat, coding and visual building products;
- planning an MVP and later phases before writing code;
- working through one step at a time and giving the AI mockups, code samples or images;
- choosing a familiar technical stack and recording style or coding preferences;
- keeping files modular, reviewing early architectural decisions and scheduling refactoring;
- specific prompts, one task at a time, examples, reference files and explicit exclusions;
- maintaining a context document such as `CLAUDE.md` when the project learns something worth keeping;
- starting a fresh session after repeated failure or when the next task is unrelated;
- debugging from error messages and logs, while understanding what failed instead of accepting a patch blindly;
- regular Git commits, clean feature starts and recovery through source control;
- tests, including regression tests for bugs and browser level checks;
- secret handling, environment variables and security review;
- specification driven development as the step after informal prompting.

Curriculum implication: planning, standards and a small specification should appear before substantial agent work. Git, tests and secret handling are part of the building loop, not material to leave until release day.

### AI engineer roadmap

The AI engineer roadmap assumes that the learner can already build software. Its topic sequence still gives a useful dependency map:

- LLM terminology, including tokens, context, sampling, inference, embeddings, training, vector databases, RAG and agents;
- temperature, top k, top p and repetition controls;
- prompt anatomy, input format, system instructions, role, context, constraints and structured output;
- zero shot, few shot, ReAct and other prompting methods;
- context sources, security, evaluation, dynamic retrieval, memory, compaction, long context, historical state and isolation;
- model families, open and closed weights, self hosting and model selection;
- provider APIs, SDKs and compatible interfaces;
- embeddings, semantic search, vector databases and RAG implementation;
- agent use cases, tools, function calling, agent SDKs and MCP;
- prompt injection, privacy, bias, moderation, adversarial tests and constrained inputs and outputs;
- tracing, logs, cost and latency monitoring, production monitoring and evaluation;
- deterministic checks, model based evaluation, human evaluation and regression testing;
- multimodal work with images, audio and video.

Curriculum implication: AI school already covers model choice and context at a suitable beginner level. It is missing structured output, basic generation controls, prompt versioning, safety and the distinction between deterministic checks and model judged checks. Embeddings, vector databases and RAG can remain an optional later track because they are not required for the promised beginner workflow.

### Prompt engineering roadmap

The prompt engineering roadmap starts with LLMs, prompts, tokens, context windows, hallucinations, agents and prompt injection. It then covers:

- model providers and the fact that model choice affects the result;
- output controls such as maximum length, stop conditions and structured output;
- temperature, top k, top p, frequency penalties and presence penalties;
- zero shot and few shot prompts;
- system, role and contextual instructions;
- step back, chain based, tree based, ReAct and self consistency methods;
- using a model to improve a draft prompt and testing the result;
- examples for structure and style;
- short, clear instructions with labelled sections and reusable placeholders;
- explicit output formats such as Markdown, CSV or JSON;
- tuning for creativity or repeatability;
- prompt injection defence and safe handling of user supplied text;
- automated evaluation, prompt version history, latency and cost checks;
- records of decisions, failures and lessons learned.

Curriculum implication: this is the largest gap in Chapter 1. A beginner needs prompt anatomy, examples, source material, output format and simple checking before context rot and project memory. Advanced reasoning prompt names do not need separate beginner lessons. The course can teach the common principle instead: ask for a visible plan, intermediate checks or evidence when the task has dependent steps.

### AI agents roadmap

The AI agents roadmap treats backend development, Git, terminal use and APIs as prerequisites. It then moves through:

- LLM behaviour, reasoning models, embeddings, RAG, context, pricing and generation controls;
- the agent loop: receive input, reason and plan, use a tool, observe the result and continue;
- useful prompts with context, examples, length and format requirements;
- tool definitions with a name, description, input and output schema, examples and error handling;
- tools such as search, code execution, database queries, APIs, messages and file access;
- MCP hosts, clients and servers, with local and remote deployment;
- short and long term memory, user profiles, retrieval, compression and forgetting;
- RAG agents, ReAct, planner and executor patterns, directed flows, multiple agents and self critique;
- direct API implementations, function calling and agent frameworks;
- unit tests for tools, integration tests for flows and human review;
- logs, tracing and monitoring;
- prompt injection, tool sandboxing, permissions, privacy, bias controls and red team testing.

Curriculum implication: AI school should explain the agent loop and tool permissions before asking the learner to manage agent work. Git and tests should also move ahead of the first file changing exercise. MCP, memory systems and agent frameworks are suitable optional or later material, while tools, permissions and human approval belong in the core route.

### Forward deployed engineer roadmap

The forward deployed engineer roadmap states that the role is not for beginners. It expects full stack development, Linux, system design, algorithms, AI engineering, DevOps and cloud deployment. The part that matters to AI school is the delivery layer:

- requirements gathering;
- technical scoping and sequencing;
- tradeoffs between scope, speed and quality;
- business impact and the expected return from AI work;
- stakeholder management;
- technical writing;
- a feedback loop between delivered work, product decisions and the next iteration;
- responsibility for showing that a system is safe and dependable in production.

Curriculum implication: the learner should define who the work is for and what outcome matters before choosing a tool. These ideas can improve the project brain, task brief, handover and maintenance lessons without turning the course into professional engineering training.

## Points shared by the sources

Across the six roadmaps, the same dependency chain appears repeatedly:

1. Learn what the model receives and what it can return.
2. Write a bounded request with useful context, examples and an output requirement.
3. Record project facts and start a fresh context when the task changes.
4. Plan the work and establish acceptance checks.
5. Protect the current state with version history before making changes.
6. Let one agent inspect, plan and act through explicit tools and permissions.
7. Test the result, record evidence and keep a handover.
8. Reuse a successful process through a specification, template or skill.
9. Add multiple agents only when tasks and ownership can be separated.
10. Deploy with security, monitoring, cost and maintenance in view.

The current course contains most of this chain, but steps two, five and six are incomplete, while step seven is divided between Chapters 2, 3 and 6.

## Current course comparison

| Concept | Current coverage | Assessment | Suggested treatment |
| --- | --- | --- | --- |
| AI and web chat basics | Introduction and Lesson 1.1 | Present | Keep first, but keep IDEs and command line agents out of the first practical lesson. |
| Prompt anatomy | Scattered through later task cards | Missing as a taught concept | Add goal, source material, constraints, output format and acceptance checks to Chapter 1. |
| Examples and reference material | Mentioned in tasks | Too implicit | Teach when examples help and how to attach or quote the relevant source. |
| Structured output | Almost absent | Missing | Add a beginner exercise using a list, table or fixed fields. Leave JSON as an optional technical example. |
| Hallucination and checking | Introduction and Chapter 6 verification | Introduced early, practised late | Add a simple web research check in Chapter 1, then deepen it later. |
| Privacy and sensitive input | Not a visible curriculum topic | Missing | Teach what not to paste into a public AI tool before file based work begins. |
| Context rot | Lesson 1.2 | Strong lesson, slightly early | Place after the learner has used a bounded prompt and source material. |
| Project memory | Lesson 1.3 | Strong | Keep early in the repeatable workflow chapter. |
| Files and handovers | Lesson 1.4 | Strong | Keep with project memory, before agent work. |
| Clean task loop | Lesson 1.5 | Strong | Make this the centre of the course promise and connect later lessons back to it. |
| Model choice | Chapter 2 | Strong | Keep before agent tools. Add a short section on model settings and repeatability. |
| Context windows | Lesson 2.3 | Strong | Keep the mechanism after the learner has already seen the practical symptom. |
| Fair model test | Lesson 2.4 | Strong | Rename its result as a recorded evaluation and reuse the same method later. |
| Project folders and IDEs | Lesson 1.1 | Present too early | Move to a workspace chapter immediately before agents. |
| Task brief | Lesson 3.1 | Strong, but late | Teach a simple request contract in Chapter 1, then expand it into an agent brief. |
| Agent inspection and review | Chapter 3 | Strong | Keep, with permissions and a Git checkpoint added before the first change. |
| Agent loop and tools | Implied | Missing | Explain inspect, plan, act, observe and report, plus the boundary created by tool permissions. |
| Git and recovery | Lesson 6.2 | Much too late | Move before an agent changes files. |
| Testing and debugging | Verification in 6.1, review in 3.4 | Too scattered | Put visible checks, error reading, logs and regression tests beside the change itself. |
| Secrets and permissions | Not a course topic | Missing | Add before coding agents, deployment or third party tools. |
| Skills and templates | Chapter 4 | Strong | Keep after one successful agent workflow. |
| Multiple agents | Chapter 5 | Correctly delayed | Keep after skills, but teach context isolation, ownership and shared file risk. |
| MCP and external tools | Not a course topic | Missing | Add a plain language introduction before fleets, with no requirement to build a server. |
| Deployment and maintenance | Chapter 6 | Strong | Keep last, with monitoring, cost and feedback added. |
| RAG, embeddings and vector databases | Absent | Reasonable omission | Keep outside the core beginner route, then consider an AI engineer extension. |
| APIs and SDKs | Absent | Reasonable omission | Add only if a later developer route needs them. |

## Why the current order feels off

The first chapter tries to do two jobs. It introduces AI to a web user, then immediately introduces project folders, IDEs and command line agents. The next lesson steps back into chat context. This creates a forward jump followed by a backward jump.

The middle of the course is clearer, because model choice before agent work is sensible. The problem is that the learner reaches an agent without the two safety mechanisms that every coding focused roadmap treats as prerequisites: version control and tests.

The final chapter then teaches verification and source control after the learner has already made changes, created skills and coordinated multiple agents. Those ideas should still return during shipping, but their first practical use needs to happen much earlier.

## Recommended course order

This is the preferred structure if the course can grow from six chapters to eight. It keeps the existing lessons where they fit, and it makes the move from web AI to controlled project work visible.

### Course introduction

Set the learner promise, explain that AI outputs can be narrowed, and preview the controls used throughout the course: fixed inputs, bounded outputs, permitted actions, validation and recorded evidence. Mention later mechanisms without teaching them in full here.

### Chapter 1: Use AI on the web

1. **What AI can and cannot do.** Keep the web chat part of the current Lesson 1.1, including ChatGPT, Claude and Gemini.
2. **Write a useful request.** Teach goal, context, source material, constraints and required output.
3. **Use examples and files.** Show when to attach a source, give an example and request a table or fixed set of fields.
4. **Check the answer.** Practise checking a claim against a supplied source, noticing uncertainty and protecting private information.
5. **Know when to start fresh.** Move the current context rot lesson here, after the learner has enough experience to recognise the failure.

Learner outcome: complete a small web based task with a clear request, supplied evidence and a visible check.

### Chapter 2: Build a repeatable project workflow

1. **Define the result.** Turn the Chapter 1 request into a small task with acceptance checks.
2. **Your project brain.** Use the current Lesson 1.3.
3. **Files and handovers.** Use the current Lesson 1.4.
4. **A clean task loop.** Use the current Lesson 1.5 and make define, load, change, check and record the recurring course pattern.
5. **Repeat the same task.** Run a simple task twice from the same brief, decide what must match, then compare both the accepted output and the evidence.

Learner outcome: repeat a small project task from maintained files without relying on one long chat.

### Chapter 3: Models, context and controls

1. **What models change.** Use the current Lesson 2.1.
2. **Speed, cost and reasoning.** Use the current Lesson 2.2.
3. **Tokens and context windows.** Use the current Lesson 2.3, with tokens introduced before the window.
4. **Settings and output control.** Introduce creativity versus repeatability, response length and structured output, while making clear that web tools expose different controls.
5. **A fair model test.** Use the current Lesson 2.4 and record task, model, mode, date, prompt, result and decision.

Learner outcome: choose and test a model based on the work, settings, cost and evidence.

### Chapter 4: Move from chat to a workspace

1. **Files, folders and an editor.** Move the IDE and project folder material out of Lesson 1.1.
2. **What a coding agent can access.** Explain files, terminal commands, search and external tools in plain language.
3. **Git as a checkpoint.** Move the first practical part of current Lesson 6.2 here.
4. **Permissions, secrets and safe boundaries.** Cover approvals, minimum access, environment variables and sensitive files.
5. **Read errors and run checks.** Introduce logs, simple tests and the idea of reproducing a bug before fixing it.

Learner outcome: open a project safely, create a recoverable checkpoint and understand what the agent can change.

### Chapter 5: Build with one agent

1. **Write the agent brief.** Expand the Chapter 1 request contract with project files, constraints and checks.
2. **Let the agent inspect and plan.** Use the current Lesson 3.2.
3. **Make one contained change.** Use the current Lesson 3.3, with a Git checkpoint already in place.
4. **Test and review the result.** Combine the strongest parts of current Lessons 3.4 and 6.1.
5. **Record the result and handover.** Close the loop by updating the project brain, change history and next action.

Learner outcome: supervise one agent through inspect, plan, change, test and report without losing the previous working state.

### Chapter 6: Specifications, skills and repeatable work

1. **From a good result to a specification.** Record the inputs, process, output and checks that worked.
2. **What a skill is.** Use the current Lesson 4.1.
3. **Write your first skill.** Use the current Lesson 4.2.
4. **Use templates well.** Use the current Lesson 4.3.
5. **Improve it from recorded results.** Use the current Lesson 4.4, with prompt and skill version history.

Learner outcome: turn one checked workflow into a maintained instruction that can be used again.

### Chapter 7: Tools and agent teams

1. **How agents use tools.** Explain actions, inputs, outputs, errors and permission boundaries.
2. **What MCP connects.** Give a conceptual introduction to hosts, clients and servers without requiring code.
3. **When parallel work helps.** Use the current Lesson 5.1.
4. **Divide jobs and isolate context.** Use current Lesson 5.2, adding one owner and one output for each job.
5. **Write clean handovers.** Use current Lesson 5.3.
6. **Merge without chaos.** Use current Lesson 5.4, with tests and Git as required evidence.

Learner outcome: decide when work can run independently and combine the results without overlapping edits or hidden assumptions.

### Chapter 8: Ship and maintain

1. **Run the final checks.** Revisit acceptance criteria, regression tests, privacy and security.
2. **Prepare the change history.** Deepen Git and GitHub from checkpointing into review and collaboration.
3. **Deploy within known limits.** Use the current deployment lesson, with cost and rollback included.
4. **Monitor the live result.** Add logs, failure reports, usage cost and user feedback.
5. **Maintain the system.** Use the current final lesson and connect every update back to the clean task loop.

Learner outcome: release a checked project, observe what happens and return to it with enough context to make the next safe change.

## Lower disruption option

If eight chapters would make the course too long, the current six chapter shape can remain with these changes:

1. Add one practical prompt lesson after Lesson 1.1, then place context rot after it.
2. Move the IDE, project folder and command line agent material from Lesson 1.1 to the start of Chapter 3.
3. Move source control from Chapter 6 to Chapter 3, before the first agent edit.
4. Add permissions, secrets and a basic test before the agent makes a change.
5. Keep Chapter 2 in its current position, but add structured output and model settings to it.
6. Add a short tools and MCP concept lesson before fleets.
7. Keep final verification in Chapter 6 as a release check, even though the learner first practises checking much earlier.

This option fixes the confusing transitions without rebuilding the course map or greatly increasing the lesson count.

## Topic backlog

### Core topics to add

- prompt anatomy;
- examples and source material;
- structured output;
- privacy in web AI tools;
- model settings and repeatability;
- Git checkpoints before agent edits;
- debugging from errors and logs;
- tests beside the change;
- agent loop and tool boundaries;
- permissions, secrets and human approval;
- prompt and skill version history;
- monitoring and feedback after deployment.

### Existing topics to move

- move IDEs, project folders and command line agents out of Lesson 1.1;
- place context rot after the first useful request exercise;
- move first use of Git from shipping to the workspace setup;
- bring practical verification forward, then revisit it at release;
- keep multi agent work after one agent, skills, tools and tests.

### Optional later tracks

- APIs and SDKs;
- embeddings and semantic search;
- vector databases;
- RAG;
- building MCP clients or servers;
- agent frameworks;
- self hosted model operations;
- observability platforms;
- multimodal application development;
- advanced security and red team testing;
- the professional forward deployed engineer route.

## Decisions still needed

Before changing the live course map, decide:

1. Whether AI school should remain a 25 lesson foundation course or become a longer route with explicit web, workspace and agent stages.
2. Resolved: deterministic control is part of the public course promise. Define it in the introduction as narrowing accepted outputs and actions, then repeat the same control loop in every chapter.
3. Whether coding is the single destination or one project type among writing, research, operations and software. This affects how early IDEs and Git should appear.
4. Whether APIs, RAG and MCP implementation belong in this course or in a later AI engineer course.
5. Whether the current completed lessons should be moved intact first, then revised, or rewritten before the navigation changes.

My recommendation is to agree the chapter structure before building more lessons. The next implementation should then update `aicourse.md`, `courseData.ts` and the introduction together, so the promise, navigation and lesson prerequisites stay consistent.
