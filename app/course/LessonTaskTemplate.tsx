"use client";

import { useEffect, useRef, useState } from "react";
import { PixelArrow, PixelCheck, PixelClose } from "../components/PixelIcons";

type TaskOption = {
  id: string;
  label: string;
};

type LessonTaskCardProps = {
  completed: boolean;
  open: boolean;
  onOpen: () => void;
};

export function LessonTaskCard({ completed, open, onOpen }: LessonTaskCardProps) {
  return <div className={`lesson-task-template-card ${completed ? "completed" : ""}`}>
    <div><span>{completed ? "TASK COMPLETE" : "EXAMPLE TASK"}</span><small>{completed ? "1 of 1 complete" : "Optional side panel"}</small></div>
    <h3>Use a task when the learner needs to make a decision.</h3>
    <p>The reading explains the idea, while the task asks the learner to apply it without leaving the lesson.</p>
    <button type="button" onClick={onOpen}>{open ? "Task is open" : completed ? "Review task" : "Open task"} {completed ? <PixelCheck /> : <PixelArrow />}</button>
  </div>;
}

type LessonTaskPanelProps = {
  completed: boolean;
  onClose: () => void;
  onComplete: () => void;
};

const options: TaskOption[] = [
  { id: "space", label: "It fills an empty part of the page." },
  { id: "evidence", label: "It helps the learner compare evidence or understand the idea." },
  { id: "routine", label: "Every lesson should contain an image." },
];

export function LessonTaskPanel({ completed, onClose, onComplete }: LessonTaskPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [selected, setSelected] = useState<string | null>(completed ? "evidence" : null);
  const [checked, setChecked] = useState(completed);
  const correct = completed || checked && selected === "evidence";

  useEffect(() => {
    headingRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function chooseOption(id: string) {
    if (completed) return;
    setSelected(id);
    setChecked(false);
  }

  function checkAnswer() {
    setChecked(true);
    if (selected === "evidence") onComplete();
  }

  return <aside className="context-visual lesson-task-panel" aria-label="Example lesson task">
    <div className="sheet-grab-handle" aria-hidden="true"><span /></div>
    <header className="lesson-task-panel-head">
      <div><span>TASK TEMPLATE</span><b>One decision, checked here</b></div>
      <button type="button" onClick={onClose} aria-label="Close example task"><PixelClose /></button>
    </header>
    <div className="lesson-task-panel-body">
      <p className="lesson-task-count">QUESTION 1 OF 1</p>
      <h2 ref={headingRef} tabIndex={-1}>When does an image earn its place in a lesson?</h2>
      <p className="lesson-task-prompt">Choose the strongest reason, then check the answer.</p>
      <div className="lesson-task-options">
        {options.map((option, index) => {
          const selectedOption = selected === option.id;
          const resultClass = checked && selectedOption ? option.id === "evidence" ? "correct" : "incorrect" : "";
          return <button key={option.id} type="button" disabled={completed} className={`${selectedOption ? "selected" : ""} ${resultClass}`} aria-pressed={selectedOption} onClick={() => chooseOption(option.id)}><span>{String(index + 1).padStart(2, "0")}</span><b>{option.label}</b>{selectedOption && correct ? <PixelCheck /> : null}</button>;
        })}
      </div>
      <div className={`lesson-task-feedback ${checked ? correct ? "correct" : "incorrect" : ""}`} role="status" aria-live="polite">
        {checked ? correct ? "Correct. The visual supports the lesson outcome." : "Try again. An image needs a teaching job, rather than empty space to fill." : "Select one answer before checking it."}
      </div>
    </div>
    <footer className="lesson-task-panel-footer">
      <span>{correct ? "1 of 1 complete" : "0 of 1 complete"}</span>
      <button type="button" disabled={!selected || completed} onClick={checkAnswer}>{correct ? "Answer checked" : "Check answer"} {correct ? <PixelCheck /> : <PixelArrow />}</button>
    </footer>
  </aside>;
}
