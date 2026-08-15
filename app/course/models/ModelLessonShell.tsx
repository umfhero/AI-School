"use client";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import AuthButton from "../../components/AuthButton";
import CourseSignInNotice from "../../components/CourseSignInNotice";
import ExperienceBadge from "../../components/ExperienceBadge";
import LessonSaveState from "../../components/LessonSaveState";
import LessonXpCelebration from "../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../components/PixelIcons";
import { LessonCelebration } from "../basics/context-rot/LessonCelebration";
import { courseChapters, courseIntroLesson } from "../courseData";
import { ModelMatchTask, type ModelMatchTaskDefinition } from "./ModelMatchTask";

type LessonProgress = Record<string, { completedTasks?: string[]; lessonCompletedAt?: number }>;
type SaveStatus = "idle" | "saving" | "saved" | "error";

type LessonControls = {
  completedTasks: string[];
  openTask: (taskId: string) => void;
};

type ModelLessonShellProps = {
  lessonId: string;
  lessonNumber: string;
  title: string;
  lede: string;
  currentPath: string;
  previousHref: string;
  nextHref: string;
  nextLabel?: string;
  completionTitle: string;
  tasks: ModelMatchTaskDefinition[];
  children: (controls: LessonControls) => ReactNode;
};

function TaskCard({ definition, complete, onStart }: { definition: ModelMatchTaskDefinition; complete: boolean; onStart: () => void }) {
  return <div className={`inline-task model-task ${complete ? "complete" : ""}`}><div className="task-heading"><span>{definition.cardTitle}</span><b>{complete ? "COMPLETE ✓" : "4 MATCHES"}</b></div><h3>{definition.cardPrompt}</h3><p>Open the side view, connect all four pairs, then check your answers. The task completes only when every match is right.</p>{complete ? null : <button className="start-task-button" type="button" onClick={onStart}>Open task<PixelArrow /></button>}<p className="task-start-note">The matching cards appear in the side view.</p></div>;
}

export function ModelLessonTaskCard({ task, completedTasks, openTask }: { task: ModelMatchTaskDefinition; completedTasks: string[]; openTask: (taskId: string) => void }) {
  return <TaskCard definition={task} complete={completedTasks.includes(task.taskId)} onStart={() => openTask(task.taskId)} />;
}

export default function ModelLessonShell({ lessonId, lessonNumber, title, lede, currentPath, previousHref, nextHref, nextLabel = "Next lesson", completionTitle, tasks, children }: ModelLessonShellProps) {
  const [openChapter, setOpenChapter] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignInNotice, setShowSignInNotice] = useState(false);
  const [lessonCompletedAt, setLessonCompletedAt] = useState<number | null>(null);
  const [completionStatus, setCompletionStatus] = useState<"idle" | "saving" | "error">("idle");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [visualOpen, setVisualOpen] = useState(false);
  const [taskCelebrationKey, setTaskCelebrationKey] = useState(0);
  const [lessonCompletionKey, setLessonCompletionKey] = useState(0);
  const [visualWidth, setVisualWidth] = useState(620);
  const resizing = useRef(false);
  const [sheetHeight, setSheetHeightRaw] = useState(76);
  const [sheetDragging, setSheetDragging] = useState(false);
  const sheetHeightRef = useRef(76);
  const sheetDrag = useRef<{ startY: number; startHeight: number } | null>(null);

  const activeTask = tasks.find((task) => task.taskId === activeTaskId) ?? null;
  const progress = Math.round((completedTasks.length / tasks.length) * 100);
  const allTasksComplete = completedTasks.length === tasks.length;
  const lessonComplete = Boolean(lessonCompletedAt);
  const workspaceStyle = { "--visual-width": `${visualWidth}px`, "--sheet-height": `${sheetHeight}vh`, "--sheet-height-dvh": `${sheetHeight}dvh` } as CSSProperties;

  function setSheetHeight(value: number) { setSheetHeightRaw(Math.min(92, Math.max(14, value))); }

  useEffect(() => { sheetHeightRef.current = sheetHeight; }, [sheetHeight]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { signal: controller.signal, credentials: "same-origin" })
      .then(async (response) => { if (!response.ok) throw new Error("Progress unavailable"); return response.json() as Promise<{ user: unknown; lessons?: LessonProgress }>; })
      .then((data) => { setSignedIn(Boolean(data.user)); setLessonProgress(data.lessons ?? {}); setCompletedTasks(data.lessons?.[lessonId]?.completedTasks ?? []); setLessonCompletedAt(data.lessons?.[lessonId]?.lessonCompletedAt ?? null); })
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setSaveStatus("error"); });
    return () => controller.abort();
  }, [lessonId]);

  useEffect(() => {
    const phoneLayout = window.matchMedia("(max-width: 920px)");
    const frame = window.requestAnimationFrame(() => { if (phoneLayout.matches) setSidebarOpen(false); });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function openTask(taskId: string) { setActiveTaskId(taskId); setVisualOpen(true); setSheetHeight(76); }
  function completeTask(taskId: string) {
    if (completedTasks.includes(taskId)) return;
    const next = [...completedTasks, taskId];
    setCompletedTasks(next);
    if (signedIn) void saveProgress(next);
    setVisualOpen(false);
    setTaskCelebrationKey((key) => key + 1);
  }
  async function saveProgress(nextTasks: string[]) {
    setSaveStatus("saving");
    try { const response = await fetch("/api/progress", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, completedTasks: nextTasks }) }); if (!response.ok) throw new Error("Save failed"); setSaveStatus("saved"); window.dispatchEvent(new Event("progress-changed")); } catch { setSaveStatus("error"); }
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
  function beginResize(event: ReactPointerEvent<HTMLDivElement>) { resizing.current = true; event.currentTarget.setPointerCapture(event.pointerId); }
  function resizeVisual(event: ReactPointerEvent<HTMLDivElement>) { if (resizing.current) setVisualWidth(Math.min(860, Math.max(380, window.innerWidth - event.clientX))); }
  function endResize(event: ReactPointerEvent<HTMLDivElement>) { resizing.current = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }
  function resizeWithKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); setVisualWidth((width) => Math.min(860, Math.max(380, width + (event.key === "ArrowLeft" ? 30 : -30)))); }
  function beginSheetDrag(event: ReactPointerEvent<HTMLDivElement>) { if ((event.target as HTMLElement).closest(".close-visual")) return; sheetDrag.current = { startY: event.clientY, startHeight: sheetHeightRef.current }; setSheetDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }
  function dragSheet(event: ReactPointerEvent<HTMLDivElement>) { if (!sheetDrag.current) return; setSheetHeight(sheetDrag.current.startHeight + ((sheetDrag.current.startY - event.clientY) / window.innerHeight) * 100); }
  function endSheetDrag(event: ReactPointerEvent<HTMLDivElement>) { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); const drag = sheetDrag.current; sheetDrag.current = null; setSheetDragging(false); if (!drag) return; const height = sheetHeightRef.current; if (Math.abs(height - drag.startHeight) < 3) { setSheetHeight(drag.startHeight >= 70 ? 54 : 88); return; } if (height < 30) { setSheetHeight(54); setVisualOpen(false); return; } setSheetHeight(height < 70 ? 54 : 88); }
  function resizeSheetWithKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) { if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return; event.preventDefault(); setSheetHeight(event.key === "ArrowUp" ? 88 : 54); }

  function lessonIsComplete(id: string) { return Boolean(id === lessonId ? lessonCompletedAt : lessonProgress[id]?.lessonCompletedAt); }
  function chapterIsComplete(chapter: typeof courseChapters[number]) { return chapter.lessons.every((lesson) => lessonIsComplete(lesson.id)); }
  const modelLessons = courseChapters[1].lessons;
  const modelTasksDone = modelLessons.reduce((total, lesson) => total + (lesson.id === lessonId ? completedTasks.length : lessonProgress[lesson.id]?.completedTasks?.length ?? 0), 0);

  return <main className="lesson-page"><LessonCelebration trigger={taskCelebrationKey} /><LessonXpCelebration trigger={lessonCompletionKey} nextLessonHref={nextHref} />
    <header className="lesson-header"><div className="lesson-header-left"><button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Hide contents" : "Show contents"} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b aria-hidden="true">{sidebarOpen ? "Hide contents" : "Show contents"}</b></button><a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI school course overview"><PixelSpark className="lesson-brand-star" /><b>AI school</b></a></div><div className="lesson-crumb"><span>Chapter 02 · Pick the right model</span><span>/</span><b>{title}</b></div><div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: `${Math.max(4, progress)}%` }} /></span><b>{completedTasks.length} / 3 tasks</b></div><LessonSaveState signedIn={signedIn} status={saveStatus} /><ExperienceBadge compact /><AuthButton returnTo={currentPath} compact /></div></header>
    <div className={`lesson-workspace ${sidebarOpen ? "" : "sidebar-closed"} ${visualOpen ? "" : "visual-closed"}`} style={workspaceStyle}>
      <aside className="course-sidebar" id="course-contents" aria-label="Course contents"><div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: `${Math.max(4, progress)}%` }} /><small>{progress}% of this lesson</small></div></div><nav><a className={`course-intro-link ${lessonProgress.intro?.lessonCompletedAt ? "complete" : ""}`} href={courseIntroLesson.path}><span>{lessonProgress.intro?.lessonCompletedAt ? "✓" : "○"}</span><div><small>COURSE INTRO</small><b>{courseIntroLesson.title}</b></div>{lessonProgress.intro?.lessonCompletedAt ? <i>COMPLETE</i> : null}</a>{courseChapters.map((chapter, chapterIndex) => { const chapterComplete = chapterIsComplete(chapter); return <div className={`side-chapter ${chapterIndex === 1 ? "current" : ""} ${chapterComplete ? "complete" : ""}`} key={chapter.title}><button type="button" onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{chapterComplete ? "✓" : String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i>{chapterComplete ? "COMPLETE" : openChapter === chapterIndex ? "−" : "+"}</i></button>{openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => { const done = lessonIsComplete(lesson.id); const active = lesson.id === lessonId; return <li className={`${active ? "active" : ""} ${done ? "complete" : ""}`} key={lesson.id}><span>{done ? "✓" : active ? "●" : "○"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small>{lesson.path ? <a href={lesson.path}>{lesson.title}</a> : <b>{lesson.title}</b>}</div>{done ? <i>COMPLETE</i> : !lesson.path ? <i>LOCKED</i> : null}</li>; })}</ol> : null}</div>; })}</nav><div className="chapter-project"><span>CHAPTER PROGRESS</span><b>Choose models with purpose</b><p>Build a judgement call, not a favourite.</p><small>{modelTasksDone} / 12 tasks</small></div></aside>
      <article className="lesson-reading"><div className="lesson-reading-inner model-reading model-decision-reading"><p className="reading-kicker">Lesson {lessonNumber}</p><h1>{title}.</h1><p className="lesson-lede">{lede}</p><div className="lesson-rule" />
        {children({ completedTasks, openTask })}
        {allTasksComplete ? <section className={`lesson-complete-card ${lessonComplete ? "complete" : ""}`}><span>{lessonComplete ? "LESSON COMPLETE" : "READY TO COMPLETE"}</span><h2>{lessonComplete ? completionTitle : "Finish the lesson and collect your XP."}</h2><p>{lessonComplete ? "Your account has saved this lesson and its XP." : signedIn ? "All tasks are complete. Confirm the lesson to add 100 XP to your level." : "Sign in with Google to save this lesson and collect its XP."}</p>{lessonComplete ? null : <button className="complete-lesson-button" type="button" disabled={completionStatus === "saving"} onClick={completeLesson}>{completionStatus === "saving" ? "Completing lesson..." : "Complete lesson · +100 XP"}</button>}{completionStatus === "error" ? <small className="completion-error">We could not save the lesson yet. Please try again.</small> : null}</section> : null}
      </div></article>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      {visualOpen && activeTask ? <div className="lesson-resize-handle" role="separator" aria-label="Resize the lesson visual" aria-orientation="vertical" aria-valuemin={380} aria-valuemax={860} aria-valuenow={visualWidth} tabIndex={0} onPointerDown={beginResize} onPointerMove={resizeVisual} onPointerUp={endResize} onPointerCancel={endResize} onKeyDown={resizeWithKeyboard}><span aria-hidden="true">⋮</span></div> : null}
      {visualOpen && activeTask ? <aside className={`lesson-visual context-visual model-task-sheet${sheetDragging ? " sheet-dragging" : ""}`} aria-label={`${activeTask.title} task visual`}><div className="visual-switcher task-visual-header sheet-drag-surface" onPointerDown={beginSheetDrag} onPointerMove={dragSheet} onPointerUp={endSheetDrag} onPointerCancel={endSheetDrag}><div className="sheet-grab-handle" role="slider" aria-label="Resize the task visual sheet" aria-orientation="vertical" aria-valuemin={14} aria-valuemax={92} aria-valuenow={Math.round(sheetHeight)} tabIndex={0} onKeyDown={resizeSheetWithKeyboard}><span aria-hidden="true" /></div><div><span>Side view</span><b>{activeTask.title}</b></div><span className="task-visual-context">{activeTask.number}</span><button className="close-visual" type="button" onClick={() => setVisualOpen(false)} aria-label="Close side view">×</button></div><div className="context-visual-stage ai-visual-stage"><ModelMatchTask key={`${lessonId}-${activeTask.taskId}`} definition={activeTask} onComplete={() => completeTask(activeTask.taskId)} /></div></aside> : null}
      {!visualOpen && activeTask ? <button className="reopen-visual" type="button" onClick={() => setVisualOpen(true)}><span>Resume task visual</span><b>{activeTask.title}</b></button> : null}
    </div>
    <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href={previousHref}><PixelArrow className="lesson-back-arrow" /><b>Previous lesson</b></a><div><span>CHAPTER 02 · PICK THE RIGHT MODEL</span><b>{completedTasks.length} of 3 tasks complete</b></div><a className={`lesson-next ${!lessonComplete ? "disabled" : ""} ${signedIn === false && !lessonComplete ? "guest-gate" : ""}`} aria-disabled={!lessonComplete} href={nextHref} onClick={(event) => { if (!lessonComplete) { event.preventDefault(); if (signedIn === false) setShowSignInNotice(true); } }}>{nextLabel} <PixelArrow /></a></nav>
    {showSignInNotice ? <CourseSignInNotice returnTo={currentPath} onDismiss={() => setShowSignInNotice(false)} /> : null}
  </main>;
}
