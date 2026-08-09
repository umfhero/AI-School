import type { Metadata } from "next";
import AiLessonClient from "./LessonClient";

export const metadata: Metadata = {
  title: "What is AI? Free beginner lesson",
  description: "Start with what AI is, where people use it and how a project grows from a chat into a workspace.",
  alternates: { canonical: "/course/basics/ai" },
  openGraph: { title: "What is AI? | Free beginner lesson", url: "/course/basics/ai" },
};

export default function AiLesson() {
  return <AiLessonClient />;
}
