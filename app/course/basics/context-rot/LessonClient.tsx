"use client";

import { useState } from "react";
import Link from "next/link";

const template = `# [Project name]

## Goal
[What are you making, and who is it for?]

## What exists
[Pages, files, decisions and links]

## Current task
[One thing the next chat should do]

## Rules
[Style, tools, limits and things to avoid]`;

const courseChapters = [
  { title: "The basics", lessons: ["Context rot", "Your project brain", "Files and handovers", "A clean first workflow"] },
  { title: "Pick the right model", lessons: ["What models change", "Speed, cost and reasoning", "Context windows", "A simple model test"] },
  { title: "Build with an agent", lessons: ["Write the task brief", "Let the agent inspect", "Make the change", "Review what happened"] },
  { title: "Skills and repeatable work", lessons: ["What a skill is", "Write your first skill", "Use templates well", "Improve it from results"] },
  { title: "Fleets and parallel work", lessons: ["When parallel work helps", "Divide the jobs", "Write clean handovers", "Merge without chaos"] },
  { title: "Ship it properly", lessons: ["Verification", "Source control", "Deployment", "Maintaining the system"] },
];

function AttentionChart({ stable = false }: { stable?: boolean }) {
  return (
    <figure className={`proper-chart ${stable ? "chart-stable" : "chart-decline"}`}>
      <figcaption><b>{stable ? "Focused work" : "One growing chat"}</b><span>{stable ? "Useful attention stays near the job" : "Useful attention competes with more noise"}</span></figcaption>
      <div className="chart-key"><i /> Useful attention <small>Illustrative pattern, not a benchmark score</small></div>
      <div className="chart-area">
        <div className="y-label">Useful attention</div>
        <div className="y-ticks"><span>High</span><span>Medium</span><span>Low</span></div>
        <div className="plot">
          <div className="grid-line grid-1" /><div className="grid-line grid-2" /><div className="grid-line grid-3" />
          <div className="data-segment seg-1" /><div className="data-segment seg-2" /><div className="data-segment seg-3" /><div className="data-segment seg-4" />
          <i className="data-point point-1" /><i className="data-point point-2" /><i className="data-point point-3" /><i className="data-point point-4" /><i className="data-point point-5" />
        </div>
        <div className="x-ticks"><span>{stable ? "Task 1" : "Start"}</span><span>{stable ? "Task 2" : "+ changes"}</span><span>{stable ? "Task 3" : "+ fixes"}</span><span>{stable ? "Task 4" : "+ new page"}</span><span>{stable ? "Task 5" : "+ old work"}</span></div>
        <div className="x-label">{stable ? "Separate focused jobs" : "More turns and unrelated context"}</div>
      </div>
    </figure>
  );
}

function BadProjectVisual() {
  return (
    <div className="bad-project-wrap">
      <div className="visual-title"><span><i className="status-red" /> BAD PROJECT</span><b>shop-redesign</b><small>47 messages · 9 loose files</small></div>
      <div className="bad-project-window">
        <aside>
          <p>PROJECT</p>
          <div className="tree"><b>▾ shop-redesign</b><span>▾ app</span><span className="indent">page.tsx</span><span className="indent">old-page.tsx</span><span className="indent">page-final.tsx</span><span>▾ notes</span><span className="indent warn-file">ideas.txt</span><span className="indent warn-file">changes-final.txt</span><span>logo-old.png</span><span>brief-v2.docx</span></div>
        </aside>
        <div className="bad-project-main">
          <div className="visual-tabs"><span>page-final.tsx</span><span>chat</span></div>
          <div className="warning-banner"><b>NO SOURCE OF TRUTH</b><span>The project goal and current decisions only exist in the chat.</span></div>
          <div className="project-mess">
            <div className="mess-card one"><small>Message 06</small><b>Use the blue logo</b></div>
            <div className="mess-card two"><small>Message 19</small><b>Go back to green</b></div>
            <div className="mess-card three"><small>Message 31</small><b>Keep the old homepage</b></div>
            <div className="mess-card four"><small>Message 44</small><b>Why is the old logo back?</b></div>
            <div className="missing-file"><span>?</span><b>overview.md</b><small>missing</small></div>
          </div>
          <div className="visual-terminal"><span>PROBLEM</span><p>Agent is using an old decision from message 06.</p></div>
        </div>
      </div>
      <div className="visual-diagnosis"><div><span>01</span><p><b>No project memory</b>The important facts are trapped in one long conversation.</p></div><div><span>02</span><p><b>No task boundary</b>Design, copy and bug fixes are mixed together.</p></div><div><span>03</span><p><b>No handover</b>The next chat will either inherit the mess or lose the work.</p></div></div>
    </div>
  );
}

export default function LessonClient() {
  const [copied, setCopied] = useState(false);
  const [openChapter, setOpenChapter] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const progress = Math.round((completedTasks.length / 3) * 100);

  function completeTask(task: string) {
    setCompletedTasks((current) => current.includes(task) ? current : [...current, task]);
  }

  async function copyTemplate() {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="lesson-page">
      <header className="lesson-header"><Link className="lesson-brand" href="/"><span>AW</span><b>AI Workflows</b></Link><div className="lesson-crumb"><Link href="/#course">Chapter 01 · The basics</Link><span>/</span><b>Context rot</b></div><div className="lesson-progress"><span><i style={{ width: `${Math.max(4, progress)}%` }} /></span><b>{completedTasks.length} / 3 tasks</b></div></header>
      <div className="lesson-workspace">
        <aside className="course-sidebar" aria-label="Course contents">
          <div className="course-side-head"><p>AI Workflows</p><h2>Course contents</h2><div><span style={{ width: `${Math.max(4, progress)}%` }} /><small>{progress}% of this lesson</small></div></div>
          <nav>
            {courseChapters.map((chapter, chapterIndex) => <div className={`side-chapter ${chapterIndex === 0 ? "current" : ""}`} key={chapter.title}>
              <button onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} aria-expanded={openChapter === chapterIndex}><span>{String(chapterIndex + 1).padStart(2, "0")}</span><b>{chapter.title}</b><i aria-hidden="true">{openChapter === chapterIndex ? "−" : "+"}</i></button>
              {openChapter === chapterIndex ? <ol>{chapter.lessons.map((lesson, lessonIndex) => <li className={chapterIndex === 0 && lessonIndex === 0 ? "active" : ""} key={lesson}><span>{chapterIndex === 0 && lessonIndex === 0 ? "●" : "○"}</span><div><small>Lesson {chapterIndex + 1}.{lessonIndex + 1}</small><b>{lesson}</b></div>{chapterIndex > 0 ? <i>LOCKED</i> : null}</li>)}</ol> : null}
            </div>)}
          </nav>
          <div className="chapter-project"><span>CHAPTER PROJECT</span><b>Build your project brain</b><p>Unlocks after all four lessons.</p><small>0 / 4 lessons</small></div>
          <Link className="side-back" href="/#course">← Back to course map</Link>
        </aside>
        <article className="lesson-reading">
          <div className="lesson-reading-inner">
            <div className="lesson-meta"><span>LESSON 01.1</span><span>8 MINUTES</span><span>BEGINNER</span></div>
            <h1>Your AI did not get worse. <em>Your chat got messy.</em></h1>
            <p className="lesson-lede">A large context window means a model can read a lot. It does not mean every old instruction, correction and decision receives equal attention.</p>
            <aside className="objectives-card"><div><span aria-hidden="true">◎</span><h2>Learning objectives</h2></div><p>After this lesson, you will be able to:</p><ul><li>Explain why a long chat can become less reliable.</li><li>Separate project memory from conversation history.</li><li>Use one focused chat for one proper job.</li></ul></aside>
            <div className="lesson-rule" />

            <section id="the-problem"><p className="reading-kicker">Section 1 · The problem</p><h2>A chat is a whiteboard, not the whole office.</h2><p>Every prompt, reply, correction and pasted file becomes part of the context the model sees. This is useful at first, but a chat can slowly collect old decisions and unrelated work until the current task has to compete with all of it.</p><p>The model has not literally become less intelligent. Its answer can become less reliable because the input is noisier, and research shows that models can use information unevenly when the relevant detail sits inside a long context.</p>
              <aside className="lesson-note"><span>KEEP THIS STRAIGHT</span><p>Starting a new chat is not magic. If the useful project facts only exist in the old chat, the clean chat has no way to know them.</p></aside>
              <div className={`inline-task ${completedTasks.includes("diagnose") ? "complete" : ""}`}><div className="task-heading"><span>TASK 01 · QUICK CHECK</span><b>{completedTasks.includes("diagnose") ? "COMPLETE ✓" : "1 MINUTE"}</b></div><h3>Which setup is most likely to cause trouble?</h3><div className="answer-list"><button onClick={() => setQuizAnswer("a")}>A. One chat for each focused job, with a shared overview.md.</button><button onClick={() => { setQuizAnswer("b"); completeTask("diagnose"); }}>B. One chat containing the design, research, copy, bug fixes and old decisions.</button><button onClick={() => setQuizAnswer("c")}>C. A new chat supplied with the current project file and relevant code.</button></div>{quizAnswer ? <p className={`task-feedback ${quizAnswer === "b" ? "right" : "wrong"}`}>{quizAnswer === "b" ? "Correct. The current job has to compete with every earlier instruction and detour." : "Not quite. This setup keeps the context close to the current job, so try another answer."}</p> : null}</div>
            </section>

            <section id="what-changes"><p className="reading-kicker">Section 2 · What changes</p><h2>The shape of the input affects the work.</h2><p>In one growing chat, the early goal sits beside colour changes, abandoned ideas and later corrections. The line below shows the teaching pattern clearly: as unrelated context grows, useful attention can become less dependable.</p><AttentionChart />
              <p>A focused workflow looks different because each task begins with a small source of truth. The model still receives context, but it is the context for this job.</p><AttentionChart stable />
              <div className={`inline-task observation ${completedTasks.includes("compare") ? "complete" : ""}`}><div className="task-heading"><span>TASK 02 · READ THE CHART</span><b>{completedTasks.includes("compare") ? "COMPLETE ✓" : "2 MINUTES"}</b></div><h3>Write down the difference in one sentence.</h3><p>The point is not that attention reaches zero. The point is that focused jobs keep the useful material closer to the task.</p><button className="task-complete-button" onClick={() => completeTask("compare")}>{completedTasks.includes("compare") ? "Marked complete" : "I have written my sentence"}</button></div>
            </section>

            <section id="the-workflow"><p className="reading-kicker">Section 3 · The workflow</p><h2>Keep the memory, then lose the clutter.</h2><ol className="lesson-steps"><li><span>01</span><div><b>Keep the source of truth outside the chat.</b><p>Store the project goal, current state, settled decisions and next task in a small overview.md file.</p></div></li><li><span>02</span><div><b>Give one chat one proper job.</b><p>Use it to plan a feature, write a page, fix a bug or review a change, then finish that job.</p></div></li><li><span>03</span><div><b>Leave a factual handover.</b><p>Record what changed, what remains and which files matter before you move on.</p></div></li><li><span>04</span><div><b>Start the next job clean.</b><p>Bring overview.md and only the files that the new task needs.</p></div></li></ol></section>

            <section id="try-it"><p className="reading-kicker">Section 4 · Try it now</p><h2>Make the file your next chat needs.</h2><p>Copy this into a new overview.md file, then replace the square brackets with your own project details.</p><div className="lesson-template"><div><span>overview.md</span><button onClick={copyTemplate}>{copied ? "Copied" : "Copy template"}</button></div><pre><code>{template}</code></pre></div><div className={`inline-task build-task ${completedTasks.includes("build") ? "complete" : ""}`}><div className="task-heading"><span>TASK 03 · MAKE THE FILE</span><b>{completedTasks.includes("build") ? "COMPLETE ✓" : "5 MINUTES"}</b></div><h3>Complete your own overview.md.</h3><ul><li>State what you are making and who it is for.</li><li>Record the pages, files and decisions that already exist.</li><li>Give the next chat one exact job.</li></ul><button className="task-complete-button" onClick={() => completeTask("build")}>{completedTasks.includes("build") ? "Task complete" : "I have made the file"}</button></div></section>

            {completedTasks.length === 3 ? <section className="lesson-complete-card"><span>LESSON COMPLETE</span><h2>You have separated project memory from chat history.</h2><p>Your progress will be saved to an account once login is connected. For now, this interaction is a working preview.</p><Link href="/#course">Return to the course map →</Link></section> : null}

            <section className="lesson-sources"><p className="reading-kicker">Sources</p><h2>Read the work behind the lesson.</h2><a href="https://research.trychroma.com/context-rot" target="_blank" rel="noreferrer"><b>Chroma Research</b><span>Context Rot ↗</span></a><a href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noreferrer"><b>Liu et al.</b><span>Lost in the Middle ↗</span></a><a href="https://arxiv.org/abs/2311.04325" target="_blank" rel="noreferrer"><b>Hsieh et al.</b><span>RULER ↗</span></a></section>
          </div>
        </article>
        <aside className="lesson-visual" aria-label="Visual example of a poorly organised AI project"><BadProjectVisual /></aside>
      </div>
      <nav className="lesson-bottom" aria-label="Lesson navigation"><Link href="/#course">← Course map</Link><div><span>CHAPTER 01 · THE BASICS</span><b>{completedTasks.length} of 3 tasks complete</b></div><button className="lesson-next" disabled={completedTasks.length < 3}>{completedTasks.length === 3 ? "Next: Your project brain →" : "Complete the tasks to continue"}</button></nav>
    </main>
  );
}
