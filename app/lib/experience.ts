import { courseChapters } from "../course/courseData";

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
  const completedXp = (lessonId: string) => lessons[lessonId]?.lessonCompletedAt ? lessons[lessonId].xpAwarded ?? XP_PER_LESSON : 0;
  const completedChapterXp = (chapterIndex: number) => courseChapters[chapterIndex].lessons
    .reduce((total, lesson) => total + completedXp(lesson.id), 0);
  const nextChapterIndex = courseChapters.findIndex((chapter) => chapter.lessons
    .some((lesson) => !lessons[lesson.id]?.lessonCompletedAt));
  const graduated = nextChapterIndex === -1;
  const chapterIndex = graduated ? courseChapters.length - 1 : nextChapterIndex;
  const chapter = courseChapters[chapterIndex];
  const xpTarget = chapter.lessons.length * XP_PER_LESSON;
  const xpInLevel = completedChapterXp(chapterIndex);
  const totalXp = courseChapters.reduce((total, _chapter, index) => total + completedChapterXp(index), 0);

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
