export type CourseLesson = {
  id: string;
  title: string;
  path?: string;
  taskCount: number;
  xpAward?: number;
};

export type CourseChapter = {
  title: string;
  lessons: CourseLesson[];
};

export type CourseLessonProgress = {
  lessonCompletedAt?: number;
};

export const courseChapters: CourseChapter[] = [
  {
    title: "Start with web AI",
    lessons: [
      {
        id: "chapter-1/lesson-1",
        title: "Your AI course pathway",
        path: "/course/chapter-1/lesson-1",
        taskCount: 0,
      },
    ],
  },
];

export const courseLessons = courseChapters.flatMap((chapter) => chapter.lessons);
export const totalCourseTasks = courseLessons.reduce((total, lesson) => total + lesson.taskCount, 0);
export const totalCourseLessons = courseLessons.length;
export const totalCourseProgressItems = totalCourseTasks + courseLessons.filter((lesson) => lesson.taskCount === 0).length;
export const totalCourseXp = courseLessons.reduce((total, lesson) => total + (lesson.xpAward ?? 100), 0);
export const publishedCourseLessons = courseLessons.filter((lesson): lesson is CourseLesson & { path: string } => Boolean(lesson.path));

export function getLesson(lessonId: string) {
  return courseLessons.find((lesson) => lesson.id === lessonId);
}

export function getCourseResumeLesson(lessons: Record<string, CourseLessonProgress>) {
  const finalPublishedLesson = publishedCourseLessons[publishedCourseLessons.length - 1];
  if (!finalPublishedLesson) throw new Error("The course needs at least one published lesson.");
  return publishedCourseLessons.find((lesson) => !lessons[lesson.id]?.lessonCompletedAt) ?? finalPublishedLesson;
}
