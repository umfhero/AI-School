import type { Metadata } from "next";
import SpeedCostReasoningClient from "./LessonClient";

export const metadata: Metadata = {
  title: "Speed, cost and reasoning | Free beginner AI lesson",
  description: "Learn how to balance AI model speed, cost and reasoning effort against the consequence of getting a task wrong.",
  alternates: { canonical: "/course/models/speed-cost-reasoning" },
  openGraph: { title: "Speed, cost and reasoning | AI school", url: "/course/models/speed-cost-reasoning" },
};

export default function SpeedCostReasoningLesson() {
  return <SpeedCostReasoningClient />;
}
