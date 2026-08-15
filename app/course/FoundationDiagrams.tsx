"use client";

import { useState, type CSSProperties } from "react";

const courseStages = [
  { number: "01", short: "Basics", title: "Give the work a dependable home.", detail: "Learn how chats, files, context and a project brain fit together." },
  { number: "02", short: "Models", title: "Choose the model for the job.", detail: "Compare capability, speed, cost, reasoning and context." },
  { number: "03", short: "Agents", title: "Give an agent one bounded task.", detail: "Let it inspect the project, make a contained change and report back." },
  { number: "04", short: "Skills", title: "Save instructions you will use again.", detail: "Turn a dependable process into a maintained project file." },
  { number: "05", short: "Fleets", title: "Divide independent work with care.", detail: "Give each agent a clear owner, input and expected result." },
  { number: "06", short: "Shipping", title: "Check, release and maintain the result.", detail: "Keep evidence, change history and the live project in view." },
];

export function CoursePathDiagram() {
  const [active, setActive] = useState(0);
  const stage = courseStages[active];
  return <div className="model-concept-console foundation-console course-path-console">
    <header><div><span>COURSE MAP</span><b>Follow one project from first idea to a checked release.</b></div><small aria-live="polite">Chapter {stage.number}</small></header>
    <div className="foundation-console-controls course-path-controls" role="group" aria-label="Choose a course chapter">{courseStages.map((item, index) => <button type="button" className={active === index ? "active" : ""} onClick={() => setActive(index)} key={item.number}><span>{item.number}</span>{item.short}</button>)}</div>
    <div className="course-path-body"><ol>{courseStages.map((item, index) => <li className={index < active ? "passed" : index === active ? "active" : ""} key={item.number}><span>{item.number}</span><b>{item.short}</b></li>)}</ol><article><span>CHAPTER {stage.number}</span><h3>{stage.title}</h3><p>{stage.detail}</p></article></div>
    <p>Each chapter adds one part of the same workflow, so later tools sit on top of habits you have already practised.</p>
  </div>;
}

const assistantModes = {
  vague: { label: "Vague request", input: "Make me a useful app", context: "No project files", output: "Confident guess", check: "Hard to judge", score: 28 },
  brief: { label: "Clear request", input: "Add a mobile study timer", context: "Goal and current files", output: "Focused first pass", check: "Compare with brief", score: 76 },
  checked: { label: "Checked workflow", input: "Add and test the timer", context: "Brief, files and constraints", output: "Change with evidence", check: "Review test result", score: 94 },
};

export function AiAssistantDiagram() {
  const [mode, setMode] = useState<keyof typeof assistantModes>("brief");
  const current = assistantModes[mode];
  return <div className="model-concept-console foundation-console assistant-console">
    <header><div><span>AI WORKBENCH</span><b>Change what the model receives, then inspect what becomes easier.</b></div><small aria-live="polite">{current.label}</small></header>
    <div className="foundation-console-controls" role="group" aria-label="Change the AI work setup"><button type="button" className={mode === "vague" ? "active" : ""} onClick={() => setMode("vague")}>Vague prompt</button><button type="button" className={mode === "brief" ? "active" : ""} onClick={() => setMode("brief")}>Clear brief</button><button type="button" className={mode === "checked" ? "active" : ""} onClick={() => setMode("checked")}>Brief and checks</button></div>
    <div className="assistant-flow"><div><span>01 · REQUEST</span><b>{current.input}</b></div><div><span>02 · CONTEXT</span><b>{current.context}</b></div><div className="assistant-model-core"><span>AI MODEL</span><i style={{ "--foundation-score": `${current.score}%` } as CSSProperties} /></div><div><span>03 · ANSWER</span><b>{current.output}</b></div><div><span>04 · YOUR CHECK</span><b>{current.check}</b></div></div>
    <p>The model supplies a fast response from the material it receives, while you decide whether that response fits the job.</p>
  </div>;
}

const pressureModes = {
  clean: { label: "Clean task", score: 88, cards: ["Goal", "Current rule", "Question"], note: "The current rule is easy to find." },
  growing: { label: "Growing chat", score: 43, cards: ["Goal", "Old idea", "Correction", "Draft", "Another task", "Current rule", "Old answer", "Question"], note: "The rule remains present, although it now competes with old work." },
  reset: { label: "Fresh task chat", score: 97, cards: ["Project brain", "Relevant file", "Question"], note: "The useful facts return without the abandoned conversation." },
};

export function ContextPressureDiagram() {
  const [mode, setMode] = useState<keyof typeof pressureModes>("clean");
  const current = pressureModes[mode];
  return <div className="model-concept-console foundation-console pressure-console">
    <header><div><span>CONTEXT PRESSURE</span><b>Watch an important rule compete with a growing conversation.</b></div><small aria-live="polite">Signal {current.score}%</small></header>
    <div className="foundation-console-controls" role="group" aria-label="Change the conversation length"><button type="button" className={mode === "clean" ? "active" : ""} onClick={() => setMode("clean")}>Short chat</button><button type="button" className={mode === "growing" ? "active" : ""} onClick={() => setMode("growing")}>Add old work</button><button type="button" className={mode === "reset" ? "active" : ""} onClick={() => setMode("reset")}>Fresh task chat</button></div>
    <div className="pressure-body"><div className="pressure-cards">{current.cards.map((card, index) => <i className={card === "Current rule" || card === "Project brain" || card === "Relevant file" || card === "Question" || card === "Goal" ? "signal" : "noise"} style={{ "--foundation-index": index } as CSSProperties} key={`${mode}-${card}`}>{card}</i>)}</div><div className="pressure-meter"><span>USEFUL SIGNAL</span><div><i style={{ width: `${current.score}%` }} /></div><b>{current.note}</b></div></div>
    <p>Context rot changes how consistently the model uses the right information, so a fresh chat and a small source of truth can restore a clear starting point.</p>
  </div>;
}

export function ProjectBrainDiagram() {
  const [connected, setConnected] = useState(true);
  return <div className={`model-concept-console foundation-console project-brain-console ${connected ? "connected" : "disconnected"}`}>
    <header><div><span>PROJECT MEMORY</span><b>Give every fresh chat the same maintained starting point.</b></div><small aria-live="polite">{connected ? "Overview loaded" : "Memory missing"}</small></header>
    <div className="foundation-console-controls two" role="group" aria-label="Change whether the project brain is available"><button type="button" className={!connected ? "active" : ""} onClick={() => setConnected(false)}>Chat alone</button><button type="button" className={connected ? "active" : ""} onClick={() => setConnected(true)}>Load overview.md</button></div>
    <div className="project-memory-body"><article><span>overview.md</span>{["Goal", "Audience", "Constraints", "Current state", "Decisions", "Next action"].map((item) => <b key={item}>{item}</b>)}</article><div className="memory-lines" aria-hidden="true"><i /><i /><i /></div><div className="fresh-chat-stack">{["Research chat", "Build chat", "Review chat"].map((chat, index) => <div className={connected ? "ready" : "guessing"} key={chat}><span>0{index + 1}</span><b>{chat}</b><small>{connected ? "Same project facts" : "Starts from guesses"}</small></div>)}</div></div>
    <p>The file keeps decisions available between conversations, while each chat can stay focused on the task in front of it.</p>
  </div>;
}

export function HandoverDiagram() {
  const [handover, setHandover] = useState(true);
  return <div className={`model-concept-console foundation-console handover-console ${handover ? "with-handover" : "without-handover"}`}>
    <header><div><span>HANDOVER VIEWER</span><b>Compare the next session with and without a short record.</b></div><small aria-live="polite">{handover ? "Ready to continue" : "Reconstruction needed"}</small></header>
    <div className="foundation-console-controls two" role="group" aria-label="Change whether a handover is available"><button type="button" className={!handover ? "active" : ""} onClick={() => setHandover(false)}>No handover</button><button type="button" className={handover ? "active" : ""} onClick={() => setHandover(true)}>Use handover</button></div>
    <div className="handover-body"><article><span>SESSION A</span><b>Work completed</b><ul><li>Timer screen changed</li><li>Phone layout checked</li><li>One issue remains</li></ul></article><div className="handover-file"><span>handover.md</span><b>{handover ? "Changed · Remaining · Start here" : "No record saved"}</b></div><article><span>SESSION B</span><b>{handover ? "Continue from the issue" : "Search for what happened"}</b><ul><li>{handover ? "Open the named file" : "Inspect several files"}</li><li>{handover ? "Reproduce the issue" : "Guess which decision won"}</li><li>{handover ? "Make the next change" : "Repeat old work"}</li></ul></article></div>
    <p>A handover keeps the useful edge of the previous session, so the next person or chat can continue without replaying the whole conversation.</p>
  </div>;
}

const workflowSteps = [
  { label: "Define", detail: "Name one result that can be checked." },
  { label: "Load", detail: "Give the AI the project overview and relevant files." },
  { label: "Change", detail: "Make one contained change to the project." },
  { label: "Check", detail: "Compare the result with the task and visible evidence." },
  { label: "Record", detail: "Update the project brain or leave a handover." },
];

export function CleanWorkflowDiagram() {
  const [active, setActive] = useState(0);
  const current = workflowSteps[active];
  return <div className="model-concept-console foundation-console workflow-console-lesson">
    <header><div><span>CLEAN WORKFLOW</span><b>Move one bounded task from intent to a recorded result.</b></div><small aria-live="polite">Step {active + 1} of 5</small></header>
    <div className="workflow-step-controls" role="group" aria-label="Choose a workflow step">{workflowSteps.map((step, index) => <button type="button" className={index === active ? "active" : index < active ? "passed" : ""} onClick={() => setActive(index)} key={step.label}><span>0{index + 1}</span><b>{step.label}</b></button>)}</div>
    <div className="workflow-step-detail"><span>STEP 0{active + 1}</span><h3>{current.label}</h3><p>{current.detail}</p><div><i style={{ width: `${((active + 1) / workflowSteps.length) * 100}%` }} /></div></div>
    <p>The routine keeps the work small enough to inspect, and the final record gives the next task a clean starting point.</p>
  </div>;
}

const modelFactors = {
  writing: { label: "Writing task", prompt: "Rewrite a support reply", strength: "Tone and instruction following", speed: 78, depth: 55, vision: 18 },
  reasoning: { label: "Reasoning task", prompt: "Trace a calculation error", strength: "Reasoning across several steps", speed: 42, depth: 92, vision: 22 },
  vision: { label: "Image task", prompt: "Check a mobile screenshot", strength: "Image understanding", speed: 61, depth: 64, vision: 96 },
};

export function ModelFactorDiagram() {
  const [factor, setFactor] = useState<keyof typeof modelFactors>("writing");
  const current = modelFactors[factor];
  return <div className="model-concept-console foundation-console model-factor-console">
    <header><div><span>MODEL FACTORS</span><b>The same chat box can route work through a different model.</b></div><small aria-live="polite">{current.label}</small></header>
    <div className="foundation-console-controls" role="group" aria-label="Choose a model task"><button type="button" className={factor === "writing" ? "active" : ""} onClick={() => setFactor("writing")}>Writing</button><button type="button" className={factor === "reasoning" ? "active" : ""} onClick={() => setFactor("reasoning")}>Reasoning</button><button type="button" className={factor === "vision" ? "active" : ""} onClick={() => setFactor("vision")}>Image review</button></div>
    <div className="model-factor-body"><article><span>REQUEST</span><b>{current.prompt}</b><small>Choose the capability that the work depends on.</small></article><div><span>FIRST STRENGTH TO TEST</span><b>{current.strength}</b>{[["Response pace",current.speed],["Reasoning depth",current.depth],["Image input",current.vision]].map(([label,value]) => <label key={String(label)}>{label}<i><em style={{ width: `${value}%` }} /></i></label>)}</div></div>
    <p>A model can be excellent at one kind of work and ordinary at another, so compare the capability that your task actually uses.</p>
  </div>;
}
