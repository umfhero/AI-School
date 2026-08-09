"use client";

import { useCallback, useEffect, useState } from "react";
import { getLesson, totalCourseLessons, totalCourseTasks } from "../course/courseData";
import { PixelArrow } from "./PixelIcons";

type ProgressResponse = {
  user: { name: string } | null;
  completedTasks?: string[];
  lessons?: Record<string, { completedTasks?: string[] }>;
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
        <a href="/api/auth/google/start?returnTo=%2F">Sign in with Google to track progress <PixelArrow /></a>
      </section>
    );
  }

  const completedTasks = progress.completedTasks?.length ?? 0;
  const coursePercent = Math.round((completedTasks / totalCourseTasks) * 100);
  const aiTasks = progress.lessons?.["basics/ai"]?.completedTasks?.length ?? 0;
  const contextTasks = progress.lessons?.["basics/context-rot"]?.completedTasks?.length ?? 0;
  const aiComplete = aiTasks >= (getLesson("basics/ai")?.taskCount ?? 2);
  const contextComplete = contextTasks >= (getLesson("basics/context-rot")?.taskCount ?? 3);
  const currentHref = aiComplete ? "/course/basics/context-rot" : "/course/basics/ai";
  const currentText = !aiComplete
    ? `Lesson 1 of ${totalCourseLessons} · AI? · ${aiTasks} of 2 tasks`
    : !contextComplete
      ? `Lesson 2 of ${totalCourseLessons} · Context rot · ${contextTasks} of 3 tasks`
      : "Lessons 1 and 2 complete · Your project brain is next";

  return (
    <section className="home-progress" aria-label="Your saved course progress">
      <div className="home-progress-summary">
        <span>YOUR COURSE PROGRESS</span>
        <strong>{coursePercent}%</strong>
        <small>{completedTasks} of {totalCourseTasks} course tasks</small>
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
      <a className="home-progress-continue" href={currentHref}>{completedTasks ? "Continue learning" : "Start lesson one"} <PixelArrow /></a>
    </section>
  );
}
