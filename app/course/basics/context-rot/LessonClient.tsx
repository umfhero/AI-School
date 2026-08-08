"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Vinext's client Link handler fails on the deployed Worker, so this footer link must use native navigation. */

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
import AuthButton from "../../../components/AuthButton";
import { LessonCelebration } from "./LessonCelebration";
import { LessonVisualContent, type LessonVisual } from "./LessonVisuals";

const projectSetupPrompt = `You are setting up durable project context for this workspace.

First, inspect the project folder and the files that explain it. Read the existing documentation, package or dependency files, source structure, configuration, current task notes and recent decisions where they exist. Use only information you can find in the project or that I provide. Do not change code, configuration or dependencies yet.

Then create overview.md in the project root. Keep it concise, factual and useful to the next clean chat. Include:

# [Project name]
## Goal
## User and product context
## What exists
## How to run and check the project
## Current decisions
## Rules and constraints
## Current task
## TODO / tracker

For the TODO / tracker, separate completed work, work in progress, the next task and blocked items. Include file paths, commands and links when they matter. Mark anything uncertain as "Needs confirmation" instead of guessing.

When the file is ready, show me a short summary, the questions that still need my answer and the exact overview.md path. Do not start the next task until I have reviewed the file.`;

const courseChapters = [
  { title: "The basics", lessons: ["Context rot", "Your project brain", "Files and handovers", "A clean first workflow"] },
  { title: "Pick the right model", lessons: ["What models change", "Speed, cost and reasoning", "Context windows", "A simple model test"] },
  { title: "Build with an agent", lessons: ["Write the task brief", "Let the agent inspect", "Make the change", "Review what happened"] },
  { title: "Skills and repeatable work", lessons: ["What a skill is", "Write your first skill", "Use templates well", "Improve it from results"] },
  { title: "Fleets and parallel work", lessons: ["When parallel work helps", "Divide the jobs", "Write clean handovers", "Merge without chaos"] },
  { title: "Ship it properly", lessons: ["Verification", "Source control", "Deployment", "Maintaining the system"] },
];

const visualLabels: Record<LessonVisual, string> = {
  chat: "Long recipe chat",
  workflow: "Workflow comparison",
  workspace: "overview.md workspace",
};

const visualTaskLabels: Record<LessonVisual, string> = {
  chat: "Task 01",
  workflow: "Task 02",
  workspace: "Task 03",
};

export default function LessonClient() {
  const [copied, setCopied] = useState(false);
  const [openChapter, setOpenChapter] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visualOpen, setVisualOpen] = useState(false);
  const [activeVisual, setActiveVisual] = useState<LessonVisual | null>(null);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [visualWidth, setVisualWidth] = useState(620);
  const resizing = useRef(false);

  const progress = Math.round((completedTasks.length / 3) * 100);
  const workspaceStyle = { "--visual-width": `${visualWidth}px` } as CSSProperties;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { signal: controller.signal, credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Progress unavailable");
        return response.json() as Promise<{ user: unknown; completedTasks?: string[] }>;
      })
      .then((data) => {
        setSignedIn(Boolean(data.user));
        if (data.user && Array.isArray(data.completedTasks)) setCompletedTasks(data.completedTasks);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSaveStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const phoneLayout = window.matchMedia("(max-width: 920px)");
    const frame = window.requestAnimationFrame(() => {
      if (phoneLayout.matches) setSidebarOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function startTask(visual: LessonVisual) {
    setActiveVisual(visual);
    setVisualOpen(true);
  }

  function isTaskVisualOpen(visual: LessonVisual) {
    return visualOpen && activeVisual === visual;
  }

  function completeTask(task: string) {
    if (completedTasks.includes(task)) return;
    const next = [...completedTasks, task];
    setCompletedTasks(next);
    if (signedIn) void saveProgress(next);
    setVisualOpen(false);
    setCelebrationKey((key) => key + 1);
  }

  async function saveProgress(tasks: string[]) {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedTasks: tasks }),
      });
      if (!response.ok) throw new Error("Save failed");
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  async function copyProjectSetupPrompt() {
    await navigator.clipboard.writeText(projectSetupPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function beginResize(event: ReactPointerEvent<HTMLDivElement>) {
    resizing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resizeVisual(event: ReactPointerEvent<HTMLDivElement>) {
    if (!resizing.current) return;
    setVisualWidth(Math.min(860, Math.max(380, window.innerWidth - event.clientX)));
  }

  function endResize(event: ReactPointerEvent<HTMLDivElement>) {
    resizing.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function resizeWithKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setVisualWidth((width) => Math.min(860, Math.max(380, width + (event.key === "ArrowLeft" ? 30 : -30))));
  }

  return (
    <main className="lesson-page">
      <LessonCelebration trigger={celebrationKey} />
      <header className="lesson-header">
        <div className="lesson-header-left">
          <button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b>{sidebarOpen ? "Hide contents" : "Show contents"}</b></button>
          <a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI workflow course overview">
            <Image src="/ai-workflows-icon.png" alt="" width={28} height={28} priority />
            <b>AI workflow course</b>
          </a>
        </div>
        <div className="lesson-crumb"><span>Chapter 01 · The basics</span><span>/</span><b>Context rot</b></div>
        <div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: `${Math.max(4, progress)}%` }} /></span><b>{completedTasks.length} / 3 tasks</b></div><AuthButton returnTo="/course/basics/context-rot" compact /></div>
      </header>

      <div className={`lesson-workspace ${sidebarOpen ? "" : "sidebar-closed"} ${visualOpen ? "" : "visual-closed"}`} style={workspaceStyle}>
        <aside className="course-sidebar" id="course-contents" aria-label="Course contents">
          <div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: `${Math.max(4, progress)}%` }} /><small>{progress}% of this lesson</small></div></div>
          <nav>
            {courseChapters.map((chapter, chapterIndex) => (
              <div className={`side-chapter ${chapterIndex === 0 ? "current" : ""}`} key={chapter.title}>
                <button onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i aria-hidden="true">{openChapter === chapterIndex ? "−" : "+"}</i></button>
                {openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => <li className={chapterIndex === 0 && lessonIndex === 0 ? "active" : ""} key={lesson}><span>{chapterIndex === 0 && lessonIndex === 0 ? "●" : "○"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small><b>{lesson}</b></div>{chapterIndex > 0 ? <i>LOCKED</i> : null}</li>)}</ol> : null}
              </div>
            ))}
          </nav>
          <div className="chapter-project"><span>CHAPTER PROJECT</span><b>Build your project brain</b><p>Unlocks after all four lessons.</p><small>0 / 4 lessons</small></div>
        </aside>

        <article className="lesson-reading">
          <div className="lesson-reading-inner context-rot-reading">
            <p className={`progress-save-state ${signedIn ? "connected" : ""}`}>{signedIn ? (saveStatus === "saving" ? "Saving progress…" : saveStatus === "error" ? "Your progress could not be saved yet, while the lesson remains open." : "You are signed in, so task progress saves automatically.") : signedIn === false ? "Sign in above when you want this progress saved across devices." : "Your saved progress is being checked."}</p>
            <h1>Context rot.</h1>
            <p className="lesson-lede">An average user opens <a className="lesson-reference-link" href="https://chatgpt.com/" target="_blank" rel="noreferrer">ChatGPT</a>, <a className="lesson-reference-link" href="https://claude.ai/" target="_blank" rel="noreferrer">Claude</a> or <a className="lesson-reference-link" href="https://gemini.google.com/" target="_blank" rel="noreferrer">Gemini</a> and starts typing about one topic, because the chat looks like a place where the model knows the subject and remembers everything said before. The same thread then gathers new requests, corrections and side jobs, until the information that mattered at the start becomes harder for the model to use consistently.</p>
            <div className="lesson-rule" />

            <section id="one-growing-chat">
              <p className="reading-kicker">Section 1</p>
              <h2>One topic slowly becomes one crowded chat.</h2>
              <p>A recipe conversation can begin with a useful list of ingredients and a clear request, then grow into portion changes, lunch ideas and a shopping list. Each reply feels connected to the same topic, so keeping it all in one place seems sensible.</p>
              <p>The earlier ingredient list can remain inside the context window while the model uses it less consistently, because later instructions and similar details compete for the same answer. People often describe this as the model forgetting, although the practical problem is unreliable use of information that still exists somewhere in a long input.</p>
              <div className={`inline-task context-task ${completedTasks.includes("diagnose") ? "complete" : ""}`}>
                <div className="task-heading"><span>TASK 01 · FIND THE DRIFT</span><b>{completedTasks.includes("diagnose") ? "COMPLETE ✓" : "3 MINUTES"}</b></div>
                <h3>Read the conversation and find the first reply that breaks the original brief.</h3>
                <p>The original brief asks for vegetarian meals for two people that use chickpeas, spinach, peppers, lemon, rice and yoghurt first.</p>
                <button className="start-task-button" type="button" onClick={() => startTask("chat")}>Open task<span aria-hidden="true">→</span></button>
                {isTaskVisualOpen("chat") ? <><div className="answer-list"><button onClick={() => setQuizAnswer("a")}>Turn 04, when the assistant changes the cooking method.</button><button onClick={() => { setQuizAnswer("b"); completeTask("diagnose"); }}>Turn 10, when the assistant buys a new meal and adds breakfast food.</button><button onClick={() => setQuizAnswer("c")}>Turn 16, when the assistant suggests couscous and halloumi.</button></div>
                {quizAnswer ? <p className={`task-feedback ${quizAnswer === "b" ? "right" : "wrong"}`}>{quizAnswer === "b" ? "Turn 10 is the first clear drift, because it ignores the pantry and also breaks the instruction about breakfast food." : "The conversation has already drifted before that point, so compare the reply with the original instruction at the top of the side view."}</p> : null}</> : <p className="task-start-note">Open the task to view the recipe conversation and reveal the answer choices.</p>}
              </div>
            </section>

            <section id="what-research-shows">
              <p className="reading-kicker">Section 2</p>
              <h2>More context can make a simple task less reliable.</h2>
              <p>Chroma tested whether leading models could copy a sequence of repeated words exactly. The task stayed simple while the input grew longer: reproduce the text, including one deliberately different word, without changing anything.</p>
              <figure className="research-figure">
                <a className="research-image-link" href="https://www.trychroma.com/research/context-rot" target="_blank" rel="noreferrer" aria-label="Open the original Context Rot research figure on Chroma">
                  <Image src="/context-rot-repeated-words.png" alt="Chroma line chart showing normalized Levenshtein scores falling as input length grows for Claude Sonnet 4, GPT-4.1, Qwen3-32B and Gemini 2.5 Flash on the Repeated Words task." width={1200} height={790} />
                  <span>Open original figure ↗</span>
                </a>
                <figcaption><span>Repeated Words</span><p>All four models became less accurate as the sequence grew, despite the instruction itself staying the same.</p><a href="https://www.trychroma.com/research/context-rot#repeated-words" target="_blank" rel="noreferrer">Chroma, Context Rot ↗</a></figcaption>
                <div className="research-model-links"><span>Models shown</span><a href="https://www.anthropic.com/claude/sonnet" target="_blank" rel="noreferrer">Claude Sonnet 4 ↗</a><a href="https://openai.com/index/gpt-4-1/" target="_blank" rel="noreferrer">GPT-4.1 ↗</a><a href="https://qwenlm.github.io/blog/qwen3/" target="_blank" rel="noreferrer">Qwen3-32B ↗</a><a href="https://deepmind.google/models/gemini/flash/" target="_blank" rel="noreferrer">Gemini 2.5 Flash ↗</a></div>
              </figure>
              <p>The score uses normalized Levenshtein distance: higher means the model&apos;s output stayed closer to the text it was asked to copy. This is a controlled copying test, not a prediction of when a recipe chat will fail. It shows the underlying problem clearly: being able to receive more context does not mean using all of it with the same reliability.</p>
              <div className={`inline-task context-task observation ${completedTasks.includes("compare") ? "complete" : ""}`}>
                <div className="task-heading"><span>TASK 02 · COMPARE THE WORKFLOWS</span><b>{completedTasks.includes("compare") ? "COMPLETE ✓" : "2 MINUTES"}</b></div>
                <h3>Follow where the original ingredients live in each workflow.</h3>
                <p>In the growing chat, those facts sit above every later job. In the focused workflow, the facts live in one source of truth and each new chat receives the part it needs.</p>
                <button className="start-task-button" type="button" onClick={() => startTask("workflow")}>Open task<span aria-hidden="true">→</span></button>
                {isTaskVisualOpen("workflow") ? <button className="task-complete-button" onClick={() => completeTask("compare")}>{completedTasks.includes("compare") ? "Comparison complete" : "I have compared both workflows"}</button> : <p className="task-start-note">Open the task to compare the two workflows.</p>}
              </div>
            </section>

            <section id="source-of-truth">
              <p className="reading-kicker">Section 3</p>
              <h2>Move the useful context into overview.md.</h2>
              <p>An overview.md file is a short record of the facts that should survive between chats, including the goal, current state, settled decisions and the next job. It gives the project a memory that you can read and edit directly, instead of asking one conversation to hold the current version of every fact.</p>
              <p>The clean chat becomes useful when you give it that current record at the start. For the recipe example, a new chat can begin with <code>@overview.md please suggest a recipe</code>, which supplies the pantry list and rules without the older lunch discussion or abandoned shopping ideas.</p>
              <p>Use a separate clean chat for each proper job, then update overview.md when a fact or decision changes. The next task begins from the edited file, while completed chat history can stay closed.</p>
              <div className="project-setup-guide">
                <div className="project-setup-steps"><span>SET UP THE FILE ONCE</span><h3>Ask your AI to make the first version from the project it can see.</h3><ol><li><b>Open a new chat in the project folder.</b><span>Give it access to the files, documentation and current task notes.</span></li><li><b>Copy the prompt below.</b><span>It tells the AI to inspect the evidence before it writes overview.md.</span></li><li><b>Review the file before the next task.</b><span>Correct missing facts, then keep the tracker current as the work changes.</span></li></ol></div>
                <div className="project-setup-prompt"><header><div><span>PROJECT SETUP PROMPT</span><b>Paste this into your AI at the start of a project.</b></div><button type="button" onClick={copyProjectSetupPrompt}>{copied ? "Copied" : "Copy prompt"}</button></header><pre><code>{projectSetupPrompt}</code></pre></div>
              </div>
              <div className={`inline-task context-task build-task ${completedTasks.includes("build") ? "complete" : ""}`}>
                <div className="task-heading"><span>TASK 03 · MAKE THE FILE</span><b>{completedTasks.includes("build") ? "COMPLETE ✓" : "5 MINUTES"}</b></div>
                <h3>Create overview.md for a project you already have.</h3>
                <ul><li>Write the project goal and the current state as facts.</li><li>Record decisions that the next chat must keep.</li><li>Give the next chat one specific job, then start that job in a clean chat with the file attached.</li></ul>
                <button className="start-task-button" type="button" onClick={() => startTask("workspace")}>Open task<span aria-hidden="true">→</span></button>
                {isTaskVisualOpen("workspace") ? <button className="task-complete-button" onClick={() => completeTask("build")}>{completedTasks.includes("build") ? "Task complete" : "I have made the file"}</button> : <p className="task-start-note">Open the task to inspect the overview.md workspace.</p>}
              </div>
            </section>

            {completedTasks.length === 3 ? <section className="lesson-complete-card"><span>LESSON COMPLETE</span><h2>You have moved project memory outside the chat.</h2><p>{signedIn ? "Your account now holds the completed tasks, so this lesson will remain complete on another device." : "You can sign in with Google to keep the completed tasks when you continue on another device."}</p></section> : null}

            <section className="lesson-sources"><p className="reading-kicker">Sources</p><h2>The research used in this lesson.</h2><a href="https://www.trychroma.com/research/context-rot" target="_blank" rel="noreferrer"><b>Chroma Research</b><span>Context Rot ↗</span></a><a href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noreferrer"><b>Liu et al.</b><span>Lost in the Middle ↗</span></a></section>
          </div>
        </article>

        {/* A focusable ARIA separator supports pointer dragging and keyboard resizing. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {visualOpen && activeVisual ? <div className="lesson-resize-handle" role="separator" aria-label="Resize the lesson visual" aria-orientation="vertical" aria-valuemin={380} aria-valuemax={860} aria-valuenow={visualWidth} tabIndex={0} onPointerDown={beginResize} onPointerMove={resizeVisual} onPointerUp={endResize} onPointerCancel={endResize} onKeyDown={resizeWithKeyboard}><span aria-hidden="true">⋮</span></div> : null}
        {visualOpen && activeVisual ? <aside className="lesson-visual context-visual" aria-label={`${visualLabels[activeVisual]} visual`}>
          <div className="visual-switcher task-visual-header"><div><span>Side view</span><b>{visualLabels[activeVisual]}</b></div><span className="task-visual-context">{visualTaskLabels[activeVisual]}</span><button className="close-visual" type="button" onClick={() => setVisualOpen(false)} aria-label="Close side view">×</button></div>
          <div className="context-visual-stage"><LessonVisualContent visual={activeVisual} /></div>
        </aside> : null}
        {!visualOpen && activeVisual ? <button className="reopen-visual" type="button" onClick={() => setVisualOpen(true)}><span>Resume task visual</span><b>{visualLabels[activeVisual]}</b></button> : null}
      </div>

      <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href="/"><span aria-hidden="true">←</span><b>Back to home</b></a><div><span>CHAPTER 01 · THE BASICS</span><b>{completedTasks.length} of 3 tasks complete</b></div><button className="lesson-next" disabled={completedTasks.length < 3} title={completedTasks.length < 3 ? "Complete the three tasks to unlock the next lesson" : undefined}>Next lesson <span aria-hidden="true">→</span></button></nav>
    </main>
  );
}
