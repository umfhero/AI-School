# AI school course pathway

This is the source of truth for the rebuilt AI school curriculum. The course takes a complete beginner from using AI in a web page to designing, orchestrating and maintaining controlled AI systems.

The previous curriculum remains in Git history. Commit `804b52c` contains the final version before the reset, while [aicourse-research.md](./aicourse-research.md) records the roadmap research and curriculum audit behind this pathway.

## Course promise

AI school teaches the learner what sits inside an AI product, how to give it useful context, how to turn a successful chat into a repeatable workflow and how to control a larger system built from models, tools and agents.

Deterministic AI is taught after the learner understands models, context and workflows. It is not introduced in Lesson 1.1. When the topic arrives, the course treats determinism as a system design problem: decide what may vary, narrow the answer or action space, validate the result and fail safely when the contract is not met.

The course uses the same working loop at increasing levels of complexity:

1. Define the result.
2. Supply the right context.
3. Set the permitted output or action.
4. Run the work.
5. Check the evidence.
6. Record what happened.

## Why the order works

The learner uses web AI before learning model architecture. They learn models before managing context, manage context before building workflows, and understand workflows before controlling their repeatability. Project setup comes before file-changing agents. One agent comes before reusable skills, while skills and tool contracts come before subagents and orchestration. Deployment and monitoring come last because the learner first needs something controlled and testable to operate.

## Teaching rules

- Start in familiar web AI products before introducing files, terminals or code.
- Explain one new system boundary at a time, then show it in an original SVG diagram.
- Every concept lesson needs at least one relevant, accessible SVG diagram. Motion must explain movement, state or sequence and stop for reduced motion preferences.
- Use sourced images when the original chart, interface, model, hardware or research figure is the evidence. Keep the source and teaching caption attached.
- Put practice on the page after the idea it checks. Do not use side tasks.
- Give a task only when doing something improves understanding. The pathway lesson has no task.
- Use British English and plain language. Define technical terms when they first appear.
- Return to the control loop throughout the course so agents and orchestration extend habits the learner already understands.
- Treat privacy, permissions, recovery, testing and monitoring as parts of the workflow.

## Chapter 1: Use AI on the web

The learner starts with tools they can open in a browser and learns how to complete a small task without confusing fluent output with a checked result.

### Lesson 1.1: Your AI course pathway

- Show the complete route from a web prompt to an operated AI system.
- Explain every chapter and its practical outcome inside one detailed pixel SVG.
- Introduce the recurring working loop without teaching its mechanisms.
- Include no task. Reading the orientation unlocks lesson completion immediately.
- Do not introduce deterministic AI in this lesson.

### Lesson 1.2: What AI is doing

- Explain training and inference in plain language.
- Show prediction as a mechanism rather than human thought.
- Explain why fluent output is not proof of correctness.

### Lesson 1.3: Give AI a clear job

- Write a request with an outcome, audience, limits and output shape.
- Compare vague requests with bounded requests.
- State exclusions when a plausible answer could still be unwanted.

### Lesson 1.4: Use examples, sources and files

- Attach or quote the material the model needs.
- Use examples to define structure, tone or level of detail.
- Separate supplied evidence from facts the model has produced itself.

### Lesson 1.5: Check the answer

- Check claims against supplied evidence and original sources.
- Separate factual correctness, instruction following and usefulness.
- Notice uncertainty, missing evidence and invented detail.

### Lesson 1.6: Protect private information and start fresh

- Decide what should not be pasted into a public AI product.
- Recognise when an old conversation is competing with the current job.
- Start a clean conversation and reload only the useful material.

Learner outcome: complete a small web task with a clear request, relevant evidence and a visible check.

## Chapter 2: Understand models and AI products

The learner separates the model from the company, product and tools around it, then chooses capabilities without treating one brand as universally best.

### Lesson 2.1: Product, provider and model

- Separate a web product from the model inside it.
- Explain the roles of providers such as OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek and Alibaba.
- Show how product search, memory, safety rules and tools can change the result even when the underlying model is similar.

### Lesson 2.2: Training and inference

- Show how training creates model weights and inference uses those weights.
- Distinguish pretraining, later tuning and live generation.
- Connect compute, data and model size to practical trade-offs without treating size as quality.

### Lesson 2.3: Types of model

- Compare general language, reasoning, code, image, audio, multimodal and embedding models.
- Explain when a specialist model is a better fit than a larger general model.
- Separate model capability from tool access.

### Lesson 2.4: Closed models and open weights

- Explain hosted closed models, downloadable open-weight models and local inference.
- Compare control, hardware, privacy, maintenance and licence obligations.
- Avoid calling open weights open source unless the licence and training materials support that claim.

### Lesson 2.5: Speed, cost and reasoning

- Separate time to first output from output speed.
- Match reasoning effort and spend to the consequence of a wrong result.
- Measure the cost of a completed task, including retries and checking.

### Lesson 2.6: Choose and compare models

- Form a shortlist from task requirements rather than rankings alone.
- Give each model the same source, request and visible pass conditions.
- Record the model, mode, date, result and decision.

Learner outcome: explain what model and product they are using, then choose an option based on capability, control, cost and evidence.

## Chapter 3: Manage prompts and context

The learner controls what the model receives during one run and what should remain outside the active context.

### Lesson 3.1: Prompt anatomy

- Separate system instructions, the user request, source material, examples, constraints and output requirements.
- Use clear labelled sections for longer requests.
- Keep the current job easier to find than supporting detail.

### Lesson 3.2: Tokens and context windows

- Explain tokens as the units a model receives and produces.
- Show that input, tool results, history and output share a context budget.
- Separate context capacity from reliable use of everything inside it.

### Lesson 3.3: Context management

- Decide what belongs in the active context for the current task.
- Identify context rot, conflicting instructions and buried requirements.
- Remove material that no longer helps the current decision.

### Lesson 3.4: Clear, compact and reload

- Compare starting fresh, compacting a session and continuing the same thread.
- Reload the current goal, settled decisions and relevant files after a reset.
- Check that a summary has not dropped a constraint.

### Lesson 3.5: Memory and retrieval

- Separate active context, saved project memory, product memory and retrieved material.
- Introduce search, embeddings and retrieval at a conceptual level.
- Explain that retrieved material still needs relevance, permission and source checks.

### Lesson 3.6: Build a context pack

- Create a small reusable pack containing the goal, constraints, source files and expected output.
- Load the same pack into a fresh session and check what the model receives.

Learner outcome: build, clear and reload a context set that contains the information the current task needs.

## Chapter 4: Build AI workflows

The learner moves from one response to a visible sequence with state, checks and handovers.

### Lesson 4.1: Chat, workflow and agent

- Compare a single response, a fixed workflow and an agent that chooses its next action.
- Show where ordinary code, a model and a human each make decisions.
- Pick the simplest structure that can complete the job.

### Lesson 4.2: Define the workflow contract

- Name the input, accepted result, constraints and failure behaviour.
- Decide which fields and decisions must remain visible between steps.
- Write pass conditions before running the workflow.

### Lesson 4.3: Break work into steps and branches

- Separate fixed steps from decisions that depend on an earlier result.
- Pass only the required state into the next step.
- Stop a branch when its conditions are not met.

### Lesson 4.4: Add tools and approval points

- Give each tool a name, purpose, input, output and error contract.
- Keep human approval around consequential or external actions.
- Record which actor changed the state.

### Lesson 4.5: Record state and handovers

- Keep the current state outside one model response.
- Record what completed, what failed and what the next step receives.
- Resume a workflow without reconstructing its history from memory.

### Lesson 4.6: Run a repeatable workflow

- Run the same workflow more than once from known inputs.
- Compare the path, accepted result, failures and evidence.
- Improve the contract where the run exposed ambiguity.

Learner outcome: design and run a small AI workflow whose steps, state and checks are visible.

## Chapter 5: Build deterministic AI systems

The learner narrows model outputs and actions until the system meets the level of repeatability required by the job.

### Lesson 5.1: Decide what may vary

- Separate exact fields, bounded choices and free-form content.
- Define exact repeatability and bounded repeatability.
- Choose the required level before selecting a control.

### Lesson 5.2: Control generation

- Explain temperature, top p, seeds and stop conditions.
- Show which settings reduce variation and which settings only change length or sampling.
- Record model versions and exposed settings when reproduction matters.

### Lesson 5.3: Constrain the output

- Request named fields, enumerated values, tables and JSON.
- Introduce schemas, grammars and constrained decoding.
- Explain that a valid structure does not make an unsupported fact true.

### Lesson 5.4: Constrain actions

- Replace free-form action choice with a permitted tool set.
- Validate tool inputs before execution.
- Use ordinary code for calculations, routing and policy rules that do not need model judgement.

### Lesson 5.5: Validate, retry and reject

- Check structure, evidence and business rules outside the model.
- Retry only when the failure can be corrected safely.
- Reject invalid results and make failure visible.

### Lesson 5.6: Test repeatability

- Run fixed cases across repeated calls and recorded versions.
- Measure exact matches, accepted variation, failure rates and unsafe actions.
- Keep regression cases for failures that must not return.

Learner outcome: build a small AI system whose allowed variation, checks and failure behaviour are explicit.

## Chapter 6: Set up a project workspace

The learner gives longer work a recoverable home before allowing an agent to change it.

### Lesson 6.1: Files, folders, editors and terminals

- Read a project tree and find the files that matter.
- Distinguish an editor, terminal, repository and running application.
- Understand commands before authorising them.

### Lesson 6.2: Create the project brief

- Record the user, purpose, finish condition, scope and current state.
- Keep durable facts and settled decisions in a short source of truth.
- Remove facts that are no longer true.

### Lesson 6.3: Organise files and handovers

- Give research, decisions, drafts, tests and outputs a predictable home.
- Record what changed, what remains and where the next session starts.

### Lesson 6.4: Make a Git checkpoint

- Save a known working state before an agent changes files.
- Inspect the exact difference and recover a previous version.
- Separate one contained change from unrelated work.

### Lesson 6.5: Set permissions and protect secrets

- Grant the smallest useful access.
- Keep credentials in secret or environment settings rather than project files.
- Require approval for destructive, costly or external actions.

### Lesson 6.6: Read errors and run tests

- Reproduce a problem and read the relevant error or log.
- Run focused checks before and after a change.
- Add a regression test when a fixed failure could return.

Learner outcome: create a project workspace with maintained context, a recovery point and clear access boundaries.

## Chapter 7: Work with one agent

The learner supervises one agent through a complete, contained change.

### Lesson 7.1: Understand the agent loop

- Follow inspect, plan, act, observe and report.
- Show how tool results return to the model as new context.
- See where ordinary code and permissions bound the loop.

### Lesson 7.2: Write the agent brief

- Name the result, relevant files, constraints, exclusions and checks.
- Tell the agent when to stop and ask for authority.
- Keep the brief small enough to inspect.

### Lesson 7.3: Let the agent inspect and plan

- Ask the agent to show what it found in the project.
- Review the proposed files, actions and checks.
- Correct the plan before authorising a material change.

### Lesson 7.4: Make one contained change

- Keep one owner, one scope and one visible result.
- Review external commands and tool calls before they run.
- Stop when the work moves outside the brief.

### Lesson 7.5: Test and review the result

- Inspect the diff, run the relevant checks and review live behaviour.
- Compare the result with the brief rather than the agent's summary.

### Lesson 7.6: Record and hand over

- Update the project state, change history and next action.
- Record remaining uncertainty without pasting the full conversation.

Learner outcome: supervise one agent from inspection to checked handover without losing the previous working state.

## Chapter 8: Create skills and connect tools

The learner turns successful work into maintained instructions and gives agents reusable capabilities with explicit contracts.

### Lesson 8.1: Turn a result into a specification

- Record inputs, steps, output contract, failure behaviour and checks.
- Separate reusable rules from project-specific facts.

### Lesson 8.2: Build a template

- Use placeholders for details that change between runs.
- Keep required sections and validation consistent.
- Test the template with more than one example.

### Lesson 8.3: Understand skills

- Explain when a reusable skill is better than a long prompt.
- Define the skill's trigger, required context, process and output.
- Keep instructions and supporting files together.

### Lesson 8.4: Build and test a skill

- Create one focused skill from a checked workflow.
- Test normal, missing-input and failure cases.
- Version the skill when its behaviour changes.

### Lesson 8.5: Connect tools and MCP

- Explain tools, MCP hosts, clients and servers in plain language.
- Inspect permissions, schemas, errors and data ownership before connecting a service.
- Treat tool output as untrusted input that still needs checking.

### Lesson 8.6: Improve from recorded runs

- Compare failures and accepted results across versions.
- Change one instruction or boundary at a time.
- Keep regression cases beside the skill.

Learner outcome: turn a checked workflow into a reusable skill with versioned instructions, tool boundaries and tests.

## Chapter 9: Orchestrate models and agents

The learner coordinates models, subagents and parallel jobs after the individual roles and contracts are already clear.

### Lesson 9.1: Route work to the right model

- Choose models by capability, cost, latency and control requirements.
- Use a fixed router when the decision can be expressed as code.
- Use a model router only when the classification needs model judgement.

### Lesson 9.2: Models prompting models

- Separate planner, worker, critic and judge roles.
- Pass a bounded output from one model into the next model's input.
- Avoid treating a second model's confidence as proof.

### Lesson 9.3: Create subagents

- Give each subagent one job, one context boundary and one expected output.
- Use a parent agent to delegate, receive and assess the handover.
- Keep permissions smaller for workers than for the final owner.

### Lesson 9.4: Run parallel work safely

- Split only jobs that can complete independently.
- Isolate context and files so workers do not overwrite each other.
- Avoid parallel work when the jobs depend on the same unsettled decision.

### Lesson 9.5: Monitor and intervene

- Track state, tool calls, token use, cost, latency, retries and failures.
- Set stopping conditions and escalation points.
- Let a human pause or cancel a run without losing its record.

### Lesson 9.6: Judge, merge and hand over

- Compare outputs against the same acceptance conditions.
- Merge through one owner, Git and tests.
- Record which model or agent produced each result.

Learner outcome: orchestrate models and subagents while keeping ownership, context, monitoring and merge evidence visible.

## Chapter 10: Ship, monitor and maintain

The learner releases the system, observes its real behaviour and returns to the control loop for every change.

### Lesson 10.1: Run the release checks

- Revisit acceptance conditions, regression tests, privacy and security.
- Confirm the production boundary matches the tested boundary.

### Lesson 10.2: Prepare the change history

- Write a useful commit and review the final difference.
- Keep enough history for another person to understand and recover the release.

### Lesson 10.3: Deploy and roll back

- Deploy within known service and cost limits.
- Confirm the live version and retain a tested recovery route.

### Lesson 10.4: Observe the live system

- Use logs, traces, failure records, user reports, latency and cost.
- Monitor model calls, tool calls and orchestration state separately.
- Avoid recording private inputs or secrets in logs.

### Lesson 10.5: Evaluate live behaviour

- Sample real failures and accepted results safely.
- Compare live behaviour with the original tests.
- Add regression cases when production exposes a new failure.

### Lesson 10.6: Maintain models, prompts and skills

- Re-test after a model, prompt, data source, tool, skill or platform changes.
- Feed evidence back into the specification, checks and project record.
- Retire instructions and dependencies that no longer match the system.

Learner outcome: release a checked AI system, monitor its models and tools, and make the next change from a recoverable state.

## Scope held for later courses

These topics can follow the core pathway without blocking it:

- provider API and SDK implementation;
- building embedding pipelines and vector databases;
- implementing retrieval augmented generation;
- building MCP clients or servers;
- training, fine-tuning and serving open-weight models;
- advanced agent frameworks;
- multimodal application engineering;
- advanced evaluation, observability and red team testing;
- the professional forward deployed engineer route.

## Live implementation state

Only Lesson 1.1 is published. Later lessons remain a curriculum plan until their copy, SVG concept diagram, practice and checks have been built and tested through the shared lesson template.
