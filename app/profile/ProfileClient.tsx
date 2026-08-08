"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { useEffect, useMemo, useState } from "react";
import styles from "./profile.module.css";
import { PixelArrow, PixelSpark } from "../components/PixelIcons";

type User = { name: string; email: string; pictureUrl: string | null };
type Progress = { user: User | null; completedTasks?: string[]; activity?: Record<string, number> };

const chapters = ["The basics", "Pick the right model", "Build with an agent", "Skills and repeatable work", "Fleets and parallel work", "Your AI workflow"];
const heatLabels = ["Mon", "Wed", "Fri"];

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function activityLevel(count: number) {
  return Math.min(4, Math.ceil(Math.min(count, 10) / 2.5));
}

function ActivityGrid({ activity }: { activity: Record<string, number> }) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (start.getDay() + 77)); // Sunday, eleven weeks before this week.
  const days = Array.from({ length: 84 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const count = date <= today ? activity[localDateKey(date)] ?? 0 : 0;
    return { date, count, level: activityLevel(count), week: Math.floor(index / 7) };
  });
  const months = days.reduce<{ label: string; week: number }[]>((labels, day, index) => {
    const previous = labels[labels.length - 1];
    if ((index === 0 || day.date.getDate() === 1) && previous?.week !== day.week) {
      labels.push({ label: day.date.toLocaleDateString(undefined, { month: "short" }), week: day.week });
    }
    return labels;
  }, []);

  return <div className={styles.activityWrap} aria-label="Learning activity for the last 12 weeks">
    <div className={styles.activityLabels}>{heatLabels.map((label, index) => <span key={label} style={{ gridRow: index * 2 + 2 }}>{label}</span>)}</div>
    <div className={styles.activityContent}>
      <div className={styles.activityMonths} aria-hidden="true">{months.map(({ label, week }) => <span key={`${label}-${week}`} style={{ gridColumn: week + 1 }}>{label}</span>)}</div>
      <div className={styles.activityGrid}>{days.map(({ date, count, level }) => <span key={localDateKey(date)} className={`${styles.day} ${styles[`level${level}`]}`} title={`${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${count} ${count === 1 ? "task" : "tasks"} completed`} />)}</div>
    </div>
  </div>;
}

function CourseProgress({ completedTasks }: { completedTasks: number }) {
  const totalTasks = 72;
  const percent = Math.round((completedTasks / totalTasks) * 100);
  const completedFirstLesson = completedTasks >= 3;
  return <section className={styles.courseCard} id="courses">
    <PixelSpark className={styles.cornerSpark} />
    <div className={styles.courseHeader}><div><p className={styles.eyebrow}>COURSE IN PROGRESS</p><h2>AI workflows</h2><p>Build a calmer, more capable way of working with AI.</p></div><strong>{percent}%<small>complete</small></strong></div>
    <div className={styles.progressTrack} aria-label={`${percent}% of the course complete`}><span style={{ width: `${Math.max(percent, completedTasks ? 2 : 0)}%` }} /></div>
    <div className={styles.chapterList}>{chapters.map((chapter, index) => {
      const active = index === 0;
      const done = active && completedFirstLesson;
      return <div key={chapter} className={`${styles.chapter} ${active ? styles.active : ""} ${done ? styles.done : ""}`}><span>{done ? "✓" : String(index + 1).padStart(2, "0")}</span><div><b>{chapter}</b><small>{active ? `${completedTasks} of 3 tasks in Context rot` : "Not started"}</small></div><i>{done ? "Complete" : active ? "In progress" : "Locked"}</i></div>;
    })}</div>
    <a href="/course/basics/context-rot" className={styles.continue}>{completedTasks ? "Continue course" : "Start course"}<PixelArrow /></a>
  </section>;
}

export default function ProfileClient() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { credentials: "same-origin", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unavailable")))
      .then((data: Progress) => setProgress(data))
      .catch(() => setProgress({ user: null }))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  const completedTasks = progress?.completedTasks?.length ?? 0;
  const activity = progress?.activity ?? {};
  const currentMonth = localDateKey(new Date()).slice(0, 7);
  const completedThisMonth = Object.entries(activity).reduce((total, [day, count]) => day.startsWith(currentMonth) ? total + count : total, 0);
  let dayStreak = 0;
  for (let date = new Date(); activity[localDateKey(date)] > 0; date.setDate(date.getDate() - 1)) dayStreak += 1;
  const initial = useMemo(() => progress?.user?.name?.trim().charAt(0).toUpperCase() || "A", [progress?.user?.name]);

  if (isLoading) return <main className={styles.page}><div className={styles.loading}>Loading your learning profile…</div></main>;
  if (!progress?.user) return <main className={styles.page}><section className={styles.signedOut}><p className={styles.eyebrow}>YOUR AI SCHOOL</p><h1>Your learning profile is waiting.</h1><p>Sign in to keep your course progress and build a daily learning streak.</p><a href="/api/auth/google/start?returnTo=%2Fprofile">Sign in with Google <PixelArrow /></a><a href="/">Back to AI school</a></section></main>;

  const avatarStyle = progress.user.pictureUrl ? { backgroundImage: `url(${progress.user.pictureUrl})` } : undefined;
  return <main className={styles.page}><div className={styles.shell}>
    <nav className={styles.nav} aria-label="Profile navigation"><a href="/" className={styles.homeLink}><PixelArrow className={styles.iconBack} /> Home</a><a href="/" className={styles.wordmark}>AI school</a><a href="/course/basics/context-rot">AI workflows</a></nav>
    <header className={styles.profileHeader}><div className={styles.identity}><span className={styles.avatar} style={avatarStyle}>{progress.user.pictureUrl ? null : initial}</span><div><p className={styles.eyebrow}>LEARNER PROFILE</p><h1>{progress.user.name}</h1><p>{progress.user.email}</p></div></div><div className={styles.stat}><strong>{completedTasks}</strong><span>tasks completed</span></div><div className={styles.stat}><strong>{dayStreak}</strong><span>day streak</span></div></header>
    <div className={styles.grid}><CourseProgress completedTasks={completedTasks} /><aside className={styles.side}><section className={styles.activityCard}><PixelSpark className={styles.cornerSpark} /><div className={styles.activityTitle}><div><p className={styles.eyebrow}>CONSISTENCY</p><h2>Learning activity</h2></div><b>{completedThisMonth} this month</b></div><ActivityGrid activity={activity} /><div className={styles.legend}><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`${styles.day} ${styles[`level${level}`]}`} />)}<span>More</span></div></section><section className={styles.next}><PixelSpark className={styles.cornerSparkNext} /><p className={styles.eyebrow}>UP NEXT</p><h2>Context rot</h2><p>Learn why a long chat starts losing the thread and how to prevent it.</p><a href="/course/basics/context-rot">Open lesson <PixelArrow /></a></section></aside></div>
  </div></main>;
}
