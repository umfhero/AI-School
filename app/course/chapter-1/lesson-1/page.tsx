import type { Metadata } from "next";
import LessonOneClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Lesson one",
  description: "The starter lesson used to establish the shared structure for the rebuilt AI school course.",
  alternates: { canonical: "/course/chapter-1/lesson-1" },
  openGraph: { title: "Lesson one | AI school", url: "/course/chapter-1/lesson-1" },
};

export default function LessonOne() {
  return <LessonOneClient />;
}
