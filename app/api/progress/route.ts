import { database, getSessionUser, isSameOrigin, noStoreJson } from "@/lib/server/auth";

const LESSON_ID = "basics/context-rot";
const ALLOWED_TASKS = new Set(["diagnose", "compare", "build"]);

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ user: null, completedTasks: [] });
    const row = await database().prepare(
      "SELECT completed_tasks AS completedTasks FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
    ).bind(user.id, LESSON_ID).first<{ completedTasks: string }>();
    return noStoreJson({ user, completedTasks: parseTasks(row?.completedTasks) });
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
    const completedTasks = Array.isArray(payload.completedTasks)
      ? [...new Set(payload.completedTasks.filter((task): task is string => typeof task === "string" && ALLOWED_TASKS.has(task)))]
      : [];
    const now = Math.floor(Date.now() / 1000);
    await database().prepare(
      "INSERT INTO lesson_progress (user_id, lesson_id, completed_tasks, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed_tasks = excluded.completed_tasks, updated_at = excluded.updated_at",
    ).bind(user.id, LESSON_ID, JSON.stringify(completedTasks), now).run();
    return noStoreJson({ completedTasks, saved: true });
  } catch (error) {
    console.error("Progress save failed", error);
    return noStoreJson({ error: "Progress could not be saved." }, { status: 503 });
  }
}

function parseTasks(value?: string) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((task): task is string => typeof task === "string" && ALLOWED_TASKS.has(task)) : [];
  } catch {
    return [];
  }
}
