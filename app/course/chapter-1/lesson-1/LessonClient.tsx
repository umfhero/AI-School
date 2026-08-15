"use client";

import Image from "next/image";
import { PixelArrow } from "../../../components/PixelIcons";
import InlineLessonTask from "../../InlineLessonTask";
import LessonTemplate from "../../LessonTemplate";

const lessonId = "chapter-1/lesson-1";
const currentPath = "/course/chapter-1/lesson-1";

export default function LessonOneClient() {
  return <LessonTemplate
    lessonId={lessonId}
    currentPath={currentPath}
    chapterNumber={1}
    lessonTitle="Lesson one"
    requiredTaskIds={["image-purpose"]}
    completion={{
      readyTitle: "Finish reading when the structure makes sense.",
      signedInCopy: "Your task is complete. Finish the lesson to save 100 XP.",
      signedOutCopy: "Your task is complete. Sign in with Google to save the lesson and collect its XP.",
      completedTitle: "The starter lesson is complete.",
      completedCopy: "Your account has saved this lesson and its XP.",
    }}
  >
    <section>
      <p className="reading-kicker">Section 1</p>
      <h2>A clean starting point.</h2>
      <p>The previous chapters have been retired from the live course, while their content is recorded in the project archive and remains available in Git history. The next course path can now be designed without old lesson names, progress counts or chapter projects getting in the way.</p>
      <p>This page keeps the working lesson shell: a shared header, responsive course contents, a readable article and bottom navigation. Images, diagrams and tasks can then be added when they help someone understand or practise the lesson.</p>
      <div className="context-clear-note"><span>TEMPLATE REVIEW</span><p>Settle the layout here once, then carry the same spacing, type, image treatment and task behaviour into each new lesson.</p></div>
    </section>
    <section>
      <p className="reading-kicker">Section 2</p>
      <h2>Images should do a job.</h2>
      <p>A useful image gives the learner something concrete to inspect, compare or remember. This figure pattern keeps the source, explanation and original link attached to the image, so it does not become decoration without context.</p>
      <figure className="lesson-image-template">
        <div><Image src="/lesson-images/model-training-cost.jpg" alt="Bar chart comparing the estimated training costs of selected AI models between 2017 and 2023" width={2591} height={1377} sizes="(max-width: 920px) 100vw, 1000px" /></div>
        <figcaption><span>EXAMPLE IMAGE</span><div><b>Estimated training cost of selected AI models, 2017 to 2023.</b><p>The caption tells the learner what to notice, while the source remains one click away.</p></div><a href="https://aiindex.stanford.edu/report/" target="_blank" rel="noreferrer">Open source <PixelArrow /></a></figcaption>
      </figure>
    </section>
    <section>
      <p className="reading-kicker">Section 3</p>
      <h2>Tasks should stay with the lesson.</h2>
      <p>Short tasks belong directly after the idea they test, so the learner can answer without losing their place. Multiple choice, sorting and matching tasks should all use the reading column rather than opening another panel.</p>
      <InlineLessonTask taskId="image-purpose" />
    </section>
  </LessonTemplate>;
}
