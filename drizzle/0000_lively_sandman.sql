CREATE TABLE `lesson_progress` (
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`completed_tasks` text DEFAULT '[]' NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `lesson_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`google_sub` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`picture_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_sub_unique` ON `users` (`google_sub`);