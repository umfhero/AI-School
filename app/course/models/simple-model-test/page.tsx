import type { Metadata } from "next";
import SimpleModelTestClient from "./LessonClient";

export const metadata: Metadata = {
  title: "A simple model test | Free beginner AI lesson",
  description: "Learn how to compare AI models fairly with one bounded task, shared success criteria and a short test record.",
  alternates: { canonical: "/course/models/simple-model-test" },
  openGraph: { title: "A simple model test | AI school", url: "/course/models/simple-model-test" },
};

export default function SimpleModelTestLesson() {
  return <SimpleModelTestClient />;
}
