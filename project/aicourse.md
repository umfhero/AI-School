# AI school course pathway

This is the source of truth for the rebuilt AI school curriculum. The course takes a complete beginner from using AI in a web page to designing, testing and maintaining controlled AI workflows.

The previous curriculum is preserved in Git history. Commit `804b52c` contains the final version before the reset, while [aicourse-research.md](./aicourse-research.md) records the roadmap research and curriculum audit behind this pathway.

## Course promise

AI school teaches the learner how to narrow what an AI system is allowed to do, make the important inputs visible, check the result and keep enough evidence to repeat the work.

The course does not treat determinism as a choice between identical prose and chaos. Model behaviour can be narrowed through fixed inputs, clear boundaries, constrained decoding, schemas, tools, validation, retries and ordinary code. The correct level of control depends on the job. A creative draft can allow a broad answer space. A data extraction or production action may require one valid structure, one approved tool path and a hard pass or fail check.

Every chapter adds one layer of control to the same working loop:

1. Define the result.
2. Supply the right context.
3. Narrow the allowed output or action.
4. Run the work.
5. Check it against visible conditions.
6. Record what happened.

## Teaching rules

- Start in familiar web AI products before introducing files, terminals or code.
- Explain one new system boundary at a time, then show it in an original SVG diagram.
- Every concept lesson needs at least one relevant, accessible SVG diagram. Motion must explain movement, state or sequence and must stop for reduced motion preferences.
- Use sourced images only when the original chart, interface, model, hardware or research figure is the evidence. Keep the source and teaching caption attached.
- Put practice on the page after the idea it checks. Do not use side tasks.
- Give a task only when doing something improves understanding. The pathway lesson has no task.
- Use British English and plain language. Define technical terms at first use.
- Return to the control loop throughout the course so later agent work feels like an extension of earlier web work.
- Treat privacy, permissions, recovery and verification as part of the workflow, not release-day extras.

## Chapter 1: Start with web AI

The learner begins with tools they can open in a browser. This chapter establishes what the product receives, why answers change and how to judge an answer before trusting it.

### Lesson 1.1: Your AI course pathway

- Show the full route from web chat to a maintained AI system.
- Introduce the recurring control loop without teaching every mechanism.
- Explain where deterministic control enters the course.
- Set expectations for diagrams, practical tasks and lesson completion.
- Include one animated course pathway SVG.
- Include no task. Reading the orientation unlocks the completion button immediately.

### Lesson 1.2: What AI is doing

- Separate the model from the web product wrapped around it.
- Explain prediction, training, inference and why fluent text is not proof.
- Compare language, image and code capabilities without treating a model as a person.

### Lesson 1.3: Give AI a clear job

- Write a request with an outcome, audience, source material, limits and output shape.
- Compare vague requests with bounded requests.
- Show how exclusions prevent plausible but unwanted work.

### Lesson 1.4: Use context, examples and files

- Decide what the model needs for the current job.
- Use examples to define structure or style.
- Attach or quote the source instead of asking the model to guess.

### Lesson 1.5: Check the answer

- Check claims against supplied evidence and original sources.
- Separate factual correctness, instruction following and usefulness.
- Notice uncertainty, missing evidence and invented detail.

### Lesson 1.6: Protect private information and start fresh

- Decide what should not be pasted into a public AI product.
- Recognise when old conversation is competing with the current job.
- Start a clean conversation and reload only the useful context.

Learner outcome: complete a small web task with a bounded request, relevant evidence and a visible check.

## Chapter 2: Narrow and control the result

This chapter makes determinism practical. The learner moves from asking for a good answer to defining the set of answers or actions that the system may accept.

### Lesson 2.1: Define the accepted result

- Turn an intention into observable pass conditions.
- Separate required fields, optional content and forbidden content.
- Decide what can vary and what must stay fixed.

### Lesson 2.2: Control the output shape

- Request fixed headings, tables and named fields.
- Introduce JSON and schemas as machine-readable contracts.
- Explain that a format constraint narrows structure, not truth.

### Lesson 2.3: Control generation

- Explain temperature, top p, seeds and stop conditions in plain language.
- Show which controls reduce variation and which controls only limit length or sampling.
- Record the model, version and exposed settings when repeatability matters.

### Lesson 2.4: Constrain actions with tools

- Replace a free-form instruction with a small set of permitted actions.
- Give each tool named inputs, expected outputs and error behaviour.
- Keep approval around consequential actions.

### Lesson 2.5: Validate, retry and reject

- Check schema, evidence and business rules outside the model.
- Retry only when the failure can be corrected safely.
- Reject an invalid result instead of forcing every run to succeed.

### Lesson 2.6: Build a deterministic path

- Combine fixed inputs, constrained outputs, bounded tools and hard checks.
- Compare exact repeatability with bounded repeatability.
- Run the same small workflow more than once and inspect the accepted result, not only its wording.

Learner outcome: design a small AI workflow whose acceptable outputs and failure behaviour are explicit.

## Chapter 3: Keep a repeatable project

The learner moves useful context out of one conversation and into maintained project files.

### Lesson 3.1: Define the project result

- Record the user, purpose, finish condition and current scope.
- Turn the accepted result from Chapter 2 into a project brief.

### Lesson 3.2: Create a project source of truth

- Keep durable facts, constraints, decisions and current state in one short overview.
- Remove facts that are no longer true.

### Lesson 3.3: Organise files and handovers

- Give research, decisions, drafts and outputs a predictable home.
- Record what changed, what remains and where the next session starts.

### Lesson 3.4: Clear and reload context

- Separate the model's context capacity from the relevance of what fills it.
- Reset a crowded session, then load the project overview and task files.

### Lesson 3.5: Use the control loop

- Practise define, load, constrain, run, check and record.
- Repeat a project task without relying on one long chat.

Learner outcome: resume and repeat a project task from maintained files rather than memory.

## Chapter 4: Choose models and measure results

The learner chooses a model as one part of the system, based on the work and the evidence.

### Lesson 4.1: What the model changes

- Separate a model from product features such as search, memory and tools.
- Compare hosted, open-weight and locally controlled options.

### Lesson 4.2: Speed, cost and reasoning

- Separate time to first output from output speed.
- Match reasoning effort and spend to the consequence of a wrong result.
- Measure the cost of a successful task, including retries and checking.

### Lesson 4.3: Tokens and context windows

- Explain tokens, input, output and context capacity.
- Separate a large context window from reliable use of every item inside it.

### Lesson 4.4: Run a fair evaluation

- Give models the same bounded task, source and settings.
- Write pass conditions before seeing the answers.
- Use deterministic checks, human review and model-based evaluation for different jobs.

### Lesson 4.5: Record a model decision

- Save the task, model, version, mode, date, input, result and decision.
- Re-test when a provider, model or important dependency changes.

Learner outcome: choose and test a model based on evidence, latency, cost and the required control boundary.

## Chapter 5: Move into a safe workspace

The learner moves from a browser conversation into files an agent can inspect and change.

### Lesson 5.1: Files, folders and editors

- Read a project tree and find the files that matter.
- Distinguish an editor, terminal, repository and running application.

### Lesson 5.2: What an agent can access

- Explain file search, edits, commands, browser access and external services.
- Make tool access visible before work starts.

### Lesson 5.3: Make a Git checkpoint

- Save a known working state before an agent changes files.
- Inspect the exact difference and recover a previous version.

### Lesson 5.4: Set permissions and protect secrets

- Grant the smallest useful access.
- Keep credentials in secret or environment settings rather than project files.
- Require approval for destructive or external actions.

### Lesson 5.5: Read errors and run checks

- Reproduce a problem, read the error and inspect relevant logs.
- Run focused tests before and after a change.

Learner outcome: open a project safely, protect its working state and understand what an agent may change.

## Chapter 6: Build with one agent

The learner supervises one agent through a complete, contained change.

### Lesson 6.1: Understand the agent loop

- Follow inspect, plan, act, observe and report.
- See where the model decides and where ordinary code enforces a boundary.

### Lesson 6.2: Write the agent brief

- Name the result, relevant files, constraints, exclusions and checks.
- Give the agent enough context to inspect before proposing a change.

### Lesson 6.3: Inspect and plan

- Ask the agent to prove what it found in the project.
- Review the plan before authorising a material change.

### Lesson 6.4: Make one contained change

- Keep one owner, one scope and one visible result.
- Stop when the task needs authority or information outside the brief.

### Lesson 6.5: Test, review and hand over

- Inspect the diff, run the relevant checks and review the live behaviour.
- Record the result, remaining uncertainty and next safe action.

Learner outcome: supervise one agent from inspection to checked handover without losing the previous working state.

## Chapter 7: Reuse and scale the workflow

The learner turns a successful run into maintained instructions, then adds tools or parallel work only where the boundaries are clear.

### Lesson 7.1: Turn a result into a specification

- Record inputs, steps, output contract, failure behaviour and checks.
- Separate a reusable rule from details that belong to one project.

### Lesson 7.2: Build templates and skills

- Use templates for repeated structure.
- Use a skill for repeatable judgement, actions and validation.

### Lesson 7.3: Connect tools and MCP

- Explain hosts, clients and servers in plain language.
- Review permissions, schemas, errors and ownership before connecting a tool.

### Lesson 7.4: Decide when parallel work helps

- Split only independent jobs with separate inputs and outputs.
- Avoid several agents editing the same source at once.

### Lesson 7.5: Merge work with evidence

- Require a clean handover from each job.
- Combine changes through Git, tests and one final owner.

Learner outcome: reuse a checked workflow and scale it without losing ownership, context or evidence.

## Chapter 8: Ship and maintain

The learner releases the work, observes its real behaviour and returns to the same control loop for each change.

### Lesson 8.1: Run the release checks

- Revisit acceptance conditions, regression tests, privacy and security.
- Confirm the production boundary matches the tested boundary.

### Lesson 8.2: Prepare the change history

- Write a useful commit and review the final difference.
- Keep enough history for another person to understand and recover the release.

### Lesson 8.3: Deploy and roll back

- Deploy within known service and cost limits.
- Confirm the live version and retain a tested recovery route.

### Lesson 8.4: Observe the live result

- Use logs, failure records, user reports, latency and cost.
- Separate a system problem from an isolated model response.

### Lesson 8.5: Maintain the system

- Re-test after model, prompt, data, tool or platform changes.
- Feed evidence back into the specification, checks and project record.

Learner outcome: release a checked AI system, observe it and make the next change from a recoverable state.

## Scope held for later courses

These topics are useful but are not prerequisites for the core pathway:

- provider APIs and SDK implementation;
- embeddings, semantic search and vector databases;
- retrieval augmented generation;
- building MCP clients or servers;
- agent frameworks;
- self-hosted model operations;
- multimodal application development;
- advanced evaluation, observability and red team testing;
- the professional forward deployed engineer route.

## Live implementation state

Only Lesson 1.1 is currently published. Later lessons remain a curriculum plan until their copy, SVG concept diagram, practice and checks have been built and tested through the shared lesson template.
