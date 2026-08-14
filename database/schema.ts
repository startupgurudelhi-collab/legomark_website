/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

// 1. Users Table
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("CLIENT"), // "ADMIN" | "CLIENT"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 2. Clients Table
export const clients = pgTable("clients", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  phone: varchar("phone", { length: 50 }),
  companyName: text("company_name"),
  gstin: varchar("gstin", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 3. Leads Table
export const leads = pgTable("leads", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  service: text("service").notNull(),
  source: text("source").notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  status: varchar("status", { length: 100 }).notNull().default("New"),
  notes: text("notes"),
  companyName: text("company_name"),
  assignedExecutive: varchar("assigned_executive", { length: 255 }),
  priority: varchar("priority", { length: 50 }),
  followUpDate: varchar("follow_up_date", { length: 50 }),
  attachments: jsonb("attachments").$defaultFn(() => []),
  notesHistory: jsonb("notes_history").$defaultFn(() => []),
  statusHistory: jsonb("status_history").$defaultFn(() => []),
  followUpHistory: jsonb("follow_up_history").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 4. Orders Table
export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  leadId: varchar("lead_id", { length: 255 }).references(() => leads.id),
  customerName: text("customer_name").notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerCompanyName: text("customer_company_name"),
  service: text("service").notNull(),
  packageName: varchar("package_name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  gst: integer("gst").notNull(),
  discount: integer("discount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  assignedExecutive: varchar("assigned_executive", { length: 255 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 100 }).notNull().default("Pending"),
  serviceStatus: varchar("service_status", { length: 100 }).notNull().default("Documents Pending"),
  attachments: jsonb("attachments").$defaultFn(() => []),
  notesHistory: jsonb("notes_history").$defaultFn(() => []),
  statusHistory: jsonb("status_history").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 5. Services Table
export const services = pgTable("services", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 100 }),
  seoMetaTitle: text("seo_meta_title"),
  seoMetaDescription: text("seo_meta_description"),
  seoKeywords: jsonb("seo_keywords").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 6. Categories Table
export const categories = pgTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 7. Blogs Table
export const blogs = pgTable("blogs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  status: varchar("status", { length: 50 }).notNull().default("Draft"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: jsonb("seo_keywords").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 8. Packages Table
export const packages = pgTable("packages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  serviceId: varchar("service_id", { length: 255 }).notNull().references(() => services.id),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  gstPercent: integer("gst_percent").notNull().default(18),
  features: jsonb("features").$defaultFn(() => []),
  displayOrder: integer("display_order").notNull().default(0),
  cta: text("cta"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 9. Tasks Table
export const tasks = pgTable("tasks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull().references(() => orders.id),
  service: text("service").notNull(),
  taskName: text("task_name").notNull(),
  description: text("description"),
  assignedExecutive: varchar("assigned_executive", { length: 255 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull().default("Medium"),
  status: varchar("status", { length: 100 }).notNull().default("Pending"),
  dueDate: varchar("due_date", { length: 50 }).notNull(),
  completedDate: varchar("completed_date", { length: 50 }),
  notes: text("notes"),
  documentChecklist: jsonb("document_checklist").$defaultFn(() => []),
  comments: jsonb("comments").$defaultFn(() => []),
  activityLog: jsonb("activity_log").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 10. Workflow Templates Table
export const workflowTemplates = pgTable("workflow_templates", {
  id: varchar("id", { length: 255 }).primaryKey(),
  service: varchar("service", { length: 255 }).notNull().unique(),
  steps: jsonb("steps").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 11. Workflow Tasks Table
export const workflowTasks = pgTable("workflow_tasks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  taskId: varchar("task_id", { length: 255 }).notNull().references(() => tasks.id),
  stepName: text("step_name").notNull(),
  status: varchar("status", { length: 100 }).notNull().default("Pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 12. Invoices Table
export const invoices = pgTable("invoices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  invoiceDate: varchar("invoice_date", { length: 50 }).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerCompanyName: text("customer_company_name"),
  customerGstin: varchar("customer_gstin", { length: 50 }),
  placeOfSupply: varchar("place_of_supply", { length: 255 }).notNull(),
  service: text("service").notNull(),
  packageName: varchar("package_name", { length: 255 }).notNull(),
  hsnSac: varchar("hsn_sac", { length: 50 }).notNull(),
  taxableAmount: integer("taxable_amount").notNull(),
  cgstRate: integer("cgst_rate").notNull().default(0),
  cgstAmount: integer("cgst_amount").notNull().default(0),
  sgstRate: integer("sgst_rate").notNull().default(0),
  sgstAmount: integer("sgst_amount").notNull().default(0),
  igstRate: integer("igst_rate").notNull().default(0),
  igstAmount: integer("igst_amount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: varchar("payment_status", { length: 100 }).notNull().default("Unpaid"),
  paymentMethod: varchar("payment_method", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 13. Quotations Table
export const quotations = pgTable("quotations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerCompanyName: text("customer_company_name"),
  service: text("service").notNull(),
  packageName: varchar("package_name", { length: 255 }).notNull(),
  items: jsonb("items").$defaultFn(() => []),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  discount: integer("discount").notNull().default(0),
  gstPercent: integer("gst_percent").notNull().default(18),
  gstAmount: integer("gst_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  validUntil: varchar("valid_until", { length: 100 }).notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 100 }).notNull().default("Draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 14. Payments Table
export const payments = pgTable("payments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  invoiceId: varchar("invoice_id", { length: 255 }).notNull().references(() => invoices.id),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  method: varchar("method", { length: 100 }).notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 100 }).notNull().default("Pending"),
  transactionRef: varchar("transaction_ref", { length: 255 }).notNull(),
  paidDate: varchar("paid_date", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 15. Receipts Table
export const receipts = pgTable("receipts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  paymentRef: varchar("payment_ref", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerCompanyName: text("customer_company_name"),
  orderId: varchar("order_id", { length: 255 }),
  invoiceId: varchar("invoice_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 16. Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id", { length: 255 }).primaryKey(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  subject: text("subject").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull().default("Medium"),
  status: varchar("status", { length: 100 }).notNull().default("Open"),
  description: text("description").notNull(),
  messages: jsonb("messages").$defaultFn(() => []),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 17. Notifications Table
export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  date: varchar("date", { length: 50 }).notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 18. Automation Logs Table
export const automationLogs = pgTable("automation_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventName: text("event_name").notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 19. CMS Settings Table
export const cmsSettings = pgTable("cms_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 20. Client Logos Table
export const clientLogos = pgTable("client_logos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  status: varchar("status", { length: 50 }).notNull().default("Active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 21. Homepage Sections Table
export const homepageSections = pgTable("homepage_sections", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sectionKey: varchar("section_key", { length: 255 }).notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  badge: varchar("badge", { length: 255 }),
  content: jsonb("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


