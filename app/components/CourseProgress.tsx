"use client";

import { useCallback, useEffect, useState } from "react";

type ProgressResponse = {
  user: { name: string } | null;
  completedTasks?: string[];
};

const TOTAL_COURSE_TASKS = 6 * 4 * 3;

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
        <a href="/api/auth/google/start?returnTo=%2F">Sign in with Google to track progress →</a>
      </section>
    );
  }

  const completedTasks = progress.completedTasks?.length ?? 0;
  const coursePercent = Math.round((completedTasks / TOTAL_COURSE_TASKS) * 100);
  const lessonComplete = completedTasks === 3;

  return (
    <section className="home-progress" aria-label="Your saved course progress">
      <div className="home-progress-summary">
        <span>YOUR COURSE PROGRESS</span>
        <strong>{coursePercent}%</strong>
        <small>{completedTasks} of {TOTAL_COURSE_TASKS} course tasks</small>
      </div>
      <div className="home-progress-track">
        <div><span style={{ width: `${Math.max(coursePercent, completedTasks ? 1.5 : 0)}%` }} /></div>
        <p>Signed in as {progress.user.name}</p>
      </div>
      <div className="home-progress-current">
        <span>CURRENT POSITION</span>
        <strong>Chapter 1 of 6 · The basics</strong>
        <p>{lessonComplete ? "Lesson 1 complete · Your project brain is next" : `Lesson 1 of 24 · Context rot · ${completedTasks} of 3 tasks`}</p>
      </div>
      <a className="home-progress-continue" href="/course/basics/context-rot">{completedTasks ? "Continue learning" : "Start lesson one"} <span aria-hidden="true">→</span></a>
    </section>
  );
}
