CREATE TABLE `terms_acceptance` (
	`user_id` text PRIMARY KEY NOT NULL,
	`version` text NOT NULL,
	`accepted_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
