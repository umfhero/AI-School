"use client";

import { FairModelTestDiagram, LessonPhoto, TestRecordDiagram } from "../LessonDiagrams";
import ModelLessonShell, { ModelLessonTaskCard } from "../ModelLessonShell";
import type { ModelMatchTaskDefinition } from "../ModelMatchTask";

const tasks: ModelMatchTaskDefinition[] = [
  { taskId: "criteria", number: "Task 01", title: "Match the success criteria", instruction: "Select a test part, then connect it to a fair measurement.", cardTitle: "TASK 01 · DEFINE SUCCESS", cardPrompt: "Connect each part of a test to the criterion that makes it measurable.", pairs: [
    { left: "Rewrite a support reply", right: "Correct facts, clear tone, under 120 words" },
    { left: "Compare two models", right: "Use the same prompt and settings" },
    { left: "Judge an answer", right: "Apply criteria before preference" },
    { left: "Record the run", right: "Save model, date, settings and result" },
  ] },
  { taskId: "evidence", number: "Task 02", title: "Match the evidence", instruction: "Select an observation, then connect it to what the test result means.", cardTitle: "TASK 02 · READ THE RESULT", cardPrompt: "Connect each test observation to the correct judgement.", pairs: [
    { left: "A polished answer with the wrong total", right: "Fails correctness" },
    { left: "A plain answer with every source cited", right: "Passes the evidence check" },
    { left: "A different prompt was used for model B", right: "The comparison is unfair" },
    { left: "One unusually good answer", right: "Repeat before deciding" },
  ] },
  { taskId: "decision", number: "Task 03", title: "Match the decision", instruction: "Select a test result, then connect it to the next sensible decision.", cardTitle: "TASK 03 · RECORD THE DECISION", cardPrompt: "Connect each result to a decision that the evidence can support.", pairs: [
    { left: "Both pass, while one is faster", right: "Choose speed for this task" },
    { left: "The cheaper model needs repeated fixes", right: "Record the real task cost" },
    { left: "No model passes the criteria", right: "Improve the brief or change approach" },
    { left: "One model wins one task", right: "Do not call it a universal winner" },
  ] },
];

export default function SimpleModelTestClient() {
  return <ModelLessonShell lessonId="models/simple-model-test" lessonNumber="02.4" title="A simple model test" lede="A leaderboard can help you form a shortlist, but a small test tells you how a model handles your work. A fair comparison uses the same bounded task, the same input and visible success criteria, then records enough detail to repeat the decision later." currentPath="/course/models/simple-model-test" previousHref="/course/models/context-windows" nextHref="/profile#courses" nextLabel="Return to course" completionTitle="You can compare models with a fair, repeatable test." tasks={tasks}>
    {({ completedTasks, openTask }) => <>
      <section><p className="reading-kicker">Section 1</p><h2>Decide what success means first.</h2><p>Choose a task small enough to check without guessing, such as summarising one policy, extracting five values from a table, or rewriting one support reply. Give each model the same source material and prompt, then keep the model settings as similar as the products allow.</p><p>Write the pass conditions before reading either answer, because this stops a confident tone or a favourite brand from quietly changing the judgement. A useful criterion can be checked, such as naming the correct deadline, staying under 120 words, citing the supplied paragraph and avoiding invented facts.</p><LessonPhoto src="/lesson-images/model-test.jpg" alt="A row of labelled laboratory sample tubes with a researcher behind them" eyebrow="CONTROL THE COMPARISON" title="A useful test changes one thing at a time, while the shared task and checking rules stay fixed." sourceHref="https://unsplash.com/photos/a-row-of-test-tubes-filled-with-different-colored-liquids-RuTQYiOOz0Y" sourceLabel="National Cancer Institute on Unsplash" /><FairModelTestDiagram /><ModelLessonTaskCard task={tasks[0]} completedTasks={completedTasks} openTask={openTask} /></section>
      <section><p className="reading-kicker">Section 2</p><h2>Check the work, not the performance.</h2><p>Read each output against the criteria and the original source, while keeping speed and cost as separate recorded measures. A long, polished answer can still fail one required fact, and a plain answer can be the better result when it is correct, complete and easy to use.</p><p>Models can produce different answers when the same prompt is repeated, so one run is evidence rather than a final verdict. Repeat important tests with a few representative examples, especially when the model will handle varied documents or the result can affect another person.</p><div className="test-checklist"><span>CHECK IN THIS ORDER</span><ol><li><b>1</b><p><strong>Correctness</strong> Compare facts, calculations and citations with the supplied source.</p></li><li><b>2</b><p><strong>Requirements</strong> Confirm that every instruction and output constraint was followed.</p></li><li><b>3</b><p><strong>Use in practice</strong> Record response time, retries, edits and the cost of the complete task.</p></li></ol></div><div className="lesson-source-strip"><span>EVALUATION REFERENCES</span><a href="https://platform.openai.com/docs/api-reference/evals" target="_blank" rel="noreferrer">OpenAI Evals reference</a><a href="https://ai.google.dev/gemini-api/docs/safety-guidance" target="_blank" rel="noreferrer">Google testing and factuality guidance</a></div><ModelLessonTaskCard task={tasks[1]} completedTasks={completedTasks} openTask={openTask} /></section>
      <section><p className="reading-kicker">Section 3</p><h2>Record a decision you can revisit.</h2><p>Write down the task, model name, mode or reasoning setting, date, prompt, result and any changes needed after the answer. Model versions and products change, which means a short record lets you repeat the test instead of relying on a memory of which answer felt best several months ago.</p><p>The result should stay attached to the task it measured. A model that wins a policy summary can still lose a spreadsheet repair or image review, so choose the winner for this workflow and run another bounded test when the work changes.</p><TestRecordDiagram /><div className="model-test-rule"><span>THE DECISION RULE</span><b>Use the cheapest and fastest option that passes the criteria reliably, then raise the model effort when the consequence or difficulty calls for it.</b></div><ModelLessonTaskCard task={tasks[2]} completedTasks={completedTasks} openTask={openTask} /></section>
    </>}
  </ModelLessonShell>;
}
