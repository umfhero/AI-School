"use client";

import { useState } from "react";
import { PixelArrow, PixelCheck } from "../components/PixelIcons";
import { useLessonTask } from "./LessonTemplate";

type TaskOption = {
  id: string;
  label: string;
};

const options: TaskOption[] = [
  { id: "space", label: "It fills an empty part of the page." },
  { id: "evidence", label: "It helps the learner compare evidence or understand the idea." },
  { id: "routine", label: "Every lesson should contain an image." },
];

export default function InlineLessonTask({ taskId }: { taskId: string }) {
  const { completed, complete } = useLessonTask(taskId);
  const [selected, setSelected] = useState<string | null>(completed ? "evidence" : null);
  const [checked, setChecked] = useState(completed);
  const correct = completed || checked && selected === "evidence";

  function chooseOption(id: string) {
    if (completed) return;
    setSelected(id);
    setChecked(false);
  }

  function checkAnswer() {
    setChecked(true);
    if (selected === "evidence") complete();
  }

  return <section className={`lesson-inline-task ${completed ? "completed" : ""}`} aria-labelledby={`${taskId}-title`}>
    <header>
      <span>{completed ? "TASK COMPLETE" : "EXAMPLE TASK"}</span>
      <small>{completed ? "1 of 1 complete" : "QUESTION 1 OF 1"}</small>
    </header>
    <h3 id={`${taskId}-title`}>When does an image earn its place in a lesson?</h3>
    <p>Choose the strongest reason, then check the answer.</p>
    <div className="lesson-task-options">
      {options.map((option, index) => {
        const selectedOption = completed ? option.id === "evidence" : selected === option.id;
        const resultClass = checked && selectedOption ? option.id === "evidence" ? "correct" : "incorrect" : "";
        return <button key={option.id} type="button" disabled={completed} className={`${selectedOption ? "selected" : ""} ${resultClass}`} aria-pressed={selectedOption} onClick={() => chooseOption(option.id)}><span>{String(index + 1).padStart(2, "0")}</span><b>{option.label}</b>{selectedOption && correct ? <PixelCheck /> : null}</button>;
      })}
    </div>
    <div className={`lesson-task-feedback ${correct ? "correct" : checked ? "incorrect" : ""}`} role="status" aria-live="polite">
      {correct ? "Correct. The image supports the lesson outcome." : checked ? "Try again. An image needs a teaching job, rather than empty space to fill." : "Select one answer before checking it."}
    </div>
    <footer className="lesson-inline-task-footer">
      <span>{correct ? "1 of 1 complete" : "0 of 1 complete"}</span>
      <button type="button" disabled={!selected || completed} onClick={checkAnswer}>{correct ? "Answer checked" : "Check answer"} {correct ? <PixelCheck /> : <PixelArrow />}</button>
    </footer>
  </section>;
}
