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

export const courseIntroLesson: CourseLesson = {
  id: "intro",
  title: "Introduction",
  path: "/course/intro",
  taskCount: 0,
  xpAward: 500,
};

export const courseChapters: CourseChapter[] = [
  {
    title: "The basics",
    lessons: [
      { id: "basics/ai", title: "AI?", path: "/course/basics/ai", taskCount: 2 },
      { id: "basics/context-rot", title: "Context rot", path: "/course/basics/context-rot", taskCount: 3 },
      { id: "basics/project-brain", title: "Your project brain", taskCount: 3 },
      { id: "basics/files-handovers", title: "Files and handovers", taskCount: 3 },
      { id: "basics/clean-workflow", title: "A clean first workflow", taskCount: 3 },
    ],
  },
  { title: "Pick the right model", lessons: [
    { id: "models/what-changes", title: "What models change", taskCount: 3 },
    { id: "models/speed-cost-reasoning", title: "Speed, cost and reasoning", taskCount: 3 },
    { id: "models/context-windows", title: "Context windows", taskCount: 3 },
    { id: "models/simple-model-test", title: "A simple model test", taskCount: 3 },
  ] },
  { title: "Build with an agent", lessons: [
    { id: "agent/task-brief", title: "Write the task brief", taskCount: 3 },
    { id: "agent/inspect", title: "Let the agent inspect", taskCount: 3 },
    { id: "agent/make-change", title: "Make the change", taskCount: 3 },
    { id: "agent/review", title: "Review what happened", taskCount: 3 },
  ] },
  { title: "Skills and repeatable work", lessons: [
    { id: "skills/what-is-a-skill", title: "What a skill is", taskCount: 3 },
    { id: "skills/first-skill", title: "Write your first skill", taskCount: 3 },
    { id: "skills/templates", title: "Use templates well", taskCount: 3 },
    { id: "skills/improve", title: "Improve it from results", taskCount: 3 },
  ] },
  { title: "Fleets and parallel work", lessons: [
    { id: "fleets/when-parallel-helps", title: "When parallel work helps", taskCount: 3 },
    { id: "fleets/divide-jobs", title: "Divide the jobs", taskCount: 3 },
    { id: "fleets/handovers", title: "Write clean handovers", taskCount: 3 },
    { id: "fleets/merge", title: "Merge without chaos", taskCount: 3 },
  ] },
  { title: "Ship it properly", lessons: [
    { id: "ship/verification", title: "Verification", taskCount: 3 },
    { id: "ship/source-control", title: "Source control", taskCount: 3 },
    { id: "ship/deployment", title: "Deployment", taskCount: 3 },
    { id: "ship/maintaining", title: "Maintaining the system", taskCount: 3 },
  ] },
];

export const courseLessons = [courseIntroLesson, ...courseChapters.flatMap((chapter) => chapter.lessons)];
export const totalCourseTasks = courseLessons.reduce((total, lesson) => total + lesson.taskCount, 0);
export const totalCourseLessons = courseLessons.length;
export const totalCourseProgressItems = totalCourseTasks + 1;
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

export function chapterTaskCount(chapter: CourseChapter) {
  return chapter.lessons.reduce((total, lesson) => total + lesson.taskCount, 0);
}
