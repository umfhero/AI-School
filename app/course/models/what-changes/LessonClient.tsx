"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import AuthButton from "../../../components/AuthButton";
import CourseSignInNotice from "../../../components/CourseSignInNotice";
import ExperienceBadge from "../../../components/ExperienceBadge";
import LessonSaveState from "../../../components/LessonSaveState";
import LessonXpCelebration from "../../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../../components/PixelIcons";
import { courseChapters, courseIntroLesson } from "../../courseData";

const lessonId = "models/what-changes";
const taskIds = ["match", "source", "choose"];

type LessonProgress = Record<string, { completedTasks?: string[]; lessonCompletedAt?: number }>;
type SaveStatus = "idle" | "saving" | "saved" | "error";
type Answer = "writing" | "image" | "reasoning" | "open" | null;

function TaskCard({ complete, children, title }: { complete: boolean; children: ReactNode; title: string }) {
  return <div className={`inline-task model-task ${complete ? "complete" : ""}`}>
    <div className="task-heading"><span>{title}</span><b>{complete ? "COMPLETE ✓" : "1 DECISION"}</b></div>
    {children}
  </div>;
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
  const [matchAnswer, setMatchAnswer] = useState<Answer>(null);
  const [sourceAnswer, setSourceAnswer] = useState<Answer>(null);
  const [choiceAnswer, setChoiceAnswer] = useState<Answer>(null);
  const [celebrationKey, setCelebrationKey] = useState(0);

  const progress = Math.round((completedTasks.length / taskIds.length) * 100);
  const allTasksComplete = completedTasks.length === taskIds.length;
  const lessonComplete = Boolean(lessonCompletedAt);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { signal: controller.signal, credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Progress unavailable");
        return response.json() as Promise<{ user: unknown; lessons?: LessonProgress }>;
      })
      .then((data) => {
        setSignedIn(Boolean(data.user));
        setLessonProgress(data.lessons ?? {});
        setCompletedTasks(data.lessons?.[lessonId]?.completedTasks ?? []);
        setLessonCompletedAt(data.lessons?.[lessonId]?.lessonCompletedAt ?? null);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSaveStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const phoneLayout = window.matchMedia("(max-width: 920px)");
    const frame = window.requestAnimationFrame(() => { if (phoneLayout.matches) setSidebarOpen(false); });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function completeTask(task: string) {
    if (completedTasks.includes(task)) return;
    const next = [...completedTasks, task];
    setCompletedTasks(next);
    if (signedIn) void saveProgress(next);
    setCelebrationKey((key) => key + 1);
  }

  async function saveProgress(tasks: string[]) {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/progress", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, completedTasks: tasks }) });
      if (!response.ok) throw new Error("Save failed");
      setSaveStatus("saved");
      window.dispatchEvent(new Event("progress-changed"));
    } catch { setSaveStatus("error"); }
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
      setLessonCompletedAt(data.lesson.lessonCompletedAt);
      setCompletionStatus("idle");
      window.dispatchEvent(new Event("progress-changed"));
      if (data.newlyCompleted) setCelebrationKey((key) => key + 1);
    } catch { setCompletionStatus("error"); }
  }

  function lessonIsComplete(id: string) { return Boolean(id === lessonId ? lessonCompletedAt : lessonProgress[id]?.lessonCompletedAt); }
  function chapterIsComplete(chapter: typeof courseChapters[number]) { return chapter.lessons.every((lesson) => lessonIsComplete(lesson.id)); }
  const modelLessons = courseChapters[1].lessons;
  const modelTasksDone = modelLessons.reduce((total, lesson) => total + (lesson.id === lessonId ? completedTasks.length : lessonProgress[lesson.id]?.completedTasks?.length ?? 0), 0);

  return <main className="lesson-page">
    <LessonXpCelebration trigger={celebrationKey} nextLessonHref="/course/models/what-changes" />
    <header className="lesson-header"><div className="lesson-header-left"><button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b>{sidebarOpen ? "Hide contents" : "Show contents"}</b></button><a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI school course overview"><PixelSpark className="lesson-brand-star" /><b>AI school</b></a></div><div className="lesson-crumb"><span>Chapter 02 · Pick the right model</span><span>/</span><b>What models change</b></div><div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: `${Math.max(4, progress)}%` }} /></span><b>{completedTasks.length} / 3 tasks</b></div><LessonSaveState signedIn={signedIn} status={saveStatus} /><ExperienceBadge compact /><AuthButton returnTo="/course/models/what-changes" compact /></div></header>

    <div className={`lesson-workspace visual-closed ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <aside className="course-sidebar" id="course-contents" aria-label="Course contents"><div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: `${Math.max(4, progress)}%` }} /><small>{progress}% of this lesson</small></div></div><nav><a className={`course-intro-link ${lessonProgress.intro?.lessonCompletedAt ? "complete" : ""}`} href={courseIntroLesson.path}><span>{lessonProgress.intro?.lessonCompletedAt ? "✓" : "○"}</span><div><small>COURSE INTRO</small><b>{courseIntroLesson.title}</b></div>{lessonProgress.intro?.lessonCompletedAt ? <i>COMPLETE</i> : null}</a>{courseChapters.map((chapter, chapterIndex) => { const chapterComplete = chapterIsComplete(chapter); return <div className={`side-chapter ${chapterIndex === 1 ? "current" : ""} ${chapterComplete ? "complete" : ""}`} key={chapter.title}><button type="button" onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{chapterComplete ? "✓" : String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i>{chapterComplete ? "COMPLETE" : openChapter === chapterIndex ? "−" : "+"}</i></button>{openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => { const done = lessonIsComplete(lesson.id); const active = lesson.id === lessonId; return <li className={`${active ? "active" : ""} ${done ? "complete" : ""}`} key={lesson.id}><span>{done ? "✓" : active ? "●" : "○"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small>{lesson.path ? <a href={lesson.path}>{lesson.title}</a> : <b>{lesson.title}</b>}</div>{done ? <i>COMPLETE</i> : !lesson.path ? <i>LOCKED</i> : null}</li>; })}</ol> : null}</div>; })}</nav><div className="chapter-project"><span>CHAPTER PROGRESS</span><b>Choose models with purpose</b><p>Build a judgement call, not a favourite.</p><small>{modelTasksDone} / 12 tasks</small></div></aside>

      <article className="lesson-reading"><div className="lesson-reading-inner model-reading"><p className="reading-kicker">Lesson 02.1</p><h1>What models change.</h1><p className="lesson-lede">A model is the engine inside an AI tool. It affects how well the tool follows a detailed instruction, reasons through a difficult problem, writes code, understands an image and how much time or money a request takes. There is no model that wins every job.</p><div className="lesson-rule" />
        <section><p className="reading-kicker">Section 1</p><h2>Same chat box, different engine.</h2><p>ChatGPT, Claude and Gemini are products. Inside them, a particular model creates the answer. The product can also add search, tools, safety rules, memory and its own interface. That is why a result depends on more than the model name, but the model still matters.</p><p>Think of a model as a specialist with a different balance of strengths. One may write cleanly, another may handle an image or a spreadsheet well, and another may spend more effort on a multi-step problem. A model can be strong in one area and merely adequate in another.</p><div className="model-strength-grid" aria-label="Examples of model strengths"><article><span>WRITING</span><b>Clear draft</b><p>Tone, structure and a useful first pass.</p></article><article><span>REASONING</span><b>Hard problem</b><p>Several steps, checks and constraints.</p></article><article><span>CODE</span><b>Project change</b><p>Reading files, changing code and testing.</p></article><article><span>VISION</span><b>Image input</b><p>Reading a screenshot, chart or photograph.</p></article></div>
          <figure className="model-ecosystem-figure"><div className="model-ecosystem-grid"><a href="https://www.anthropic.com/" target="_blank" rel="noreferrer"><Image src="/model-logos/anthropic.svg" alt="Anthropic logo" width={54} height={54} /><span>Hosted model provider</span><b>Use in a product or API</b></a><a href="https://gemini.google.com/" target="_blank" rel="noreferrer"><Image src="/model-logos/gemini.svg" alt="Google Gemini logo" width={54} height={54} /><span>Hosted model provider</span><b>Use in a product or API</b></a><a href="https://huggingface.co/models" target="_blank" rel="noreferrer"><Image src="/model-logos/huggingface.svg" alt="Hugging Face logo" width={54} height={54} /><span>Open model ecosystem</span><b>Find and run model weights</b></a></div><figcaption><b>Models reach you in different ways.</b><p>Hosted products make the infrastructure someone else&apos;s job. Open-weight ecosystems offer more choices about where a model runs.</p><a href="https://simpleicons.org/" target="_blank" rel="noreferrer">Icons: Simple Icons (CC0) ↗</a></figcaption></figure>
          <TaskCard title="TASK 01 · MATCH THE STRENGTH" complete={completedTasks.includes("match")}><h3>Choose the best first strength to investigate.</h3><p>You need an AI to explain a complicated chart from a screenshot. Before price or speed, what capability should you check?</p><div className="model-options">{[["writing", "Writing"], ["image", "Image understanding"], ["reasoning", "Reasoning only"]].map(([value, label]) => <button key={value} type="button" className={matchAnswer === value ? "selected" : ""} onClick={() => setMatchAnswer(value as Answer)}>{label}</button>)}</div>{matchAnswer ? <p className={`task-feedback ${matchAnswer === "image" ? "right" : "wrong"}`}>{matchAnswer === "image" ? "Correct. The model needs image understanding first; reasoning still matters after it can read the chart." : "Try again. The request starts with information held in an image."}</p> : null}{matchAnswer === "image" ? <button className="task-complete-button" type="button" onClick={() => completeTask("match")}>Check answer</button> : null}</TaskCard>
        </section>
        <section><p className="reading-kicker">Section 2</p><h2>Rankings are a starting point, not a verdict.</h2><p>Leaderboards let you compare current models across measurements such as intelligence, coding, output speed, price, latency and context window. They help narrow a long list, but they cannot know your exact project, prompt, files or definition of a good answer.</p><div className="live-reference-panel"><div><span>LIVE REFERENCES</span><h3>Check the category that matches the job.</h3><p>These lists change often. Open them when you are choosing a model, then compare the task and the measurement before looking at the position.</p></div><a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noreferrer"><b>Artificial Analysis</b><span>Models, speed, price, context ↗</span></a><a href="https://llm-stats.com/" target="_blank" rel="noreferrer"><b>LLM Stats</b><span>Current benchmark comparisons ↗</span></a></div><p>A benchmark is a repeatable test. It is useful evidence, not a promise. A top coding score does not guarantee that a model understands your codebase, and a low price per token does not automatically mean a lower bill for your task. The right comparison is always close to the work you actually need done.</p>
          <TaskCard title="TASK 02 · READ THE MEASURE" complete={completedTasks.includes("source")}><h3>Pick the evidence that fits the question.</h3><p>You need to send 80 short support replies quickly. Which leaderboard category is the most relevant first check?</p><div className="model-options">{[["writing", "Output speed and price"], ["image", "Image benchmark"], ["reasoning", "Largest context window"]].map(([value, label]) => <button key={value} type="button" className={sourceAnswer === value ? "selected" : ""} onClick={() => setSourceAnswer(value as Answer)}>{label}</button>)}</div>{sourceAnswer ? <p className={`task-feedback ${sourceAnswer === "writing" ? "right" : "wrong"}`}>{sourceAnswer === "writing" ? "Correct. The work is short and repeated, so output speed and price are useful starting measures." : "Look for measures that describe how quickly and economically the repeated work can be produced."}</p> : null}{sourceAnswer === "writing" ? <button className="task-complete-button" type="button" onClick={() => completeTask("source")}>Check answer</button> : null}</TaskCard>
        </section>
        <section><p className="reading-kicker">Section 3</p><h2>Open and closed models.</h2><p>A closed model is run and controlled by its maker. You normally use it through a website or an API and pay through a subscription or usage charges. A model described as open weight makes its trained weights available, so other people can run, adapt or host it under that model&apos;s licence. This is often shortened to &quot;open source&quot;, although the licence and training data access vary, so read the details.</p><p>Running a model yourself means a computer has to store it in memory and do the calculations for every answer. Smaller models can run on a capable personal machine; larger ones often need expensive graphics hardware or rented servers. The cost is not only the model: it includes hardware, electricity, setup, security, updates and someone who can keep it working.</p><div className="open-closed-table"><div><span>Closed</span><b>Use a hosted service</b><p>Fastest route to a strong managed model. The provider handles the infrastructure.</p></div><div><span>Open weight</span><b>Choose where it runs</b><p>More control over deployment and customisation, with more responsibility for operations.</p></div></div><p>Open models matter because they give researchers, small teams and organisations another route to experiment and deploy. The sensible question is not &quot;open or closed?&quot; in the abstract. It is &quot;what level of control, privacy, capability and operating effort does this job need?&quot;</p>
          <TaskCard title="TASK 03 · CHOOSE THE CONSTRAINT" complete={completedTasks.includes("choose")}><h3>Identify the deciding factor.</h3><p>A team needs to keep sensitive documents inside its own environment and has engineers who can operate the system. What should lead its model search?</p><div className="model-options">{[["writing", "The most popular chat product"], ["open", "Deployment control and licence"], ["reasoning", "The largest public benchmark score"]].map(([value, label]) => <button key={value} type="button" className={choiceAnswer === value ? "selected" : ""} onClick={() => setChoiceAnswer(value as Answer)}>{label}</button>)}</div>{choiceAnswer ? <p className={`task-feedback ${choiceAnswer === "open" ? "right" : "wrong"}`}>{choiceAnswer === "open" ? "Correct. Their privacy and hosting constraint determines the shortlist before a general leaderboard position does." : "The key detail is that the documents must stay in the team&apos;s own environment."}</p> : null}{choiceAnswer === "open" ? <button className="task-complete-button" type="button" onClick={() => completeTask("choose")}>Check answer</button> : null}</TaskCard>
        </section>
        {allTasksComplete ? <section className={`lesson-complete-card ${lessonComplete ? "complete" : ""}`}><span>{lessonComplete ? "LESSON COMPLETE" : "READY TO COMPLETE"}</span><h2>{lessonComplete ? "You can compare models with a purpose." : "Finish the lesson and collect your XP."}</h2><p>{lessonComplete ? "Your account has saved this lesson and its XP." : signedIn ? "All tasks are complete. Confirm the lesson to add 100 XP to your level." : "Sign in with Google to save this lesson and collect its XP."}</p>{lessonComplete ? null : <button className="complete-lesson-button" type="button" disabled={completionStatus === "saving"} onClick={completeLesson}>{completionStatus === "saving" ? "Completing lesson..." : "Complete lesson · +100 XP"}</button>}{completionStatus === "error" ? <small className="completion-error">We could not save the lesson yet. Please try again.</small> : null}</section> : null}
      </div></article>
    </div>
    <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href="/"><span aria-hidden="true">←</span><b>Back to home</b></a><div><span>CHAPTER 02 · PICK THE RIGHT MODEL</span><b>{completedTasks.length} of 3 tasks complete</b></div><a className={`lesson-next ${!lessonComplete ? "disabled" : ""} ${signedIn === false && !lessonComplete ? "guest-gate" : ""}`} aria-disabled={!lessonComplete} href="/course/models/what-changes" onClick={(event) => { if (!lessonComplete) { event.preventDefault(); if (signedIn === false) setShowSignInNotice(true); } }}>Next lesson <PixelArrow /></a></nav>
    {showSignInNotice ? <CourseSignInNotice returnTo="/course/models/what-changes" onDismiss={() => setShowSignInNotice(false)} /> : null}
  </main>;
}
