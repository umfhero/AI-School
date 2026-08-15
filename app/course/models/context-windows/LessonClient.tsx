"use client";

import { ContextClearingDiagram, ContextWindowDiagram, LessonPhoto } from "../LessonDiagrams";
import ModelLessonShell, { ModelLessonTaskCard } from "../ModelLessonShell";
import type { ModelMatchTaskDefinition } from "../ModelMatchTask";

const tasks: ModelMatchTaskDefinition[] = [
  { taskId: "capacity", number: "Task 01", title: "Match the context part", instruction: "Select an item, then connect it to what it means inside a context window.", cardTitle: "TASK 01 · MATCH THE CONTEXT", cardPrompt: "Connect each part of a request to its effect on the context window.", pairs: [
    { left: "Instructions and the current task", right: "Keep in active context" },
    { left: "An old unrelated brainstorm", right: "Leave out" },
    { left: "The model's answer", right: "Uses context space too" },
    { left: "A large context window", right: "More capacity, with focus still to test" },
  ] },
  { taskId: "relevance", number: "Task 02", title: "Match signal and noise", instruction: "Select a piece of information, then connect it to the cleanest treatment.", cardTitle: "TASK 02 · MATCH SIGNAL AND NOISE", cardPrompt: "Connect each piece of information to where it belongs for the current task.", pairs: [
    { left: "Current brand rules", right: "High signal" },
    { left: "A correction needed next week", right: "Move it into a project file" },
    { left: "Three abandoned approaches", right: "Noise for this task" },
    { left: "A fresh chat with a concise brief", right: "Cleaner starting point" },
  ] },
  { taskId: "clear", number: "Task 03", title: "Match the clearing step", instruction: "Select a situation, then connect it to the next clean action.", cardTitle: "TASK 03 · CLEAR AND RELOAD", cardPrompt: "Connect each point in a tired conversation to the right context clearing action.", pairs: [
    { left: "A decision must survive the chat", right: "Write it into the project brain" },
    { left: "The chat starts contradicting rules", right: "Open a fresh task chat" },
    { left: "The new chat starts", right: "Provide the brief and relevant files" },
    { left: "The work is returned", right: "Check it against the source of truth" },
  ] },
];

export default function ContextWindowsClient() {
  return <ModelLessonShell lessonId="models/context-windows" lessonNumber="02.3" title="Context windows" lede="A context window is the working space a model can receive for one request, including instructions, chat messages, supplied files and the answer being produced. A bigger window lets more information fit, but it does not make every part equally useful or guarantee that the right detail will guide the answer." currentPath="/course/models/context-windows" previousHref="/course/models/speed-cost-reasoning" nextHref="/course/models/simple-model-test" completionTitle="You can keep a model's active context small, relevant and recoverable." tasks={tasks}>
    {({ completedTasks, openTask }) => <>
      <section><p className="reading-kicker">Section 1</p><h2>The window holds the current request.</h2><p>Models process text and other inputs as tokens, which are small pieces of information rather than a simple word count. The context limit includes what you send and the space needed for the answer, so a long document can leave less room for the response that follows.</p><p>A larger context window can accept more pages, code or conversation history in one request, which is useful when the material genuinely belongs together. This capacity is closer to the size of a library than the skill of its librarian, because storing more material does not decide which shelf matters for the question.</p><LessonPhoto src="/lesson-images/transformer-attention.jpg" alt="Technical diagram showing the stages of one attention head inside a transformer model" eyebrow="HOW TOKEN SIGNALS CONNECT" title="This transformer diagram traces how token signals are compared and combined. You do not need the symbols. The useful point is that every active token creates work inside the model." sourceHref="https://commons.wikimedia.org/wiki/File:Process_of_a_Single_Attention_Head_in_a_Transformer_Model.jpg" sourceLabel="Zhang and colleagues on Wikimedia Commons, CC BY 4.0" contain /><ContextWindowDiagram /><ModelLessonTaskCard task={tasks[0]} completedTasks={completedTasks} openTask={openTask} /></section>
      <section><p className="reading-kicker">Section 2</p><h2>Extra context can add distraction.</h2><p>Long context can be useful, but capacity and reliability are separate. Old plans, repeated corrections and unrelated requests can compete with the current instruction, while a model may also give different weight to information depending on where it appears and how clearly it is stated.</p><p>This is why a concise project brain still matters when a model can accept a very large file. The project brain gives the model the current goal, constraints and decisions in a dependable form, while task-specific files add the detail needed for the work in front of it.</p><div className="context-capacity-comparison"><article><span>LARGE AND NOISY</span><b>Everything fits</b><div>{["Old chat", "Idea", "Correction", "Draft", "Current rule", "Old file", "Question"].map((label) => <i key={label}>{label}</i>)}</div><p>The current rule exists, but it competes with the rest.</p></article><article><span>SMALL AND RELEVANT</span><b>The useful facts fit</b><div>{["Current rule", "Relevant file", "Question"].map((label) => <i key={label}>{label}</i>)}</div><p>The request is easier to follow and cheaper to process.</p></article></div><div className="lesson-source-strip"><span>READ THE DEFINITIONS</span><a href="https://ai.google.dev/gemini-api/docs/long-context" target="_blank" rel="noreferrer">Google long context guide</a><a href="https://ai.google.dev/gemini-api/docs/tokens" target="_blank" rel="noreferrer">Google token and context limits</a><a href="https://docs.anthropic.com/en/docs/build-with-claude/context-windows" target="_blank" rel="noreferrer">Anthropic context window guide</a></div><ModelLessonTaskCard task={tasks[1]} completedTasks={completedTasks} openTask={openTask} /></section>
      <section><p className="reading-kicker">Section 3</p><h2>Clearing context is a controlled reset.</h2><p>Clearing or starting a fresh chat removes the active conversation from the next request, which can stop an old mistake or abandoned plan from continuing. The project itself remains safe in its files, because anything that must survive should already be held there instead of depending on one chat.</p><p>After the reset, give the model the short project overview, the current task and only the files that matter. The model now has a clean working space, while the project brain keeps the decisions that should remain consistent across every fresh conversation.</p><ContextClearingDiagram /><div className="context-clear-note"><span>THE SAFE RESET</span><p>Save the facts first, clear the conversation second, then reload the task from the project source of truth.</p></div><ModelLessonTaskCard task={tasks[2]} completedTasks={completedTasks} openTask={openTask} /></section>
    </>}
  </ModelLessonShell>;
}
