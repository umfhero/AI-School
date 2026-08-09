import type { Metadata } from "next";
import ProjectBrainLessonClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Your project brain, free beginner lesson",
  description: "Learn how a short project overview gives every new AI chat the context it needs.",
  alternates: { canonical: "/course/basics/project-brain" },
  openGraph: { title: "Your project brain | AI school", url: "/course/basics/project-brain" },
};

export default function ProjectBrainLesson() { return <ProjectBrainLessonClient />; }
