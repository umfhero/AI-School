import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  googleSub: text("google_sub").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  pictureUrl: text("picture_url"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const termsAcceptance = sqliteTable("terms_acceptance", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  acceptedAt: integer("accepted_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const lessonProgress = sqliteTable(
  "lesson_progress",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    completedTasks: text("completed_tasks").notNull().default("[]"),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
);

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    audience: text("audience").notNull(),
    recipientUserId: text("recipient_user_id").references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    href: text("href"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_notifications_audience_created_at").on(table.audience, table.createdAt),
    index("idx_notifications_recipient_created_at").on(table.recipientUserId, table.createdAt),
  ],
);

export const notificationReads = sqliteTable(
  "notification_reads",
  {
    notificationId: text("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    readAt: integer("read_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.notificationId, table.userId] }),
    index("idx_notification_reads_user_id").on(table.userId),
  ],
);
