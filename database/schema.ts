/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { pgTable, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

// 1. Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("CLIENT"), // "ADMIN" | "CLIENT"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 2. Clients Table
export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  phone: text("phone"),
  companyName: text("company_name"),
  gstin: text("gstin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 3. Leads Table
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  source: text("source").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("New"),
  notes: text("notes"),
  companyName: text("company_name"),
  assignedExecutive: text("assigned_executive"),
  priority: text("priority"),
  followUpDate: text("follow_up_date"),
  attachments: jsonb("attachments").default("[]"),
  notesHistory: jsonb("notes_history").default("[]"),
  statusHistory: jsonb("status_history").default("[]"),
  followUpHistory: jsonb("follow_up_history").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 4. Orders Table
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").references(() => leads.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerCompanyName: text("customer_company_name"),
  service: text("service").notNull(),
  packageName: text("package_name").notNull(),
  price: integer("price").notNull(),
  gst: integer("gst").notNull(),
  discount: integer("discount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  assignedExecutive: text("assigned_executive").notNull(),
  paymentStatus: text("payment_status").notNull().default("Pending"),
  serviceStatus: text("service_status").notNull().default("Documents Pending"),
  attachments: jsonb("attachments").default("[]"),
  notesHistory: jsonb("notes_history").default("[]"),
  statusHistory: jsonb("status_history").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 5. Services Table
export const services = pgTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
  seoMetaTitle: text("seo_meta_title"),
  seoMetaDescription: text("seo_meta_description"),
  seoKeywords: jsonb("seo_keywords").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 6. Categories Table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 7. Blogs Table
export const blogs = pgTable("blogs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  status: text("status").notNull().default("Draft"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: jsonb("seo_keywords").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 8. Packages Table
export const packages = pgTable("packages", {
  id: text("id").primaryKey(),
  serviceId: text("service_id").notNull().references(() => services.id),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  gstPercent: integer("gst_percent").notNull().default(18),
  features: jsonb("features").default("[]"),
  displayOrder: integer("display_order").notNull().default(0),
  cta: text("cta"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 9. Tasks Table
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  service: text("service").notNull(),
  taskName: text("task_name").notNull(),
  description: text("description"),
  assignedExecutive: text("assigned_executive").notNull(),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").notNull().default("Pending"),
  dueDate: text("due_date").notNull(),
  completedDate: text("completed_date"),
  notes: text("notes"),
  documentChecklist: jsonb("document_checklist").default("[]"),
  comments: jsonb("comments").default("[]"),
  activityLog: jsonb("activity_log").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 10. Workflow Templates Table
export const workflowTemplates = pgTable("workflow_templates", {
  id: text("id").primaryKey(),
  service: text("service").notNull().unique(),
  steps: jsonb("steps").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 11. Workflow Tasks Table
export const workflowTasks = pgTable("workflow_tasks", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  stepName: text("step_name").notNull(),
  status: text("status").notNull().default("Pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 12. Invoices Table
export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  invoiceDate: text("invoice_date").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerCompanyName: text("customer_company_name"),
  customerGstin: text("customer_gstin"),
  placeOfSupply: text("place_of_supply").notNull(),
  service: text("service").notNull(),
  packageName: text("package_name").notNull(),
  hsnSac: text("hsn_sac").notNull(),
  taxableAmount: integer("taxable_amount").notNull(),
  cgstRate: integer("cgst_rate").notNull().default(0),
  cgstAmount: integer("cgst_amount").notNull().default(0),
  sgstRate: integer("sgst_rate").notNull().default(0),
  sgstAmount: integer("sgst_amount").notNull().default(0),
  igstRate: integer("igst_rate").notNull().default(0),
  igstAmount: integer("igst_amount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("Unpaid"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 13. Quotations Table
export const quotations = pgTable("quotations", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerCompanyName: text("customer_company_name"),
  service: text("service").notNull(),
  packageName: text("package_name").notNull(),
  items: jsonb("items").default("[]"),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  discount: integer("discount").notNull().default(0),
  gstPercent: integer("gst_percent").notNull().default(18),
  gstAmount: integer("gst_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  validUntil: text("valid_until").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("Draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 14. Payments Table
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  customerEmail: text("customer_email").notNull(),
  method: text("method").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("Pending"),
  transactionRef: text("transaction_ref").notNull(),
  paidDate: text("paid_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 15. Receipts Table
export const receipts = pgTable("receipts", {
  id: text("id").primaryKey(),
  paymentRef: text("payment_ref").notNull(),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerCompanyName: text("customer_company_name"),
  orderId: text("order_id"),
  invoiceId: text("invoice_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 16. Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  clientEmail: text("client_email").notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").notNull().default("Open"),
  description: text("description").notNull(),
  messages: jsonb("messages").default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 17. Notifications Table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  clientEmail: text("client_email").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("info"),
  date: text("date").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

// 18. Automation Logs Table
export const automationLogs = pgTable("automation_logs", {
  id: text("id").primaryKey(),
  eventName: text("event_name").notNull(),
  status: text("status").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
