import type { Metadata } from "next";
import IntroLessonClient from "./LessonClient";

export const metadata: Metadata = {
  title: "AI workflow course introduction",
  description: "See who this free AI workflow course is for, what it covers and how you will learn to use AI with confidence.",
  alternates: { canonical: "/course/intro" },
  openGraph: { title: "AI workflow course introduction | AI school", url: "/course/intro" },
};

export default function IntroLesson() {
  return <IntroLessonClient />;
}
