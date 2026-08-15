"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

export type ModelMatchPair = { left: string; right: string };

export type ModelMatchTaskDefinition = {
  taskId: string;
  number: string;
  title: string;
  instruction: string;
  cardTitle: string;
  cardPrompt: string;
  pairs: ModelMatchPair[];
};

export function ModelMatchTask({ definition, onComplete }: { definition: ModelMatchTaskDefinition; onComplete: () => void }) {
  const { pairs } = definition;
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const rightOptions = useMemo(() => [...pairs.slice(2), ...pairs.slice(0, 2)], [pairs]);
  const boardRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [connections, setConnections] = useState<Array<{ id: string; path: string }>>([]);
  const correctCount = pairs.filter((pair) => matches[pair.left] === pair.right).length;
  const allMatched = Object.keys(matches).length === pairs.length;

  useLayoutEffect(() => {
    let frame = 0;
    const updateConnections = () => {
      const board = boardRef.current;
      if (!board) return;
      const boardRect = board.getBoundingClientRect();
      setBoardSize({ width: boardRect.width, height: boardRect.height });
      setConnections(pairs.flatMap((pair) => {
        const matchedRight = matches[pair.left];
        const leftRect = leftRefs.current[pair.left]?.getBoundingClientRect();
        const rightRect = matchedRight ? rightRefs.current[matchedRight]?.getBoundingClientRect() : null;
        if (!leftRect || !rightRect) return [];
        const x1 = leftRect.right - boardRect.left;
        const y1 = leftRect.top - boardRect.top + leftRect.height / 2;
        const x2 = rightRect.left - boardRect.left;
        const y2 = rightRect.top - boardRect.top + rightRect.height / 2;
        const distance = Math.max(24, x2 - x1);
        return [{ id: pair.left, path: `M ${x1} ${y1} C ${x1 + distance * 0.35} ${y1}, ${x2 - distance * 0.35} ${y2}, ${x2} ${y2}` }];
      }));
    };
    const scheduleUpdate = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateConnections); };
    scheduleUpdate();
    const observer = new ResizeObserver(scheduleUpdate);
    if (boardRef.current) observer.observe(boardRef.current);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [matches, pairs]);

  function selectRight(right: string) {
    if (!selectedLeft) return;
    setMatches((current) => ({
      ...Object.fromEntries(Object.entries(current).filter(([, selectedRight]) => selectedRight !== right)),
      [selectedLeft]: right,
    }));
    setSelectedLeft(null);
    setChecked(false);
  }

  function checkMatches() {
    setChecked(true);
    if (allMatched && correctCount === pairs.length) onComplete();
  }

  return <div className="ai-match-visual model-match-visual">
    <header><span>{definition.number}</span><b>{definition.title}</b><small>{definition.instruction}</small></header>
    <div className="ai-match-board" ref={boardRef}>
      <svg className="ai-match-connections" viewBox={`0 0 ${boardSize.width} ${boardSize.height}`} aria-hidden="true">{connections.map((connection) => <path key={connection.id} d={connection.path} />)}</svg>
      <div className="ai-match-columns">
        <div className="ai-match-stack" aria-label="Situations">{pairs.map((pair) => <button key={pair.left} ref={(node) => { leftRefs.current[pair.left] = node; }} type="button" className={`${selectedLeft === pair.left ? "selected" : ""} ${matches[pair.left] ? "linked" : ""}`} onClick={() => { setSelectedLeft(pair.left); setChecked(false); }}><span>{matches[pair.left] ? "Linked" : "Choose"}</span>{pair.left}</button>)}</div>
        <div className="ai-match-stack answers" aria-label="Answers">{rightOptions.map((pair) => <button key={pair.right} ref={(node) => { rightRefs.current[pair.right] = node; }} type="button" disabled={!selectedLeft} className={checked && matches[pair.left] === pair.right ? "right" : ""} onClick={() => selectRight(pair.right)}>{pair.right}</button>)}</div>
      </div>
    </div>
    <footer><div><b>{checked ? `${correctCount} / 4 correct` : `${Object.keys(matches).length} / 4 linked`}</b><span>{checked && correctCount < pairs.length ? "Adjust the links and check again." : ""}</span></div><button type="button" disabled={!allMatched} onClick={checkMatches}>{checked && correctCount === pairs.length ? "Task complete" : "Check matches"}</button></footer>
  </div>;
}
