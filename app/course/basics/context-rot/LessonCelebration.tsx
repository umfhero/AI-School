"use client";

import { useEffect, useRef, useState } from "react";

type ConfettiPiece = {
  id: number;
  color: string;
  left: string;
  drift: string;
  delay: string;
  rotate: string;
  size: string;
};

export type LessonCelebrationProps = {
  /**
   * Change this value whenever a task is completed. An incrementing number is
   * ideal, because it can celebrate consecutive completions.
   */
  trigger: number | string;
  /** Play a brief synthesised success sound. Defaults to true. */
  sound?: boolean;
  /** How long the celebration stays visible. Defaults to 2.8 seconds. */
  durationMs?: number;
};

const colours = ["#8b5cf6", "#5b66f5", "#20c997", "#f5b942", "#f36a8a", "#68b8ff"];

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 72 }, (_, id) => ({
    id,
    color: colours[id % colours.length],
    left: `${5 + ((id * 37) % 90)}%`,
    drift: `${-90 + ((id * 53) % 181)}px`,
    delay: `${((id * 19) % 180) / 1000}s`,
    rotate: `${(id * 71) % 360}deg`,
    size: `${7 + ((id * 11) % 7)}px`,
  }));
}

function playSuccessSound() {
  if (typeof window === "undefined") return;

  const AudioContextConstructor = window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.27);
    gain.connect(context.destination);

    [659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.085);
      oscillator.connect(gain);
      oscillator.start(now + index * 0.085);
      oscillator.stop(now + 0.29);
    });

    window.setTimeout(() => void context.close(), 450);
  } catch {
    // Sound is a non-essential enhancement; browsers can deny an audio context.
  }
}

/**
 * A self-contained task-completion acknowledgement. Keep it mounted once at
 * lesson level and increment `trigger` after each successful task completion.
 */
export function LessonCelebration({ trigger, sound = true, durationMs = 2800 }: LessonCelebrationProps) {
  const previousTrigger = useRef(trigger);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => () => {
    if (timeout.current) window.clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    if (previousTrigger.current === trigger) return;
    previousTrigger.current = trigger;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
    setPieces(prefersReducedMotion ? [] : makeConfetti());
    setIsVisible(true);
    if (sound && !prefersReducedMotion) playSuccessSound();

    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setIsVisible(false), durationMs);
  }, [durationMs, sound, trigger]);

  if (!isVisible) return null;

  return (
    <div className="lesson-celebration" role="status" aria-live="polite" aria-atomic="true">
      <div className="lesson-celebration__confetti" aria-hidden="true">
        {pieces.map((piece) => (
          <i
            key={piece.id}
            className="lesson-celebration__piece"
            style={{
              "--celebration-colour": piece.color,
              "--celebration-left": piece.left,
              "--celebration-drift": piece.drift,
              "--celebration-delay": piece.delay,
              "--celebration-rotate": piece.rotate,
              "--celebration-size": piece.size,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="lesson-celebration__message">
        <span aria-hidden="true">✓</span>
        <b>Task complete</b>
        <small>{reducedMotion ? "Nice work." : "Keep the momentum going."}</small>
      </div>
      <style>{`
        .lesson-celebration { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; pointer-events: none; }
        .lesson-celebration__confetti { position: absolute; inset: 0; overflow: hidden; }
        .lesson-celebration__piece { position: absolute; top: 27%; left: var(--celebration-left); display: block; width: var(--celebration-size); height: calc(var(--celebration-size) * .68); border-radius: 2px; background: var(--celebration-colour); animation: lesson-celebration-fall 1.55s cubic-bezier(.12,.75,.25,1) var(--celebration-delay) both; }
        .lesson-celebration__message { position: relative; display: grid; grid-template-columns: 2.4rem auto; column-gap: .65rem; align-items: center; min-width: 15rem; padding: .9rem 1.1rem; border: 1px solid rgba(91,102,245,.28); border-radius: .85rem; color: #10152e; background: rgba(255,255,255,.96); box-shadow: 0 1.25rem 4rem rgba(25,31,71,.22); animation: lesson-celebration-pop .28s ease-out both; }
        .lesson-celebration__message > span { grid-row: span 2; display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border-radius: 50%; color: white; background: #5b66f5; font-weight: 800; }
        .lesson-celebration__message b { font-size: .95rem; line-height: 1.1; }
        .lesson-celebration__message small { color: #59617b; font-size: .75rem; margin-top: .12rem; }
        @keyframes lesson-celebration-fall { from { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; } to { transform: translate3d(var(--celebration-drift), 58vh, 0) rotate(calc(var(--celebration-rotate) + 540deg)); opacity: 0; } }
        @keyframes lesson-celebration-pop { from { transform: scale(.88) translateY(.5rem); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .lesson-celebration__message { animation: none; } }
      `}</style>
    </div>
  );
}
