# AI workflow course outline

This is the working outline for AI school. It is written for someone with no technical background who wants to use AI to build real projects without getting lost in one long chat. Each lesson should explain the idea in ordinary language, show it in a visual example, then finish with a small task that lets the learner prove they understand it.

The course currently has six chapters and 25 proposed lessons. AI? has two tasks and the other 24 planned lessons have three each, which makes 74 tasks in the current course map. The live site has now been updated to use these figures.

## Course introduction

This is a short, task-free first lesson that sits before Chapter 1. It explains that the course is for non-technical learners who want to use AI to make and manage real projects, and that prior coding experience is not required. It makes clear that AI is not intelligent in the human sense, and that its answers depend on its training, instructions, context, tools, model and settings. It introduces the six chapters, what AI and models are, hallucinations and checking work, agents, context management, anti-hallucination workflows, skills, parallel work and safe shipping. The learner completes it after reading and earns 500 XP, moving from Level 0 to Level 1. Completing Chapter 1 brings the learner to 1,000 total XP and Level 2.

## Chapter 1: The basics

This chapter starts before context rot. It gives a first-time learner enough vocabulary and confidence to understand what an AI tool, a chat, a project folder and a coding environment are, then shows why work needs a home outside a single conversation.

### Lesson 1.1: AI?

Start with a plain-English explanation of AI as software that can work with language, images, code and other information, based on patterns learned from large amounts of data. Explain what it is useful for, including writing, research, planning, learning, analysis and helping to build software, alongside the need to check its work rather than treat it as an authority.

(here we should include a visual showing the AI as a helpful assistant, not a magic box)

then hinting at a few things, like the speed at which apps are now being created vs used (inside lessonimages folder) eg positives (we can go into negatives of AI later down the road)

Introduce the main ways people meet AI through chat tools such as [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/) and [Gemini](https://gemini.google.com/). Compare a one-off question with an ongoing project, and explain that different tools can give different answers because they use different models, settings and context. 

(have a note saying more info on picking the right model will come in chapter 2)

Introduce the learner's environment in gentle steps. Explain that a project is a folder of files, an IDE is an app for opening and editing those files, and [Visual Studio Code](https://code.visualstudio.com/) is a common example. Then explain how AI can be brought into that workspace through tools such as [Cursor](https://www.cursor.com/), GitHub Copilot and an IDE chat, so the AI can work with the files that hold the project rather than relying on memory from a chat alone. The lesson should stay practical and avoid assuming that the learner can code.

Suggested learner outcome: identify an AI chat tool, an IDE and a project folder, for the first task for this lesson, have the user match 2 halfs of a story (by linking 2 card stacks, then a submit button for the task to check, only show the user x/4 correct until 4/4 then have the task show as complete):

Web based AI -> GPT, Claude Gemini
IDE -> VSC, Cursor, Antigravity
Project folder -> A directory containing all files (that an IDE would point to to work in)
Non IDE -> opencode, claude code, codex (a type of IDE where you only interface with the AI, not the files) (mention this in this lesson as more advanced, like iv shown below)


Least to most advanced setupts:
Web based
IDE
Non IDE

(have this as a small reorder task where the user has to drag and drop the 3 setups into the correct order)

### Lesson 1.2: Context rot (this one is done, i like how it is)

Explain why a model can become less reliable when a conversation grows, corrections pile up and useful project facts compete with unrelated messages. Be precise: the model has not become less intelligent, but it can use the right information less consistently.

Show the difference between one sprawling chat and a clean task chat that receives the small amount of project context it needs. Introduce the central idea that a project needs an external source of truth.

Suggested learner outcome: spot where a long conversation stopped following an important project rule, then choose what should be recorded outside the chat.

### Lesson 1.3: Your project brain

Introduce a short project overview as the project brain. Cover the facts it should hold, including the goal, audience, constraints, current state, decisions already made and the next useful action.

Show how the overview gives every fresh chat the same starting point, while remaining small enough to read and maintain. Explain that it is a living document rather than a final specification.

Suggested learner outcome: create a first project overview for a small personal project. (make this a small task where the user has to fill in a few fields, then submit and have the task show as complete)

### Lesson 1.4: Files and handovers

Explain the difference between a chat, a file and a folder, then show a simple project structure that a beginner can recognise. Cover why useful decisions, instructions and work-in-progress belong in files that the next person, or the next chat, can find.

Introduce a handover as a short note that says what changed, what remains and where to start. Keep the focus on making work understandable after a break, not on formal process.

Suggested learner outcome: organise a small project folder and write a handover that another person could follow.

### Lesson 1.5: A clean first workflow

Bring the chapter together into a repeatable first workflow: define one task, give the AI the relevant project context, make one change, check the result, then update the project brain or handover.

Show that a clean workflow is slower than asking one vague question at the start, but faster than repairing confused work later. The learner should see the routine as a way to stay in control, not as a technical rulebook.

Suggested learner outcome: complete one small task using a fresh chat and a project overview.

## Chapter 2: Pick the right model

This chapter helps the learner choose an AI model for the job, instead of assuming that every model is interchangeable.

### Lesson 2.1: What models change

Cover broad differences in strengths, such as writing, reasoning, coding, image understanding and following instructions, without presenting any model as universally best. and explain why each is different down to factors.

One good source will be https://artificialanalysis.ai/leaderboards/models

where you can see each model ranked by categories such as Output Speed, cost per task, latency, context window etc.

Then more important categories like https://llm-stats.com/ with leads on reasoning, cheapest in the top 10 etc. and would be amazing to get this to be live fetched on some stats, and a live ranking for each cateogiry showing top 3-5 for each section. Adding the AI logos etc.

Will also be important to introduce the idea of open/closed source models, with this idea of why cost is so big and what its like running a model on your own machine, why open source is important, what models you could run on your own machine etc.



### Lesson 2.2: Speed, cost and reasoning

Show the practical trade-off between a quick, lower-cost model and a slower model that may spend more effort on difficult work. Explain free plans, usage limits and paid usage in plain language, and teach the learner to match the cost to the consequence of getting the task wrong.

### Lesson 2.3: Context windows

Explain a context window as the amount of information a model can receive in one request. Separate capacity from reliability, and show why a large context window does not remove the need for concise project files and clear tasks.

### Lesson 2.4: A simple model test

Give the learner a fair way to compare models on the same bounded task. Cover a shared prompt, clear success criteria, checking the output and recording the result, so the comparison is based on the work rather than a first impression.

## Chapter 3: Build with an agent

This chapter turns AI from a chat partner into a careful collaborator that can inspect a project, make a contained change and report what it did.

### Lesson 3.1: Write the task brief

Teach a task brief that states the goal, relevant context, constraints, expected output and how the work will be checked. Show how a clear brief reduces guessing while leaving room for the agent to do useful work.

### Lesson 3.2: Let the agent inspect

Explain why an agent should look at the relevant files before changing anything. Cover asking it to report what it found, identify assumptions and propose a plan, so the learner can correct its direction early.

### Lesson 3.3: Make the change

Show how to give an agent a limited piece of work, review the proposed edit and keep the change easy to understand. Introduce the habit of changing one thing at a time when the learner is unsure.

### Lesson 3.4: Review what happened

Teach the learner to read the agent's summary, inspect the changed files and compare the result with the brief. Cover what to do when the agent made a reasonable attempt but solved the wrong problem.

## Chapter 4: Skills and repeatable work

This chapter helps the learner turn recurring instructions into reusable tools, so they do not have to rebuild a good process from memory.

### Lesson 4.1: What a skill is

Define a skill as a reusable set of instructions, context and checks for a recurring job. Use familiar examples such as writing a lesson plan, checking a document or preparing a project handover.

### Lesson 4.2: Write your first skill

Guide the learner through writing a small skill with a clear purpose, inputs, steps, expected output and checks. Keep the first example narrow enough to test in a few minutes.

### Lesson 4.3: Use templates well

Show how a template provides a dependable starting structure while leaving room for the details of the current task. Cover the difference between useful placeholders and a rigid form that encourages careless copying.

### Lesson 4.4: Improve it from results

Teach the learner to revise a skill after seeing where it helped, where it caused confusion and what checks were missing. Treat skills as maintained project files rather than permanent instructions.

## Chapter 5: Fleets and parallel work

This chapter introduces multiple agents only after the learner can manage one clear task, so parallel work feels like organised delegation rather than noise.

### Lesson 5.1: When parallel work helps

Explain when separate tasks can run at the same time and when they cannot. Use examples where research, file inspection and testing can be independent, then contrast them with work that depends on one shared decision.

### Lesson 5.2: Divide the jobs

Show how to split a larger goal into bounded jobs with one owner, a clear input and a defined output. Cover avoiding overlapping edits and vague instructions that cause several agents to solve the same problem.

### Lesson 5.3: Write clean handovers

Build on Chapter 1 by teaching handovers for parallel work. Each handover should state the task, the evidence or files used, the result, open questions and the next action.

### Lesson 5.4: Merge without chaos

Explain how to bring parallel work back together: compare outputs, resolve conflicting suggestions, make the final decision and check the combined result. Introduce source control as a way to manage changes safely, with the practical details coming later.

## Chapter 6: Ship it properly

This chapter closes the course by showing that a project is only useful when it has been checked, recorded and released in a way the learner can return to.

### Lesson 6.1: Verification

Teach verification as checking the result against the task brief, rather than trusting that an AI response sounds convincing. Cover simple checks, user-focused checks and asking the agent to identify gaps in its own work.

### Lesson 6.2: Source control

Introduce source control as a history of file changes that lets a project be reviewed and recovered. Explain the purpose of Git and GitHub in plain language, focusing on commits, branches and shared work before command-line detail.

### Lesson 6.3: Deployment

Explain deployment as making a finished project available to the people who need it. Cover the difference between a local project and a live site or service, plus the need to understand the free limits and costs of any hosting service.

### Lesson 6.4: Maintaining the system

Show how a project stays useful after launch: update the project brain, record decisions, check that important workflows still work and make small improvements when evidence calls for them. End by connecting maintenance back to the clean task workflow from Chapter 1.

## Notes for future lesson writing

- Keep every lesson suitable for a learner with no technical background. Define unfamiliar terms when they first appear.
- Use British English, ordinary language and real examples. Each lesson should include a visual demonstration and a small task.
- Link named products, models, research and images to their original sources.
- Treat this file as a planning document. Add rough key points, references, images and task ideas under the relevant lesson before writing the final lesson content.
