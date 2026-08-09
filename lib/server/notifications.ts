import { database } from "./auth";

export type NotificationAudience = "all" | "user";

export type NewNotification = {
  audience: NotificationAudience;
  recipientUserId?: string;
  kind: string;
  title: string;
  body: string;
  href?: string;
};

let notificationTablesReady: Promise<void> | null = null;

// One-off live preview requested by the site owner. The fixed ID makes this
// broadcast idempotent, so it is written once rather than on every request.
const previewBroadcast = {
  id: "cb8d85e8-2c91-4ab8-b3a5-1ce84f0ff24a",
  kind: "test_update",
  title: "Hello!",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

/**
 * Broadcasts are stored once and joined to each viewer's read state at query
 * time. This avoids a write for every user when a course or site update ships.
 */
export function ensureNotificationTables() {
  if (!notificationTablesReady) {
    const db = database();
    const now = Math.floor(Date.now() / 1000);
    notificationTablesReady = db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS notifications (id text PRIMARY KEY NOT NULL, audience text NOT NULL, recipient_user_id text, kind text NOT NULL, title text NOT NULL, body text NOT NULL, href text, created_at integer NOT NULL, FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE)"),
      db.prepare("CREATE TABLE IF NOT EXISTS notification_reads (notification_id text NOT NULL, user_id text NOT NULL, read_at integer NOT NULL, PRIMARY KEY (notification_id, user_id), FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_notifications_audience_created_at ON notifications (audience, created_at DESC)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created_at ON notifications (recipient_user_id, created_at DESC)"),
      db.prepare("CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON notification_reads (user_id)"),
      db.prepare("INSERT OR IGNORE INTO notifications (id, audience, recipient_user_id, kind, title, body, href, created_at) VALUES (?, 'all', NULL, ?, ?, ?, NULL, ?)")
        .bind(previewBroadcast.id, previewBroadcast.kind, previewBroadcast.title, previewBroadcast.body, now),
    ]).then(() => undefined).catch((error) => {
      notificationTablesReady = null;
      throw error;
    });
  }
  return notificationTablesReady;
}

/**
 * Server-only publishing hook for future course launches, site updates and
 * friend-request flows. Do not expose it through a learner-controlled route.
 */
export async function createNotification(input: NewNotification) {
  const audience = input.audience;
  const recipientUserId = audience === "user" ? input.recipientUserId?.trim() : null;
  const kind = input.kind.trim().slice(0, 40);
  const title = input.title.trim().slice(0, 140);
  const body = input.body.trim().slice(0, 600);
  const href = input.href?.trim() || null;
  if (!kind || !title || !body || (audience === "user" && !recipientUserId) || (href && (!href.startsWith("/") || href.startsWith("//")))) {
    throw new Error("Invalid notification.");
  }
  await ensureNotificationTables();
  const id = crypto.randomUUID();
  const createdAt = Math.floor(Date.now() / 1000);
  await database().prepare(
    "INSERT INTO notifications (id, audience, recipient_user_id, kind, title, body, href, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(id, audience, recipientUserId ?? null, kind, title, body, href, createdAt).run();
  return { id, createdAt };
}
