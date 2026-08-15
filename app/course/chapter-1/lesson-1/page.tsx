import type { Metadata } from "next";
import LessonOneClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Your AI course pathway",
  description: "See the complete AI school route from web AI and model basics to workflows, projects, agents, orchestration and maintenance.",
  alternates: { canonical: "/course/chapter-1/lesson-1" },
  openGraph: { title: "Your AI course pathway | AI school", url: "/course/chapter-1/lesson-1" },
};

export default function LessonOne() {
  return <LessonOneClient />;
}
