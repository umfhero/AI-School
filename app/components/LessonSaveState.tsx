"use client";

export type LessonSaveStatus = "idle" | "saving" | "saved" | "error";

const chipCopy = {
  checking: { label: "Checking", detail: "Your saved progress is being checked." },
  "signed-out": { label: "Sign in to save", detail: "Sign in above to save this lesson and its XP across your devices." },
  saving: { label: "Saving", detail: "Your progress is being saved now." },
  saved: { label: "Saved", detail: "Your progress on this lesson has been saved to your account." },
  autosave: { label: "Autosave on", detail: "You are signed in, so progress on this lesson saves automatically." },
  error: { label: "Not saved", detail: "Your progress could not be saved yet, while the lesson stays open." },
} as const;

function chipState(signedIn: boolean | null, status: LessonSaveStatus) {
  if (signedIn === null) return "checking" as const;
  if (!signedIn) return "signed-out" as const;
  if (status === "saving") return "saving" as const;
  if (status === "error") return "error" as const;
  if (status === "saved") return "saved" as const;
  return "autosave" as const;
}

export default function LessonSaveState({ signedIn, status = "idle" }: { signedIn: boolean | null; status?: LessonSaveStatus }) {
  const state = chipState(signedIn, status);
  const { label, detail } = chipCopy[state];
  return <span className={`lesson-save-chip ${state}`} role="status" title={detail} aria-label={detail}>
    <i aria-hidden="true" />
    <b aria-hidden="true">{label}</b>
  </span>;
}
