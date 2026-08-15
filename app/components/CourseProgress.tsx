"use client";

import { useCallback, useEffect, useState } from "react";
import {
  courseChapters,
  courseLessons,
  getCourseResumeLesson,
  publishedCourseLessons,
  totalCourseLessons,
  totalCourseProgressItems,
} from "../course/courseData";
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
  const completedTaskFreeLessons = courseLessons.filter(
    (lesson) => lesson.taskCount === 0 && progress.lessons?.[lesson.id]?.lessonCompletedAt,
  ).length;
  const completedProgressItems = completedTasks + completedTaskFreeLessons;
  const coursePercent = totalCourseProgressItems
    ? Math.round((completedProgressItems / totalCourseProgressItems) * 100)
    : 0;
  const resumeLesson = getCourseResumeLesson(progress.lessons ?? {});
  const allPublishedLessonsComplete = publishedCourseLessons.every(
    (lesson) => progress.lessons?.[lesson.id]?.lessonCompletedAt,
  );
  const currentText = allPublishedLessonsComplete
    ? "All available lessons are complete · Review Lesson one"
    : `Lesson 1 of ${totalCourseLessons} · Lesson one · Read to complete`;

  return (
    <section className="home-progress" aria-label="Your saved course progress">
      <div className="home-progress-summary">
        <span>YOUR COURSE PROGRESS</span>
        <strong>{coursePercent}%</strong>
        <small>{completedProgressItems} of {totalCourseProgressItems} course steps</small>
      </div>
      <div className="home-progress-track">
        <div><span style={{ width: `${Math.max(coursePercent, completedProgressItems ? 1.5 : 0)}%` }} /></div>
        <p>Signed in as {progress.user.name}</p>
      </div>
      <div className="home-progress-current">
        <span>CURRENT POSITION</span>
        <strong>Chapter 1 of {courseChapters.length}</strong>
        <p>{currentText}</p>
      </div>
      <a className="home-progress-continue" href={resumeLesson.path}>{completedProgressItems ? "Continue learning" : "Start course"} <PixelArrow /></a>
    </section>
  );
}
