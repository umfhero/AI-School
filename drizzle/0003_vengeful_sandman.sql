CREATE INDEX `idx_notification_reads_user_id` ON `notification_reads` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_notifications_audience_created_at` ON `notifications` (`audience`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_notifications_recipient_created_at` ON `notifications` (`recipient_user_id`,`created_at`);