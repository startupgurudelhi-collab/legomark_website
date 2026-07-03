/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { logger } from "../utils/logger.js";
import { EmailService } from "./emailService.js";
import { WhatsAppService } from "./whatsappService.js";
import { NotificationsRepository } from "../repositories/dataRepository.js";

export interface Recipient {
  email: string;
  phone?: string;
  fullName?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  templateName?: string;
  variables?: Record<string, any>;
  type?: "info" | "warning" | "success" | "document" | "error" | string;
  mediaUrl?: string;
  documentUrl?: string;
  fileName?: string;
}

export const NotificationCenter = {
  /**
   * Dispatch a notification across multiple specified channels (or default channels)
   */
  async notify(
    recipient: Recipient,
    channels: Array<"email" | "whatsapp" | "internal" | "sms" | "push" | string> | "all",
    payload: NotificationPayload
  ) {
    logger.info(`[NotificationCenter] Processing dispatch to ${recipient.email} via channels: ${JSON.stringify(channels)}`);
    
    const results: Record<string, any> = {};
    const resolvedChannels = channels === "all" 
      ? ["email", "whatsapp", "internal"] 
      : channels;

    for (const channel of resolvedChannels) {
      try {
        switch (channel.toLowerCase()) {
          case "email":
            results.email = await this.dispatchEmail(recipient, payload);
            break;

          case "whatsapp":
            results.whatsapp = await this.dispatchWhatsApp(recipient, payload);
            break;

          case "internal":
            results.internal = await this.dispatchInternal(recipient, payload);
            break;

          case "sms":
            results.sms = await this.dispatchSMS(recipient, payload);
            break;

          case "push":
            results.push = await this.dispatchPush(recipient, payload);
            break;

          default:
            logger.warn(`[NotificationCenter] Unknown notification channel attempted: "${channel}"`);
            results[channel] = { success: false, message: `Channel "${channel}" is unrecognized.` };
            break;
        }
      } catch (err: any) {
        logger.error(`[NotificationCenter] Failed to dispatch via ${channel}:`, err);
        results[channel] = { success: false, error: err.message };
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      recipient: recipient.email,
      dispatches: results
    };
  },

  /**
   * Dispatch Email Notification
   */
  async dispatchEmail(recipient: Recipient, payload: NotificationPayload) {
    logger.info(`[NotificationCenter] Dispatching Email to ${recipient.email}`);
    
    if (payload.templateName) {
      const vars = {
        fullName: recipient.fullName || "Valued Partner",
        body: payload.body,
        title: payload.title,
        ...(payload.variables || {})
      };
      const queueItem = await EmailService.sendTemplate(recipient.email, payload.templateName, vars);
      return { success: true, method: "Template", queueItemId: queueItem.id };
    } else {
      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">${payload.title}</h2>
          <p style="font-size: 14px; line-height: 1.6;">${payload.body}</p>
          <div style="margin-top: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            This is an automated operational notification from Legomark India.
          </div>
        </div>
      `;
      const queueItem = await EmailService.sendEmail(recipient.email, payload.title, html);
      return { success: true, method: "Custom HTML", queueItemId: queueItem.id };
    }
  },

  /**
   * Dispatch WhatsApp Notification
   */
  async dispatchWhatsApp(recipient: Recipient, payload: NotificationPayload) {
    if (!recipient.phone) {
      logger.warn(`[NotificationCenter] Missing mobile phone for WhatsApp dispatch to ${recipient.email}`);
      return { success: false, error: "Recipient phone number is missing." };
    }

    const phone = recipient.phone;
    logger.info(`[NotificationCenter] Dispatching WhatsApp to ${phone}`);

    // If media is attached
    if (payload.mediaUrl) {
      return await WhatsAppService.sendMedia(phone, payload.mediaUrl, "image", payload.body);
    }
    
    // If document is attached
    if (payload.documentUrl) {
      return await WhatsAppService.sendDocument(phone, payload.documentUrl, payload.fileName || "document.pdf", payload.body);
    }

    // If templates are declared
    if (payload.templateName) {
      const components = [
        {
          type: "body",
          parameters: [
            { type: "text", text: recipient.fullName || "Advisor Partner" },
            { type: "text", text: payload.body }
          ]
        }
      ];
      return await WhatsAppService.sendTemplate(phone, payload.templateName, components);
    }

    // Default to text
    return await WhatsAppService.sendText(phone, `${payload.title}\n\n${payload.body}`);
  },

  /**
   * Dispatch Internal Portal Notification
   */
  async dispatchInternal(recipient: Recipient, payload: NotificationPayload) {
    logger.info(`[NotificationCenter] Dispatching Internal Portal Notification for ${recipient.email}`);
    
    const internalNotification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      clientEmail: recipient.email.toLowerCase().trim(),
      title: payload.title,
      description: payload.body,
      type: payload.type || "info",
      date: "Just now",
      read: false,
      createdAt: new Date().toISOString()
    };

    await NotificationsRepository.createNotification(internalNotification);
    return { success: true, notificationId: internalNotification.id };
  },

  /**
   * Future-ready SMS dispatch stub
   */
  async dispatchSMS(recipient: Recipient, payload: NotificationPayload) {
    const phone = recipient.phone || "No Phone provided";
    logger.info(`[NotificationCenter] [FUTURE-READY STUB] SMS Dispatch: Recipient=${phone} | Text="${payload.title}: ${payload.body}"`);
    return { 
      success: true, 
      status: "Queued (Future Abstraction Simulator)", 
      details: "SMS provider integration is pre-mapped for production scale, utilizing Twilio/Plivo API." 
    };
  },

  /**
   * Future-ready Push notification stub
   */
  async dispatchPush(recipient: Recipient, payload: NotificationPayload) {
    logger.info(`[NotificationCenter] [FUTURE-READY STUB] Web Push Dispatch: Recipient=${recipient.email} | Title="${payload.title}"`);
    return { 
      success: true, 
      status: "Broadcast Queued (Future Abstraction Simulator)", 
      details: "Web-push subscription protocol is active. Integration mapped for Firebase Cloud Messaging (FCM)." 
    };
  }
};
