import { database, getSessionUser, isSameOrigin, noStoreJson } from "@/lib/server/auth";

const LESSON_ID = "basics/context-rot";
const ALLOWED_TASKS = new Set(["diagnose", "compare", "build"]);

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ user: null, completedTasks: [], activity: {} });
    const row = await database().prepare(
      "SELECT completed_tasks AS completedTasks FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
    ).bind(user.id, LESSON_ID).first<{ completedTasks: string }>();
    const progress = parseProgress(row?.completedTasks);
    return noStoreJson({ user, completedTasks: progress.completedTasks, activity: activityByDay(progress.completedAt) });
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
    const payload = await request.json() as { completedTasks?: unknown };
    const requestedTasks = Array.isArray(payload.completedTasks)
      ? [...new Set(payload.completedTasks.filter((task): task is string => typeof task === "string" && ALLOWED_TASKS.has(task)))]
      : [];
    const now = Math.floor(Date.now() / 1000);
    const existing = await database().prepare(
      "SELECT completed_tasks AS completedTasks FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
    ).bind(user.id, LESSON_ID).first<{ completedTasks: string }>();
    const previous = parseProgress(existing?.completedTasks);

    // Completion is monotonic: a stale browser tab cannot erase a completed task,
    // and a timestamp is added only when the task is first completed.
    const completedTasks = [...new Set([...previous.completedTasks, ...requestedTasks])];
    const completedAt = { ...previous.completedAt };
    for (const task of completedTasks) {
      if (!previous.completedTasks.includes(task) && !completedAt[task]) completedAt[task] = now;
    }
    const storedProgress: StoredProgress = { version: 2, completedTasks, completedAt };
    await database().prepare(
      "INSERT INTO lesson_progress (user_id, lesson_id, completed_tasks, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed_tasks = excluded.completed_tasks, updated_at = excluded.updated_at",
    ).bind(user.id, LESSON_ID, JSON.stringify(storedProgress), now).run();
    return noStoreJson({ completedTasks, activity: activityByDay(completedAt), saved: true });
  } catch (error) {
    console.error("Progress save failed", error);
    return noStoreJson({ error: "Progress could not be saved." }, { status: 503 });
  }
}

type StoredProgress = {
  version: 2;
  completedTasks: string[];
  completedAt: Record<string, number>;
};

function parseProgress(value?: string): StoredProgress {
  if (!value) return { version: 2, completedTasks: [], completedAt: {} };
  try {
    const parsed = JSON.parse(value);
    // Existing production rows are arrays. They remain valid and are upgraded on
    // the next completion save, without inventing historical completion dates.
    const rawTasks = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.completedTasks) ? parsed.completedTasks : [];
    const rawDates = !Array.isArray(parsed) && parsed?.completedAt && typeof parsed.completedAt === "object"
      ? parsed.completedAt as Record<string, unknown> : {};
    const completedTasks = [...new Set(rawTasks.filter((task): task is string => typeof task === "string" && ALLOWED_TASKS.has(task)))];
    const completedAt = Object.fromEntries(Object.entries(rawDates)
      .filter(([task, timestamp]) => ALLOWED_TASKS.has(task) && typeof timestamp === "number" && Number.isFinite(timestamp) && timestamp > 0)
      .map(([task, timestamp]) => [task, Math.floor(timestamp as number)]));
    return { version: 2, completedTasks, completedAt };
  } catch {
    return { version: 2, completedTasks: [], completedAt: {} };
  }
}

function activityByDay(completedAt: Record<string, number>) {
  return Object.values(completedAt).reduce<Record<string, number>>((days, timestamp) => {
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    days[date] = (days[date] ?? 0) + 1;
    return days;
  }, {});
}
