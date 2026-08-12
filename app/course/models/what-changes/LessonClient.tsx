"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import Image from "next/image";
import { useEffect, useState } from "react";
import AuthButton from "../../../components/AuthButton";
import CourseSignInNotice from "../../../components/CourseSignInNotice";
import ExperienceBadge from "../../../components/ExperienceBadge";
import LessonSaveState from "../../../components/LessonSaveState";
import LessonXpCelebration from "../../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../../components/PixelIcons";
import { LessonCelebration } from "../../basics/context-rot/LessonCelebration";
import { courseChapters, courseIntroLesson } from "../../courseData";
import { ModelTaskVisualContent, type ModelTaskVisual } from "./LessonVisuals";

const lessonId = "models/what-changes";
const taskIds = ["match", "source", "choose"];

type LessonProgress = Record<string, { completedTasks?: string[]; lessonCompletedAt?: number }>;
type SaveStatus = "idle" | "saving" | "saved" | "error";
type LiveRankings = { sourceUrl: string; updatedAt: string; rankings: Array<{ id: string; title: string; unit: string; entries: Array<{ model: string; provider: string; value: string }> }> };

const visualDetails: Record<ModelTaskVisual, { task: string; title: string; number: string }> = {
  capability: { task: "match", title: "Match the strengths", number: "Task 01" },
  metric: { task: "source", title: "Match the measures", number: "Task 02" },
  hosting: { task: "choose", title: "Match the constraints", number: "Task 03" },
};

function LiveModelRankings() {
  const [data, setData] = useState<LiveRankings | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/model-rankings", { signal: controller.signal, credentials: "same-origin" })
      .then((response) => response.ok ? response.json() as Promise<LiveRankings> : Promise.reject(new Error("Unavailable")))
      .then(setData)
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setUnavailable(true); });
    return () => controller.abort();
  }, []);

  const updated = data ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(new Date(data.updatedAt)) : null;
  return <div className="live-model-rankings" aria-live="polite"><div className="live-model-rankings-head"><div><span>LIVE MODEL DATA</span><h3>Current trade-offs, not a single winner.</h3></div>{data ? <a href={data.sourceUrl} target="_blank" rel="noreferrer">Source: LLM Stats ↗</a> : null}</div>{data ? <><div className="live-model-card-grid">{data.rankings.map((ranking) => <article key={ranking.id}><h4>{ranking.title}</h4><p>{ranking.unit}</p><ol>{ranking.entries.map((entry) => <li key={`${ranking.id}-${entry.model}`}><b>{entry.model}</b><span>{entry.provider}</span><strong>{entry.value}</strong></li>)}</ol></article>)}</div><small>Updated {updated}. Measurements and prices change, so use this to form a shortlist, then test the work you need done.</small></> : <div className="live-model-loading"><b>{unavailable ? "Live data is temporarily unavailable." : "Loading current model measurements..."}</b><p>{unavailable ? "Open LLM Stats to view its latest leaderboard directly." : "This panel uses public data from LLM Stats and refreshes regularly."}</p>{unavailable ? <a href="https://llm-stats.com/" target="_blank" rel="noreferrer">Open LLM Stats ↗</a> : null}</div>}</div>;
}

function TaskCard({ complete, title, count, prompt, onStart }: { complete: boolean; title: string; count: string; prompt: string; onStart: () => void }) {
  return <div className={`inline-task model-task ${complete ? "complete" : ""}`}><div className="task-heading"><span>{title}</span><b>{complete ? "COMPLETE ✓" : count}</b></div><h3>{prompt}</h3><p>Open the side view, connect all four pairs, then check your answers. The task completes only when every match is right.</p>{complete ? null : <button className="start-task-button" type="button" onClick={onStart}>Open task<span aria-hidden="true">→</span></button>}<p className="task-start-note">The matching cards appear in the side view.</p></div>;
}

export default function WhatModelsChangeClient() {
  const [openChapter, setOpenChapter] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignInNotice, setShowSignInNotice] = useState(false);
  const [lessonCompletedAt, setLessonCompletedAt] = useState<number | null>(null);
  const [completionStatus, setCompletionStatus] = useState<"idle" | "saving" | "error">("idle");
  const [activeVisual, setActiveVisual] = useState<ModelTaskVisual | null>(null);
  const [visualOpen, setVisualOpen] = useState(false);
  const [taskCelebrationKey, setTaskCelebrationKey] = useState(0);
  const [lessonCompletionKey, setLessonCompletionKey] = useState(0);

  const progress = Math.round((completedTasks.length / taskIds.length) * 100);
  const allTasksComplete = completedTasks.length === taskIds.length;
  const lessonComplete = Boolean(lessonCompletedAt);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { signal: controller.signal, credentials: "same-origin" })
      .then(async (response) => { if (!response.ok) throw new Error("Progress unavailable"); return response.json() as Promise<{ user: unknown; lessons?: LessonProgress }>; })
      .then((data) => { setSignedIn(Boolean(data.user)); setLessonProgress(data.lessons ?? {}); setCompletedTasks(data.lessons?.[lessonId]?.completedTasks ?? []); setLessonCompletedAt(data.lessons?.[lessonId]?.lessonCompletedAt ?? null); })
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setSaveStatus("error"); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const phoneLayout = window.matchMedia("(max-width: 920px)");
    const frame = window.requestAnimationFrame(() => { if (phoneLayout.matches) setSidebarOpen(false); });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function startTask(visual: ModelTaskVisual) { setActiveVisual(visual); setVisualOpen(true); }
  function completeTask(task: string) {
    if (completedTasks.includes(task)) return;
    const next = [...completedTasks, task];
    setCompletedTasks(next);
    if (signedIn) void saveProgress(next);
    setVisualOpen(false);
    setTaskCelebrationKey((key) => key + 1);
  }
  async function saveProgress(tasks: string[]) {
    setSaveStatus("saving");
    try { const response = await fetch("/api/progress", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, completedTasks: tasks }) }); if (!response.ok) throw new Error("Save failed"); setSaveStatus("saved"); window.dispatchEvent(new Event("progress-changed")); } catch { setSaveStatus("error"); }
  }
  async function completeLesson() {
    if (signedIn === false) { setShowSignInNotice(true); return; }
    if (!signedIn || !allTasksComplete || lessonComplete || completionStatus === "saving") return;
    setCompletionStatus("saving");
    try {
      const response = await fetch("/api/progress", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, completedTasks, completeLesson: true }) });
      if (!response.ok) throw new Error("Completion failed");
      const data = await response.json() as { lesson?: { lessonCompletedAt?: number }; newlyCompleted?: boolean };
      if (!data.lesson?.lessonCompletedAt) throw new Error("Completion was not saved");
      setLessonCompletedAt(data.lesson.lessonCompletedAt); setCompletionStatus("idle"); window.dispatchEvent(new Event("progress-changed"));
      if (data.newlyCompleted) setLessonCompletionKey((key) => key + 1);
    } catch { setCompletionStatus("error"); }
  }

  function lessonIsComplete(id: string) { return Boolean(id === lessonId ? lessonCompletedAt : lessonProgress[id]?.lessonCompletedAt); }
  function chapterIsComplete(chapter: typeof courseChapters[number]) { return chapter.lessons.every((lesson) => lessonIsComplete(lesson.id)); }
  const modelLessons = courseChapters[1].lessons;
  const modelTasksDone = modelLessons.reduce((total, lesson) => total + (lesson.id === lessonId ? completedTasks.length : lessonProgress[lesson.id]?.completedTasks?.length ?? 0), 0);

  return <main className="lesson-page"><LessonCelebration trigger={taskCelebrationKey} /><LessonXpCelebration trigger={lessonCompletionKey} nextLessonHref="/course/models/what-changes" />
    <header className="lesson-header"><div className="lesson-header-left"><button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b>{sidebarOpen ? "Hide contents" : "Show contents"}</b></button><a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI school course overview"><PixelSpark className="lesson-brand-star" /><b>AI school</b></a></div><div className="lesson-crumb"><span>Chapter 02 · Pick the right model</span><span>/</span><b>What models change</b></div><div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: `${Math.max(4, progress)}%` }} /></span><b>{completedTasks.length} / 3 tasks</b></div><LessonSaveState signedIn={signedIn} status={saveStatus} /><ExperienceBadge compact /><AuthButton returnTo="/course/models/what-changes" compact /></div></header>
    <div className={`lesson-workspace ${sidebarOpen ? "" : "sidebar-closed"} ${visualOpen ? "" : "visual-closed"}`}>
      <aside className="course-sidebar" id="course-contents" aria-label="Course contents"><div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: `${Math.max(4, progress)}%` }} /><small>{progress}% of this lesson</small></div></div><nav><a className={`course-intro-link ${lessonProgress.intro?.lessonCompletedAt ? "complete" : ""}`} href={courseIntroLesson.path}><span>{lessonProgress.intro?.lessonCompletedAt ? "✓" : "○"}</span><div><small>COURSE INTRO</small><b>{courseIntroLesson.title}</b></div>{lessonProgress.intro?.lessonCompletedAt ? <i>COMPLETE</i> : null}</a>{courseChapters.map((chapter, chapterIndex) => { const chapterComplete = chapterIsComplete(chapter); return <div className={`side-chapter ${chapterIndex === 1 ? "current" : ""} ${chapterComplete ? "complete" : ""}`} key={chapter.title}><button type="button" onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{chapterComplete ? "✓" : String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i>{chapterComplete ? "COMPLETE" : openChapter === chapterIndex ? "−" : "+"}</i></button>{openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => { const done = lessonIsComplete(lesson.id); const active = lesson.id === lessonId; return <li className={`${active ? "active" : ""} ${done ? "complete" : ""}`} key={lesson.id}><span>{done ? "✓" : active ? "●" : "○"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small>{lesson.path ? <a href={lesson.path}>{lesson.title}</a> : <b>{lesson.title}</b>}</div>{done ? <i>COMPLETE</i> : !lesson.path ? <i>LOCKED</i> : null}</li>; })}</ol> : null}</div>; })}</nav><div className="chapter-project"><span>CHAPTER PROGRESS</span><b>Choose models with purpose</b><p>Build a judgement call, not a favourite.</p><small>{modelTasksDone} / 12 tasks</small></div></aside>
      <article className="lesson-reading"><div className="lesson-reading-inner model-reading"><p className="reading-kicker">Lesson 02.1</p><h1>What models change.</h1><p className="lesson-lede">A model is the engine inside an AI tool. It affects how well the tool follows a detailed instruction, reasons through a difficult problem, writes code, understands an image and how much time or money a request takes. There is no model that wins every job.</p><div className="lesson-rule" />
        <section><p className="reading-kicker">Section 1</p><h2>Same chat box, different engine.</h2><p>ChatGPT, Claude and Gemini are products. Inside them, a particular model creates the answer. The product can also add search, tools, safety rules, memory and its own interface. That is why a result depends on more than the model name, but the model still matters.</p><p>Compare models by the work in front of you. A screenshot needs image understanding, a difficult calculation needs reasoning, and an existing app needs a model that can work carefully with code and project files.</p><LiveModelRankings /><figure className="model-ecosystem-figure"><div className="model-ecosystem-grid"><a href="https://www.anthropic.com/" target="_blank" rel="noreferrer"><Image src="/model-logos/anthropic.svg" alt="Anthropic logo" width={54} height={54} /><span>Hosted model provider</span><b>Use in a product or API</b></a><a href="https://gemini.google.com/" target="_blank" rel="noreferrer"><Image src="/model-logos/gemini.svg" alt="Google Gemini logo" width={54} height={54} /><span>Hosted model provider</span><b>Use in a product or API</b></a><a href="https://huggingface.co/models" target="_blank" rel="noreferrer"><Image src="/model-logos/huggingface.svg" alt="Hugging Face logo" width={54} height={54} /><span>Open model ecosystem</span><b>Find and run model weights</b></a></div><figcaption><b>Models reach you in different ways.</b><p>Hosted products make the infrastructure someone else&apos;s job. Open-weight ecosystems offer more choices about where a model runs.</p><a href="https://simpleicons.org/" target="_blank" rel="noreferrer">Icons: Simple Icons (CC0) ↗</a></figcaption></figure><TaskCard title="TASK 01 · MATCH THE STRENGTH" count="4 MATCHES" prompt="Connect each request to the first strength you should investigate." complete={completedTasks.includes("match")} onStart={() => startTask("capability")} /></section>
        <section><p className="reading-kicker">Section 2</p><h2>Rankings are a starting point, not a verdict.</h2><p>Leaderboards help you narrow a long list, but they cannot know your project, prompt, files or definition of a good answer. A top coding score does not guarantee that a model understands your codebase, and a low price per token does not automatically mean a lower bill for your task.</p><div className="live-reference-panel"><div><span>LIVE REFERENCES</span><h3>Check the category that matches the job.</h3><p>Use current measurements to form a shortlist, then test the task you actually need done.</p></div><a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noreferrer"><b>Artificial Analysis</b><span>Models, speed, price, context ↗</span></a><a href="https://llm-stats.com/" target="_blank" rel="noreferrer"><b>LLM Stats</b><span>Current benchmark comparisons ↗</span></a></div><TaskCard title="TASK 02 · MATCH THE MEASURE" count="4 MATCHES" prompt="Connect each job to the first measure you should check." complete={completedTasks.includes("source")} onStart={() => startTask("metric")} /></section>
        <section><p className="reading-kicker">Section 3</p><h2>Open and closed models.</h2><p>A closed model is run and controlled by its maker. You normally use it through a website or an API and pay through a subscription or usage charges. A model described as open weight makes its trained weights available, so other people can run, adapt or host it under that model&apos;s licence. This is often shortened to &quot;open source&quot;, although the licence and training data access vary, so read the details.</p><p>Running a model yourself means a computer has to store it in memory and do the calculations for every answer. Smaller models can run on a capable personal machine; larger ones often need expensive graphics hardware or rented servers. The cost is not only the model: it includes hardware, electricity, setup, security, updates and someone who can keep it working.</p><div className="open-closed-table"><div><span>Closed</span><b>Use a hosted service</b><p>Fastest route to a strong managed model. The provider handles the infrastructure.</p></div><div><span>Open weight</span><b>Choose where it runs</b><p>More control over deployment and customisation, with more responsibility for operations.</p></div></div><p>Open models matter because they give researchers, small teams and organisations another route to experiment and deploy. The sensible question is not &quot;open or closed?&quot; in the abstract. It is &quot;what level of control, privacy, capability and operating effort does this job need?&quot;</p><TaskCard title="TASK 03 · MATCH THE CONSTRAINT" count="4 MATCHES" prompt="Connect each situation to the decision that should lead your search." complete={completedTasks.includes("choose")} onStart={() => startTask("hosting")} /></section>
        {allTasksComplete ? <section className={`lesson-complete-card ${lessonComplete ? "complete" : ""}`}><span>{lessonComplete ? "LESSON COMPLETE" : "READY TO COMPLETE"}</span><h2>{lessonComplete ? "You can compare models with a purpose." : "Finish the lesson and collect your XP."}</h2><p>{lessonComplete ? "Your account has saved this lesson and its XP." : signedIn ? "All tasks are complete. Confirm the lesson to add 100 XP to your level." : "Sign in with Google to save this lesson and collect its XP."}</p>{lessonComplete ? null : <button className="complete-lesson-button" type="button" disabled={completionStatus === "saving"} onClick={completeLesson}>{completionStatus === "saving" ? "Completing lesson..." : "Complete lesson · +100 XP"}</button>}{completionStatus === "error" ? <small className="completion-error">We could not save the lesson yet. Please try again.</small> : null}</section> : null}
      </div></article>
      {visualOpen && activeVisual ? <aside className="lesson-visual context-visual" aria-label="Model matching task visual"><div className="visual-switcher task-visual-header"><div><span>Side view</span><b>{visualDetails[activeVisual].title}</b></div><span className="task-visual-context">{visualDetails[activeVisual].number}</span><button className="close-visual" type="button" onClick={() => setVisualOpen(false)} aria-label="Close side view">×</button></div><div className="context-visual-stage ai-visual-stage"><ModelTaskVisualContent visual={activeVisual} onComplete={() => completeTask(visualDetails[activeVisual].task)} /></div></aside> : null}
      {!visualOpen && activeVisual ? <button className="reopen-visual" type="button" onClick={() => setVisualOpen(true)}><span>Resume task visual</span><b>{visualDetails[activeVisual].title}</b></button> : null}
    </div>
    <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href="/"><span aria-hidden="true">←</span><b>Back to home</b></a><div><span>CHAPTER 02 · PICK THE RIGHT MODEL</span><b>{completedTasks.length} of 3 tasks complete</b></div><a className={`lesson-next ${!lessonComplete ? "disabled" : ""} ${signedIn === false && !lessonComplete ? "guest-gate" : ""}`} aria-disabled={!lessonComplete} href="/course/models/what-changes" onClick={(event) => { if (!lessonComplete) { event.preventDefault(); if (signedIn === false) setShowSignInNotice(true); } }}>Next lesson <PixelArrow /></a></nav>
    {showSignInNotice ? <CourseSignInNotice returnTo="/course/models/what-changes" onDismiss={() => setShowSignInNotice(false)} /> : null}
  </main>;
}
