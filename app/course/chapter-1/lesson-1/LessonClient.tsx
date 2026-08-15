"use client";

import LessonTemplate from "../../LessonTemplate";
import CoursePathwayDiagram from "./CoursePathwayDiagram";

const lessonId = "chapter-1/lesson-1";
const currentPath = "/course/chapter-1/lesson-1";

const chapters = [
  { number: "01", title: "Start with web AI", copy: "Give AI a clear job, supply useful evidence and check the answer before trusting it." },
  { number: "02", title: "Narrow and control the result", copy: "Define what may vary, constrain the output or action and reject results that miss the contract." },
  { number: "03", title: "Keep a repeatable project", copy: "Move useful context into maintained files, clear crowded sessions and record each result." },
  { number: "04", title: "Choose models and measure results", copy: "Compare models through the same task, settings, cost, speed and visible pass conditions." },
  { number: "05", title: "Move into a safe workspace", copy: "Understand files, tools, permissions, secrets, Git checkpoints, errors and tests." },
  { number: "06", title: "Build with one agent", copy: "Supervise one contained change through inspection, planning, action, checking and handover." },
  { number: "07", title: "Reuse and scale the workflow", copy: "Turn checked work into specifications, templates and skills before adding tools or more agents." },
  { number: "08", title: "Ship and maintain", copy: "Release from a recoverable state, inspect live evidence and feed it into the next safe change." },
];

export default function LessonOneClient() {
  return <LessonTemplate
    lessonId={lessonId}
    currentPath={currentPath}
    chapterNumber={1}
    lessonTitle="Your AI course pathway"
    completion={{
      readyTitle: "You know where the course is going.",
      signedInCopy: "There are no tasks in this orientation. Complete the lesson to save 100 XP.",
      signedOutCopy: "There are no tasks in this orientation. Sign in with Google to save the lesson and collect its XP.",
      completedTitle: "Your course pathway is complete.",
      completedCopy: "Your account has saved this orientation and its XP. The next lesson will begin with web AI.",
    }}
  >
    <section>
      <p className="reading-kicker">Section 1</p>
      <h2>From your first prompt to a controlled AI system.</h2>
      <p>You will start with the AI tools that already work in a browser. From there, each chapter adds one useful boundary: a clearer request, a narrower output, maintained context, measured model choice, safer tools and stronger checks.</p>
      <p>The destination is not a single clever prompt. It is a workflow you can inspect, repeat and improve, whether you are researching, writing, running operations or building software.</p>
      <CoursePathwayDiagram />
    </section>

    <section>
      <p className="reading-kicker">Section 2</p>
      <h2>Determinism comes from the complete system.</h2>
      <p>AI answers can be narrowed. You can fix the input, reduce sampling, require a schema, limit the available tools, validate the result with ordinary code and reject anything outside the contract. Some jobs need exact values. Others can allow different wording inside a fixed structure.</p>
      <p>The course will teach both. Instead of labelling every model response unpredictable and stopping there, you will decide what may vary, constrain everything else and measure the remaining boundary.</p>
      <div className="context-clear-note course-pathway-note">
        <span>THE RULE THAT RETURNS</span>
        <p>Define the result, supply the right context, constrain the answer or action, run the work, check it and record what happened.</p>
        <a href="https://developers.cloudflare.com/workers-ai/features/json-mode/" target="_blank" rel="noreferrer">See a real schema based output control in Cloudflare Workers AI</a>
      </div>
    </section>

    <section>
      <p className="reading-kicker">Section 3</p>
      <h2>What each chapter adds.</h2>
      <p>The route is ordered so that every new tool rests on a habit you have already used. Git appears before an agent edits files. Tests appear beside the change. Multiple agents wait until one agent, one specification and one handover already make sense.</p>
      <div className="course-chapter-overview">
        {chapters.map((chapter) => <article key={chapter.number}>
          <span>{chapter.number}</span>
          <div><h3>{chapter.title}</h3><p>{chapter.copy}</p></div>
        </article>)}
      </div>
    </section>

    <section>
      <p className="reading-kicker">Section 4</p>
      <h2>This lesson is only your map.</h2>
      <p>Later lessons will use diagrams to make each mechanism visible, then add a task when practice helps. This orientation has no quiz or exercise. Read the pathway, complete the lesson and begin the first concept with a clear view of where it leads.</p>
      <div className="context-clear-note course-pathway-note">
        <span>ZERO TASKS</span>
        <p>The completion button below is ready now. It records that you have seen the route, not that you have passed a test.</p>
      </div>
    </section>
  </LessonTemplate>;
}
