import { getCourseResumeLesson, type CourseLessonProgress } from "./courseData";
import { database, getSessionUser } from "@/lib/server/auth";

function redirectTo(path: string, request: Request) {
  return new Response(null, { status: 302, headers: { Location: new URL(path, request.url).toString(), "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return redirectTo(getCourseResumeLesson({}).path, request);
    const rows = await database().prepare("SELECT lesson_id AS lessonId, completed_tasks AS completedTasks FROM lesson_progress WHERE user_id = ?")
      .bind(user.id).all<{ lessonId: string; completedTasks: string }>();
    const lessons: Record<string, CourseLessonProgress> = {};
    for (const row of rows.results ?? []) {
      try {
        const value = JSON.parse(row.completedTasks) as { lessonCompletedAt?: unknown };
        if (typeof value.lessonCompletedAt === "number" && Number.isFinite(value.lessonCompletedAt) && value.lessonCompletedAt > 0) lessons[row.lessonId] = { lessonCompletedAt: value.lessonCompletedAt };
      } catch {
        // Older task-only progress is incomplete until the learner confirms the lesson.
      }
    }
    return redirectTo(getCourseResumeLesson(lessons).path, request);
  } catch (error) {
    console.error("Course resume lookup failed", error);
    return redirectTo(getCourseResumeLesson({}).path, request);
  }
}
