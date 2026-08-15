"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import AuthButton from "../../../components/AuthButton";
import CourseSignInNotice from "../../../components/CourseSignInNotice";
import ExperienceBadge from "../../../components/ExperienceBadge";
import LessonSaveState from "../../../components/LessonSaveState";
import LessonXpCelebration from "../../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../../components/PixelIcons";
import LessonPointerEffects from "../../LessonPointerEffects";
import { LessonTaskCard, LessonTaskPanel } from "../../LessonTaskTemplate";
import { courseChapters } from "../../courseData";

const lessonId = "chapter-1/lesson-1";
const currentPath = "/course/chapter-1/lesson-1";

type LessonProgress = Record<string, { lessonCompletedAt?: number }>;

export default function LessonOneClient() {
  const [openChapter, setOpenChapter] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [lessonCompletedAt, setLessonCompletedAt] = useState<number | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignInNotice, setShowSignInNotice] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<"idle" | "saving" | "error">("idle");
  const [celebrationKey, setCelebrationKey] = useState(0);
  const lessonComplete = Boolean(lessonCompletedAt);
  const openTask = useCallback(() => setTaskOpen(true), []);
  const closeTask = useCallback(() => setTaskOpen(false), []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Progress unavailable");
        return response.json() as Promise<{ user: unknown; lessons?: LessonProgress }>;
      })
      .then((data) => {
        setSignedIn(Boolean(data.user));
        setLessonProgress(data.lessons ?? {});
        setLessonCompletedAt(data.lessons?.[lessonId]?.lessonCompletedAt ?? null);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setSignedIn(false);
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

  async function completeLesson() {
    if (signedIn === false) {
      setShowSignInNotice(true);
      return;
    }
    if (!signedIn || lessonComplete || completionStatus === "saving") return;
    setCompletionStatus("saving");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completedTasks: [], completeLesson: true }),
      });
      if (!response.ok) throw new Error("Completion failed");
      const data = await response.json() as { lesson?: { lessonCompletedAt?: number }; newlyCompleted?: boolean };
      if (!data.lesson?.lessonCompletedAt) throw new Error("Completion was not saved");
      setLessonCompletedAt(data.lesson.lessonCompletedAt);
      setLessonProgress((progress) => ({ ...progress, [lessonId]: { lessonCompletedAt: data.lesson?.lessonCompletedAt } }));
      setCompletionStatus("idle");
      window.dispatchEvent(new Event("progress-changed"));
      if (data.newlyCompleted) setCelebrationKey((key) => key + 1);
    } catch {
      setCompletionStatus("error");
    }
  }

  function lessonIsComplete(id: string) {
    return Boolean(id === lessonId ? lessonCompletedAt : lessonProgress[id]?.lessonCompletedAt);
  }

  return <main className="lesson-page">
    <LessonPointerEffects />
    <LessonXpCelebration trigger={celebrationKey} nextLessonHref="/" />
    <header className="lesson-header">
      <div className="lesson-header-left">
        <button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? "Hide contents" : "Show contents"} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b aria-hidden="true">{sidebarOpen ? "Hide contents" : "Show contents"}</b></button>
        <a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI school course overview"><PixelSpark className="lesson-brand-star" /><b>AI school</b></a>
      </div>
      <div className="lesson-crumb"><span>Chapter 01</span><span>/</span><b>Lesson one</b></div>
      <div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: lessonComplete ? "100%" : "4%" }} /></span><b>{lessonComplete ? "Complete" : "Read to complete"}</b></div><LessonSaveState signedIn={signedIn} status={completionStatus === "saving" ? "saving" : completionStatus === "error" ? "error" : lessonComplete ? "saved" : "idle"} /><ExperienceBadge compact /><AuthButton returnTo={currentPath} compact /></div>
    </header>
    <div className={`lesson-workspace lesson-template-workspace ${taskOpen ? "task-open" : "visual-closed"} ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <aside className="course-sidebar" id="course-contents" aria-label="Course contents">
        <div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: lessonComplete ? "100%" : "4%" }} /><small>{lessonComplete ? "Lesson complete" : "1 lesson available"}</small></div></div>
        <nav>{courseChapters.map((chapter, chapterIndex) => {
          const chapterComplete = chapter.lessons.every((lesson) => lessonIsComplete(lesson.id));
          return <div className={`side-chapter current ${chapterComplete ? "complete" : ""}`} key={chapter.title}>
            <button type="button" onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{chapterComplete ? "✓" : String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i>{chapterComplete ? "COMPLETE" : openChapter === chapterIndex ? "−" : "+"}</i></button>
            {openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => {
              const complete = lessonIsComplete(lesson.id);
              return <li className={`active ${complete ? "complete" : ""}`} key={lesson.id}><span>{complete ? "✓" : "●"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small><a href={lesson.path}>{lesson.title}</a></div>{complete ? <i>COMPLETE</i> : null}</li>;
            })}</ol> : null}
          </div>;
        })}</nav>
      </aside>
      <article className="lesson-reading">
        <div className="lesson-reading-inner lesson-template-reading">
          <section>
            <p className="reading-kicker">Section 1</p>
            <h2>A clean starting point.</h2>
            <p>The previous chapters have been retired from the live course, while their content is recorded in the project archive and remains available in Git history. The next course path can now be designed without old lesson names, progress counts or chapter projects getting in the way.</p>
            <p>This page keeps the working lesson shell: a shared header, responsive course contents, a readable article and bottom navigation. Images, diagrams and tasks can then be added when they help someone understand or practise the lesson.</p>
            <div className="context-clear-note"><span>TEMPLATE REVIEW</span><p>Settle the layout here once, then carry the same spacing, type, image treatment and task behaviour into each new lesson.</p></div>
          </section>
          <section>
            <p className="reading-kicker">Section 2</p>
            <h2>Images should do a job.</h2>
            <p>A useful image gives the learner something concrete to inspect, compare or remember. This figure pattern keeps the source, explanation and original link attached to the image, so it does not become decoration without context.</p>
            <figure className="lesson-image-template">
              <div><Image src="/lesson-images/model-training-cost.jpg" alt="Bar chart comparing the estimated training costs of selected AI models between 2017 and 2023" width={2591} height={1377} sizes="(max-width: 920px) 100vw, 1000px" /></div>
              <figcaption><span>EXAMPLE IMAGE</span><div><b>Estimated training cost of selected AI models, 2017 to 2023.</b><p>The caption tells the learner what to notice, while the source remains one click away.</p></div><a href="https://aiindex.stanford.edu/report/" target="_blank" rel="noreferrer">Open source <PixelArrow /></a></figcaption>
            </figure>
          </section>
          <section>
            <p className="reading-kicker">Section 3</p>
            <h2>Tasks should prove something.</h2>
            <p>A task belongs after the learner has enough information to make a choice. The task panel opens beside the reading on a large screen and becomes a contained sheet on mobile, while the course contents remain available from the header.</p>
            <LessonTaskCard open={taskOpen} onOpen={openTask} />
          </section>
          <section className={`lesson-complete-card intro-complete-card ${lessonComplete ? "complete" : ""}`}>
            <span>{lessonComplete ? "LESSON COMPLETE" : "READY WHEN YOU ARE"}</span>
            <h2>{lessonComplete ? "The starter lesson is complete." : "Finish reading when the structure makes sense."}</h2>
            <p>{lessonComplete ? "Your account has saved this lesson and its XP." : signedIn ? "This starter lesson has no tasks. Complete it to save 100 XP." : "Sign in with Google to save this lesson and collect its XP."}</p>
            {lessonComplete ? null : <button className="complete-lesson-button" type="button" disabled={completionStatus === "saving"} onClick={completeLesson}>{completionStatus === "saving" ? "Completing lesson..." : "Complete lesson · +100 XP"}</button>}
            {completionStatus === "error" ? <small className="completion-error">We could not save the lesson yet. Please try again.</small> : null}
          </section>
        </div>
      </article>
      {taskOpen ? <LessonTaskPanel onClose={closeTask} /> : null}
    </div>
    <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href="/"><PixelArrow className="lesson-back-arrow" /><b>Back to home</b></a><div><span>CHAPTER 01</span><b>{lessonComplete ? "Lesson complete" : "One lesson available"}</b></div><a className="lesson-next" href="/">Return to course <PixelArrow /></a></nav>
    {showSignInNotice ? <CourseSignInNotice returnTo={currentPath} onDismiss={() => setShowSignInNotice(false)} /> : null}
  </main>;
}
