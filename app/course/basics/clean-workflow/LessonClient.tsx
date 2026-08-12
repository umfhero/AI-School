"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is required by the deployed Vinext Worker router. */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import AuthButton from "../../../components/AuthButton";
import ExperienceBadge from "../../../components/ExperienceBadge";
import LessonSaveState from "../../../components/LessonSaveState";
import LessonXpCelebration from "../../../components/LessonXpCelebration";
import { PixelArrow, PixelSpark } from "../../../components/PixelIcons";
import { courseChapters, courseIntroLesson } from "../../courseData";

const lessonId = "basics/clean-workflow";
const taskIds = ["define", "check", "update"];
type Lessons = Record<
  string,
  { completedTasks?: string[]; lessonCompletedAt?: number }
>;
const questions = [
  ["A clear task should say what success looks like.", true],
  ["Once AI changes a project, checking the result is unnecessary.", false],
  ["A fresh chat should receive the project context it needs.", true],
  ["A project brain should stay unchanged after new decisions.", false],
  [
    "One contained change is easier to review than several unrelated changes.",
    true,
  ],
] as const;
export default function CleanWorkflowLessonClient() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [lessons, setLessons] = useState<Lessons>({});
  const [complete, setComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openChapter, setOpenChapter] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);
  const [finish, setFinish] = useState(false);
  const [visualWidth, setVisualWidth] = useState(620);
  const resizing = useRef(false);
  const progress = Math.round((tasks.length / 3) * 100);
  const answerCount = Object.keys(answers).length;
  const canContinue = signedIn === false || complete;
  const lessonDone = (id: string) =>
    Boolean(id === lessonId ? complete : lessons[id]?.lessonCompletedAt);
  const basicsLessons = courseChapters[0].lessons;
  const basicsDone = basicsLessons.filter((lesson) =>
    lessonDone(lesson.id),
  ).length;
  const workspaceStyle = {
    "--visual-width": `${visualWidth}px`,
  } as CSSProperties;
  useEffect(() => {
    fetch("/api/progress", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d: { user: unknown; lessons?: Lessons }) => {
        setSignedIn(Boolean(d.user));
        setLessons(d.lessons ?? {});
        setTasks(d.lessons?.[lessonId]?.completedTasks ?? []);
        setComplete(Boolean(d.lessons?.[lessonId]?.lessonCompletedAt));
      })
      .catch(() => setSignedIn(false));
  }, []);
  function beginResize(event: ReactPointerEvent<HTMLDivElement>) {
    resizing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function resizeVisual(event: ReactPointerEvent<HTMLDivElement>) {
    if (resizing.current)
      setVisualWidth(
        Math.min(860, Math.max(380, window.innerWidth - event.clientX)),
      );
  }
  function endResize(event: ReactPointerEvent<HTMLDivElement>) {
    resizing.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function resizeWithKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setVisualWidth((width) =>
      Math.min(
        860,
        Math.max(380, width + (event.key === "ArrowLeft" ? 30 : -30)),
      ),
    );
  }
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 920px)");
    const closeOnMobile = () => setSidebarOpen(!mobileQuery.matches);
    closeOnMobile();
    mobileQuery.addEventListener("change", closeOnMobile);
    return () => mobileQuery.removeEventListener("change", closeOnMobile);
  }, []);
  async function passQuiz() {
    const correct = questions.filter(
      ([, answer], i) => answers[i] === answer,
    ).length;
    setScore(correct);
    if (correct < 4) return;
    const next = taskIds;
    setTasks(next);
    if (signedIn) {
      await fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completedTasks: next }),
      });
      window.dispatchEvent(new Event("progress-changed"));
    }
    setOpen(false);
  }
  async function completeLesson() {
    if (!signedIn || tasks.length !== 3 || complete) return;
    const r = await fetch("/api/progress", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        completedTasks: tasks,
        completeLesson: true,
      }),
    });
    const d = (await r.json()) as {
      lesson?: { lessonCompletedAt?: number };
      newlyCompleted?: boolean;
    };
    if (d.lesson?.lessonCompletedAt) {
      setComplete(true);
      setFinish(Boolean(d.newlyCompleted));
      window.dispatchEvent(new Event("progress-changed"));
    }
  }
  return (
    <main className="lesson-page">
      <LessonXpCelebration
        trigger={finish ? 1 : 0}
        nextLessonHref="/profile#courses"
      />
      <header className="lesson-header">
        <div className="lesson-header-left">
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setSidebarOpen((isOpen) => !isOpen)}
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
          <b>A clean first workflow</b>
        </div>
        <div className="lesson-account">
          <div className="lesson-progress">
            <span>
              <i style={{ width: `${Math.max(4, progress)}%` }} />
            </span>
            <b>{tasks.length}/3 tasks</b>
          </div>
          <LessonSaveState signedIn={signedIn} />
          <ExperienceBadge compact />
          <AuthButton returnTo="/course/basics/clean-workflow" compact />
        </div>
      </header>
      <div
        className={`lesson-workspace ${open ? "" : "visual-closed"} ${sidebarOpen ? "" : "sidebar-closed"}`}
        style={workspaceStyle}
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
          <div className="lesson-reading-inner">
            <p className="reading-kicker">Lesson 01.5</p>
            <h1>A clean first workflow.</h1>
            <p className="lesson-lede">
              A clean workflow gives AI one bounded task, the project context it
              needs and a clear way to check the result. It takes a little more
              care at the start, although it prevents much more confused work
              later.
            </p>
            <div className="lesson-rule" />
            <section>
              <p className="reading-kicker">Section 1</p>
              <h2>Define, give context, change, check, record.</h2>
              <p>
                Start by naming one outcome and the limits that matter. Give the
                fresh chat the project brain and only the files or facts it
                needs for this task.
              </p>
              <p>
                Then make one contained change, check it against the task and
                update the project brain or handover with anything the next task
                needs to know. This keeps you responsible for the work, while AI
                helps with the parts that benefit from speed.
              </p>
              <ol className="intro-course-map">
                <li>
                  <b>Define one task.</b> State the goal, constraints and what a
                  good result looks like.
                </li>
                <li>
                  <b>Give the right context.</b> Start from the project brain
                  and the relevant files.
                </li>
                <li>
                  <b>Make and check one change.</b> Compare the result with the
                  task before accepting it.
                </li>
                <li>
                  <b>Record what changed.</b> Update the project brain or leave
                  a handover.
                </li>
              </ol>
            </section>
            <section>
              <p className="reading-kicker">Section 2</p>
              <h2>Slower at the start, faster than a repair.</h2>
              <p>
                Asking one vague question is quicker in the moment, although it
                moves the cost rather than removing it, because you pay it back
                while working out which part of a confident answer was wrong.
                The routine above spends a few minutes up front so that the work
                you accept is work you can already explain.
              </p>
              <p>
                Treat it as a habit rather than a rulebook, because the point is
                to stay in control of a project while something faster than you
                does part of the typing. That matters more as the work grows
                past what a single conversation can carry.
              </p>
            </section>
            <section className="inline-task build-task">
              <div className="task-heading">
                <span>CHAPTER QUIZ · TRUE OR FALSE</span>
                <b>{tasks.length === 3 ? "PASSED ✓" : "80% REQUIRED"}</b>
              </div>
              <h3>Check that the Chapter 1 workflow makes sense.</h3>
              <p>
                You need at least 4 out of 5 correct to finish this lesson and
                close out Chapter 1.
              </p>
              <button
                className="start-task-button"
                type="button"
                onClick={() => {
                  setOpen(true);
                  setScore(null);
                }}
              >
                Open chapter quiz
              </button>
              {score !== null && score < 4 ? (
                <p className="completion-error">
                  You scored {score}/5. Review the lesson, then retake the quiz.
                </p>
              ) : null}
            </section>
            {tasks.length === 3 ? (
              <section
                className={`lesson-complete-card ${complete ? "complete" : ""}`}
              >
                <span>
                  {complete ? "CHAPTER COMPLETE" : "READY TO COMPLETE"}
                </span>
                <h2>
                  {complete
                    ? "You have a clean first workflow."
                    : "Finish Chapter 1 and collect your XP."}
                </h2>
                <p>
                  {complete
                    ? "Chapter 2 is still being written. Your progress is saved, so it will be waiting for you when it lands."
                    : signedIn
                      ? "You passed the chapter quiz. Confirm this lesson to add 100 XP."
                      : "Sign in to save the quiz result and collect your XP."}
                </p>
                {complete ? null : (
                  <button
                    className="complete-lesson-button"
                    type="button"
                    disabled={!signedIn}
                    onClick={completeLesson}
                  >
                    Complete lesson · +100 XP
                  </button>
                )}
              </section>
            ) : null}
          </div>
        </article>
        {/* A focusable ARIA separator supports pointer dragging and keyboard resizing. */}
        {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {open ? (
          <div
            className="lesson-resize-handle"
            role="separator"
            aria-label="Resize the chapter quiz side view"
            aria-orientation="vertical"
            aria-valuemin={380}
            aria-valuemax={860}
            aria-valuenow={visualWidth}
            tabIndex={0}
            onPointerDown={beginResize}
            onPointerMove={resizeVisual}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            onKeyDown={resizeWithKeyboard}
          >
            <span aria-hidden="true">⋮</span>
          </div>
        ) : null}
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {open ? (
          <aside
            className="lesson-visual context-visual workflow-quiz"
            aria-label="Chapter 1 quiz"
          >
            <header className="visual-switcher task-visual-header">
              <div>
                <span>Side view</span>
                <b>Chapter 1 quiz</b>
              </div>
              <span className="task-visual-context">
                {answerCount}/5 answered
              </span>
              <button
                className="close-visual"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chapter quiz"
              >
                ×
              </button>
            </header>
            <div className="workflow-quiz-content">
              <p>
                Answer all five questions, then submit your quiz. You need 4
                correct answers to pass.
              </p>
              {questions.map(([text], i) => (
                <div className="quiz-question" key={text}>
                  <b>
                    {i + 1}. {text}
                  </b>
                  <div>
                    <button
                      className={answers[i] === true ? "selected" : ""}
                      onClick={() => setAnswers({ ...answers, [i]: true })}
                    >
                      True
                    </button>
                    <button
                      className={answers[i] === false ? "selected" : ""}
                      onClick={() => setAnswers({ ...answers, [i]: false })}
                    >
                      False
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="complete-lesson-button"
                type="button"
                disabled={answerCount !== 5}
                onClick={passQuiz}
              >
                Submit quiz
              </button>
              {score !== null && score < 4 ? (
                <p className="workflow-quiz-result" role="status">
                  You scored {score}/5. Review the lesson, change your answers
                  and submit again.
                </p>
              ) : answerCount < 5 ? (
                <p className="workflow-quiz-result" role="status">
                  Choose {5 - answerCount} more answer
                  {5 - answerCount === 1 ? "" : "s"} to enable submission.
                </p>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
      <nav className="lesson-bottom" aria-label="Lesson navigation">
        <a className="lesson-home-back" href="/">
          <span aria-hidden="true">←</span>
          <b>Back to home</b>
        </a>
        <div>
          <span>CHAPTER 01</span>
          <b>{tasks.length === 3 ? "Quiz passed" : "Quiz required"}</b>
        </div>
        <a
          className={`lesson-next ${!canContinue ? "disabled" : ""}`}
          aria-disabled={!canContinue}
          href={canContinue ? "/profile#courses" : "/course/basics/clean-workflow"}
        >
          Course overview <PixelArrow />
        </a>
      </nav>
    </main>
  );
}
