import { clearSessionCookie, database, getSessionUser, isSameOrigin } from "@/lib/server/auth";
import { ensureNotificationTables } from "@/lib/server/notifications";

function accountHeaders(headers: HeadersInit = {}) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store");
  return responseHeaders;
}

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return new Response(JSON.stringify({ error: "Sign in to download your data." }), { status: 401, headers: accountHeaders({ "content-type": "application/json; charset=utf-8" }) });
    const progress = await database().prepare(
      "SELECT lesson_id AS lessonId, completed_tasks AS completedTasks, updated_at AS updatedAt FROM lesson_progress WHERE user_id = ?",
    ).bind(user.id).all<{ lessonId: string; completedTasks: string; updatedAt: number }>();
    await ensureNotificationTables();
    const notificationReads = await database().prepare(
      "SELECT notification_id AS notificationId, read_at AS readAt FROM notification_reads WHERE user_id = ?",
    ).bind(user.id).all<{ notificationId: string; readAt: number }>();
    const body = JSON.stringify({ exportedAt: new Date().toISOString(), account: { email: user.email, name: user.name, pictureUrl: user.pictureUrl }, progress: progress.results ?? [], notificationReads: notificationReads.results ?? [] }, null, 2);
    return new Response(body, { headers: accountHeaders({ "content-type": "application/json; charset=utf-8", "content-disposition": "attachment; filename=ai-school-account-data.json" }) });
  } catch (error) {
    console.error("Account export failed", error);
    return new Response(JSON.stringify({ error: "Account data is temporarily unavailable." }), { status: 503, headers: accountHeaders({ "content-type": "application/json; charset=utf-8" }) });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return new Response(JSON.stringify({ error: "Invalid origin." }), { status: 403, headers: accountHeaders({ "content-type": "application/json; charset=utf-8" }) });
  try {
    const user = await getSessionUser(request);
    if (!user) return new Response(JSON.stringify({ error: "Sign in to delete your account." }), { status: 401, headers: accountHeaders({ "content-type": "application/json; charset=utf-8" }) });
    const db = database();
    await ensureNotificationTables();
    await db.prepare("DELETE FROM notification_reads WHERE user_id = ?").bind(user.id).run();
    await db.prepare("DELETE FROM notifications WHERE recipient_user_id = ?").bind(user.id).run();
    await db.prepare("DELETE FROM lesson_progress WHERE user_id = ?").bind(user.id).run();
    await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
    await db.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();
    const headers = accountHeaders({ "content-type": "application/json; charset=utf-8" });
    headers.append("Set-Cookie", clearSessionCookie(request));
    return new Response(JSON.stringify({ deleted: true }), { headers });
  } catch (error) {
    console.error("Account deletion failed", error);
    return new Response(JSON.stringify({ error: "Account deletion is temporarily unavailable." }), { status: 503, headers: accountHeaders({ "content-type": "application/json; charset=utf-8" }) });
  }
}
