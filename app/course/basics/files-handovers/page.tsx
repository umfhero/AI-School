import type { Metadata } from "next";
import FilesHandoversLessonClient from "./LessonClient";

export const metadata: Metadata = { title: "Files and handovers, free beginner lesson", description: "Learn where project information belongs and how to leave a handover someone can follow.", alternates: { canonical: "/course/basics/files-handovers" } };
export default function FilesHandoversLesson() { return <FilesHandoversLessonClient />; }
