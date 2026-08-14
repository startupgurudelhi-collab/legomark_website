/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";
import { 
  LeadsService, 
  OrdersService, 
  TasksService, 
  BlogsService, 
  BillingService, 
  SupportService, 
  CmsConfigService,
  PackagesService
} from "../services/dataService.js";
import { logger } from "../utils/logger.js";

// Helper to handle standardized success response
const sendSuccess = (res: Response, message: string, data: any = null, status: number = HttpStatus.OK) => {
  const response: ApiResponse = { success: true, message, data };
  return res.status(status).json(response);
};

// Helper to handle standardized error response
const sendError = (res: Response, error: any, defaultMsg: string, status: number = HttpStatus.BAD_REQUEST) => {
  const message = error instanceof Error ? error.message : defaultMsg;
  const response: ApiResponse = { success: false, message, errors: [String(error)] };
  return res.status(status).json(response);
};

// ==========================================
// LEADS CONTROLLER
// ==========================================
export const LeadsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const leads = await LeadsService.listAll();
      return sendSuccess(res, "Leads retrieved successfully", leads);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve leads");
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await LeadsService.create(req.body);
      return sendSuccess(res, "Lead created successfully", lead, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to create lead");
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await LeadsService.update(id, req.body);
      return sendSuccess(res, "Lead updated successfully", updated);
    } catch (err) {
      return sendError(res, err, "Failed to update lead");
    }
  },

  async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { author, note } = req.body;
      const updated = await LeadsService.addNote(id, author, note);
      return sendSuccess(res, "Note added to lead", updated);
    } catch (err) {
      return sendError(res, err, "Failed to add note to lead");
    }
  },

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fromStatus, toStatus, updatedBy } = req.body;
      const updated = await LeadsService.changeStatus(id, fromStatus, toStatus, updatedBy);
      return sendSuccess(res, "Lead status updated", updated);
    } catch (err) {
      return sendError(res, err, "Failed to update lead status");
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await LeadsService.delete(id);
      return sendSuccess(res, "Lead deleted successfully");
    } catch (err) {
      return sendError(res, err, "Failed to delete lead");
    }
  }
};

// ==========================================
// ORDERS CONTROLLER
// ==========================================
export const OrdersController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrdersService.listAll();
      return sendSuccess(res, "Orders retrieved successfully", orders);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve orders");
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrdersService.create(req.body);
      return sendSuccess(res, "Order placed successfully", order, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to place order");
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await OrdersService.update(id, req.body);
      return sendSuccess(res, "Order updated successfully", updated);
    } catch (err) {
      return sendError(res, err, "Failed to update order");
    }
  },

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fromStatus, toStatus, updatedBy } = req.body;
      const updated = await OrdersService.changeStatus(id, fromStatus, toStatus, updatedBy);
      return sendSuccess(res, "Order state transition successful", updated);
    } catch (err) {
      return sendError(res, err, "Failed to transition order state");
    }
  }
};

// ==========================================
// TASKS CONTROLLER
// ==========================================
export const TasksController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await TasksService.listAll();
      return sendSuccess(res, "Tasks retrieved successfully", tasks);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve tasks");
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TasksService.create(req.body);
      return sendSuccess(res, "Task created successfully", task, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to create task");
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await TasksService.update(id, req.body);
      return sendSuccess(res, "Task updated successfully", updated);
    } catch (err) {
      return sendError(res, err, "Failed to update task");
    }
  },

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { author, comment } = req.body;
      const updated = await TasksService.addComment(id, author, comment);
      return sendSuccess(res, "Comment added to task", updated);
    } catch (err) {
      return sendError(res, err, "Failed to add comment");
    }
  }
};

// ==========================================
// BLOGS CONTROLLER
// ==========================================
export const BlogsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await BlogsService.listAll();
      return sendSuccess(res, "Blogs retrieved successfully", blogs);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve blogs");
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await BlogsService.create(req.body);
      return sendSuccess(res, "Blog post created", blog, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to create blog post");
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await BlogsService.update(id, req.body);
      return sendSuccess(res, "Blog post updated", updated);
    } catch (err) {
      return sendError(res, err, "Failed to update blog post");
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await BlogsService.delete(id);
      return sendSuccess(res, "Blog post deleted successfully");
    } catch (err) {
      return sendError(res, err, "Failed to delete blog post");
    }
  }
};

// ==========================================
// BILLING / FINANCE CONTROLLER
// ==========================================
export const BillingController = {
  async listDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        quotations,
        proformas,
        invoices,
        payments,
        receipts,
        refunds,
        creditNotes,
        ledger
      ] = await Promise.all([
        BillingService.getQuotations(),
        BillingService.getProformas(),
        BillingService.getInvoices(),
        BillingService.getPayments(),
        BillingService.getReceipts(),
        BillingService.getRefunds(),
        BillingService.getCreditNotes(),
        BillingService.getLedger()
      ]);

      return sendSuccess(res, "Financial dashboard retrieved", {
        quotations,
        proformas,
        invoices,
        payments,
        receipts,
        refunds,
        creditNotes,
        ledger
      });
    } catch (err) {
      return sendError(res, err, "Failed to retrieve billing dashboard");
    }
  },

  async createQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await BillingService.createQuotation(req.body);
      return sendSuccess(res, "Quotation created successfully", data, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to create quotation");
    }
  },

  async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await BillingService.createInvoice(req.body);
      return sendSuccess(res, "Invoice generated successfully", data, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to generate invoice");
    }
  },

  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await BillingService.createPayment(req.body);
      return sendSuccess(res, "Payment logged successfully", data, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to log payment transaction");
    }
  },

  async createReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await BillingService.createReceipt(req.body);
      return sendSuccess(res, "Receipt generated successfully", data, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to generate receipt");
    }
  }
};

// ==========================================
// SUPPORT TICKETS CONTROLLER
// ==========================================
export const SupportController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await SupportService.getTickets();
      return sendSuccess(res, "Support tickets retrieved", tickets);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve support tickets");
    }
  },

  async listByClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const tickets = await SupportService.getTicketsByClient(email);
      return sendSuccess(res, "Client support tickets retrieved", tickets);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve tickets");
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await SupportService.createTicket(req.body);
      return sendSuccess(res, "Ticket raised successfully", ticket, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to raise support ticket");
    }
  },

  async reply(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sender, text } = req.body;
      const updated = await SupportService.replyTicket(id, sender, text);
      return sendSuccess(res, "Reply logged on ticket", updated);
    } catch (err) {
      return sendError(res, err, "Failed to submit support ticket reply");
    }
  }
};

// ==========================================
// CMS / CONFIG CONTROLLER
// ==========================================
export const CmsConfigController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.getCmsData();
      return sendSuccess(res, "System configs and CMS pages loaded", data);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve system configurations");
    }
  },

  async getTestimonials(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.getTestimonialsOnly();
      return sendSuccess(res, "Testimonials loaded successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve testimonials");
    }
  },

  async updateHomepage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateHomepage(req.body);
      return sendSuccess(res, "Homepage layouts saved successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update homepage CMS");
    }
  },

  async updateContact(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateContact(req.body);
      return sendSuccess(res, "Corporate contact information updated", data);
    } catch (err) {
      return sendError(res, err, "Failed to save contact configurations");
    }
  },

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateSettings(req.body);
      return sendSuccess(res, "Global application parameters updated", data);
    } catch (err) {
      return sendError(res, err, "Failed to update system settings");
    }
  },

  async updateTestimonials(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateTestimonials(req.body);
      return sendSuccess(res, "Testimonials saved successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update testimonials CMS");
    }
  },

  async updateLogos(req: Request, res: Response, next: NextFunction) {
    try {
      const list = req.body;
      const data = await CmsConfigService.updateLogos(list);
      return sendSuccess(res, "Client logos saved successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update client logos CMS");
    }
  },

  async updateFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateFaqs(req.body);
      return sendSuccess(res, "FAQs saved successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update FAQs CMS");
    }
  },

  async updateMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateMediaList(req.body);
      return sendSuccess(res, "Media library updated successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update media library");
    }
  },

  async updateNavigation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateNavigation(req.body);
      return sendSuccess(res, "Header & navigation menu updated successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update navigation menu");
    }
  },

  async updateServices(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateServices(req.body);
      return sendSuccess(res, "Services catalog saved successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update services catalog");
    }
  },

  async updateCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CmsConfigService.updateCategories(req.body);
      return sendSuccess(res, "Service categories saved successfully", data);
    } catch (err) {
      return sendError(res, err, "Failed to update service categories");
    }
  },

  async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, folder, size, url, type } = req.body;
      const file = await CmsConfigService.addMediaFile(name, folder, size, url, type);
      return sendSuccess(res, "Media asset cataloged successfully", file, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to upload and index media asset");
    }
  },

  async uploadVideoFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "No video file provided" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      return sendSuccess(res, "Video uploaded successfully", { url: fileUrl, filename: req.file.filename });
    } catch (err) {
      return sendError(res, err, "Failed to upload video file");
    }
  },

  async uploadThumbnailFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "No thumbnail file provided" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      return sendSuccess(res, "Thumbnail uploaded successfully", { url: fileUrl, filename: req.file.filename });
    } catch (err) {
      return sendError(res, err, "Failed to upload thumbnail file");
    }
  }
};

// ==========================================
// PACKAGES CMS CONTROLLER
// ==========================================
export const PackagesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pkgs = await PackagesService.listAll();
      return sendSuccess(res, "Packages retrieved successfully", pkgs);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve packages");
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pkg = await PackagesService.create(req.body);
      return sendSuccess(res, "Package created successfully", pkg, HttpStatus.CREATED);
    } catch (err) {
      return sendError(res, err, "Failed to create package");
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await PackagesService.update(id, req.body);
      return sendSuccess(res, "Package updated successfully", updated);
    } catch (err) {
      return sendError(res, err, "Failed to update package");
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await PackagesService.delete(id);
      return sendSuccess(res, "Package deleted successfully");
    } catch (err) {
      return sendError(res, err, "Failed to delete package");
    }
  }
};

