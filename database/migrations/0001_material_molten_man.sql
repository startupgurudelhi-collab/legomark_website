CREATE TABLE `client_logos` (
	`id` varchar(255) NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`image_url` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`status` varchar(50) NOT NULL DEFAULT 'Active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_logos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cms_settings` (
	`id` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cms_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `homepage_sections` (
	`id` varchar(255) NOT NULL,
	`section_key` varchar(255) NOT NULL,
	`title` text,
	`subtitle` text,
	`badge` varchar(255),
	`content` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `homepage_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `homepage_sections_section_key_unique` UNIQUE(`section_key`)
);
