CREATE TABLE `notification_reads` (
	`notification_id` text NOT NULL,
	`user_id` text NOT NULL,
	`read_at` integer NOT NULL,
	PRIMARY KEY(`notification_id`, `user_id`),
	FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`audience` text NOT NULL,
	`recipient_user_id` text,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`href` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`recipient_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
