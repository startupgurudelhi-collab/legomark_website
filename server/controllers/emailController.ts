/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";
import { EmailService } from "../services/emailService.js";
import { EmailRepository } from "../repositories/dataRepository.js";
import { logger } from "../utils/logger.js";

// Helper for success responses
const sendSuccess = (res: Response, message: string, data: any = null, status: number = HttpStatus.OK) => {
  const response: ApiResponse = { success: true, message, data };
  return res.status(status).json(response);
};

// Helper for error responses
const sendError = (res: Response, error: any, defaultMsg: string, status: number = HttpStatus.BAD_REQUEST) => {
  const message = error instanceof Error ? error.message : defaultMsg;
  const response: ApiResponse = { success: false, message, errors: [String(error)] };
  return res.status(status).json(response);
};

export const EmailController = {
  /**
   * Fetch current SMTP metadata, masked config parameters, and queue aggregate counters
   */
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const queue = await EmailRepository.getAll();
      
      // Calculate real-time queue states
      const stats = {
        total: queue.length,
        pending: queue.filter(q => q.status === "Pending").length,
        sending: queue.filter(q => q.status === "Sending").length,
        delivered: queue.filter(q => q.status === "Delivered").length,
        failed: queue.filter(q => q.status === "Failed").length,
        retry: queue.filter(q => q.status === "Retry").length,
      };

      // Retrieve and mask SMTP settings securely (never send passwords to client)
      const smtpConfig = {
        host: process.env.SMTP_HOST || "smtp.sendgrid.net",
        port: process.env.SMTP_PORT || "587",
        user: process.env.SMTP_USER || "Unconfigured",
        from: process.env.SMTP_FROM || "info@legomarkindia.com",
        isConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
        providerName: EmailService.provider.name
      };

      return sendSuccess(res, "Email infrastructure status loaded", {
        stats,
        smtpConfig,
        recentLogs: queue.slice(-30).reverse() // Show last 30 items in reverse chronological order
      });
    } catch (err) {
      logger.error("[EmailController] Failed to compile infrastructure status:", err);
      return sendError(res, err, "Failed to retrieve email systems status");
    }
  },

  /**
   * Run connection verify diagnostics against the active SMTP provider
   */
  async verifySmtpConnection(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("[EmailController] Triggering on-demand SMTP validation test...");
      const verifyResult = await EmailService.testActiveSmtp();
      
      if (verifyResult.success) {
        return sendSuccess(res, "SMTP handshake validation successful! SMTP pipeline is fully active.");
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: "SMTP handshake failed. Please verify SMTP Host, Port, or Credentials in environment.",
          errors: [verifyResult.error]
        });
      }
    } catch (err) {
      logger.error("[EmailController] Connection test crashed:", err);
      return sendError(res, err, "SMTP diagnostics crashed during execution.");
    }
  },

  /**
   * Force manual retry of a Failed or Retry status queue item
   */
  async retryMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.info(`[EmailController] Manual retry requested for item ${id}`);
      
      const item = await EmailRepository.update(id, {
        status: "Pending",
        attempts: 0,
        error: undefined
      });

      if (!item) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Enqueued email record not found."
        });
      }

      // Re-trigger the processing queue in a non-blocking background thread
      EmailService.processQueue().catch((err) => {
        logger.error("[EmailController] Background retry thread crashed:", err);
      });

      return sendSuccess(res, `Enqueued email ${id} set to Pending and queued for re-delivery.`, item);
    } catch (err) {
      logger.error("[EmailController] Retry registration failed:", err);
      return sendError(res, err, "Failed to initiate manual retry.");
    }
  },

  /**
   * Fetch full outbound email list
   */
  async getQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const queue = await EmailRepository.getAll();
      return sendSuccess(res, "Email outbound queue fetched successfully", queue);
    } catch (err) {
      return sendError(res, err, "Failed to fetch email queue list");
    }
  }
};
