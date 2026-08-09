"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { useEffect, useState } from "react";
import AuthButton from "../../components/AuthButton";
import ExperienceBadge from "../../components/ExperienceBadge";
import LessonXpCelebration from "../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../components/PixelIcons";
import { courseChapters, courseIntroLesson } from "../courseData";

type ProgressResponse = { user: unknown; lessons?: Record<string, { lessonCompletedAt?: number }> };

export default function IntroLessonClient() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, { lessonCompletedAt?: number }>>({});
  const [lessonCompletedAt, setLessonCompletedAt] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openChapter, setOpenChapter] = useState(0);
  const [completionStatus, setCompletionStatus] = useState<"idle" | "saving" | "error">("idle");
  const [celebrationKey, setCelebrationKey] = useState(0);
  const lessonComplete = Boolean(lessonCompletedAt);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { signal: controller.signal, credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Progress unavailable");
        return response.json() as Promise<ProgressResponse>;
      })
      .then((data) => {
        setSignedIn(Boolean(data.user));
        setLessonProgress(data.lessons ?? {});
        setLessonCompletedAt(data.lessons?.[courseIntroLesson.id]?.lessonCompletedAt ?? null);
      })
      .catch(() => setCompletionStatus("error"));
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
    if (!signedIn || lessonComplete || completionStatus === "saving") return;
    setCompletionStatus("saving");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: courseIntroLesson.id, completedTasks: [], completeLesson: true }),
      });
      if (!response.ok) throw new Error("Completion failed");
      const data = await response.json() as { lesson?: { lessonCompletedAt?: number }; newlyCompleted?: boolean };
      if (!data.lesson?.lessonCompletedAt) throw new Error("Completion was not saved");
      setLessonCompletedAt(data.lesson.lessonCompletedAt);
      setLessonProgress((progress) => ({ ...progress, [courseIntroLesson.id]: { lessonCompletedAt: data.lesson?.lessonCompletedAt } }));
      setCompletionStatus("idle");
      window.dispatchEvent(new Event("progress-changed"));
      if (data.newlyCompleted) setCelebrationKey((key) => key + 1);
    } catch {
      setCompletionStatus("error");
    }
  }

  function lessonIsComplete(id: string) {
    return Boolean(id === courseIntroLesson.id ? lessonCompletedAt : lessonProgress[id]?.lessonCompletedAt);
  }

  function chapterIsComplete(chapter: typeof courseChapters[number]) {
    return chapter.lessons.every((lesson) => lessonIsComplete(lesson.id));
  }

  return <main className="lesson-page intro-lesson-page">
    <LessonXpCelebration trigger={celebrationKey} nextLessonHref="/course/basics/ai" xpAwarded={500} />
    <header className="lesson-header"><div className="lesson-header-left"><button className="sidebar-toggle" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-expanded={sidebarOpen} aria-controls="course-contents"><span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span><b>{sidebarOpen ? "Hide contents" : "Show contents"}</b></button><a className="lesson-brand" href="/profile#courses" aria-label="Return to your AI school course overview"><PixelSpark className="lesson-brand-star" /><b>AI school</b></a></div><div className="lesson-crumb"><span>Course lesson</span><span>/</span><b>Introduction</b></div><div className="lesson-account"><div className="lesson-progress"><span><i style={{ width: lessonComplete ? "100%" : "4%" }} /></span><b>{lessonComplete ? "Complete" : "Read to complete"}</b></div><ExperienceBadge compact /><AuthButton returnTo="/course/intro" compact /></div></header>
    <div className={`lesson-workspace visual-closed ${sidebarOpen ? "" : "sidebar-closed"}`}>
      <aside className="course-sidebar" id="course-contents" aria-label="Course contents"><div className="course-side-head"><p>AI workflow course</p><h2>Course contents</h2><div><span style={{ width: lessonComplete ? "100%" : "4%" }} /><small>{lessonComplete ? "Introduction complete" : "Course introduction"}</small></div></div><nav><a className={`course-intro-link active ${lessonComplete ? "complete" : ""}`} href={courseIntroLesson.path}><span>{lessonComplete ? "✓" : "●"}</span><div><small>COURSE INTRO</small><b>{courseIntroLesson.title}</b></div>{lessonComplete ? <i>COMPLETE</i> : null}</a>{courseChapters.map((chapter, chapterIndex) => { const chapterComplete = chapterIsComplete(chapter); return <div className={`side-chapter ${chapterComplete ? "complete" : ""}`} key={chapter.title}><button onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{chapterComplete ? "✓" : String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i aria-label={chapterComplete ? "Chapter complete" : undefined}>{chapterComplete ? "COMPLETE" : openChapter === chapterIndex ? "−" : "+"}</i></button>{openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => { const lessonDone = lessonIsComplete(lesson.id); return <li className={lessonDone ? "complete" : ""} key={lesson.id}><span>{lessonDone ? "✓" : "○"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small>{lesson.path ? <a href={lesson.path}>{lesson.title}</a> : <b>{lesson.title}</b>}</div>{lessonDone ? <i>COMPLETE</i> : !lesson.path ? <i>LOCKED</i> : null}</li>; })}</ol> : null}</div>; })}</nav><div className="chapter-project"><span>CHAPTER PROJECT</span><b>Build your project brain</b><p>Unlocks after all five lessons.</p><small>0 / 5 lessons</small></div></aside>
      <article className="lesson-reading"><div className="lesson-reading-inner intro-reading"><p className={`progress-save-state ${signedIn ? "connected" : ""}`}>{signedIn ? "You are signed in, so completing this introduction saves your 500 XP." : signedIn === false ? "Sign in above when you are ready to save this introduction and its XP." : "Your saved progress is being checked."}</p><p className="reading-kicker">Course introduction</p><h1>Learn to work with AI, without losing the thread.</h1><p className="lesson-lede">AI school is a free course for people who want to use AI to make real things, while staying able to explain what the work is for, what changed and how it was checked. You do not need to code before you begin, although you will see how a project folder and an AI coding tool fit into a useful workflow.</p><div className="lesson-rule" />
        <section><p className="reading-kicker">What this course is</p><h2>A practical course for work that lasts beyond one chat.</h2><p>A chat can help you get a quick answer, a draft or a first version. A project needs more than that. It needs a clear goal, useful context, decisions that can be found again and a way to check the result before you trust it.</p><p>This course teaches those habits in ordinary language. You will practise working with an AI tool as a collaborator, keeping control of the decisions and using files to hold the information that should not disappear into a long conversation.</p></section>
        <section><p className="reading-kicker">Who it is for</p><h2>For curious beginners who want a calmer way to build.</h2><p>It is for someone who has used an AI chat, or wants to, and now wants to turn ideas into websites, tools, research, plans or other projects. It is also for people who have felt a chat become confusing after several corrections and want a repeatable way to start again.</p><p>You do not need a technical background. When a new term matters, the lesson explains it first. The aim is not to make you sound technical, it is to help you make sound choices when AI is involved.</p></section>
        <section><p className="reading-kicker">One important idea</p><h2>AI is stupid, even when it sounds confident.</h2><p>AI does not understand your goal, care whether it is correct or decide what matters in the way a person does. It predicts a useful looking next response from patterns in its training, your words, the context it receives, the model and settings in use, the tools it can access and the rules it has been given.</p><p>That is why two people can ask the same tool for help and get different results, and why a fluent answer can still be wrong. This course explains the factors behind a response, then gives you a way to control more of them instead of treating AI as an authority.</p></section>
        <section><p className="reading-kicker">What you will learn</p><h2>Six chapters, one connected workflow.</h2><ol className="intro-course-map"><li><b>The basics.</b> What AI is, how chat tools and project files differ, why models can hallucinate, and how context can become unreliable when a conversation grows.</li><li><b>Pick the right model.</b> What a model is, why models answer differently, and how to consider speed, cost, reasoning and context windows for a job.</li><li><b>Build with an agent.</b> How to write a clear task brief, let an agent inspect the right files, make a contained change and review the result.</li><li><b>Skills and repeatable work.</b> How to turn a recurring job into a skill with instructions, context and checks, then improve it from what happens in practice.</li><li><b>Fleets and parallel work.</b> When several agents can work at once, how to divide the jobs and how to bring their work back together without confusion.</li><li><b>Ship it properly.</b> How to verify a result, keep a history of changes, deploy a project and maintain it after release.</li></ol></section>
        <section><p className="reading-kicker">The habits underneath it</p><h2>Use AI with enough evidence to trust the result.</h2><p>AI can hallucinate, which means it can state something incorrect with confidence. This course treats that as a workflow problem as well as a model problem. You will learn anti hallucination habits such as asking for evidence, checking sources and results, recording important facts outside the chat, and separating a clear task from unrelated work.</p><p>Context management is the thread that joins the course together. You will make a small project overview, give an agent only the context it needs, use skills for work you repeat, and leave handovers that make the next task easier to understand. These are simple habits, although they make a large difference once a project grows.</p></section>
        <section className={`lesson-complete-card intro-complete-card ${lessonComplete ? "complete" : ""}`}><span>{lessonComplete ? "INTRODUCTION COMPLETE" : "READY WHEN YOU ARE"}</span><h2>{lessonComplete ? "You have started the course at Level 1." : "Finish reading, then start at Level 1."}</h2><p>{lessonComplete ? "Your account has saved 500 XP. Chapter 1 begins with what AI is and where it can help." : signedIn ? "This introduction has no tasks. When you have read it, complete the lesson to earn 500 XP and move from Level 0 to Level 1." : "Sign in with Google to save this introduction, earn 500 XP and begin at Level 1."}</p>{lessonComplete ? <a href="/course/basics/ai">Start Chapter 1 <PixelArrow /></a> : <button className="complete-lesson-button" type="button" disabled={!signedIn || completionStatus === "saving"} onClick={completeLesson}>{completionStatus === "saving" ? "Completing introduction…" : "Complete introduction · +500 XP"}</button>}{completionStatus === "error" ? <small className="completion-error">We could not save the introduction yet. Please try again.</small> : null}</section>
      </div></article>
    </div>
    <nav className="lesson-bottom" aria-label="Lesson navigation"><a className="lesson-home-back" href="/"><span aria-hidden="true">←</span><b>Back to home</b></a><div><span>COURSE INTRODUCTION</span><b>{lessonComplete ? "500 XP earned" : "500 XP available"}</b></div><a className={`lesson-next ${!lessonComplete ? "disabled" : ""}`} aria-disabled={!lessonComplete} href={lessonComplete ? "/course/basics/ai" : "/course/intro"}>Start Chapter 1 <PixelArrow /></a></nav>
  </main>;
}
