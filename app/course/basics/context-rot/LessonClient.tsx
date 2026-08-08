"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "../../../components/AuthButton";
import { LessonVisualContent, type LessonVisual } from "./LessonVisuals";

const template = `# [Project name]

## Goal
[What are you making, and who is it for?]

## What exists
[Pages, files, decisions and links]

## Current task
[One thing the next chat should do]

## Rules
[Style, tools, limits and things to avoid]`;

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

export default function LessonClient() {
  const [copied, setCopied] = useState(false);
  const [openChapter, setOpenChapter] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visualOpen, setVisualOpen] = useState(true);
  const [activeVisual, setActiveVisual] = useState<LessonVisual>("chat");
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

  function showVisual(visual: LessonVisual) {
    setActiveVisual(visual);
    setVisualOpen(true);
  }

  function completeTask(task: string) {
    if (completedTasks.includes(task)) return;
    const next = [...completedTasks, task];
    setCompletedTasks(next);
    if (signedIn) void saveProgress(next);
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

  async function copyTemplate() {
    await navigator.clipboard.writeText(template);
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
      <header className="lesson-header">
        <div className="lesson-header-left">
          <button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b>{sidebarOpen ? "Hide contents" : "Show contents"}</b></button>
          <div className="lesson-brand"><b>AI Free Course</b></div>
        </div>
        <div className="lesson-crumb"><span>Chapter 01 · The basics</span><span>/</span><b>Context rot</b></div>
        <div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: `${Math.max(4, progress)}%` }} /></span><b>{completedTasks.length} / 3 tasks</b></div><AuthButton returnTo="/course/basics/context-rot" compact /></div>
      </header>

      <div className={`lesson-workspace ${sidebarOpen ? "" : "sidebar-closed"} ${visualOpen ? "" : "visual-closed"}`} style={workspaceStyle}>
        <aside className="course-sidebar" id="course-contents" aria-label="Course contents">
          <div className="course-side-head"><p>AI Free Course</p><h2>Course contents</h2><div><span style={{ width: `${Math.max(4, progress)}%` }} /><small>{progress}% of this lesson</small></div></div>
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
            <p className="lesson-lede">An average user opens ChatGPT, Claude or Gemini and starts typing about one topic, because the chat looks like a place where the model knows the subject and remembers everything said before. The same thread then gathers new requests, corrections and side jobs, until the information that mattered at the start becomes harder for the model to use consistently.</p>
            <div className="lesson-rule" />

            <section id="one-growing-chat">
              <p className="reading-kicker">Section 1</p>
              <h2>One topic slowly becomes one crowded chat.</h2>
              <p>A recipe conversation can begin with a useful list of ingredients and a clear request, then grow into portion changes, lunch ideas and a shopping list. Each reply feels connected to the same topic, so keeping it all in one place seems sensible.</p>
              <p>The earlier ingredient list can remain inside the context window while the model uses it less consistently, because later instructions and similar details compete for the same answer. People often describe this as the model forgetting, although the practical problem is unreliable use of information that still exists somewhere in a long input.</p>
              <button className="open-visual-button" type="button" onClick={() => showVisual("chat")}><span>Open the side view</span><b>Read the long recipe chat</b><i aria-hidden="true">→</i></button>

              <div className={`inline-task context-task ${completedTasks.includes("diagnose") ? "complete" : ""}`}>
                <div className="task-heading"><span>TASK 01 · FIND THE DRIFT</span><b>{completedTasks.includes("diagnose") ? "COMPLETE ✓" : "3 MINUTES"}</b></div>
                <h3>Read the conversation and find the first reply that breaks the original brief.</h3>
                <p>The original brief asks for vegetarian meals for two people that use chickpeas, spinach, peppers, lemon, rice and yoghurt first.</p>
                <div className="answer-list"><button onClick={() => setQuizAnswer("a")}>Turn 04, when the assistant changes the cooking method.</button><button onClick={() => { setQuizAnswer("b"); completeTask("diagnose"); }}>Turn 10, when the assistant buys a new meal and adds breakfast food.</button><button onClick={() => setQuizAnswer("c")}>Turn 16, when the assistant suggests couscous and halloumi.</button></div>
                {quizAnswer ? <p className={`task-feedback ${quizAnswer === "b" ? "right" : "wrong"}`}>{quizAnswer === "b" ? "Turn 10 is the first clear drift, because it ignores the pantry and also breaks the instruction about breakfast food." : "The conversation has already drifted before that point, so compare the reply with the original instruction at the top of the side view."}</p> : null}
              </div>
            </section>

            <section id="what-research-shows">
              <p className="reading-kicker">Section 2</p>
              <h2>A large context window and reliable recall are different things.</h2>
              <p>A context window sets how much text a model can receive in one request, while the answer still depends on how well the model finds and uses the relevant part. Chroma tested this with LongMemEval, where models answered questions from either a focused prompt of about 300 tokens or a full chat history of about 113,000 tokens.</p>
              <figure className="research-figure">
                <Image src="/context-rot-longmemeval-claude.png" alt="Chroma bar chart comparing Claude performance on focused prompts and full long chat histories, with focused prompts scoring higher for every tested model." width={1200} height={600} />
                <figcaption><span>Published research figure</span><p>Every Claude model in this test scored higher with the focused input than with the full history.</p><a href="https://www.trychroma.com/research/context-rot#longmemeval" target="_blank" rel="noreferrer">Chroma, Context Rot ↗</a></figcaption>
              </figure>
              <p>The graph measures a controlled question-answering task rather than recipe planning, so it does not predict a fixed point where a conversation fails. It does support the practical lesson that carrying an entire history can make a simple job less reliable than supplying the smaller part that the job needs.</p>
              <button className="open-visual-button" type="button" onClick={() => showVisual("workflow")}><span>Open the side view</span><b>Compare both workflows</b><i aria-hidden="true">→</i></button>

              <div className={`inline-task context-task observation ${completedTasks.includes("compare") ? "complete" : ""}`}>
                <div className="task-heading"><span>TASK 02 · COMPARE THE WORKFLOWS</span><b>{completedTasks.includes("compare") ? "COMPLETE ✓" : "2 MINUTES"}</b></div>
                <h3>Follow where the original ingredients live in each workflow.</h3>
                <p>In the growing chat, those facts sit above every later job. In the focused workflow, the facts live in one source of truth and each new chat receives the part it needs.</p>
                <button className="task-complete-button" onClick={() => { showVisual("workflow"); completeTask("compare"); }}>{completedTasks.includes("compare") ? "Comparison complete" : "I have compared both workflows"}</button>
              </div>
            </section>

            <section id="source-of-truth">
              <p className="reading-kicker">Section 3</p>
              <h2>Move the useful context into overview.md.</h2>
              <p>An overview.md file is a short record of the facts that should survive between chats, including the goal, current state, settled decisions and the next job. It gives the project a memory that you can read and edit directly, instead of asking one conversation to hold the current version of every fact.</p>
              <p>The clean chat becomes useful when you give it that current record at the start. For the recipe example, a new chat can begin with <code>@overview.md please suggest a recipe</code>, which supplies the pantry list and rules without the older lunch discussion or abandoned shopping ideas.</p>
              <p>Use a separate clean chat for each proper job, then update overview.md when a fact or decision changes. The next task begins from the edited file, while completed chat history can stay closed.</p>
              <button className="open-visual-button" type="button" onClick={() => showVisual("workspace")}><span>Open the side view</span><b>See overview.md in a clean workspace</b><i aria-hidden="true">→</i></button>

              <div className="lesson-template"><div><span>overview.md</span><button onClick={copyTemplate}>{copied ? "Copied" : "Copy template"}</button></div><pre><code>{template}</code></pre></div>
              <div className={`inline-task context-task build-task ${completedTasks.includes("build") ? "complete" : ""}`}>
                <div className="task-heading"><span>TASK 03 · MAKE THE FILE</span><b>{completedTasks.includes("build") ? "COMPLETE ✓" : "5 MINUTES"}</b></div>
                <h3>Create overview.md for a project you already have.</h3>
                <ul><li>Write the project goal and the current state as facts.</li><li>Record decisions that the next chat must keep.</li><li>Give the next chat one specific job, then start that job in a clean chat with the file attached.</li></ul>
                <button className="task-complete-button" onClick={() => { showVisual("workspace"); completeTask("build"); }}>{completedTasks.includes("build") ? "Task complete" : "I have made the file"}</button>
              </div>
            </section>

            {completedTasks.length === 3 ? <section className="lesson-complete-card"><span>LESSON COMPLETE</span><h2>You have moved project memory outside the chat.</h2><p>{signedIn ? "Your account now holds the completed tasks, so this lesson will remain complete on another device." : "You can sign in with Google to keep the completed tasks when you continue on another device."}</p></section> : null}

            <section className="lesson-sources"><p className="reading-kicker">Sources</p><h2>The research used in this lesson.</h2><a href="https://www.trychroma.com/research/context-rot" target="_blank" rel="noreferrer"><b>Chroma Research</b><span>Context Rot ↗</span></a><a href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noreferrer"><b>Liu et al.</b><span>Lost in the Middle ↗</span></a></section>
          </div>
        </article>

        {/* A focusable ARIA separator supports pointer dragging and keyboard resizing. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {visualOpen ? <div className="lesson-resize-handle" role="separator" aria-label="Resize the lesson visual" aria-orientation="vertical" aria-valuemin={380} aria-valuemax={860} aria-valuenow={visualWidth} tabIndex={0} onPointerDown={beginResize} onPointerMove={resizeVisual} onPointerUp={endResize} onPointerCancel={endResize} onKeyDown={resizeWithKeyboard}><span aria-hidden="true">⋮</span></div> : null}
        {visualOpen ? <aside className="lesson-visual context-visual" aria-label={`${visualLabels[activeVisual]} visual`}>
          <div className="visual-switcher"><div><span>Side view</span><b>{visualLabels[activeVisual]}</b></div><nav aria-label="Choose lesson visual">{(Object.keys(visualLabels) as LessonVisual[]).map((visual) => <button className={activeVisual === visual ? "active" : ""} type="button" onClick={() => setActiveVisual(visual)} key={visual}>{visualLabels[visual]}</button>)}</nav><button className="close-visual" type="button" onClick={() => setVisualOpen(false)} aria-label="Close side view">×</button></div>
          <div className="context-visual-stage"><LessonVisualContent visual={activeVisual} /></div>
        </aside> : null}
        {!visualOpen ? <button className="reopen-visual" type="button" onClick={() => setVisualOpen(true)}><span>Open side view</span><b>{visualLabels[activeVisual]}</b></button> : null}
      </div>

      <nav className="lesson-bottom" aria-label="Lesson navigation"><Link className="lesson-home-back" href="/"><span aria-hidden="true">←</span><b>Back to home</b></Link><div><span>CHAPTER 01 · THE BASICS</span><b>{completedTasks.length} of 3 tasks complete</b></div><button className="lesson-next" disabled={completedTasks.length < 3} title={completedTasks.length < 3 ? "Complete the three tasks to unlock the next lesson" : undefined}>Next lesson <span aria-hidden="true">→</span></button></nav>
    </main>
  );
}
