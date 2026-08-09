"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PixelCheck, PixelSpark } from "./PixelIcons";

export default function LessonXpCelebration({ trigger, nextLessonHref }: { trigger: number; nextLessonHref: string }) {
  const previous = useRef(trigger);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (previous.current === trigger) return;
    previous.current = trigger;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), reduced ? 3800 : 3000);
    return () => window.clearTimeout(timeout);
  }, [trigger]);

  if (!visible) return null;
  return <div className="lesson-xp-celebration" role="status" aria-live="polite" aria-atomic="true">
    {!reducedMotion ? <div className="lesson-xp-pixels" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} style={{ "--pixel-index": index } as CSSProperties} />)}</div> : null}
    <div className="lesson-xp-card"><PixelSpark className="lesson-xp-spark" /><div className="lesson-xp-check"><PixelCheck /></div><div><span>LESSON COMPLETE</span><b>+100 XP earned</b><small>Your progress has been saved.</small></div><a href={nextLessonHref}>Continue</a></div>
  </div>;
}
