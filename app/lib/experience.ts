import { courseChapters, courseIntroLesson, courseLessons } from "../course/courseData";

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
  const completedXp = (lessonId: string, fallbackXp = XP_PER_LESSON) => lessons[lessonId]?.lessonCompletedAt ? lessons[lessonId].xpAwarded ?? fallbackXp : 0;
  const introComplete = Boolean(lessons[courseIntroLesson.id]?.lessonCompletedAt);
  const totalXp = courseLessons.reduce((total, lesson) => total + completedXp(lesson.id, lesson.xpAward ?? XP_PER_LESSON), 0);
  if (!introComplete) {
    return {
      totalXp,
      level: 0,
      levelTitle: "Course introduction",
      xpInLevel: completedXp(courseIntroLesson.id, courseIntroLesson.xpAward),
      xpTarget: courseIntroLesson.xpAward ?? XP_PER_LESSON,
      xpPercent: 0,
      graduated: false,
    };
  }
  const nextChapterIndex = courseChapters.findIndex((chapter) => chapter.lessons
    .some((lesson) => !lessons[lesson.id]?.lessonCompletedAt));
  const graduated = nextChapterIndex === -1;
  const chapterIndex = graduated ? courseChapters.length - 1 : nextChapterIndex;
  const chapter = courseChapters[chapterIndex];
  const xpTarget = graduated
    ? totalXp
    : (courseIntroLesson.xpAward ?? XP_PER_LESSON) + courseChapters
      .slice(0, chapterIndex + 1)
      .reduce((total, courseChapter) => total + courseChapter.lessons.length * XP_PER_LESSON, 0);
  const xpInLevel = totalXp;

  return {
    totalXp,
    level: chapterIndex + 1,
    levelTitle: graduated ? "Course graduate" : chapter.title,
    xpInLevel,
    xpTarget,
    xpPercent: xpTarget ? Math.min(100, Math.round((xpInLevel / xpTarget) * 100)) : 100,
    graduated,
  };
}
