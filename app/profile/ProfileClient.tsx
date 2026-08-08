"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./profile.module.css";

type User = { name: string; email: string; pictureUrl: string | null };
type Progress = { user: User | null; completedTasks?: string[] };

const chapters = ["The basics", "Pick the right model", "Build with an agent", "Skills and repeatable work", "Fleets and parallel work", "Your AI workflow"];
const heatLabels = ["Mon", "Wed", "Fri"];

function activityLevel(dayIndex: number, completedTasks: number) {
  const signal = (dayIndex * 7 + completedTasks * 11 + Math.floor(dayIndex / 5) * 3) % 13;
  if (signal < 6) return 0;
  if (signal < 8) return 1;
  if (signal < 10) return 2;
  if (signal < 12) return 3;
  return 4;
}

function ActivityGrid({ completedTasks }: { completedTasks: number }) {
  const days = Array.from({ length: 84 }, (_, index) => activityLevel(index, completedTasks));
  return <div className={styles.activityWrap} aria-label="Learning activity for the last 12 weeks">
    <div className={styles.activityLabels}>{heatLabels.map((label) => <span key={label}>{label}</span>)}</div>
    <div className={styles.activityGrid}>{days.map((level, index) => <span key={index} className={`${styles.day} ${styles[`level${level}`]}`} title={level ? `${Math.round(level * 2.5)} tasks completed` : "No tasks completed"} />)}</div>
  </div>;
}

function CourseProgress({ completedTasks }: { completedTasks: number }) {
  const totalTasks = 72;
  const percent = Math.round((completedTasks / totalTasks) * 100);
  const completedFirstLesson = completedTasks >= 3;
  return <section className={styles.courseCard}>
    <div className={styles.courseHeader}><div><p className={styles.eyebrow}>COURSE IN PROGRESS</p><h2>AI workflows</h2><p>Build a calmer, more capable way of working with AI.</p></div><strong>{percent}%<small>complete</small></strong></div>
    <div className={styles.progressTrack} aria-label={`${percent}% of the course complete`}><span style={{ width: `${Math.max(percent, completedTasks ? 2 : 0)}%` }} /></div>
    <div className={styles.chapterList}>{chapters.map((chapter, index) => {
      const active = index === 0;
      const done = active && completedFirstLesson;
      return <div key={chapter} className={`${styles.chapter} ${active ? styles.active : ""} ${done ? styles.done : ""}`}><span>{done ? "✓" : String(index + 1).padStart(2, "0")}</span><div><b>{chapter}</b><small>{active ? `${completedTasks} of 3 tasks in Context rot` : "Not started"}</small></div><i>{done ? "Complete" : active ? "In progress" : "Locked"}</i></div>;
    })}</div>
    <Link href="/course/basics/context-rot" className={styles.continue}>{completedTasks ? "Continue course" : "Start course"}<span aria-hidden="true">→</span></Link>
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
  const initial = useMemo(() => progress?.user?.name?.trim().charAt(0).toUpperCase() || "A", [progress?.user?.name]);

  if (isLoading) return <main className={styles.page}><div className={styles.loading}>Loading your learning profile…</div></main>;
  if (!progress?.user) return <main className={styles.page}><section className={styles.signedOut}><p className={styles.eyebrow}>YOUR AI SCHOOL</p><h1>Your learning profile is waiting.</h1><p>Sign in to keep your course progress and build a daily learning streak.</p><a href="/api/auth/google/start?returnTo=%2Fprofile">Sign in with Google <span aria-hidden="true">→</span></a><Link href="/">Back to AI school</Link></section></main>;

  const avatarStyle = progress.user.pictureUrl ? { backgroundImage: `url(${progress.user.pictureUrl})` } : undefined;
  return <main className={styles.page}><div className={styles.shell}>
    <nav className={styles.nav} aria-label="Profile navigation"><Link href="/" className={styles.wordmark}>AI school</Link><Link href="/course/basics/context-rot">AI workflows</Link></nav>
    <header className={styles.profileHeader}><div className={styles.identity}><span className={styles.avatar} style={avatarStyle}>{progress.user.pictureUrl ? null : initial}</span><div><p className={styles.eyebrow}>LEARNER PROFILE</p><h1>{progress.user.name}</h1><p>{progress.user.email}</p></div></div><div className={styles.stat}><strong>{completedTasks}</strong><span>tasks completed</span></div><div className={styles.stat}><strong>{completedTasks ? "1" : "0"}</strong><span>day streak</span></div></header>
    <div className={styles.grid}><CourseProgress completedTasks={completedTasks} /><aside className={styles.side}><section className={styles.activityCard}><div className={styles.activityTitle}><div><p className={styles.eyebrow}>CONSISTENCY</p><h2>Learning activity</h2></div><b>{completedTasks} this month</b></div><ActivityGrid completedTasks={completedTasks} /><div className={styles.legend}><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`${styles.day} ${styles[`level${level}`]}`} />)}<span>More</span></div></section><section className={styles.next}><p className={styles.eyebrow}>UP NEXT</p><h2>Context rot</h2><p>Learn why a long chat starts losing the thread — and how to prevent it.</p><Link href="/course/basics/context-rot">Open lesson <span aria-hidden="true">→</span></Link></section></aside></div>
  </div></main>;
}
