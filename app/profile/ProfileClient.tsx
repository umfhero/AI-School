"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */

import { useEffect, useMemo, useState } from "react";
import styles from "./profile.module.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import AuthButton from "../components/AuthButton";
import { PixelArrow, PixelSpark } from "../components/PixelIcons";
import { chapterTaskCount, courseChapters, getCourseResumeLesson, totalCourseProgressItems, type CourseChapter } from "../course/courseData";
import { getExperience, type Experience } from "../lib/experience";

type User = { name: string; email: string; pictureUrl: string | null };
type LessonMap = Record<string, { completedTasks?: string[]; lessonCompletedAt?: number; xpAwarded?: number }>;
type Progress = { user: User | null; completedTasks?: string[]; lessons?: LessonMap; activity?: Record<string, number>; experience?: Experience };
const heatLabels = ["Mon", "Wed", "Fri"];

function chapterCompletedTasks(chapter: CourseChapter, lessons: LessonMap) {
  return chapter.lessons.reduce((total, lesson) => total + Math.min(lessons[lesson.id]?.completedTasks?.length ?? 0, lesson.taskCount), 0);
}

function PixelShield({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon ${className}`.trim()}
      viewBox="0 0 7 8"
      width="20"
      height="22"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="1" y="0" width="5" height="1" />
      <rect x="0" y="1" width="7" height="1" />
      <rect x="0" y="2" width="7" height="3" />
      <rect x="1" y="5" width="5" height="1" />
      <rect x="2" y="6" width="3" height="1" />
      <rect x="3" y="7" width="1" height="1" />
    </svg>
  );
}

function ChapterBadges({ lessons }: { lessons: LessonMap }) {
  const unlockedCount = courseChapters.filter((chapter) => chapterCompletedTasks(chapter, lessons) >= chapterTaskCount(chapter)).length;
  return <section className={styles.badgesCard}>
    <div className={styles.badgesTop}><div><p className={styles.eyebrow}>ACHIEVEMENTS</p><h2>Chapter badges</h2></div><span className={styles.badgesCount}>{unlockedCount} of {courseChapters.length}</span></div>
    <div className={styles.badgeRow}>{courseChapters.map((chapter) => {
      const done = chapterCompletedTasks(chapter, lessons);
      const total = chapterTaskCount(chapter);
      const unlocked = done >= total;
      return <div key={chapter.title} className={`${styles.badge} ${unlocked ? styles.badgeUnlocked : ""}`} title={`${chapter.title}: ${done} of ${total} tasks complete`}><PixelShield className={styles.badgeIcon} /><span>{chapter.title}</span></div>;
    })}</div>
  </section>;
}

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

function CourseProgress({ completedTasks, lessons }: { completedTasks: number; lessons: Record<string, { completedTasks?: string[]; lessonCompletedAt?: number }> }) {
  const introComplete = Boolean(lessons.intro?.lessonCompletedAt);
  const completedProgressItems = completedTasks + (introComplete ? 1 : 0);
  const percent = Math.round((completedProgressItems / totalCourseProgressItems) * 100);
  const basics = courseChapters[0];
  const basicsTasks = basics.lessons.reduce((total, lesson) => total + (lessons[lesson.id]?.completedTasks?.length ?? 0), 0);
  const nextLesson = getCourseResumeLesson(lessons);
  const nextTitle = nextLesson.title;
  const nextHref = nextLesson.path;
  return <section className={styles.courseCard} id="courses">
    <PixelSpark className={styles.cornerSpark} />
    <div className={styles.courseHeader}><div><p className={styles.eyebrow}>COURSE IN PROGRESS</p><h2>AI workflows</h2><p>Build a calmer, more capable way of working with AI.</p></div><strong>{percent}%<small>complete</small></strong></div>
    <div className={styles.progressTrack} aria-label={`${percent}% of the course complete`}><span style={{ width: `${Math.max(percent, completedTasks ? 2 : 0)}%` }} /></div>
    <div className={styles.chapterList}>{courseChapters.map((chapter, index) => {
      const active = index === 0;
      const done = active && basicsTasks >= chapterTaskCount(basics);
      return <div key={chapter.title} className={`${styles.chapter} ${active ? styles.active : ""} ${done ? styles.done : ""}`}><span>{done ? "✓" : String(index + 1).padStart(2, "0")}</span><div><b>{chapter.title}</b><small>{active ? `${basicsTasks} of ${chapterTaskCount(basics)} tasks in The basics` : "Not started"}</small></div><i>{done ? "Complete" : active ? "In progress" : "Locked"}</i></div>;
    })}</div>
    <a href={nextHref} className={styles.continue}>{completedTasks ? `Continue with ${nextTitle}` : "Start course"}<PixelArrow /></a>
  </section>;
}

export default function ProfileClient() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resettingTestProgress, setResettingTestProgress] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

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
  const lessons = progress?.lessons ?? {};
  const nextLesson = getCourseResumeLesson(lessons);
  const nextTitle = nextLesson.title;
  const nextCopy = nextLesson.id === "intro" ? "See how the course is organised, who it is for and the workflow habits you will practise." : nextLesson.id === "basics/ai" ? "Start with what AI is, where people use it and how a project grows from a chat into a workspace." : "Learn why a long chat starts losing the thread and how to prevent it.";
  const nextHref = nextLesson.path;
  const level = progress?.experience ?? getExperience(lessons);
  const activity = progress?.activity ?? {};
  const currentMonth = localDateKey(new Date()).slice(0, 7);
  const completedThisMonth = Object.entries(activity).reduce((total, [day, count]) => day.startsWith(currentMonth) ? total + count : total, 0);
  let dayStreak = 0;
  for (let date = new Date(); activity[localDateKey(date)] > 0; date.setDate(date.getDate() - 1)) dayStreak += 1;
  const initial = useMemo(() => progress?.user?.name?.trim().charAt(0).toUpperCase() || "A", [progress?.user?.name]);
  const canResetTestProgress = progress?.user?.email.toLowerCase() === "umfhero@gmail.com";

  async function resetTestProgress() {
    if (!canResetTestProgress || resettingTestProgress) return;
    setResettingTestProgress(true);
    try {
      const response = await fetch("/api/progress", { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resetProgress: true }) });
      if (!response.ok) throw new Error("Reset failed");
      const data = await response.json() as Pick<Progress, "completedTasks" | "lessons" | "activity" | "experience">;
      setProgress((current) => current ? { ...current, ...data } : current);
      window.dispatchEvent(new Event("progress-changed"));
    } finally {
      setResettingTestProgress(false);
    }
  }

  async function deleteAccount() {
    if (deletingAccount || !window.confirm("Delete your AI school account and saved progress? This cannot be undone.")) return;
    setDeletingAccount(true);
    try {
      const response = await fetch("/api/account", { method: "DELETE", credentials: "same-origin" });
      if (!response.ok) throw new Error("Account deletion failed");
      window.location.assign("/");
    } catch {
      setDeletingAccount(false);
      window.alert("Your account could not be deleted right now. Please try again later.");
    }
  }

  if (isLoading) return <main className={styles.page}><SiteHeader /><div className={styles.loading}>Loading your learning profile…</div></main>;
  if (!progress?.user) return <main className={styles.page} id="top"><SiteHeader /><section className={styles.signedOut}><p className={styles.eyebrow}>YOUR AI SCHOOL</p><h1>Your learning profile is waiting.</h1><p>Sign in to keep your course progress and build a daily learning streak.</p><AuthButton returnTo="/profile" className={styles.profileSignIn} actionLabel="Sign in with Google" /><a href="/">Back to AI school</a></section><SiteFooter /></main>;

  const avatarStyle = progress.user.pictureUrl ? { backgroundImage: `url(${progress.user.pictureUrl})` } : undefined;
  return <main className={styles.page} id="top">
    <SiteHeader />
    <div className={styles.shell}>
    <header className={styles.profileHeader}>
      <div className={styles.profileHeaderTop}>
        <div className={styles.identity}><span className={styles.avatar} style={avatarStyle}>{progress.user.pictureUrl ? null : initial}</span><div><p className={styles.eyebrow}>LEARNER PROFILE</p><h1>{progress.user.name}</h1><p>{progress.user.email}</p></div></div>
        <div className={styles.stat}><strong>{completedTasks}</strong><span>tasks completed</span></div>
        <div className={styles.stat}><strong>{dayStreak}</strong><span>day streak</span></div>
        {canResetTestProgress ? <button className={styles.testReset} type="button" onClick={resetTestProgress} disabled={resettingTestProgress}>{resettingTestProgress ? "Resetting…" : "Reset test progress"}</button> : null}
      </div>
      <div className={styles.levelBar}>
        <div className={styles.levelPill}><PixelSpark className={styles.levelIcon} /><span>LV {level.level}</span></div>
        <div className={styles.xpInfo}>
          <div className={styles.xpTop}><b>{level.levelTitle}</b><span>{level.graduated ? "Course complete" : `${level.xpInLevel} / ${level.xpTarget} XP`}</span></div>
          <div className={styles.xpTrack} aria-label={`${level.xpPercent}% progress toward level ${level.level + 1}`}><span style={{ width: `${level.xpPercent}%` }} /></div>
        </div>
      </div>
    </header>
    <ChapterBadges lessons={lessons} />
    <div className={styles.grid}><CourseProgress completedTasks={completedTasks} lessons={lessons} /><aside className={styles.side}><section className={styles.activityCard}><PixelSpark className={styles.cornerSpark} /><div className={styles.activityTitle}><div><p className={styles.eyebrow}>CONSISTENCY</p><h2>Learning activity</h2></div><b>{completedThisMonth} this month</b></div><ActivityGrid activity={activity} /><div className={styles.legend}><span>Less</span>{[0, 1, 2, 3, 4].map((tier) => <i key={tier} className={`${styles.day} ${styles[`level${tier}`]}`} />)}<span>More</span></div></section><section className={styles.next}><PixelSpark className={styles.cornerSparkNext} /><p className={styles.eyebrow}>UP NEXT</p><h2>{nextTitle}</h2><p>{nextCopy}</p><a href={nextHref}>Open lesson <PixelArrow /></a></section><section className={styles.accountData}><p className={styles.eyebrow}>ACCOUNT DATA</p><h2>Your information</h2><p>Download a copy of your account and saved progress, or permanently delete them.</p><a href="/api/account">Download my data</a><button type="button" onClick={deleteAccount} disabled={deletingAccount}>{deletingAccount ? "Deleting account…" : "Delete my account"}</button></section></aside></div>
  </div><SiteFooter /></main>;
}
