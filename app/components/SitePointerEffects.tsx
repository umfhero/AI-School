"use client";

import { useEffect, useRef, useState } from "react";
import { PixelCursor } from "./PixelIcons";

type ClickMark = { id: number; x: number; y: number };

export default function SitePointerEffects() {
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
    body.classList.add("site-custom-pointer");

    function movePointer(event: PointerEvent) {
      if (!dot) return;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        dot.classList.add("visible");
      });
    }

    function clickPointer(event: PointerEvent) {
      if (event.button !== 0) return;
      const id = ++clickIdRef.current;
      setClickMarks((marks) => [...marks, { id, x: event.clientX, y: event.clientY }].slice(-3));
      window.setTimeout(() => setClickMarks((marks) => marks.filter((mark) => mark.id !== id)), 350);
    }

    function hidePointer() {
      dot?.classList.remove("visible");
    }

    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerdown", clickPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", hidePointer);
    window.addEventListener("blur", hidePointer);

    return () => {
      body.classList.remove("site-custom-pointer");
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", clickPointer);
      document.documentElement.removeEventListener("mouseleave", hidePointer);
      window.removeEventListener("blur", hidePointer);
    };
  }, []);

  return <div className="site-pointer-layer" aria-hidden="true">
    <span ref={dotRef} className="site-pointer-dot"><PixelCursor /></span>
    {clickMarks.map((mark) => <span key={mark.id} className="site-pointer-click" style={{ left: mark.x, top: mark.y }}><i /><i /><i /><i /><i /></span>)}
  </div>;
}