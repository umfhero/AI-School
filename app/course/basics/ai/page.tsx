import type { Metadata } from "next";
import AiLessonClient from "./LessonClient";

export const metadata: Metadata = {
  title: "AI? | AI workflow course",
  description: "Start with what AI is, where people use it and how a project grows from a chat into a workspace.",
};

export default function AiLesson() {
  return <AiLessonClient />;
}
