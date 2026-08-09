import { database, getSessionUser, isSameOrigin, noStoreJson } from "@/lib/server/auth";
import { ensureNotificationTables } from "@/lib/server/notifications";

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  createdAt: number;
  readAt: number | null;
};

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ authenticated: false, notifications: [], unreadCount: 0 });
    await ensureNotificationTables();
    const rows = await database().prepare(
      "SELECT n.id, n.kind, n.title, n.body, n.href, n.created_at AS createdAt, r.read_at AS readAt FROM notifications n LEFT JOIN notification_reads r ON r.notification_id = n.id AND r.user_id = ? WHERE n.audience = 'all' OR n.recipient_user_id = ? ORDER BY n.created_at DESC LIMIT 50",
    ).bind(user.id, user.id).all<NotificationRow>();
    const notifications = rows.results ?? [];
    return noStoreJson({ authenticated: true, notifications, unreadCount: notifications.filter((notification) => notification.readAt === null).length });
  } catch (error) {
    console.error("Notification lookup failed", error);
    return noStoreJson({ error: "Notifications are temporarily unavailable." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({ error: "Invalid origin." }, { status: 403 });
  try {
    const user = await getSessionUser(request);
    if (!user) return noStoreJson({ error: "Sign in to update notifications." }, { status: 401 });
    const payload = await request.json() as { notificationId?: unknown };
    const notificationId = typeof payload.notificationId === "string" && /^[0-9a-f-]{36}$/i.test(payload.notificationId) ? payload.notificationId : null;
    if (!notificationId) return noStoreJson({ error: "Invalid notification." }, { status: 400 });
    await ensureNotificationTables();
    const now = Math.floor(Date.now() / 1000);
    await database().prepare(
      "INSERT INTO notification_reads (notification_id, user_id, read_at) SELECT id, ?, ? FROM notifications WHERE id = ? AND (audience = 'all' OR recipient_user_id = ?) ON CONFLICT(notification_id, user_id) DO NOTHING",
    ).bind(user.id, now, notificationId, user.id).run();
    return noStoreJson({ saved: true });
  } catch (error) {
    console.error("Notification update failed", error);
    return noStoreJson({ error: "Notification could not be updated." }, { status: 503 });
  }
}
