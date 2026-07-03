/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRepository, LeadRepository, OrderRepository, BlogRepository, TaskRepository, FinancialRepository, SupportRepository, NotificationsRepository, CmsConfigRepository } from "../repositories/dataRepository.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";
import { EmailService } from "./emailService.js";

// ==========================================
// AUTHENTICATION SERVICE
// ==========================================
export const AuthService = {
  async register(email: string, fullName: string, passwordHash: string, role: string = "CLIENT") {
    logger.info(`[Authentication] Register attempt for ${email}`);
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error("A user with this email address already exists.");
    }
    const id = `usr-${role.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
    const user = await UserRepository.create({
      id,
      email: email.toLowerCase().trim(),
      fullName,
      passwordHash,
      role
    });

    // Centralized email triggers
    try {
      await EmailService.sendTemplate(user.email, "Welcome Email", {
        fullName: user.fullName,
        clientEmail: user.email,
        dashboardUrl: "https://legomark.com/client-portal"
      });

      await EmailService.sendTemplate(user.email, "Email Verification", {
        fullName: user.fullName,
        verificationCode: `LM-${Math.floor(10000 + Math.random() * 90000)}`,
        verifyUrl: "https://legomark.com/verify-email"
      });
    } catch (err) {
      logger.error("[AuthService] Email dispatch failed upon registration:", err);
    }

    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  },

  async login(email: string, unhashedPass: string) {
    logger.info(`[Authentication] Login attempt for ${email}`);
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      logger.warn(`[Authentication] Login failed: user not found for ${email}`);
      throw new Error("Invalid email or password.");
    }

    // Since our fallback uses a placeholder hash for safety, we allow simple fallback matches
    const isMockHash = user.passwordHash.includes("placeholder_hash");
    let isValid = false;
    if (isMockHash) {
      isValid = unhashedPass.length >= 6; // Simple safe check for mock users
    } else {
      isValid = await comparePassword(unhashedPass, user.passwordHash);
    }

    if (!isValid) {
      logger.warn(`[Authentication] Login failed: incorrect password for ${email}`);
      throw new Error("Invalid email or password.");
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const token = generateToken(tokenPayload);

    logger.info(`[Authentication] Login successful for user ${user.id} (${user.role})`);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
};

// ==========================================
// LEADS SERVICE
// ==========================================
export const LeadsService = {
  async listAll() {
    return LeadRepository.getAll();
  },

  async create(leadData: any) {
    logger.info(`[Leads] Creating new lead for ${leadData.email}`);
    const id = leadData.id || `lead-${Math.random().toString(36).substring(2, 8)}`;
    const freshLead = {
      id,
      status: "New",
      date: new Date().toISOString().split("T")[0],
      attachments: [],
      notesHistory: [],
      statusHistory: [],
      followUpHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      ...leadData
    };
    const savedLead = await LeadRepository.create(freshLead);

    // Queue lead confirmation notification email
    if (savedLead.email) {
      try {
        await EmailService.sendTemplate(savedLead.email, "Lead Confirmation", {
          fullName: savedLead.fullName || savedLead.clientName || "Lead Partner",
          service: savedLead.service || "Company Incorporation",
          phone: savedLead.phone || "N/A"
        });
      } catch (err) {
        logger.error("[LeadsService] Lead confirmation email queue failed:", err);
      }
    }

    return savedLead;
  },

  async update(id: string, updates: any) {
    logger.info(`[Leads] Updating lead ${id}`);
    updates.updatedAt = new Date();
    return LeadRepository.update(id, updates);
  },

  async addNote(id: string, author: string, noteText: string) {
    const lead = await LeadRepository.findById(id);
    if (!lead) throw new Error("Lead not found");
    const notesHistory = lead.notesHistory ? (typeof lead.notesHistory === "string" ? JSON.parse(lead.notesHistory) : lead.notesHistory) : [];
    const newNote = {
      id: `note-${Math.random().toString(36).substring(2, 6)}`,
      author,
      note: noteText,
      date: new Date().toISOString().split("T")[0]
    };
    notesHistory.push(newNote);
    return LeadRepository.update(id, { notesHistory, updatedAt: new Date() });
  },

  async changeStatus(id: string, fromStatus: string, toStatus: string, updatedBy: string) {
    const lead = await LeadRepository.findById(id);
    if (!lead) throw new Error("Lead not found");
    const statusHistory = lead.statusHistory ? (typeof lead.statusHistory === "string" ? JSON.parse(lead.statusHistory) : lead.statusHistory) : [];
    const log = {
      id: `sh-${Math.random().toString(36).substring(2, 6)}`,
      fromStatus,
      toStatus,
      updatedBy,
      date: new Date().toISOString().split("T")[0]
    };
    statusHistory.push(log);
    return LeadRepository.update(id, { status: toStatus, statusHistory, updatedAt: new Date() });
  }
};

// ==========================================
// ORDERS SERVICE
// ==========================================
export const OrdersService = {
  async listAll() {
    return OrderRepository.getAll();
  },

  async create(orderData: any) {
    logger.info(`[Orders] Initializing order for ${orderData.customer?.email || orderData.customerEmail}`);
    const id = orderData.id || `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const freshOrder = {
      id,
      paymentStatus: "Pending",
      serviceStatus: "Documents Pending",
      attachments: [],
      notesHistory: [],
      statusHistory: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      isDeleted: false,
      ...orderData
    };
    const saved = await OrderRepository.create(freshOrder);
    logger.info(`[Orders] Order ${id} created successfully.`);
    return saved;
  },

  async update(id: string, updates: any) {
    logger.info(`[Orders] Modifying order ${id}`);
    updates.updatedAt = new Date().toISOString().split("T")[0];
    return OrderRepository.update(id, updates);
  },

  async changeStatus(id: string, fromStatus: string, toStatus: string, updatedBy: string) {
    logger.info(`[Workflow] Processing state transition for Order ${id}: ${fromStatus} -> ${toStatus}`);
    const order = await OrderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    const statusHistory = order.statusHistory ? (typeof order.statusHistory === "string" ? JSON.parse(order.statusHistory) : order.statusHistory) : [];
    const log = {
      id: `sh-${Math.random().toString(36).substring(2, 6)}`,
      fromStatus,
      toStatus,
      updatedBy,
      date: new Date().toISOString().split("T")[0]
    };
    statusHistory.push(log);
    const updatedOrder = await OrderRepository.update(id, { serviceStatus: toStatus, statusHistory, updatedAt: new Date().toISOString().split("T")[0] });

    // Centralized notification triggers
    const recipientEmail = order.customerEmail || order.clientEmail || order.email || (order.customer && typeof order.customer === "object" && order.customer.email);
    if (recipientEmail) {
      try {
        const clientName = order.customerName || order.clientName || order.fullName || (order.customer && typeof order.customer === "object" && order.customer.fullName) || "Valued Founder";
        
        if (toStatus === "Completed") {
          await EmailService.sendTemplate(recipientEmail, "Order Completed", {
            fullName: clientName,
            service: order.serviceName || order.service || "Filing & Compliance Service",
            companyName: order.companyName || "Your Registered Enterprise"
          });
        } else {
          await EmailService.sendTemplate(recipientEmail, "Workflow Status Update", {
            fullName: clientName,
            orderId: id,
            fromStatus,
            toStatus,
            statusNotes: `State transitioned successfully by ${updatedBy}.`
          });
        }
      } catch (err) {
        logger.error("[OrdersService] Failed to dispatch workflow update email:", err);
      }
    }

    return updatedOrder;
  }
};

// ==========================================
// TASKS SERVICE
// ==========================================
export const TasksService = {
  async listAll() {
    return TaskRepository.getAll();
  },

  async create(taskData: any) {
    logger.info(`[Workflow] Initializing task "${taskData.taskName}" for order ${taskData.orderId}`);
    const id = taskData.id || `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const freshTask = {
      id,
      status: "Pending",
      documentChecklist: [],
      comments: [],
      activityLog: [
        { id: `act-${Math.random().toString(36).substring(2, 6)}`, action: "Task Created", description: "Task initialized by service layer.", timestamp: new Date().toISOString(), performedBy: "System" }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      ...taskData
    };
    const savedTask = await TaskRepository.create(freshTask);

    // Queue task assignment notification email
    const recipientEmail = savedTask.assigneeEmail || savedTask.assignedToEmail || savedTask.assignedTo || savedTask.email;
    if (recipientEmail && typeof recipientEmail === "string" && recipientEmail.includes("@")) {
      try {
        await EmailService.sendTemplate(recipientEmail, "Task Assigned", {
          orderId: savedTask.orderId || "N/A",
          taskName: savedTask.taskName || "General Compliance Verification",
          dueDate: savedTask.dueDate || "As Appointed",
          description: savedTask.description || "Verification and validation of client filings and registrars requirements."
        });
      } catch (err) {
        logger.error("[TasksService] Failed to queue task assignment notification email:", err);
      }
    }

    return savedTask;
  },

  async update(id: string, updates: any) {
    logger.info(`[Workflow] Updating Task details for ${id}`);
    updates.updatedAt = new Date();
    return TaskRepository.update(id, updates);
  },

  async addComment(id: string, author: string, commentText: string) {
    const task = await TaskRepository.findById(id);
    if (!task) throw new Error("Task not found");
    const comments = task.comments ? (typeof task.comments === "string" ? JSON.parse(task.comments) : task.comments) : [];
    comments.push({
      id: `c-${Math.random().toString(36).substring(2, 6)}`,
      author,
      comment: commentText,
      timestamp: new Date().toISOString()
    });
    return TaskRepository.update(id, { comments, updatedAt: new Date() });
  }
};

// ==========================================
// BLOGS SERVICE
// ==========================================
export const BlogsService = {
  async listAll() {
    return BlogRepository.getAll();
  },
  async create(blogData: any) {
    const id = blogData.id || `blog-${Math.random().toString(36).substring(2, 8)}`;
    const freshBlog = { id, status: "Draft", createdAt: new Date().toISOString().split("T")[0], isDeleted: false, ...blogData };
    return BlogRepository.create(freshBlog);
  },
  async update(id: string, updates: any) {
    return BlogRepository.update(id, updates);
  },
  async delete(id: string) {
    return BlogRepository.delete(id);
  }
};

// ==========================================
// BILLING / FINANCE SERVICE
// ==========================================
export const BillingService = {
  async getQuotations() { return FinancialRepository.getQuotations(); },
  async getProformas() { return FinancialRepository.getProformas(); },
  async getInvoices() { return FinancialRepository.getInvoices(); },
  async getPayments() { return FinancialRepository.getPayments(); },
  async getReceipts() { return FinancialRepository.getReceipts(); },
  async getRefunds() { return FinancialRepository.getRefunds(); },
  async getCreditNotes() { return FinancialRepository.getCreditNotes(); },
  async getLedger() { return FinancialRepository.getLedger(); },

  async createQuotation(data: any) {
    const id = data.id || `QT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const record = { id, createdAt: new Date().toISOString().split("T")[0], status: "Draft", ...data };
    const saved = await FinancialRepository.createQuotation(record);

    const recipient = record.customerEmail || record.email;
    if (recipient && typeof recipient === "string" && recipient.includes("@")) {
      try {
        await EmailService.sendTemplate(recipient, "Quotation", {
          id,
          fullName: record.customerName || "Founder",
          service: record.service || "Corporate Legal Drafting",
          packageName: record.packageName || "Standard Plan",
          price: record.price || "₹5,000",
          gstAmount: record.gstAmount || "₹900",
          totalAmount: record.totalAmount || "₹5,900",
          validUntil: record.validUntil || "Next 30 Days",
          actionUrl: "https://legomark.com/client-portal"
        });
      } catch (err) {
        logger.error("[BillingService] Failed to queue quotation email:", err);
      }
    }
    return saved;
  },
  async createProforma(data: any) {
    const id = data.id || `PRO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const record = { id, createdAt: new Date().toISOString().split("T")[0], status: "Sent", ...data };
    const saved = await FinancialRepository.createProforma(record);

    const recipient = record.customerEmail || record.email;
    if (recipient && typeof recipient === "string" && recipient.includes("@")) {
      try {
        await EmailService.sendTemplate(recipient, "Proforma Invoice", {
          id,
          fullName: record.customerName || "Founder",
          service: record.service || "Company Incorporation Filing Surcharges",
          totalAmount: record.totalAmount || "₹11,800",
          paymentUrl: "https://legomark.com/client-portal/billing"
        });
      } catch (err) {
        logger.error("[BillingService] Failed to queue proforma email:", err);
      }
    }
    return saved;
  },
  async createInvoice(data: any) {
    logger.info(`[Payments] Preparing Tax Invoice for ${data.customer?.email || data.customerEmail}`);
    const id = data.id || `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const record = { id, invoiceDate: new Date().toISOString().split("T")[0], paymentStatus: "Unpaid", ...data };
    const saved = await FinancialRepository.createInvoice(record);

    const recipient = record.customerEmail || record.email || (record.customer && record.customer.email);
    if (recipient && typeof recipient === "string" && recipient.includes("@")) {
      try {
        await EmailService.sendTemplate(recipient, "Tax Invoice", {
          id,
          fullName: record.customerName || (record.customer && record.customer.fullName) || "Founder",
          invoiceDate: record.invoiceDate,
          gstin: record.customerGst || record.gstin || "N/A (Consumer)",
          taxableAmount: record.amount || "₹10,000",
          gstAmount: record.gstAmount || "₹1,800",
          totalAmount: record.totalAmount || "₹11,800",
          invoiceUrl: "https://legomark.com/client-portal/billing"
        });
      } catch (err) {
        logger.error("[BillingService] Failed to queue tax invoice email:", err);
      }
    }
    return saved;
  },
  async createPayment(data: any) {
    logger.info(`[Payments] Logging successful payment trans: ${data.transactionRef}`);
    const id = data.id || `PAY-2026-${Math.floor(100 + Math.random() * 900)}`;
    const record = { id, paidDate: new Date().toISOString().split("T")[0], status: "Success", ...data };
    await FinancialRepository.createPayment(record);
    // Auto-update Invoice to paid
    await FinancialRepository.updateInvoiceStatus(data.invoiceId, "Paid", data.method);

    const recipient = record.customerEmail || record.email;
    if (recipient && typeof recipient === "string" && recipient.includes("@")) {
      try {
        await EmailService.sendTemplate(recipient, "Payment Confirmation", {
          id: record.receiptId || `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
          fullName: record.customerName || "Founder",
          transactionRef: record.transactionRef || "UTR-99931",
          amount: record.amount || "₹11,800",
          method: record.method || "Razorpay UPI"
        });
      } catch (err) {
        logger.error("[BillingService] Failed to queue payment confirmation email:", err);
      }
    }
    return record;
  },
  async createReceipt(data: any) {
    const id = data.id || `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const record = { id, date: new Date().toISOString().split("T")[0], ...data };
    return FinancialRepository.createReceipt(record);
  }
};

// ==========================================
// SUPPORT TICKETS SERVICE
// ==========================================
export const SupportService = {
  async getTickets() {
    return SupportRepository.getTickets();
  },
  async getTicketsByClient(email: string) {
    return SupportRepository.getTicketsByEmail(email);
  },
  async createTicket(data: any) {
    const id = data.id || `TCK-${Math.floor(100 + Math.random() * 900)}`;
    const record = { id, status: "Open", messages: [], ...data };
    return SupportRepository.createTicket(record);
  },
  async replyTicket(id: string, sender: string, text: string) {
    const ticket = await SupportRepository.updateTicket(id, {});
    if (!ticket) throw new Error("Ticket not found");
    const messages = ticket.messages ? (typeof ticket.messages === "string" ? JSON.parse(ticket.messages) : ticket.messages) : [];
    messages.push({
      sender,
      text,
      timestamp: new Date().toISOString().split("T")[0]
    });
    const updatedTicket = await SupportRepository.updateTicket(id, { messages });

    // Queue support ticket reply email notification
    if (ticket.clientEmail) {
      try {
        await EmailService.sendTemplate(ticket.clientEmail, "Support Ticket Reply", {
          id,
          fullName: (ticket as any).clientName || "Valued Client",
          subject: ticket.subject || "Filing & Surcharge Query",
          senderName: sender,
          replyText: text
        });
      } catch (err) {
        logger.error("[SupportService] Failed to queue ticket reply notification email:", err);
      }
    }

    return updatedTicket;
  }
};

// ==========================================
// SYSTEM CONFIG & CMS SERVICE
// ==========================================
export const CmsConfigService = {
  async getCmsData() {
    const homepage = await CmsConfigRepository.getHomepage();
    const contact = await CmsConfigRepository.getContact();
    const settings = await CmsConfigRepository.getSettings();
    const media = await CmsConfigRepository.getMedia();
    const testimonials = await CmsConfigRepository.getTestimonials();
    const logos = await CmsConfigRepository.getLogos();
    const faqs = await CmsConfigRepository.getFaqs();
    return { homepage, contact, settings, media, testimonials, logos, faqs };
  },

  async updateHomepage(updates: any) {
    logger.info(`[Automation] Static homepage layouts updated.`);
    return CmsConfigRepository.updateHomepage(updates);
  },
  async updateContact(updates: any) {
    return CmsConfigRepository.updateContact(updates);
  },
  async updateSettings(updates: any) {
    return CmsConfigRepository.updateSettings(updates);
  },
  async updateTestimonials(list: any[]) {
    return CmsConfigRepository.updateTestimonials(list);
  },
  async updateLogos(list: any[]) {
    return CmsConfigRepository.updateLogos(list);
  },
  async updateFaqs(list: any[]) {
    return CmsConfigRepository.updateFaqs(list);
  },
  async addMediaFile(name: string, folder: string, size: string, url: string, type: "image" | "document" | "other" = "document") {
    const file = {
      id: `media-${Math.random().toString(36).substring(2, 8)}`,
      name,
      folder,
      size,
      url,
      type,
      createdAt: new Date().toISOString().split("T")[0]
    };
    return CmsConfigRepository.addMedia(file);
  }
};
