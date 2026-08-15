import { database, getSessionUser, isSameOrigin, noStoreJson } from "@/lib/server/auth";
import { getLesson } from "@/app/course/courseData";
import { getExperience } from "@/app/lib/experience";
import { hasAcceptedCurrentTerms } from "@/lib/terms";

const allowedTasksByLesson: Record<string, Set<string>> = {
  "chapter-1/lesson-1": new Set(),
};

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ user: null, completedTasks: [], lessons: {}, activity: {}, experience: getExperience({}) });
    const rows = await database().prepare(
      "SELECT lesson_id AS lessonId, completed_tasks AS completedTasks, updated_at AS updatedAt FROM lesson_progress WHERE user_id = ?",
    ).bind(user.id).all<{ lessonId: string; completedTasks: string; updatedAt: number }>();
    const lessons: Record<string, StoredProgress> = {};
    const completedAt: Record<string, number> = {};
    let completedTasks: string[] = [];
    for (const row of rows.results ?? []) {
      const allowedTasks = allowedTasksByLesson[row.lessonId];
      if (!allowedTasks) continue;
      const progress = parseProgress(row.completedTasks, row.updatedAt, allowedTasks);
      lessons[row.lessonId] = progress;
      completedTasks = [...completedTasks, ...progress.completedTasks];
      Object.assign(completedAt, Object.fromEntries(Object.entries(progress.completedAt).map(([task, timestamp]) => [`${row.lessonId}:${task}`, timestamp])));
    }
    return noStoreJson({ user, completedTasks, lessons, activity: activityByDay(completedAt), experience: getExperience(lessons) });
  } catch (error) {
    console.error("Progress lookup failed", error);
    return noStoreJson({ error: "Progress is temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid origin." }, { status: 403 });
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ error: "Sign in to save progress." }, { status: 401 });
    if (!hasAcceptedCurrentTerms(user.termsVersion)) return noStoreJson({ error: "Accept the current terms to save progress." }, { status: 428 });
    const payload = await request.json() as { lessonId?: unknown; completedTasks?: unknown; completeLesson?: unknown; resetProgress?: unknown };
    if (payload.resetProgress === true) {
      await database().prepare("DELETE FROM lesson_progress WHERE user_id = ?").bind(user.id).run();
      return noStoreJson({ completedTasks: [], activity: {}, lessons: {}, experience: getExperience({}), saved: true, reset: true });
    }
    const lessonId = typeof payload.lessonId === "string" && getLesson(payload.lessonId) ? payload.lessonId : null;
    const allowedTasks = lessonId ? allowedTasksByLesson[lessonId] : null;
    if (!lessonId || !allowedTasks) return noStoreJson({ error: "Unknown lesson." }, { status: 400 });
    const requestedTasks = Array.isArray(payload.completedTasks)
      ? [...new Set(payload.completedTasks.filter((task): task is string => typeof task === "string" && allowedTasks.has(task)))]
      : [];
    const now = Math.floor(Date.now() / 1000);
    const existing = await database().prepare(
      "SELECT completed_tasks AS completedTasks, updated_at AS updatedAt FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
    ).bind(user.id, lessonId).first<{ completedTasks: string; updatedAt: number }>();
    const previous = parseProgress(existing?.completedTasks, existing?.updatedAt, allowedTasks);

    // Completion is monotonic: a stale browser tab cannot erase a completed task,
    // and a timestamp is added only when the task is first completed.
    const completedTasks = [...new Set([...previous.completedTasks, ...requestedTasks])];
    const completedAt = { ...previous.completedAt };
    for (const task of completedTasks) {
      if (!previous.completedTasks.includes(task) && !completedAt[task]) completedAt[task] = now;
    }
    const shouldCompleteLesson = payload.completeLesson === true && completedTasks.length === allowedTasks.size;
    const newlyCompleted = shouldCompleteLesson && !previous.lessonCompletedAt;
    const storedProgress: StoredProgress = {
      version: 3,
      completedTasks,
      completedAt,
      lessonCompletedAt: newlyCompleted ? now : previous.lessonCompletedAt,
      xpAwarded: newlyCompleted ? getLesson(lessonId)?.xpAward ?? 100 : previous.xpAwarded,
    };
    await database().prepare(
      "INSERT INTO lesson_progress (user_id, lesson_id, completed_tasks, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed_tasks = excluded.completed_tasks, updated_at = excluded.updated_at",
    ).bind(user.id, lessonId, JSON.stringify(storedProgress), now).run();
    return noStoreJson({ completedTasks, activity: activityByDay(completedAt), lesson: storedProgress, newlyCompleted, saved: true });
  } catch (error) {
    console.error("Progress save failed", error);
    return noStoreJson({ error: "Progress could not be saved." }, { status: 503 });
  }
}

type StoredProgress = {
  version: 2 | 3;
  completedTasks: string[];
  completedAt: Record<string, number>;
  lessonCompletedAt?: number;
  xpAwarded?: number;
};

function parseProgress(value: string | undefined, fallbackTimestamp: number | undefined, allowedTasks: Set<string>): StoredProgress {
  if (!value) return { version: 3, completedTasks: [], completedAt: {} };
  try {
    const parsed = JSON.parse(value);
    // Older production rows are arrays. Their row update time is the only date
    // retained for those completions, so use it as a transparent best available
    // activity date rather than falsely showing an empty history.
    const rawTasks = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.completedTasks) ? parsed.completedTasks : [];
    const rawDates = !Array.isArray(parsed) && parsed?.completedAt && typeof parsed.completedAt === "object"
      ? parsed.completedAt as Record<string, unknown> : {};
    const completedTasks = [...new Set(rawTasks.filter((task): task is string => typeof task === "string" && allowedTasks.has(task)))];
    const completedAt = Object.fromEntries(Object.entries(rawDates)
      .filter(([task, timestamp]) => allowedTasks.has(task) && typeof timestamp === "number" && Number.isFinite(timestamp) && timestamp > 0)
      .map(([task, timestamp]) => [task, Math.floor(timestamp as number)]));
    const fallback = typeof fallbackTimestamp === "number" && Number.isFinite(fallbackTimestamp) && fallbackTimestamp > 0
      ? Math.floor(fallbackTimestamp) : undefined;
    for (const task of completedTasks) {
      if (!completedAt[task] && fallback) completedAt[task] = fallback;
    }
    const lessonCompletedAt = typeof parsed?.lessonCompletedAt === "number" && Number.isFinite(parsed.lessonCompletedAt) && parsed.lessonCompletedAt > 0 ? Math.floor(parsed.lessonCompletedAt) : undefined;
    // A learner who completed an earlier version of a lesson stays complete if
    // that lesson later gains a required task. Treat the old lesson completion
    // time as the best available completion time for the newly tracked task.
    if (lessonCompletedAt) {
      for (const task of allowedTasks) {
        if (!completedTasks.includes(task)) completedTasks.push(task);
        if (!completedAt[task]) completedAt[task] = lessonCompletedAt;
      }
    }
    const xpAwarded = lessonCompletedAt && typeof parsed?.xpAwarded === "number" && Number.isFinite(parsed.xpAwarded) && parsed.xpAwarded > 0 ? Math.floor(parsed.xpAwarded) : undefined;
    return { version: 3, completedTasks, completedAt, lessonCompletedAt, xpAwarded };
  } catch {
    return { version: 3, completedTasks: [], completedAt: {} };
  }
}

function activityByDay(completedAt: Record<string, number>) {
  return Object.values(completedAt).reduce<Record<string, number>>((days, timestamp) => {
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    days[date] = (days[date] ?? 0) + 1;
    return days;
  }, {});
}
