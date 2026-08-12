import type { Metadata } from "next";
import WhatModelsChangeClient from "./LessonClient";

export const metadata: Metadata = {
  title: "What AI models change | Free beginner lesson",
  description: "Learn what differs between AI models and how to start choosing one for the task in front of you.",
  alternates: { canonical: "/course/models/what-changes" },
  openGraph: { title: "What AI models change | AI school", url: "/course/models/what-changes" },
};

export default function WhatModelsChangeLesson() {
  return <WhatModelsChangeClient />;
}
