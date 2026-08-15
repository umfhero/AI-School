"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

export function LessonPhoto({ src, alt, eyebrow, title, sourceHref, sourceLabel }: { src: string; alt: string; eyebrow: string; title: string; sourceHref: string; sourceLabel: string }) {
  return <figure className="model-lesson-photo"><div><Image src={src} alt={alt} width={1400} height={900} sizes="(max-width: 700px) 92vw, 720px" /></div><figcaption><span>{eyebrow}</span><b>{title}</b><a href={sourceHref} target="_blank" rel="noreferrer">Photo: {sourceLabel}</a></figcaption></figure>;
}

const speedProfiles = {
  quick: { label: "Quick first pass", pace: "Fast", spend: "Low", checks: "One quick check", needle: 82 },
  balanced: { label: "Everyday project work", pace: "Medium", spend: "Medium", checks: "Check against the brief", needle: 58 },
  careful: { label: "High consequence work", pace: "Slower", spend: "Higher", checks: "Sources and human review", needle: 30 },
} as const;

export function SpeedReasoningDiagram() {
  const [profile, setProfile] = useState<keyof typeof speedProfiles>("balanced");
  const current = speedProfiles[profile];
  return <div className={`model-concept-console speed-console profile-${profile}`}>
    <header><div><span>DECISION CONSOLE</span><b>Match effort to the work.</b></div><small aria-live="polite">{current.label}</small></header>
    <div className="speed-console-controls" role="group" aria-label="Choose a task consequence"><button type="button" className={profile === "quick" ? "active" : ""} onClick={() => setProfile("quick")}>Quick task</button><button type="button" className={profile === "balanced" ? "active" : ""} onClick={() => setProfile("balanced")}>Project work</button><button type="button" className={profile === "careful" ? "active" : ""} onClick={() => setProfile("careful")}>High consequence</button></div>
    <div className="speed-console-body">
      <div className="pixel-gauge" aria-label={`Suggested response pace: ${current.pace}`}><div className="gauge-track"><i style={{ "--gauge-position": `${current.needle}%` } as CSSProperties} /></div><span>MORE THINKING</span><span>MORE SPEED</span></div>
      <div className="tradeoff-readout"><div><span>PACE</span><b>{current.pace}</b></div><div><span>LIKELY SPEND</span><b>{current.spend}</b></div><div><span>CHECKING</span><b>{current.checks}</b></div></div>
    </div>
    <p>A slower reasoning mode is not automatically better, and a fast model is not automatically careless. This control shows the starting priority, then your own test confirms the choice.</p>
  </div>;
}

export function CostPathDiagram() {
  return <div className="cost-path-diagram" aria-label="Three common ways to pay for AI use"><div><span>01</span><b>Free plan</b><p>You pay nothing, but the provider can limit messages, models, tools or busy period access.</p><i><em /></i><small>LIMITS RESET</small></div><div><span>02</span><b>Subscription</b><p>You pay a regular amount for a product, although fair use limits and model access can still apply.</p><i><em /><em /><em /></i><small>FIXED PERIOD</small></div><div><span>03</span><b>API usage</b><p>You pay for measured use, usually input and output tokens, so longer tasks and retries add to the bill.</p><i><em /><em /><em /><em /><em /></i><small>USE ADDS UP</small></div></div>;
}

type ContextMode = "clean" | "noisy" | "cleared";

const contextCards = {
  clean: ["Task brief", "Project rules", "Relevant file", "Current question"],
  noisy: ["Old idea", "Correction", "Old answer", "Task brief", "Unrelated chat", "Repeated rule", "Current file", "Current question"],
  cleared: ["Project brain", "Task brief", "Relevant file"],
} as const;

export function ContextWindowDiagram() {
  const [mode, setMode] = useState<ContextMode>("clean");
  const signal = mode === "noisy" ? 38 : mode === "cleared" ? 96 : 82;
  return <div className={`model-concept-console context-console mode-${mode}`}>
    <header><div><span>CONTEXT VIEWER</span><b>What the model receives now.</b></div><small aria-live="polite">Signal {signal}%</small></header>
    <div className="context-console-controls" role="group" aria-label="Change the context example"><button type="button" className={mode === "clean" ? "active" : ""} onClick={() => setMode("clean")}>Clean task</button><button type="button" className={mode === "noisy" ? "active" : ""} onClick={() => setMode("noisy")}>Add long chat</button><button type="button" className={mode === "cleared" ? "active" : ""} onClick={() => setMode("cleared")}>Clear and reload</button></div>
    <div className="context-window-stage">
      <div className="context-window-frame"><span>CONTEXT WINDOW</span><div className="context-card-flow">{contextCards[mode].map((card, index) => <i key={`${mode}-${card}`} className={card.includes("Old") || card.includes("Unrelated") || card.includes("Repeated") || card === "Correction" ? "noise" : "signal"} style={{ "--card-index": index } as CSSProperties}>{card}</i>)}</div><div className="context-capacity"><span style={{ width: `${Math.min(100, contextCards[mode].length * 12.5)}%` }} /></div><small>{contextCards[mode].length} of 8 example slots used</small></div>
      <div className="context-signal-meter"><span>RELEVANT SIGNAL</span><div><i style={{ width: `${signal}%` }} /></div><b>{mode === "noisy" ? "Useful facts compete with old messages." : mode === "cleared" ? "A fresh request gets only the facts it needs." : "The task and rules are easy to find."}</b></div>
    </div>
  </div>;
}

export function ContextClearingDiagram() {
  return <ol className="context-clearing-flow"><li><span>01</span><div><b>Save what must survive</b><p>Put decisions and project rules into the project brain.</p></div></li><li><span>02</span><div><b>Start a fresh task chat</b><p>Clearing context removes the conversation, so the clean start is deliberate.</p></div></li><li><span>03</span><div><b>Reload the useful facts</b><p>Give the model the brief and the relevant files for this task.</p></div></li><li><span>04</span><div><b>Check the returned work</b><p>Compare the answer with the source of truth before keeping it.</p></div></li></ol>;
}

type TestRun = "ready" | "a" | "b" | "compare";

export function FairModelTestDiagram() {
  const [run, setRun] = useState<TestRun>("ready");
  return <div className={`model-concept-console test-console run-${run}`}>
    <header><div><span>MODEL TEST BENCH</span><b>One task, one set of rules.</b></div><small aria-live="polite">{run === "ready" ? "Ready" : run === "compare" ? "Comparison complete" : `Model ${run.toUpperCase()} recorded`}</small></header>
    <div className="shared-test-brief"><span>SHARED PROMPT</span><p>Summarise the supplied policy in under 120 words, name the refund deadline, and cite the paragraph that contains it.</p><div><b>Correct deadline</b><b>Under 120 words</b><b>Source cited</b></div></div>
    <div className="test-output-grid"><article className={run === "a" || run === "compare" ? "ran" : ""}><span>MODEL A</span><div className="test-output-lines"><i /><i /><i /><i /></div><ul><li className="pass">Deadline correct</li><li className="pass">Length passed</li><li className="fail">Source missing</li></ul></article><article className={run === "b" || run === "compare" ? "ran" : ""}><span>MODEL B</span><div className="test-output-lines"><i /><i /><i /></div><ul><li className="pass">Deadline correct</li><li className="pass">Length passed</li><li className="pass">Source cited</li></ul></article></div>
    <div className="test-console-actions"><button type="button" onClick={() => setRun("a")}>Run model A</button><button type="button" onClick={() => setRun("b")}>Run model B</button><button type="button" disabled={run !== "a" && run !== "b" && run !== "compare"} onClick={() => setRun("compare")}>Compare evidence</button></div>
    <p>{run === "compare" ? "Model B passes this bounded test, while Model A needs a source citation. This result applies to this task and these settings." : "Run both models with the same brief, then compare the recorded evidence against the criteria."}</p>
  </div>;
}

export function TestRecordDiagram() {
  return <div className="test-record-card"><header><span>MODEL TEST RECORD</span><b>Keep enough detail to repeat it.</b></header><dl><div><dt>Task</dt><dd>Policy summary</dd></div><div><dt>Model and mode</dt><dd>Model B, standard</dd></div><div><dt>Date</dt><dd>15 August 2026</dd></div><div><dt>Prompt</dt><dd>Saved with the test</dd></div><div><dt>Result</dt><dd>3 of 3 criteria passed</dd></div><div><dt>Decision</dt><dd>Use for the next trial</dd></div></dl></div>;
}
