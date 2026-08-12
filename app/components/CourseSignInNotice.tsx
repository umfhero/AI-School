"use client";

import AuthButton from "./AuthButton";

export default function CourseSignInNotice({ returnTo, onDismiss }: { returnTo: string; onDismiss: () => void }) {
  return <section className="course-sign-in-notice" role="alert" aria-live="assertive">
    <div>
      <span>KEEP LEARNING</span>
      <h2>Sign in to continue.</h2>
      <p>Signing in is free, and it saves your progress and XP while you work through the course.</p>
    </div>
    <div className="course-sign-in-notice-actions"><AuthButton returnTo={returnTo} actionLabel="Sign in free" /><button type="button" onClick={onDismiss} aria-label="Dismiss sign-in message">Close</button></div>
  </section>;
}
