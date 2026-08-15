import { courseChapters, courseLessons } from "../course/courseData";

export const XP_PER_LESSON = 100;

export type LessonExperienceState = {
  lessonCompletedAt?: number;
  xpAwarded?: number;
};

export type Experience = {
  totalXp: number;
  level: number;
  levelTitle: string;
  xpInLevel: number;
  xpTarget: number;
  xpPercent: number;
  graduated: boolean;
};

export function getExperience(lessons: Record<string, LessonExperienceState>): Experience {
  const completedXp = (lessonId: string, fallbackXp = XP_PER_LESSON) =>
    lessons[lessonId]?.lessonCompletedAt ? lessons[lessonId].xpAwarded ?? fallbackXp : 0;
  const totalXp = courseLessons.reduce(
    (total, lesson) => total + completedXp(lesson.id, lesson.xpAward ?? XP_PER_LESSON),
    0,
  );
  const nextChapterIndex = courseChapters.findIndex((chapter) =>
    chapter.lessons.some((lesson) => !lessons[lesson.id]?.lessonCompletedAt),
  );
  const graduated = courseLessons.length > 0 && nextChapterIndex === -1;
  const chapterIndex = graduated ? Math.max(0, courseChapters.length - 1) : Math.max(0, nextChapterIndex);
  const chapter = courseChapters[chapterIndex];
  const xpTarget = graduated
    ? totalXp
    : courseChapters
      .slice(0, chapterIndex + 1)
      .flatMap((courseChapter) => courseChapter.lessons)
      .reduce((total, lesson) => total + (lesson.xpAward ?? XP_PER_LESSON), 0);

  return {
    totalXp,
    level: courseChapters.length ? chapterIndex + 1 : 0,
    levelTitle: graduated ? "Course graduate" : chapter?.title ?? "Course",
    xpInLevel: totalXp,
    xpTarget,
    xpPercent: xpTarget ? Math.min(100, Math.round((totalXp / xpTarget) * 100)) : 0,
    graduated,
  };
}
