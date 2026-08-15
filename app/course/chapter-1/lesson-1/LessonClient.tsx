"use client";

import LessonTemplate from "../../LessonTemplate";
import CoursePathwayDiagram from "./CoursePathwayDiagram";

const lessonId = "chapter-1/lesson-1";
const currentPath = "/course/chapter-1/lesson-1";

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
      <h2>From your first prompt to an AI system you can run safely.</h2>
      <p>You will start with the AI tools that already work in a browser, then learn what models are, how context changes their work and how a useful response becomes a repeatable workflow.</p>
      <p>Project setup comes before agents, one agent comes before reusable skills, and skills come before subagents or models directing other models. The final chapter joins everything together through deployment, monitoring and maintenance.</p>
      <CoursePathwayDiagram />
    </section>

    <section>
      <p className="reading-kicker">Section 2</p>
      <h2>Use this map as your course index.</h2>
      <p>Each card names the concepts taught in that chapter and the result you will carry forward. Later lessons will slow those ideas down with their own diagrams, examples and tasks, while this orientation only gives you the order.</p>
      <div className="context-clear-note course-pathway-note">
        <span>ZERO TASKS</span>
        <p>The completion button below is ready now. It records that you have read the course map, not that you have passed a test.</p>
      </div>
    </section>
  </LessonTemplate>;
}
