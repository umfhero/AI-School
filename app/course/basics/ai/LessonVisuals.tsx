"use client";

import { useState } from "react";

const matchingPairs = [
  { left: "Web based AI", right: "ChatGPT, Claude and Gemini" },
  { left: "IDE", right: "VS Code, Cursor and Antigravity" },
  { left: "Project folder", right: "A directory that holds the files for one piece of work" },
  { left: "Non IDE", right: "OpenCode, Claude Code and Codex, where you work through the agent interface" },
];

const setupOrder = ["Web based", "IDE", "Non IDE"];

export type AiLessonVisual = "match" | "order";

export function SetupMatchingVisual({ onComplete }: { onComplete: () => void }) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [rightOptions] = useState(() => [...matchingPairs].sort(() => Math.random() - 0.5));

  const correctCount = matchingPairs.filter((pair) => matches[pair.left] === pair.right).length;
  const allMatched = Object.keys(matches).length === matchingPairs.length;

  function selectRight(right: string) {
    if (!selectedLeft) return;
    setMatches((current) => ({ ...current, [selectedLeft]: right }));
    setSelectedLeft(null);
    setChecked(false);
  }

  function checkMatches() {
    setChecked(true);
    if (allMatched && correctCount === matchingPairs.length) onComplete();
  }

  return <div className="ai-match-visual">
    <header><span>Task 01</span><b>Connect each setup to the right description.</b><small>Select a card on the left, then its match on the right.</small></header>
    <div className="ai-match-board">
      <svg className="ai-match-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {matchingPairs.map((pair, leftIndex) => {
          const rightIndex = rightOptions.findIndex((option) => option.right === matches[pair.left]);
          if (rightIndex < 0) return null;
          const leftY = 12.5 + leftIndex * 25;
          const rightY = 12.5 + rightIndex * 25;
          return <path key={pair.left} d={`M 42 ${leftY} C 48 ${leftY}, 52 ${rightY}, 58 ${rightY}`} />;
        })}
      </svg>
    <div className="ai-match-columns">
      <div className="ai-match-stack" aria-label="AI setup types">
        {matchingPairs.map((pair) => <button key={pair.left} type="button" className={`${selectedLeft === pair.left ? "selected" : ""} ${matches[pair.left] ? "linked" : ""}`} onClick={() => { setSelectedLeft(pair.left); setChecked(false); }}><span>{matches[pair.left] ? "Linked" : "Choose"}</span>{pair.left}</button>)}
      </div>
      <div className="ai-match-stack answers" aria-label="Setup descriptions">
        {rightOptions.map((pair) => {
          const taken = Object.values(matches).includes(pair.right);
          return <button key={pair.right} type="button" disabled={!selectedLeft || taken} className={checked && Object.entries(matches).some(([left, right]) => left === pair.left && right === pair.right) ? "right" : ""} onClick={() => selectRight(pair.right)}>{pair.right}</button>;
        })}
      </div>
    </div>
    </div>
    <footer><div><b>{checked ? `${correctCount} / 4 correct` : `${Object.keys(matches).length} / 4 linked`}</b><span>{checked && correctCount < 4 ? "Adjust the links and check again." : ""}</span></div><button type="button" disabled={!allMatched} onClick={checkMatches}>{checked && correctCount === 4 ? "Task complete" : "Check matches"}</button></footer>
  </div>;
}

export function SetupOrderVisual({ onComplete }: { onComplete: () => void }) {
  const [items, setItems] = useState(["IDE", "Non IDE", "Web based"]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = items.every((item, index) => item === setupOrder[index]);

  function move(item: string, direction: -1 | 1) {
    const index = items.indexOf(item);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setItems(next);
    setChecked(false);
  }

  function dropOn(target: string) {
    if (!dragged || dragged === target) return;
    const next = items.filter((item) => item !== dragged);
    next.splice(next.indexOf(target), 0, dragged);
    setItems(next);
    setDragged(null);
    setChecked(false);
  }

  function checkOrder() {
    setChecked(true);
    if (correct) onComplete();
  }

  return <div className="ai-order-visual">
    <header><span>Task 02</span><b>Put the setups in order, from the least to the most advanced.</b><small>Drag cards into place, or use the move buttons.</small></header>
    <ol>
      {items.map((item, index) => <li key={item} draggable onDragStart={() => setDragged(item)} onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(item)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><small>{item === "Web based" ? "Ask questions in a browser." : item === "IDE" ? "Work with files in a visual editor." : "Work through the agent interface."}</small><div><button type="button" onClick={() => move(item, -1)} disabled={index === 0} aria-label={`Move ${item} earlier`}>↑</button><button type="button" onClick={() => move(item, 1)} disabled={index === items.length - 1} aria-label={`Move ${item} later`}>↓</button></div></li>)}
    </ol>
    <footer><p className={checked ? (correct ? "right" : "wrong") : ""}>{checked ? (correct ? "That is the order for this course." : "Try again. Start with the setup that needs only a browser.") : ""}</p><button type="button" onClick={checkOrder}>{checked && correct ? "Task complete" : "Check order"}</button></footer>
  </div>;
}

export function AiLessonVisualContent({ visual, onComplete }: { visual: AiLessonVisual; onComplete: () => void }) {
  return visual === "match" ? <SetupMatchingVisual onComplete={onComplete} /> : <SetupOrderVisual onComplete={onComplete} />;
}
