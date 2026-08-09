"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourseResumeLesson, publishedCourseLessons, totalCourseLessons, totalCourseProgressItems } from "../course/courseData";
import { PixelArrow } from "./PixelIcons";
import AuthButton from "./AuthButton";

type ProgressResponse = {
  user: { name: string } | null;
  completedTasks?: string[];
  lessons?: Record<string, { completedTasks?: string[]; lessonCompletedAt?: number }>;
};

export default function CourseProgress() {
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      const response = await fetch("/api/progress", { credentials: "same-origin" });
      if (!response.ok) throw new Error("Progress unavailable");
      setProgress(await response.json() as ProgressResponse);
      setUnavailable(false);
    } catch {
      setUnavailable(true);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadProgress(), 0);
    window.addEventListener("auth-changed", loadProgress);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("auth-changed", loadProgress);
    };
  }, [loadProgress]);

  if (!progress && !unavailable) {
    return <section className="home-progress home-progress-loading" aria-label="Loading course progress"><span /><span /><span /></section>;
  }

  if (unavailable) {
    return <section className="home-progress home-progress-message"><p>Course progress is temporarily unavailable.</p></section>;
  }

  if (!progress?.user) {
    return (
      <section className="home-progress home-progress-message" aria-label="Course progress">
        <div><span>YOUR COURSE PROGRESS</span><b>Pick up where you left off on any device.</b></div>
        <AuthButton className="course-progress-sign-in" actionLabel="Sign in with Google to track progress" />
      </section>
    );
  }

  const completedTasks = progress.completedTasks?.length ?? 0;
  const introComplete = Boolean(progress.lessons?.intro?.lessonCompletedAt);
  const completedProgressItems = completedTasks + (introComplete ? 1 : 0);
  const coursePercent = Math.round((completedProgressItems / totalCourseProgressItems) * 100);
  const aiTasks = progress.lessons?.["basics/ai"]?.completedTasks?.length ?? 0;
  const contextTasks = progress.lessons?.["basics/context-rot"]?.completedTasks?.length ?? 0;
  const resumeLesson = getCourseResumeLesson(progress.lessons ?? {});
  const allPublishedLessonsComplete = publishedCourseLessons.every((lesson) => progress.lessons?.[lesson.id]?.lessonCompletedAt);
  const currentHref = resumeLesson.path;
  const currentText = allPublishedLessonsComplete
    ? "All available lessons are complete · Review the final lesson"
    : resumeLesson.id === "intro"
    ? `Course introduction · Complete to earn 500 XP`
    : resumeLesson.id === "basics/ai"
      ? `Lesson 1 of ${totalCourseLessons - 1} · AI? · ${aiTasks} of 2 tasks`
      : resumeLesson.id === "basics/context-rot"
      ? `Lesson 2 of ${totalCourseLessons} · Context rot · ${contextTasks} of 3 tasks`
      : "Continue with your next lesson";

  return (
    <section className="home-progress" aria-label="Your saved course progress">
      <div className="home-progress-summary">
        <span>YOUR COURSE PROGRESS</span>
        <strong>{coursePercent}%</strong>
        <small>{completedProgressItems} of {totalCourseProgressItems} course steps</small>
      </div>
      <div className="home-progress-track">
        <div><span style={{ width: `${Math.max(coursePercent, completedTasks ? 1.5 : 0)}%` }} /></div>
        <p>Signed in as {progress.user.name}</p>
      </div>
      <div className="home-progress-current">
        <span>CURRENT POSITION</span>
        <strong>Chapter 1 of 6 · The basics</strong>
        <p>{currentText}</p>
      </div>
      <a className="home-progress-continue" href={currentHref}>{completedProgressItems ? "Continue learning" : "Start course"} <PixelArrow /></a>
    </section>
  );
}
