import type { Metadata } from "next";
import ContextWindowsClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Context windows | Free beginner AI lesson",
  description: "Learn what an AI context window contains, why capacity is not reliability, and how to clear and reload context cleanly.",
  alternates: { canonical: "/course/models/context-windows" },
  openGraph: { title: "Context windows | AI school", url: "/course/models/context-windows" },
};

export default function ContextWindowsLesson() {
  return <ContextWindowsClient />;
}
