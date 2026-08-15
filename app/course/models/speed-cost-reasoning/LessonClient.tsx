"use client";

import { CostPathDiagram, LessonPhoto, SpeedReasoningDiagram } from "../LessonDiagrams";
import ModelLessonShell, { ModelLessonTaskCard } from "../ModelLessonShell";
import type { ModelMatchTaskDefinition } from "../ModelMatchTask";

const tasks: ModelMatchTaskDefinition[] = [
  { taskId: "pace", number: "Task 01", title: "Match the pace", instruction: "Select a task on the left, then the most sensible starting priority on the right.", cardTitle: "TASK 01 · MATCH THE PACE", cardPrompt: "Connect each piece of work to a sensible speed and reasoning priority.", pairs: [
    { left: "Rewrite a short email", right: "Start with a fast, low cost model" },
    { left: "Trace a difficult spreadsheet error", right: "Use more reasoning effort" },
    { left: "Generate 200 simple labels", right: "Prioritise speed and low cost" },
    { left: "Review a safety critical calculation", right: "Prioritise reasoning and checking" },
  ] },
  { taskId: "cost", number: "Task 02", title: "Match the cost path", instruction: "Select a usage pattern, then connect it to the cost question that matters first.", cardTitle: "TASK 02 · MATCH THE COST", cardPrompt: "Connect each usage pattern to the first cost route worth checking.", pairs: [
    { left: "Occasional learning questions", right: "A free plan may be enough" },
    { left: "Predictable daily use in one chat app", right: "Compare subscription limits" },
    { left: "Thousands of automated requests", right: "Estimate API usage" },
    { left: "A private model on your own computer", right: "Include hardware and electricity" },
  ] },
  { taskId: "consequence", number: "Task 03", title: "Match the consequence", instruction: "Select a task, then connect it to the amount of checking it deserves.", cardTitle: "TASK 03 · MATCH THE CONSEQUENCE", cardPrompt: "Connect the cost of being wrong to a sensible model and checking choice.", pairs: [
    { left: "Brainstorm names for a draft", right: "Cheap first pass" },
    { left: "Decide whether to refund a customer", right: "Stronger model and human review" },
    { left: "Summarise a legal deadline", right: "Verify against the source" },
    { left: "Create a disposable outline", right: "Fast model and a quick check" },
  ] },
];

export default function SpeedCostReasoningClient() {
  return <ModelLessonShell lessonId="models/speed-cost-reasoning" lessonNumber="02.2" title="Speed, cost and reasoning" lede="A quick answer can be exactly what a small task needs, while difficult or high consequence work can justify more time, more reasoning effort and a larger bill. The useful choice comes from the work and the cost of being wrong, rather than the model with the biggest score." currentPath="/course/models/speed-cost-reasoning" previousHref="/course/models/what-changes" nextHref="/course/models/context-windows" completionTitle="You can match model effort to the consequence of the work." tasks={tasks}>
    {({ completedTasks, openTask }) => <>
      <section><p className="reading-kicker">Section 1</p><h2>Speed has more than one part.</h2><p>Some models begin writing almost at once, while others pause before the first word because they are processing a larger request or using extra reasoning. Once the answer begins, output speed describes how quickly more text arrives, so two models can feel different even when their full answers take a similar amount of time.</p><p>A fast response matters during a live call, when drafting many short labels, or when the learner needs quick feedback. A slower response can be reasonable when the task has dependent calculations or several rules that need to be checked together, although waiting longer does not prove that the answer is correct.</p><LessonPhoto src="/lesson-images/model-speed.jpg" alt="Close view of a dark car speedometer with a white needle" eyebrow="SPEED IS A MEASURE" title="A high reading tells you about pace, but it does not tell you whether the journey ended in the right place." sourceHref="https://unsplash.com/photos/a-close-up-of-a-speedometer-in-a-car-4wez6UYQ9vA" sourceLabel="Lorenzo Hamers on Unsplash" /><SpeedReasoningDiagram /><ModelLessonTaskCard task={tasks[0]} completedTasks={completedTasks} openTask={openTask} /></section>
      <section><p className="reading-kicker">Section 2</p><h2>Price and real task cost are different.</h2><p>A chat product can have a free plan, a paid subscription, or both. Free plans usually place limits on messages, model access or tools, while subscriptions charge a regular amount for access under their current usage rules. These limits change, so check the provider&apos;s own plan page before relying on a particular allowance.</p><p>Application programming interfaces, usually shortened to APIs, often charge for measured use. Providers commonly count tokens sent into the model and tokens produced in the answer, which means a long project brief, a long answer, extra reasoning and repeated attempts can all change the final task cost.</p><CostPathDiagram /><div className="lesson-source-strip"><span>CURRENT REFERENCES</span><a href="https://artificialanalysis.ai/methodology" target="_blank" rel="noreferrer">Artificial Analysis measurement definitions</a><a href="https://openai.com/chatgpt/pricing/" target="_blank" rel="noreferrer">ChatGPT plans</a><a href="https://ai.google.dev/gemini-api/docs/pricing" target="_blank" rel="noreferrer">Gemini API pricing</a></div><ModelLessonTaskCard task={tasks[1]} completedTasks={completedTasks} openTask={openTask} /></section>
      <section><p className="reading-kicker">Section 3</p><h2>Spend according to the consequence.</h2><p>The lowest price matters when thousands of simple, repeatable requests are being processed, but the cheapest model can become expensive if its answers need several retries or hours of repair. A stronger model can also waste money when the job is a disposable brainstorm that a faster model already handles well.</p><p>Start by asking what happens if the answer is wrong. A rough heading can be replaced in seconds, while a missed legal deadline, an incorrect medical claim or a broken customer refund needs source checking and a responsible person to make the final decision. More model reasoning supports that process, but it does not replace it.</p><div className="consequence-ladder"><div><span>LOW</span><b>Easy to undo</b><p>Use a quick, low cost first pass and check the visible result.</p></div><div><span>MEDIUM</span><b>Affects project work</b><p>Use a capable model, compare the answer with the brief, and record useful decisions.</p></div><div><span>HIGH</span><b>Hard to undo</b><p>Use stronger reasoning, check primary sources, and keep a qualified person in control.</p></div></div><ModelLessonTaskCard task={tasks[2]} completedTasks={completedTasks} openTask={openTask} /></section>
    </>}
  </ModelLessonShell>;
}
