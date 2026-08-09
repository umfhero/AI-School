import type { Metadata } from "next";
import CleanWorkflowLessonClient from "./LessonClient";
export const metadata: Metadata = { title: "A clean first workflow, free beginner lesson", description: "Learn a repeatable way to give AI one clear task, check the result and record what changed.", alternates: { canonical: "/course/basics/clean-workflow" } };
export default function CleanWorkflowLesson() { return <CleanWorkflowLessonClient />; }
