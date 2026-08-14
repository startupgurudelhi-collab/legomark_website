/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import authRoutes from "./auth.js";
import healthRoutes from "./health.js";
import { requireAuth } from "../middleware/authMiddleware.js";

// Uploads directory path
const uploadDir = path.join(process.cwd(), "public/uploads");

// Multer disk storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB limit
});
import { 
  LeadsController, 
  OrdersController, 
  TasksController, 
  BlogsController, 
  BillingController, 
  SupportController, 
  CmsConfigController,
  PackagesController
} from "../controllers/dataController.js";
import { EmailController } from "../controllers/emailController.js";
import { PaymentController } from "../controllers/paymentController.js";
import { CommunicationController } from "../controllers/communicationController.js";

const router = Router();

// 1. Authentication Routes (Public)
router.use("/auth", authRoutes);

// 2. Health Check (Public)
router.use("/", healthRoutes);

// ==========================================
// BUSINESS ROUTINGS (Protected with requireAuth)
// ==========================================

// Leads Endpoints
router.get("/leads", requireAuth, LeadsController.list);
router.post("/leads", requireAuth, LeadsController.create);
router.put("/leads/:id", requireAuth, LeadsController.update);
router.post("/leads/:id/notes", requireAuth, LeadsController.addNote);
router.post("/leads/:id/status", requireAuth, LeadsController.changeStatus);
router.delete("/leads/:id", requireAuth, LeadsController.delete);

// Orders Endpoints
router.get("/orders", requireAuth, OrdersController.list);
router.post("/orders", requireAuth, OrdersController.create);
router.put("/orders/:id", requireAuth, OrdersController.update);
router.post("/orders/:id/status", requireAuth, OrdersController.changeStatus);

// Tasks / Workflow Endpoints
router.get("/tasks", requireAuth, TasksController.list);
router.post("/tasks", requireAuth, TasksController.create);
router.put("/tasks/:id", requireAuth, TasksController.update);
router.post("/tasks/:id/comments", requireAuth, TasksController.addComment);

// Blogs / CMS Posts (Read is public, modifications require authentication)
router.get("/blogs", BlogsController.list);
router.post("/blogs", requireAuth, BlogsController.create);
router.put("/blogs/:id", requireAuth, BlogsController.update);
router.delete("/blogs/:id", requireAuth, BlogsController.delete);

// Billing & Payments Endpoints
router.get("/billing/dashboard", requireAuth, BillingController.listDashboard);
router.post("/billing/quotations", requireAuth, BillingController.createQuotation);
router.post("/billing/invoices", requireAuth, BillingController.createInvoice);
router.post("/billing/payments", requireAuth, BillingController.createPayment);
router.post("/billing/receipts", requireAuth, BillingController.createReceipt);

// Razorpay Payments Endpoints
router.get("/payments/status", requireAuth, PaymentController.getStatus);
router.post("/payments/create-order", requireAuth, PaymentController.createOrder);
router.post("/payments/verify", requireAuth, PaymentController.verify);
router.post("/payments/webhook", PaymentController.webhook); // Webhook must remain public
router.get("/payments/:id", requireAuth, PaymentController.getPaymentDetails);
router.post("/payments/public-create-order", PaymentController.publicCreateOrder);
router.post("/payments/public-verify", PaymentController.publicVerify);

// Customer Support Tickets Endpoints
router.get("/support/tickets", requireAuth, SupportController.list);
router.get("/support/tickets/client/:email", requireAuth, SupportController.listByClient);
router.post("/support/tickets", requireAuth, SupportController.create);
router.post("/support/tickets/:id/reply", requireAuth, SupportController.reply);

// System Settings & CMS Elements
router.get("/cms/config", CmsConfigController.get);
router.get("/cms/testimonials", CmsConfigController.getTestimonials);
router.put("/cms/homepage", requireAuth, CmsConfigController.updateHomepage);
router.put("/cms/contact", requireAuth, CmsConfigController.updateContact);
router.put("/cms/settings", requireAuth, CmsConfigController.updateSettings);
router.put("/cms/testimonials", requireAuth, CmsConfigController.updateTestimonials);
router.put("/cms/logos", requireAuth, CmsConfigController.updateLogos);
router.put("/cms/faqs", requireAuth, CmsConfigController.updateFaqs);
router.put("/cms/media", requireAuth, CmsConfigController.updateMedia);
router.put("/cms/navigation", requireAuth, CmsConfigController.updateNavigation);
router.put("/cms/services", requireAuth, CmsConfigController.updateServices);
router.put("/cms/categories", requireAuth, CmsConfigController.updateCategories);
router.post("/cms/media", requireAuth, CmsConfigController.uploadMedia);
router.post("/cms/upload-video", requireAuth, upload.single("video"), CmsConfigController.uploadVideoFile);
router.post("/cms/upload-thumbnail", requireAuth, upload.single("thumbnail"), CmsConfigController.uploadThumbnailFile);

// Packages CMS Endpoints
router.get("/cms/packages", PackagesController.list);
router.post("/cms/packages", requireAuth, PackagesController.create);
router.put("/cms/packages/:id", requireAuth, PackagesController.update);
router.delete("/cms/packages/:id", requireAuth, PackagesController.delete);

// Email Infrastructure Endpoints
router.get("/email/status", requireAuth, EmailController.getStatus);
router.post("/email/test", requireAuth, EmailController.verifySmtpConnection);
router.post("/email/retry/:id", requireAuth, EmailController.retryMessage);
router.get("/email/queue", requireAuth, EmailController.getQueue);

// Communication Hub & Integrations Endpoints
router.get("/communication/status", requireAuth, CommunicationController.getStatus);
router.get("/communication/reviews", CommunicationController.getReviews); // Public reviews fetch for homepage
router.post("/communication/reviews/sync", requireAuth, CommunicationController.syncReviews); // Auth manual sync reviews
router.get("/communication/calendly/events", requireAuth, CommunicationController.getCalendlyEvents); // Fetch calendly bookings
router.post("/communication/whatsapp/test", requireAuth, CommunicationController.testWhatsApp); // Direct WhatsApp dispatch test
router.post("/communication/calendly/test", requireAuth, CommunicationController.testCalendly); // Simulated booking trigger

// Contact Form Router Endpoints (Public submissions)
router.post("/contact/submit", CommunicationController.submitContactForm);

export default router;
