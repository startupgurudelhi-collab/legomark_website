-- Legomark India / eFilingg MySQL Database Schema
-- Optimized for Hostinger Business Hosting & MySQL
-- Generated for direct import into Hostinger phpMyAdmin

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist to allow clean re-import
DROP TABLE IF EXISTS `automation_logs`;
DROP TABLE IF EXISTS `workflow_tasks`;
DROP TABLE IF EXISTS `workflow_templates`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `support_tickets`;
DROP TABLE IF EXISTS `receipts`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `quotations`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `leads`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `categories`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`full_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'CLIENT',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Clients Table
CREATE TABLE `clients` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`phone` varchar(50),
	`company_name` text,
	`gstin` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Leads Table
CREATE TABLE `leads` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`service` text NOT NULL,
	`source` text NOT NULL,
	`date` varchar(50) NOT NULL,
	`status` varchar(100) NOT NULL DEFAULT 'New',
	`notes` text,
	`company_name` text,
	`assigned_executive` varchar(255),
	`priority` varchar(50),
	`follow_up_date` varchar(50),
	`attachments` json,
	`notes_history` json,
	`status_history` json,
	`follow_up_history` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Categories Table
CREATE TABLE `categories` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Services Table
CREATE TABLE `services` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`description` text,
	`icon_name` varchar(100),
	`seo_meta_title` text,
	`seo_meta_description` text,
	`seo_keywords` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Packages Table
CREATE TABLE `packages` (
	`id` varchar(255) NOT NULL,
	`service_id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`price` int NOT NULL,
	`discount_price` int,
	`gst_percent` int NOT NULL DEFAULT 18,
	`features` json,
	`display_order` int NOT NULL DEFAULT 0,
	`cta` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `packages_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Orders Table
CREATE TABLE `orders` (
	`id` varchar(255) NOT NULL,
	`lead_id` varchar(255),
	`customer_name` text NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`customer_phone` varchar(50) NOT NULL,
	`customer_company_name` text,
	`service` text NOT NULL,
	`package_name` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`gst` int NOT NULL,
	`discount` int NOT NULL DEFAULT 0,
	`total_amount` int NOT NULL,
	`assigned_executive` varchar(255) NOT NULL,
	`payment_status` varchar(100) NOT NULL DEFAULT 'Pending',
	`service_status` varchar(100) NOT NULL DEFAULT 'Documents Pending',
	`attachments` json,
	`notes_history` json,
	`status_history` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Blogs Table
CREATE TABLE `blogs` (
	`id` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`category` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`featured_image` text,
	`status` varchar(50) NOT NULL DEFAULT 'Draft',
	`seo_title` text,
	`seo_description` text,
	`seo_keywords` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tasks Table
CREATE TABLE `tasks` (
	`id` varchar(255) NOT NULL,
	`order_id` varchar(255) NOT NULL,
	`service` text NOT NULL,
	`task_name` text NOT NULL,
	`description` text,
	`assigned_executive` varchar(255) NOT NULL,
	`priority` varchar(50) NOT NULL DEFAULT 'Medium',
	`status` varchar(100) NOT NULL DEFAULT 'Pending',
	`due_date` varchar(50) NOT NULL,
	`completed_date` varchar(50),
	`notes` text,
	`document_checklist` json,
	`comments` json,
	`activity_log` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Invoices Table
CREATE TABLE `invoices` (
	`id` varchar(255) NOT NULL,
	`invoice_date` varchar(50) NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`customer_phone` varchar(50) NOT NULL,
	`customer_company_name` text,
	`customer_gstin` varchar(50),
	`place_of_supply` varchar(255) NOT NULL,
	`service` text NOT NULL,
	`package_name` varchar(255) NOT NULL,
	`hsn_sac` varchar(50) NOT NULL,
	`taxable_amount` int NOT NULL,
	`cgst_rate` int NOT NULL DEFAULT 0,
	`cgst_amount` int NOT NULL DEFAULT 0,
	`sgst_rate` int NOT NULL DEFAULT 0,
	`sgst_amount` int NOT NULL DEFAULT 0,
	`igst_rate` int NOT NULL DEFAULT 0,
	`igst_amount` int NOT NULL DEFAULT 0,
	`total_amount` int NOT NULL,
	`payment_status` varchar(100) NOT NULL DEFAULT 'Unpaid',
	`payment_method` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Quotations Table
CREATE TABLE `quotations` (
	`id` varchar(255) NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`customer_phone` varchar(50) NOT NULL,
	`customer_company_name` text,
	`service` text NOT NULL,
	`package_name` varchar(255) NOT NULL,
	`items` json,
	`quantity` int NOT NULL DEFAULT 1,
	`unit_price` int NOT NULL,
	`discount` int NOT NULL DEFAULT 0,
	`gst_percent` int NOT NULL DEFAULT 18,
	`gst_amount` int NOT NULL,
	`total_amount` int NOT NULL,
	`valid_until` varchar(100) NOT NULL,
	`notes` text,
	`status` varchar(100) NOT NULL DEFAULT 'Draft',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Payments Table
CREATE TABLE `payments` (
	`id` varchar(255) NOT NULL,
	`invoice_id` varchar(255) NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`method` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`status` varchar(100) NOT NULL DEFAULT 'Pending',
	`transaction_ref` varchar(255) NOT NULL,
	`paid_date` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Receipts Table
CREATE TABLE `receipts` (
	`id` varchar(255) NOT NULL,
	`payment_ref` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`date` varchar(50) NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` varchar(255) NOT NULL,
	`customer_company_name` text,
	`order_id` varchar(255),
	`invoice_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `receipts_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Support Tickets Table
CREATE TABLE `support_tickets` (
	`id` varchar(255) NOT NULL,
	`client_email` varchar(255) NOT NULL,
	`subject` text NOT NULL,
	`category` varchar(255) NOT NULL,
	`priority` varchar(50) NOT NULL DEFAULT 'Medium',
	`status` varchar(100) NOT NULL DEFAULT 'Open',
	`description` text NOT NULL,
	`messages` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Notifications Table
CREATE TABLE `notifications` (
	`id` varchar(255) NOT NULL,
	`client_email` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'info',
	`date` varchar(50) NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Automation Logs Table
CREATE TABLE `automation_logs` (
	`id` varchar(255) NOT NULL,
	`event_name` text NOT NULL,
	`status` varchar(100) NOT NULL,
	`details` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automation_logs_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Workflow Templates Table
CREATE TABLE `workflow_templates` (
	`id` varchar(255) NOT NULL,
	`service` varchar(255) NOT NULL,
	`steps` json,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflow_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `workflow_templates_service_unique` UNIQUE(`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Workflow Tasks Table
CREATE TABLE `workflow_tasks` (
	`id` varchar(255) NOT NULL,
	`task_id` varchar(255) NOT NULL,
	`step_name` text NOT NULL,
	`status` varchar(100) NOT NULL DEFAULT 'Pending',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflow_tasks_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ADD FOREIGN KEY CONSTRAINTS
ALTER TABLE `clients` ADD CONSTRAINT `clients_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `packages` ADD CONSTRAINT `packages_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `payments_invoice_id_invoices_id_fk` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `workflow_tasks` ADD CONSTRAINT `workflow_tasks_task_id_tasks_id_fk` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- SEED INITIAL ADMINISTRATOR USER
-- Email: admin@legomark.in
-- Password: admin123 (bcrypt hash: $2a$10$7Z2ZqE8fOInGInO0eFkWGeS/lZkWgS.Qe3Uq6H3LkWKeIqfGgG/5v)
-- Standard Admin Seed:
INSERT INTO `users` (`id`, `email`, `full_name`, `password_hash`, `role`, `created_at`, `updated_at`, `is_deleted`) 
VALUES (
	'seed_admin_1', 
	'admin@legomark.in', 
	'Legomark India Admin', 
	'$2a$10$7Z2ZqE8fOInGInO0eFkWGeS/lZkWgS.Qe3Uq6H3LkWKeIqfGgG/5v', -- admin123 hash
	'ADMIN', 
	CURRENT_TIMESTAMP, 
	CURRENT_TIMESTAMP, 
	false
) ON DUPLICATE KEY UPDATE `email`=`email`;
