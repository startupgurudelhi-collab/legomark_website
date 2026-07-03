/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import nodemailer from "nodemailer";
import { EmailRepository } from "../repositories/dataRepository.js";
import { EmailTemplates } from "../utils/emailTemplates.js";
import { logger } from "../utils/logger.js";

// ==========================================
// PROVIDER ABSTRACTION INTERFACES
// ==========================================
export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content?: string | Buffer; path?: string }[];
}

export interface EmailProvider {
  name: string;
  send(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: any }>;
  testConnection(): Promise<{ success: boolean; error?: any }>;
}

// ==========================================
// SMTP IMPLEMENTATION
// ==========================================
class SmtpProvider implements EmailProvider {
  name = "Nodemailer SMTP Provider";

  private getTransporter() {
    const host = process.env.SMTP_HOST || "smtp.sendgrid.net";
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASSWORD || "";

    // If credentials are completely missing, we return null so the system falls back gracefully
    if (!user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // True for 465, false for others
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false // Avoid SSL handshake blockages in dev sandboxes
      }
    });
  }

  async send(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: any }> {
    const transporter = this.getTransporter();
    const from = process.env.SMTP_FROM || "info@legomarkindia.com";

    if (!transporter) {
      logger.warn(`[SMTP Provider] Credentials are not configured. Running dry-run logging for: To: ${payload.to}, Subject: ${payload.subject}`);
      return { success: true, messageId: `mock-msg-${Math.random().toString(36).substring(2, 9)}` };
    }

    try {
      const info = await transporter.sendMail({
        from: `Legomark India <${from}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        attachments: payload.attachments,
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      logger.error("[SMTP Provider] Failed to transmit email via SMTP:", err);
      return { success: false, error: err.message || err };
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: any }> {
    const transporter = this.getTransporter();
    if (!transporter) {
      return { success: false, error: "SMTP credentials are not configured in environment variables." };
    }
    try {
      await transporter.verify();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || err };
    }
  }
}

// ==========================================
// MOCK FALLBACK PROVIDER FOR LOCAL STABILITY
// ==========================================
class MockProvider implements EmailProvider {
  name = "Dry-Run Simulator Provider";
  async send(payload: EmailPayload) {
    logger.info(`[Mock Email Simulator] Dispatched email to: ${payload.to} | Subject: ${payload.subject}`);
    return { success: true, messageId: `simulator-${Math.random().toString(36).substring(2, 10)}` };
  }
  async testConnection() {
    return { success: true };
  }
}

// ==========================================
// EMAIL SERVICE ENGINE
// ==========================================
export const EmailService = {
  // Configured provider. Easily swappable later
  provider: new SmtpProvider() as EmailProvider,

  /**
   * Set provider dynamically if needed (part of provider abstraction)
   */
  setProvider(newProvider: EmailProvider) {
    this.provider = newProvider;
    logger.info(`[EmailService] Switched email dispatch provider to: ${newProvider.name}`);
  },

  /**
   * Send arbitrary HTML email
   */
  async sendEmail(to: string, subject: string, html: string, attachments?: any[]) {
    logger.info(`[EmailService] Enqueuing email to ${to} | Subject: ${subject}`);
    
    // Create record in the database queue as "Pending"
    const queueItem = await EmailRepository.create({
      recipient: to,
      subject,
      templateName: "Custom Plain Email",
      variables: {},
      status: "Pending",
      attempts: 0,
      attachments
    });

    // Process the queue asynchronously
    this.processQueue().catch((err) => {
      logger.error("[EmailService] Error processing background queue:", err);
    });

    return queueItem;
  },

  /**
   * Send modular email based on pre-defined templates with dynamic placeholder replacements
   */
  async sendTemplate(to: string, templateName: string, variables: Record<string, any>, attachments?: any[]) {
    logger.info(`[EmailService] Enqueuing template "${templateName}" for ${to}`);
    const template = EmailTemplates[templateName];
    if (!template) {
      const errMsg = `Template "${templateName}" is not registered in Legomark Email Infrastructure.`;
      logger.error(errMsg);
      throw new Error(errMsg);
    }

    // Dynamic subject compilation
    let subject = template.subject;
    for (const [key, val] of Object.entries(variables)) {
      subject = subject.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), String(val));
    }

    const html = template.generateHtml(variables);

    const queueItem = await EmailRepository.create({
      recipient: to,
      subject,
      templateName,
      variables,
      status: "Pending",
      attempts: 0,
      attachments
    });

    // Run queue execution non-blocking
    this.processQueue().catch((err) => {
      logger.error("[EmailService] Error processing background queue:", err);
    });

    return queueItem;
  },

  /**
   * Send an email with dynamic attachments (handles both path-based files or custom text/buffers)
   */
  async sendAttachment(to: string, subject: string, bodyText: string, filename: string, content: string | Buffer) {
    logger.info(`[EmailService] Enqueuing email with attachment ${filename} to ${to}`);
    
    const queueItem = await EmailRepository.create({
      recipient: to,
      subject,
      templateName: "Attachment Dispatch",
      variables: { bodyText },
      status: "Pending",
      attempts: 0,
      attachments: [{ filename, content }]
    });

    this.processQueue().catch((err) => {
      logger.error("[EmailService] Error processing background queue:", err);
    });

    return queueItem;
  },

  /**
   * Process all queued messages (Pending, Retry) up to max retry attempts
   */
  async processQueue() {
    const queue = await EmailRepository.getAll();
    const activeItems = queue.filter(
      (item) => item.status === "Pending" || item.status === "Retry"
    );

    if (activeItems.length === 0) return;

    logger.info(`[Email Queue] Processing ${activeItems.length} active jobs...`);

    for (const item of activeItems) {
      // Mark as sending to lock from race conditions
      await EmailRepository.update(item.id, {
        status: "Sending",
        lastAttemptAt: new Date().toISOString()
      });

      // Prepare attachment formatting
      const formattedAttachments = item.attachments?.map((att: any) => ({
        filename: att.filename,
        content: att.content,
        path: att.path
      }));

      // Render custom html if "Custom Plain Email" or "Attachment Dispatch"
      let htmlContent = "";
      if (item.templateName === "Custom Plain Email") {
        htmlContent = `<p>${item.subject}</p>`;
      } else if (item.templateName === "Attachment Dispatch") {
        htmlContent = `<p>${item.variables.bodyText || "Please find the requested file attached below."}</p>`;
      } else {
        const template = EmailTemplates[item.templateName];
        if (template) {
          htmlContent = template.generateHtml(item.variables);
        } else {
          htmlContent = `<p>${item.subject}</p>`;
        }
      }

      logger.info(`[Email Queue] Transporting item ${item.id} (Attempt ${item.attempts + 1}) to ${item.recipient}`);

      const result = await this.provider.send({
        to: item.recipient,
        subject: item.subject,
        html: htmlContent,
        attachments: formattedAttachments
      });

      const nextAttemptCount = item.attempts + 1;

      if (result.success) {
        logger.info(`[Email Queue] Success: Item ${item.id} delivered. MessageID: ${result.messageId}`);
        await EmailRepository.update(item.id, {
          status: "Delivered",
          attempts: nextAttemptCount,
          error: undefined
        });
      } else {
        const failureReason = result.error || "Unknown transport connection failure";
        logger.warn(`[Email Queue] Attempt failed for ${item.id}: ${failureReason}`);

        if (nextAttemptCount < 3) {
          // Change back to Retry state
          await EmailRepository.update(item.id, {
            status: "Retry",
            attempts: nextAttemptCount,
            error: failureReason
          });
        } else {
          // Exceeded threshold - fail completely
          logger.error(`[Email Queue] Max retries exhausted for ${item.id}. Job failed permanently.`);
          await EmailRepository.update(item.id, {
            status: "Failed",
            attempts: nextAttemptCount,
            error: `Max retry limit reached. Last error: ${failureReason}`
          });
        }
      }
    }
  },

  /**
   * Run connection verify test against configured SMTP credentials
   */
  async testActiveSmtp() {
    logger.info("[EmailService] Running live SMTP verify diagnostics...");
    return this.provider.testConnection();
  }
};
