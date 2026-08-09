"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */
import { useEffect, useState } from "react";
import AuthButton from "../../../components/AuthButton";
import ExperienceBadge from "../../../components/ExperienceBadge";
import LessonSaveState from "../../../components/LessonSaveState";
import LessonXpCelebration from "../../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../../components/PixelIcons";
import { courseChapters, courseIntroLesson } from "../../courseData";

const lessonId = "basics/files-handovers";
const taskIds = ["places", "record", "handover"];
type Lessons = Record<
  string,
  { completedTasks?: string[]; lessonCompletedAt?: number }
>;

export default function FilesHandoversLessonClient() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [lessons, setLessons] = useState<Lessons>({});
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [finishStatus, setFinishStatus] = useState<"idle" | "saving" | "error">(
    "idle",
  );
  const [celebration, setCelebration] = useState(0);
  const [place, setPlace] = useState<string | null>(null);
  const [record, setRecord] = useState<string[]>([]);
  const [handover, setHandover] = useState({
    changed: "",
    next: "",
    start: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openChapter, setOpenChapter] = useState(0);
  const complete = Boolean(completedAt);
  const allComplete = taskIds.every((task) => tasks.includes(task));
  const progress = Math.round((tasks.length / 3) * 100);
  const lessonDone = (id: string) =>
    Boolean(id === lessonId ? completedAt : lessons[id]?.lessonCompletedAt);
  const basicsLessons = courseChapters[0].lessons;
  const basicsDone = basicsLessons.filter((lesson) =>
    lessonDone(lesson.id),
  ).length;
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 920px)");
    const closeOnMobile = () => setSidebarOpen(!mobileQuery.matches);
    closeOnMobile();
    mobileQuery.addEventListener("change", closeOnMobile);
    return () => mobileQuery.removeEventListener("change", closeOnMobile);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { user: unknown; lessons?: Lessons }) => {
        setSignedIn(Boolean(data.user));
        setLessons(data.lessons ?? {});
        setTasks(data.lessons?.[lessonId]?.completedTasks ?? []);
        setCompletedAt(data.lessons?.[lessonId]?.lessonCompletedAt ?? null);
      })
      .catch(() => setStatus("error"));
    return () => controller.abort();
  }, []);
  function save(next: string[]) {
    if (!signedIn) return;
    setStatus("saving");
    void fetch("/api/progress", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completedTasks: next }),
    })
      .then((response) => {
        if (!response.ok) throw new Error();
        setStatus("idle");
        window.dispatchEvent(new Event("progress-changed"));
      })
      .catch(() => setStatus("error"));
  }
  function completeTask(task: string) {
    if (tasks.includes(task)) return;
    const next = [...tasks, task];
    setTasks(next);
    save(next);
  }
  async function finish() {
    if (!signedIn || !allComplete || complete) return;
    setFinishStatus("saving");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completedTasks: tasks,
          completeLesson: true,
        }),
      });
      const data = (await response.json()) as {
        lesson?: { lessonCompletedAt?: number };
        newlyCompleted?: boolean;
      };
      if (!data.lesson?.lessonCompletedAt) throw new Error();
      setCompletedAt(data.lesson.lessonCompletedAt);
      setFinishStatus("idle");
      window.dispatchEvent(new Event("progress-changed"));
      if (data.newlyCompleted) setCelebration((value) => value + 1);
    } catch {
      setFinishStatus("error");
    }
  }
  const handoverReady = Object.values(handover).every(
    (value) => value.trim().length > 5,
  );
  return (
    <main className="lesson-page">
      <LessonXpCelebration
        trigger={celebration}
        nextLessonHref="/course/basics/clean-workflow"
      />
      <header className="lesson-header">
        <div className="lesson-header-left">
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-expanded={sidebarOpen}
            aria-controls="course-contents"
          >
            <span aria-hidden="true">{sidebarOpen ? "×" : "☰"}</span>
            <b>{sidebarOpen ? "Hide contents" : "Show contents"}</b>
          </button>
          <a
            className="lesson-brand"
            href="/profile#courses"
            aria-label="Return to your AI school course overview"
          >
            <PixelSpark className="lesson-brand-star" />
            <b>AI school</b>
          </a>
        </div>
        <div className="lesson-crumb">
          <span>Chapter 01 · The basics</span>
          <span>/</span>
          <b>Files and handovers</b>
        </div>
        <div className="lesson-account">
          <div className="lesson-progress">
            <span>
              <i style={{ width: `${Math.max(4, progress)}%` }} />
            </span>
            <b>{tasks.length} / 3 tasks</b>
          </div>
          <LessonSaveState signedIn={signedIn} status={status} />
          <ExperienceBadge compact />
          <AuthButton returnTo="/course/basics/files-handovers" compact />
        </div>
      </header>
      <div
        className={`lesson-workspace visual-closed ${sidebarOpen ? "" : "sidebar-closed"}`}
      >
        <aside
          className="course-sidebar"
          id="course-contents"
          aria-label="Course contents"
        >
          <div className="course-side-head">
            <p>AI workflow course</p>
            <h2>Course contents</h2>
            <div>
              <span style={{ width: `${Math.max(4, progress)}%` }} />
              <small>{progress}% of this lesson</small>
            </div>
          </div>
          <nav>
            <a
              className={`course-intro-link ${lessons.intro?.lessonCompletedAt ? "complete" : ""}`}
              href={courseIntroLesson.path}
            >
              <span>{lessons.intro?.lessonCompletedAt ? "✓" : "○"}</span>
              <div>
                <small>COURSE INTRO</small>
                <b>{courseIntroLesson.title}</b>
              </div>
            </a>
            {courseChapters.map((chapter, chapterIndex) => {
              const chapterDone = chapter.lessons.every((lesson) =>
                lessonDone(lesson.id),
              );
              return (
                <div
                  className={`side-chapter ${chapterIndex === 0 ? "current" : ""} ${chapterDone ? "complete" : ""}`}
                  key={chapter.title}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenChapter((current) =>
                        current === chapterIndex ? -1 : chapterIndex,
                      )
                    }
                    aria-expanded={openChapter === chapterIndex}
                  >
                    <span>
                      {chapterDone
                        ? "✓"
                        : String(chapterIndex + 1).padStart(2, "0")}
                    </span>
                    <b>{chapter.title}</b>
                    <i aria-label={chapterDone ? "Chapter complete" : undefined}>
                      {chapterDone
                        ? "COMPLETE"
                        : openChapter === chapterIndex
                          ? "−"
                          : "+"}
                    </i>
                  </button>
                  {openChapter === chapterIndex ? (
                    <ol>
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <li
                          className={`${lesson.id === lessonId ? "active" : ""} ${lessonDone(lesson.id) ? "complete" : ""}`}
                          key={lesson.id}
                        >
                          <span>
                            {lessonDone(lesson.id)
                              ? "✓"
                              : lesson.id === lessonId
                                ? "●"
                                : "○"}
                          </span>
                          <div>
                            <small>
                              Lesson {chapterIndex + 1}.{lessonIndex + 1}
                            </small>
                            {lesson.path ? (
                              <a href={lesson.path}>{lesson.title}</a>
                            ) : (
                              <b>{lesson.title}</b>
                            )}
                          </div>
                          {lessonDone(lesson.id) ? (
                            <i>COMPLETE</i>
                          ) : !lesson.path ? (
                            <i>LOCKED</i>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              );
            })}
          </nav>
          <div className="chapter-project">
            <span>CHAPTER PROJECT</span>
            <b>Build your project brain</b>
            <p>Unlocks after all five lessons.</p>
            <small>
              {basicsDone} / {basicsLessons.length} lessons
            </small>
          </div>
        </aside>
        <article className="lesson-reading">
          <div className="lesson-reading-inner files-handovers-reading">
            <p className="reading-kicker">Lesson 01.4</p>
            <h1>Files and handovers.</h1>
            <p className="lesson-lede">
              A chat is where the work gets discussed, a file is where a piece
              of it actually lives, and a folder keeps the files for one project
              in the same place. Once decisions and drafts sit in files, the
              next person, or the next chat, has somewhere real to begin instead
              of a transcript to scroll through.
            </p>
            <div className="lesson-rule" />
            <section>
              <p className="reading-kicker">Section 1</p>
              <h2>Give each kind of information a home.</h2>
              <p>
                You have already moved the project&apos;s facts into
                overview.md, and the same logic applies to everything else the
                work produces. Instructions, research, drafts and finished
                pieces each want a file of their own inside the project folder,
                so that finding something later is a matter of looking rather
                than remembering.
              </p>
              <div className="project-brain-preview">
                <header>
                  <span>study-planner /</span>
                  <b>PROJECT FOLDER</b>
                </header>
                <dl>
                  <div>
                    <dt>overview.md</dt>
                    <dd>The project brain and current decisions.</dd>
                  </div>
                  <div>
                    <dt>notes.md</dt>
                    <dd>Research and useful evidence.</dd>
                  </div>
                  <div>
                    <dt>app/</dt>
                    <dd>The files that make the project work.</dd>
                  </div>
                  <div>
                    <dt>handover.md</dt>
                    <dd>What changed and where to continue.</dd>
                  </div>
                </dl>
              </div>
              <div
                className={`inline-task ${tasks.includes("places") ? "complete" : ""}`}
              >
                <div className="task-heading">
                  <span>TASK 01 · PICK THE HOME</span>
                  <b>
                    {tasks.includes("places") ? "COMPLETE ✓" : "ONE ANSWER"}
                  </b>
                </div>
                <h3>Where should a decision about the project be kept?</h3>
                <div className="answer-list">
                  {[
                    ["chat", "Only in the chat where it was made."],
                    ["file", "In a project file that a future chat can read."],
                    ["memory", "In your head until somebody asks again."],
                  ].map(([value, label]) => (
                    <button
                      type="button"
                      className={place === value ? "selected" : ""}
                      onClick={() => setPlace(value)}
                      key={value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  className="task-complete-button"
                  type="button"
                  onClick={() => {
                    if (place === "file") completeTask("places");
                  }}
                >
                  Check answer
                </button>
              </div>
            </section>
            <section>
              <p className="reading-kicker">Section 2</p>
              <h2>Record what a future task needs.</h2>
              <p>
                A handover is a short note for whoever continues the work,
                whether that is a colleague, a fresh chat or you in a fortnight.
                It says what changed, what remains, where to start and what is
                still uncertain, which is enough to save the next person from
                rediscovering something you already worked out the hard way.
              </p>
              <div
                className={`inline-task ${tasks.includes("record") ? "complete" : ""}`}
              >
                <div className="task-heading">
                  <span>TASK 02 · KEEP THE USEFUL PARTS</span>
                  <b>
                    {tasks.includes("record")
                      ? "COMPLETE ✓"
                      : `${record.length} SELECTED`}
                  </b>
                </div>
                <h3>Choose every detail that belongs in a handover.</h3>
                <div className="project-brain-options">
                  {[
                    "What changed",
                    "What remains",
                    "Where to start",
                    "The full chat transcript",
                    "Anything uncertain",
                  ].map((item) => (
                    <button
                      type="button"
                      className={record.includes(item) ? "selected" : ""}
                      onClick={() =>
                        setRecord((current) =>
                          current.includes(item)
                            ? current.filter((value) => value !== item)
                            : [...current, item],
                        )
                      }
                      key={item}
                    >
                      {record.includes(item) ? "✓ " : ""}
                      {item}
                    </button>
                  ))}
                </div>
                <button
                  className="task-complete-button"
                  type="button"
                  onClick={() => {
                    const needed = [
                      "What changed",
                      "What remains",
                      "Where to start",
                      "Anything uncertain",
                    ];
                    if (
                      needed.every((item) => record.includes(item)) &&
                      record.length === needed.length
                    )
                      completeTask("record");
                  }}
                >
                  Check choices
                </button>
              </div>
            </section>
            <section>
              <p className="reading-kicker">Section 3</p>
              <h2>Leave a handover that you can follow tomorrow.</h2>
              <p>
                Use a small piece of work you finished recently, or invent one
                for the sake of the exercise. The text stays in this browser and
                is not sent to your account.
              </p>
              <div
                className={`inline-task build-task ${tasks.includes("handover") ? "complete" : ""}`}
              >
                <div className="task-heading">
                  <span>TASK 03 · WRITE A HANDOVER</span>
                  <b>
                    {tasks.includes("handover") ? "COMPLETE ✓" : "3 FIELDS"}
                  </b>
                </div>
                <h3>Write the shortest useful note for the next task.</h3>
                <div className="project-brain-form">
                  {(
                    [
                      ["changed", "What changed?"],
                      ["next", "What remains?"],
                      ["start", "Where should the next person start?"],
                    ] as const
                  ).map(([field, label]) => (
                    <label key={field}>
                      {label}
                      <textarea
                        value={handover[field]}
                        onChange={(event) =>
                          setHandover((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </label>
                  ))}
                </div>
                <button
                  className="task-complete-button"
                  type="button"
                  onClick={() => {
                    if (handoverReady) completeTask("handover");
                  }}
                >
                  Save this handover
                </button>
              </div>
            </section>
            {allComplete ? (
              <section
                className={`lesson-complete-card ${complete ? "complete" : ""}`}
              >
                <span>
                  {complete ? "LESSON COMPLETE" : "READY TO COMPLETE"}
                </span>
                <h2>
                  {complete
                    ? "Your work can survive a break."
                    : "Finish the lesson and collect your XP."}
                </h2>
                <p>
                  {complete
                    ? "Your account has saved this lesson and its XP. The last lesson of the chapter puts the whole routine together."
                    : signedIn
                      ? "All tasks are complete. Confirm the lesson to add 100 XP."
                      : "Sign in with Google to save this lesson and collect its XP."}
                </p>
                {complete ? null : (
                  <button
                    className="complete-lesson-button"
                    type="button"
                    disabled={!signedIn || finishStatus === "saving"}
                    onClick={finish}
                  >
                    {finishStatus === "saving"
                      ? "Completing lesson…"
                      : "Complete lesson · +100 XP"}
                  </button>
                )}
              </section>
            ) : null}
          </div>
        </article>
      </div>
      <nav className="lesson-bottom" aria-label="Lesson navigation">
        <a className="lesson-home-back" href="/">
          <span aria-hidden="true">←</span>
          <b>Back to home</b>
        </a>
        <div>
          <span>CHAPTER 01 · THE BASICS</span>
          <b>{tasks.length} of 3 tasks complete</b>
        </div>
        <a
          className={`lesson-next ${!complete ? "disabled" : ""}`}
          aria-disabled={!complete}
          href={
            complete
              ? "/course/basics/clean-workflow"
              : "/course/basics/files-handovers"
          }
        >
          Next lesson <PixelArrow />
        </a>
      </nav>
    </main>
  );
}
