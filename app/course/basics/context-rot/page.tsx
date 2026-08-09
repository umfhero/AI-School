import type { Metadata } from "next";
import LessonClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Context rot: why long AI chats lose the plot",
  description: "Learn why long AI chats become unreliable, and how a small project memory keeps your work focused.",
  alternates: { canonical: "/course/basics/context-rot" },
  openGraph: { title: "Context rot: why long AI chats lose the plot", url: "/course/basics/context-rot" },
};

export default function ContextRotLesson() {
  return <LessonClient />;
}
