CREATE TABLE "automation_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"event_name" text NOT NULL,
	"status" varchar(100) NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"featured_image" text,
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "client_logos" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"image_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"phone" varchar(50),
	"company_name" text,
	"gstin" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cms_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "homepage_sections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"section_key" varchar(255) NOT NULL,
	"title" text,
	"subtitle" text,
	"badge" varchar(255),
	"content" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "homepage_sections_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoice_date" varchar(50) NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"customer_company_name" text,
	"customer_gstin" varchar(50),
	"place_of_supply" varchar(255) NOT NULL,
	"service" text NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"hsn_sac" varchar(50) NOT NULL,
	"taxable_amount" integer NOT NULL,
	"cgst_rate" integer DEFAULT 0 NOT NULL,
	"cgst_amount" integer DEFAULT 0 NOT NULL,
	"sgst_rate" integer DEFAULT 0 NOT NULL,
	"sgst_amount" integer DEFAULT 0 NOT NULL,
	"igst_rate" integer DEFAULT 0 NOT NULL,
	"igst_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"payment_status" varchar(100) DEFAULT 'Unpaid' NOT NULL,
	"payment_method" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"service" text NOT NULL,
	"source" text NOT NULL,
	"date" varchar(50) NOT NULL,
	"status" varchar(100) DEFAULT 'New' NOT NULL,
	"notes" text,
	"company_name" text,
	"assigned_executive" varchar(255),
	"priority" varchar(50),
	"follow_up_date" varchar(50),
	"attachments" jsonb,
	"notes_history" jsonb,
	"status_history" jsonb,
	"follow_up_history" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) DEFAULT 'info' NOT NULL,
	"date" varchar(50) NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"lead_id" varchar(255),
	"customer_name" text NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"customer_company_name" text,
	"service" text NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"gst" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"assigned_executive" varchar(255) NOT NULL,
	"payment_status" varchar(100) DEFAULT 'Pending' NOT NULL,
	"service_status" varchar(100) DEFAULT 'Documents Pending' NOT NULL,
	"attachments" jsonb,
	"notes_history" jsonb,
	"status_history" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"service_id" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"discount_price" integer,
	"gst_percent" integer DEFAULT 18 NOT NULL,
	"features" jsonb,
	"display_order" integer DEFAULT 0 NOT NULL,
	"cta" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"invoice_id" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"method" varchar(100) NOT NULL,
	"amount" integer NOT NULL,
	"status" varchar(100) DEFAULT 'Pending' NOT NULL,
	"transaction_ref" varchar(255) NOT NULL,
	"paid_date" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"customer_company_name" text,
	"service" text NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"items" jsonb,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"gst_percent" integer DEFAULT 18 NOT NULL,
	"gst_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"valid_until" varchar(100) NOT NULL,
	"notes" text,
	"status" varchar(100) DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"payment_ref" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"date" varchar(50) NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_company_name" text,
	"order_id" varchar(255),
	"invoice_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"description" text,
	"icon_name" varchar(100),
	"seo_meta_title" text,
	"seo_meta_description" text,
	"seo_keywords" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"subject" text NOT NULL,
	"category" varchar(255) NOT NULL,
	"priority" varchar(50) DEFAULT 'Medium' NOT NULL,
	"status" varchar(100) DEFAULT 'Open' NOT NULL,
	"description" text NOT NULL,
	"messages" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"service" text NOT NULL,
	"task_name" text NOT NULL,
	"description" text,
	"assigned_executive" varchar(255) NOT NULL,
	"priority" varchar(50) DEFAULT 'Medium' NOT NULL,
	"status" varchar(100) DEFAULT 'Pending' NOT NULL,
	"due_date" varchar(50) NOT NULL,
	"completed_date" varchar(50),
	"notes" text,
	"document_checklist" jsonb,
	"comments" jsonb,
	"activity_log" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(50) DEFAULT 'CLIENT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workflow_tasks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"task_id" varchar(255) NOT NULL,
	"step_name" text NOT NULL,
	"status" varchar(100) DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_templates" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"service" varchar(255) NOT NULL,
	"steps" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workflow_templates_service_unique" UNIQUE("service")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;