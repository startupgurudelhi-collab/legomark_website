/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { WhatsAppService } from "../services/whatsappService.js";
import { CalendlyService } from "../services/calendlyService.js";
import { GoogleReviewService } from "../services/googleReviewService.js";
import { NotificationCenter } from "../services/notificationCenter.js";
import { LeadsService } from "../services/dataService.js";
import * as store from "../repositories/fallbackStore.js";
import { logger } from "../utils/logger.js";

const sendSuccess = (res: Response, message: string, data: any = null) => {
  return res.status(200).json({ success: true, message, data });
};

const sendError = (res: Response, error: any, defaultMsg: string) => {
  const message = error instanceof Error ? error.message : defaultMsg;
  return res.status(400).json({ success: false, message, errors: [String(error)] });
};

export const CommunicationController = {
  /**
   * GET /api/communication/status
   * Fetch all integration statuses for Admin settings
   */
  async getStatus(req: Request, res: Response) {
    try {
      const whatsapp = WhatsAppService.getConnectionStatus();
      const calendly = CalendlyService.getConnectionStatus();
      const googleReviews = GoogleReviewService.getConnectionStatus();

      const status = {
        whatsapp,
        calendly,
        googleReviews,
        contactRouting: {
          isConfigured: true,
          handlers: ["General Contact", "Free Consultation", "Service Enquiry", "Callback Request", "Career Application"],
          status: "Fully Routed"
        }
      };

      return sendSuccess(res, "Communication hub statuses retrieved", status);
    } catch (err) {
      return sendError(res, err, "Failed to retrieve communication statuses");
    }
  },

  /**
   * GET /api/communication/reviews
   * Public endpoint to get cached Google reviews for homepage display safely
   */
  async getReviews(req: Request, res: Response) {
    try {
      const summary = await GoogleReviewService.getReviews(false);
      return sendSuccess(res, "Google reviews fetched", summary);
    } catch (err) {
      return sendError(res, err, "Failed to fetch Google reviews");
    }
  },

  /**
   * POST /api/communication/reviews/sync
   * Authenticated endpoint to force refresh Google reviews
   */
  async syncReviews(req: Request, res: Response) {
    try {
      const summary = await GoogleReviewService.getReviews(true);
      
      // Log automation event
      store.automationLogsDb.push({
        id: `AUT-${Math.floor(1000 + Math.random() * 9000)}`,
        event: "Google Reviews Synced",
        ruleName: "Update Homepage Social Proof",
        status: "Completed",
        triggerTime: new Date().toISOString(),
        executionTime: new Date().toISOString(),
        result: `Successfully synchronized reviews with Google Places. Average rating: ${summary.averageRating} (${summary.totalReviews} total reviews). Source: ${summary.source}`,
        durationMs: Math.floor(10 + Math.random() * 15)
      });

      return sendSuccess(res, "Google reviews synchronized successfully", summary);
    } catch (err) {
      return sendError(res, err, "Failed to force sync Google reviews");
    }
  },

  /**
   * GET /api/communication/calendly/events
   * Authenticated endpoint to get Calendly bookings
   */
  async getCalendlyEvents(req: Request, res: Response) {
    try {
      const email = req.query.email as string | undefined;
      const events = await CalendlyService.fetchEvents(email);
      return sendSuccess(res, "Calendly events retrieved", events);
    } catch (err) {
      return sendError(res, err, "Failed to fetch Calendly events");
    }
  },

  /**
   * POST /api/communication/whatsapp/test
   * Authenticated endpoint to send test message
   */
  async testWhatsApp(req: Request, res: Response) {
    try {
      const { phone, text, type } = req.body;
      if (!phone) {
        return sendError(res, new Error("Phone number is required"), "Validation failed");
      }

      let result;
      const cleanPhone = phone.trim();

      if (type === "template") {
        result = await WhatsAppService.sendTemplate(cleanPhone, "hello_world", []);
      } else if (type === "document") {
        result = await WhatsAppService.sendDocument(cleanPhone, "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "Legomark_Tax_Guide.pdf", "Your tax compliance receipt");
      } else if (type === "media") {
        result = await WhatsAppService.sendMedia(cleanPhone, "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80", "image", "Legomark Advisory Board");
      } else {
        result = await WhatsAppService.sendText(cleanPhone, text || "Hello! This is a secure operational alert from Legomark India Communication Hub.");
      }

      // Log automation event
      store.automationLogsDb.push({
        id: `AUT-${Math.floor(1000 + Math.random() * 9000)}`,
        event: "Manual WhatsApp Dispatch",
        ruleName: "Direct WhatsApp Message Test",
        status: "Completed",
        triggerTime: new Date().toISOString(),
        executionTime: new Date().toISOString(),
        result: `Test WhatsApp message type: [${type || "text"}] sent to ${cleanPhone}. Message ID: ${result.messageId}. Mode: ${result.simulated ? "Simulator" : "Live API"}`,
        durationMs: Math.floor(5 + Math.random() * 10)
      });

      return sendSuccess(res, "WhatsApp message dispatched successfully", result);
    } catch (err) {
      return sendError(res, err, "Failed to send WhatsApp test");
    }
  },

  /**
   * POST /api/communication/calendly/test
   * Authenticated endpoint to generate simulated booking
   */
  async testCalendly(req: Request, res: Response) {
    try {
      const { name, email, service, notes } = req.body;
      if (!name || !email) {
        return sendError(res, new Error("Name and email are required"), "Validation failed");
      }

      const startTime = new Date();
      startTime.setDate(startTime.getDate() + 1); // tomorrow
      startTime.setHours(11, 0, 0, 0);
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 mins later

      const booking = await CalendlyService.createBooking({
        name,
        email,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: notes || "Simulated 15-min Business Setup Consultation",
        service: service || "Company Incorporation"
      });

      // Log automation event
      store.automationLogsDb.push({
        id: `AUT-${Math.floor(1000 + Math.random() * 9000)}`,
        event: "Calendly Booking Created",
        ruleName: "Sync Advisory Schedule & Create Lead",
        status: "Completed",
        triggerTime: new Date().toISOString(),
        executionTime: new Date().toISOString(),
        result: `New booking synchronized from Calendly event for client ${email} (${name}). Service: ${booking.service}. Scheduled: ${new Date(booking.startTime).toLocaleDateString()} at ${new Date(booking.startTime).toLocaleTimeString()}`,
        durationMs: Math.floor(12 + Math.random() * 18)
      });

      // Dispatch Notifications through Notification Center
      await NotificationCenter.notify(
        { email, fullName: name },
        ["email", "internal"],
        {
          title: "Consultation Call Confirmed",
          body: `Hi ${name}, your 15-minute consultation on "${booking.service}" has been scheduled for ${new Date(booking.startTime).toLocaleString()}. An expert CA advisor will contact you at this time.`,
          type: "info"
        }
      );

      return sendSuccess(res, "Simulated booking event registered", booking);
    } catch (err) {
      return sendError(res, err, "Failed to create simulated booking");
    }
  },

  /**
   * POST /api/contact/submit
   * Centralized Contact Form Router
   */
  async submitContactForm(req: Request, res: Response) {
    try {
      let { formType, name, email, phone, companyName, message, service, additionalInfo } = req.body;
      
      const parsedFormType = formType || "Website Inquiry";
      const parsedPhone = (phone || "").trim();
      
      if (!parsedPhone) {
        return res.status(400).json({
          success: false,
          message: "Required field is missing: phone",
          fields: { formType, name, email, phone }
        });
      }

      const parsedName = (name || "").trim() || "Anonymous Visitor";
      const parsedEmail = (email || "").trim().toLowerCase() || `visitor-${parsedPhone.replace(/[^0-9]/g, "") || Math.floor(Math.random() * 1000000)}@legomarkindia.com`;
      const parsedService = service || (parsedFormType === "Career Application" ? "Careers / HR Inquiry" : "Free Consultation");
      const parsedSource = parsedFormType;

      logger.info(`[ContactFormRouter] Received "${parsedFormType}" submission from ${parsedEmail} (${parsedName})`);

      // 1. Create Lead in the system
      const leadData = {
        name: parsedName,
        clientName: parsedName, // For backward compatibility if other places refer to clientName
        email: parsedEmail,
        phone: parsedPhone,
        companyName: companyName || "",
        service: parsedService,
        notes: message || additionalInfo || `Form submitted via ${parsedFormType}`,
        source: parsedSource
      };

      const createdLead = await LeadsService.create(leadData);

      // 2. Dispatch Automation Event
      const automationId = `AUT-${Math.floor(1000 + Math.random() * 9000)}`;
      const ruleName = parsedFormType === "Career Application" ? "Process HR Profile Pipeline" : "Route Website Inquiry & Alert Advisor";
      
      store.automationLogsDb.push({
        id: automationId,
        event: "Website Form Submitted",
        ruleName,
        status: "Completed",
        triggerTime: new Date().toISOString(),
        executionTime: new Date().toISOString(),
        result: `Central contact router captured form [${parsedFormType}] for ${parsedEmail}. Generated Lead ID: ${createdLead.id}. Routed notifications to both user and regional corporate managers.`,
        durationMs: Math.floor(20 + Math.random() * 30)
      });

      // 3. Queue Emails and Dispatch Notifications via Notification Center
      // Client Notification
      await NotificationCenter.notify(
        { email: parsedEmail, phone: parsedPhone, fullName: parsedName },
        ["email", "internal", "whatsapp"],
        {
          title: `Acknowledgement: ${parsedFormType}`,
          body: `Hi ${parsedName}, we have successfully received your "${parsedFormType}" submission. Our legal support desk has registered Lead ticket reference #${createdLead.id}. An advisor will review your corporate profile and reach out shortly.`,
          type: "success"
        }
      );

      // Admin Notification Alert
      const adminEmail = process.env.SMTP_FROM || "info@legomarkindia.com";
      await NotificationCenter.notify(
        { email: adminEmail },
        ["email", "internal"],
        {
          title: `🚨 Alert: New ${parsedFormType}`,
          body: `A new submission of type "${parsedFormType}" was completed. Client Name: ${parsedName}, Email: ${parsedEmail}, Phone: ${parsedPhone}, Message: ${message || "No message provided."}`,
          type: "warning"
        }
      );

      return sendSuccess(res, "Form submission successfully processed and routed", {
        leadId: createdLead.id,
        automationId
      });
    } catch (err) {
      return sendError(res, err, "Failed to route form submission");
    }
  }
};
