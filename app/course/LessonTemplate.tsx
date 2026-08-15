"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import AuthButton from "../components/AuthButton";
import CourseSignInNotice from "../components/CourseSignInNotice";
import ExperienceBadge from "../components/ExperienceBadge";
import LessonSaveState from "../components/LessonSaveState";
import LessonXpCelebration from "../components/LessonXpCelebration";
import { PixelArrow, PixelCheck, PixelSpark } from "../components/PixelIcons";
import { courseChapters } from "./courseData";
import LessonPointerEffects from "./LessonPointerEffects";

type StoredLessonProgress = {
  completedTasks?: string[];
  lessonCompletedAt?: number;
};

type LessonProgress = Record<string, StoredLessonProgress>;

type CompletionCopy = {
  readyTitle: string;
  signedInCopy: string;
  signedOutCopy: string;
  completedTitle: string;
  completedCopy: string;
};

type LessonTemplateProps = {
  children: ReactNode;
  chapterNumber: number;
  completion: CompletionCopy;
  currentPath: string;
  lessonId: string;
  lessonTitle: string;
  requiredTaskIds?: string[];
};

type LessonTaskContextValue = {
  completeTask: (taskId: string) => void;
  completedTaskIds: string[];
};

const LessonTaskContext = createContext<LessonTaskContextValue | null>(null);
const emptyTaskIds: string[] = [];

export function useLessonTask(taskId: string) {
  const context = useContext(LessonTaskContext);
  if (!context) throw new Error("useLessonTask must be used inside LessonTemplate.");
  return {
    completed: context.completedTaskIds.includes(taskId),
    complete: () => context.completeTask(taskId),
  };
}

export default function LessonTemplate({
  children,
  chapterNumber,
  completion,
  currentPath,
  lessonId,
  lessonTitle,
  requiredTaskIds = emptyTaskIds,
}: LessonTemplateProps) {
  const [openChapter, setOpenChapter] = useState(chapterNumber - 1);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [lessonCompletedAt, setLessonCompletedAt] = useState<number | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignInNotice, setShowSignInNotice] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "error">("idle");
  const [celebrationKey, setCelebrationKey] = useState(0);
  const lessonComplete = Boolean(lessonCompletedAt);
  const tasksReady = requiredTaskIds.every((taskId) => completedTaskIds.includes(taskId));
  const remainingTasks = requiredTaskIds.filter((taskId) => !completedTaskIds.includes(taskId)).length;
  const totalLessons = courseChapters.flatMap((chapter) => chapter.lessons).length;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Progress unavailable");
        return response.json() as Promise<{ user: unknown; lessons?: LessonProgress }>;
      })
      .then((data) => {
        const storedLesson = data.lessons?.[lessonId];
        setSignedIn(Boolean(data.user));
        setLessonProgress(data.lessons ?? {});
        setCompletedTaskIds((current) => [...new Set([...current, ...(storedLesson?.completedTasks ?? [])])]);
        setLessonCompletedAt(storedLesson?.lessonCompletedAt ?? null);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSignedIn(false);
      });
    return () => controller.abort();
  }, [lessonId]);

  useEffect(() => {
    const phoneLayout = window.matchMedia("(max-width: 920px)");
    const frame = window.requestAnimationFrame(() => {
      if (phoneLayout.matches) setSidebarOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const completeTask = useCallback((taskId: string) => {
    if (!requiredTaskIds.includes(taskId) || completedTaskIds.includes(taskId)) return;
    const nextTasks = [...completedTaskIds, taskId];
    setCompletedTaskIds(nextTasks);
    if (signedIn !== true) return;
    setSaveStatus("saving");
    void fetch("/api/progress", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completedTasks: nextTasks }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("Task save failed");
      const data = await response.json() as { completedTasks?: string[] };
      setCompletedTaskIds(data.completedTasks ?? nextTasks);
      setSaveStatus("idle");
      window.dispatchEvent(new Event("progress-changed"));
    }).catch(() => setSaveStatus("error"));
  }, [completedTaskIds, lessonId, requiredTaskIds, signedIn]);

  async function completeLesson() {
    if (!tasksReady || saveStatus === "saving") return;
    if (signedIn === false) {
      setShowSignInNotice(true);
      return;
    }
    if (!signedIn || lessonComplete) return;
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completedTasks: completedTaskIds, completeLesson: true }),
      });
      if (!response.ok) throw new Error("Completion failed");
      const data = await response.json() as { lesson?: StoredLessonProgress; newlyCompleted?: boolean };
      if (!data.lesson?.lessonCompletedAt) throw new Error("Completion was not saved");
      setLessonCompletedAt(data.lesson.lessonCompletedAt);
      setLessonProgress((progress) => ({ ...progress, [lessonId]: data.lesson ?? {} }));
      setSaveStatus("idle");
      window.dispatchEvent(new Event("progress-changed"));
      if (data.newlyCompleted) setCelebrationKey((key) => key + 1);
    } catch {
      setSaveStatus("error");
    }
  }

  function lessonIsComplete(id: string) {
    return Boolean(id === lessonId ? lessonCompletedAt : lessonProgress[id]?.lessonCompletedAt);
  }

  const progressStatus = saveStatus === "saving" ? "saving" : saveStatus === "error" ? "error" : lessonComplete ? "saved" : "idle";
  const readyCopy = tasksReady
    ? signedIn ? completion.signedInCopy : completion.signedOutCopy
    : `Complete ${remainingTasks === 1 ? "the task" : `the ${remainingTasks} tasks`} above before finishing the lesson.`;

  return <LessonTaskContext.Provider value={{ completeTask, completedTaskIds }}>
    <main className="lesson-page">
      <LessonPointerEffects />
      <LessonXpCelebration trigger={celebrationKey} nextLessonHref="/" />
      <header className="lesson-header">
        <div className="lesson-header-left">
          <button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Hide contents" : "Show contents"} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b aria-hidden="true">{sidebarOpen ? "Hide contents" : "Show contents"}</b></button>
          <a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI school course overview"><PixelSpark className="lesson-brand-star" /><b>AI school</b></a>
        </div>
        <div className="lesson-crumb"><span>Chapter {String(chapterNumber).padStart(2, "0")}</span><span>/</span><b>{lessonTitle}</b></div>
        <div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: lessonComplete ? "100%" : "4%" }} /></span><b>{lessonComplete ? "Complete" : "Read to complete"}</b></div><LessonSaveState signedIn={signedIn} status={progressStatus} /><ExperienceBadge compact /><AuthButton returnTo={currentPath} compact /></div>
      </header>
      <div className={`lesson-workspace lesson-template-workspace visual-closed ${sidebarOpen ? "" : "sidebar-closed"}`}>
        <aside className="course-sidebar" id="course-contents" aria-label="Course contents">
          <div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: lessonComplete ? "100%" : "4%" }} /><small>{lessonComplete ? "Lesson complete" : `${totalLessons} ${totalLessons === 1 ? "lesson" : "lessons"} available`}</small></div></div>
          <nav>{courseChapters.map((chapter, chapterIndex) => {
            const chapterComplete = chapter.lessons.every((lesson) => lessonIsComplete(lesson.id));
            const currentChapter = chapterIndex === chapterNumber - 1;
            return <div className={`side-chapter ${currentChapter ? "current" : ""} ${chapterComplete ? "complete" : ""}`} key={chapter.title}>
              <button type="button" onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{chapterComplete ? <PixelCheck /> : String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b>{chapterComplete ? <i>COMPLETE</i> : <i className={`side-chapter-toggle-mark ${openChapter === chapterIndex ? "open" : ""}`} aria-hidden="true"><span /><span /></i>}</button>
              {openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => {
                const complete = lessonIsComplete(lesson.id);
                const active = lesson.id === lessonId;
                return <li className={`${active ? "active" : ""} ${complete ? "complete" : ""}`} key={lesson.id}><span>{complete ? <PixelCheck /> : <i className="side-lesson-pixel" aria-hidden="true" />}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small><a href={lesson.path}>{lesson.title}</a></div>{complete ? <i>COMPLETE</i> : null}</li>;
              })}</ol> : null}
            </div>;
          })}</nav>
        </aside>
        <article className="lesson-reading">
          <div className="lesson-reading-inner lesson-template-reading">
            {children}
            <section className={`lesson-complete-card intro-complete-card ${lessonComplete ? "complete" : ""}`}>
              <span>{lessonComplete ? "LESSON COMPLETE" : "READY WHEN YOU ARE"}</span>
              <h2>{lessonComplete ? completion.completedTitle : completion.readyTitle}</h2>
              <p>{lessonComplete ? completion.completedCopy : readyCopy}</p>
              {lessonComplete ? null : <button className="complete-lesson-button" type="button" disabled={!tasksReady || saveStatus === "saving"} onClick={completeLesson}>{saveStatus === "saving" ? "Saving progress..." : tasksReady ? "Complete lesson · +100 XP" : "Complete the task above"}</button>}
              {saveStatus === "error" ? <small className="completion-error">We could not save your progress yet. Please try again.</small> : null}
            </section>
          </div>
        </article>
      </div>
      <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href="/"><PixelArrow className="lesson-back-arrow" /><b>Back to home</b></a><div><span>CHAPTER {String(chapterNumber).padStart(2, "0")}</span><b>{lessonComplete ? "Lesson complete" : "One lesson available"}</b></div><a className="lesson-next" href="/">Return to course <PixelArrow /></a></nav>
      {showSignInNotice ? <CourseSignInNotice returnTo={currentPath} onDismiss={() => setShowSignInNotice(false)} /> : null}
    </main>
  </LessonTaskContext.Provider>;
}
