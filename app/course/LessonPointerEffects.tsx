"use client";

import { useEffect, useRef, useState } from "react";
import { PixelCursor, PixelPointer } from "../components/PixelIcons";

type ClickMark = { id: number; x: number; y: number };

export default function LessonPointerEffects() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const clickIdRef = useRef(0);
  const [clickMarks, setClickMarks] = useState<ClickMark[]>([]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const body = document.body;
    const dot = dotRef.current;
    body.classList.add("lesson-custom-pointer");

    function movePointer(event: PointerEvent) {
      if (!dot) return;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        dot.classList.add("visible");
        const target = event.target instanceof Element ? event.target : null;
        dot.classList.toggle("interactive", Boolean(target?.closest("a, button, [role='button'], input, label")));
      });
    }

    function pressPointer(event: PointerEvent) {
      if (event.button !== 0) return;
      dot?.classList.add("pressed");
      const id = ++clickIdRef.current;
      setClickMarks((marks) => [...marks, { id, x: event.clientX, y: event.clientY }].slice(-4));
      window.setTimeout(() => setClickMarks((marks) => marks.filter((mark) => mark.id !== id)), 420);
    }

    function releasePointer() {
      dot?.classList.remove("pressed");
    }

    function hidePointer() {
      dot?.classList.remove("visible", "pressed");
    }

    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerdown", pressPointer, { passive: true });
    window.addEventListener("pointerup", releasePointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", hidePointer);
    window.addEventListener("blur", hidePointer);

    return () => {
      body.classList.remove("lesson-custom-pointer");
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", pressPointer);
      window.removeEventListener("pointerup", releasePointer);
      document.documentElement.removeEventListener("mouseleave", hidePointer);
      window.removeEventListener("blur", hidePointer);
    };
  }, []);

  return <div className="lesson-pointer-layer" aria-hidden="true">
    <span ref={dotRef} className="lesson-pointer-dot"><PixelCursor className="lesson-cursor-default" /><PixelPointer className="lesson-cursor-interactive" /></span>
    {clickMarks.map((mark) => <span key={mark.id} className="lesson-pointer-click" style={{ left: mark.x, top: mark.y }}><PixelPointer /></span>)}
  </div>;
}
