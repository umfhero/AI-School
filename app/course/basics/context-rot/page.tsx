import type { Metadata } from "next";
import LessonClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Context rot | AI Free Course",
  description: "Learn why long AI chats become unreliable, and how a small project memory keeps your work focused.",
};

export default function ContextRotLesson() {
  return <LessonClient />;
}
