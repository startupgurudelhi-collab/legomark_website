/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { logger } from "../utils/logger.js";

export interface CalendlyEventPayload {
  name: string;
  email: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  notes?: string;
  service?: string;
}

// In-memory bookings simulation cache to allow Admin and Client to interact in test mode
const simulatedBookings: any[] = [
  {
    id: "evt_sim_01",
    name: "Aarav Mehta",
    email: "aarav@mehtatech.com",
    startTime: "2026-06-29T10:00:00Z",
    endTime: "2026-06-29T10:30:00Z",
    notes: "Need help with Private Limited formation requirements in Mumbai.",
    service: "Company Incorporation",
    status: "active",
    calendlyUrl: "https://calendly.com/legomark/15min"
  },
  {
    id: "evt_sim_02",
    name: "Sunita Deshmukh",
    email: "sunita@deshmukhfoods.co",
    startTime: "2026-06-30T14:30:00Z",
    endTime: "2026-06-30T15:00:00Z",
    notes: "FSSAI compliance diagnostic callback.",
    service: "Filing & Compliance Service",
    status: "active",
    calendlyUrl: "https://calendly.com/legomark/15min"
  }
];

export const CalendlyService = {
  /**
   * Check connection status
   */
  getConnectionStatus() {
    const apiKey = process.env.CALENDLY_API_KEY || process.env.CALENDLY_PAT;
    const link = process.env.CALENDLY_LINK || "https://calendly.com/legomark/15min";
    return {
      isConfigured: !!apiKey,
      hasApiKey: !!apiKey,
      link,
      status: apiKey ? "Active" : "Simulation Active"
    };
  },

  /**
   * Fetch scheduled events / bookings
   */
  async fetchEvents(email?: string) {
    const isConfigured = this.getConnectionStatus().isConfigured;
    if (!isConfigured) {
      logger.info(`[CalendlyService] [SIMULATOR] Fetching events${email ? ` for ${email}` : ""}`);
      if (email) {
        return simulatedBookings.filter((b) => b.email.toLowerCase() === email.toLowerCase());
      }
      return simulatedBookings;
    }

    try {
      logger.info(`[CalendlyService] Call Calendly API V2 for events`);
      const apiKey = process.env.CALENDLY_API_KEY || process.env.CALENDLY_PAT;
      
      let url = "https://api.calendly.com/scheduled_events?count=20";
      if (email) {
        url += `&invitee_email=${encodeURIComponent(email)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Calendly API error");
      }
      return data.collection || [];
    } catch (err: any) {
      logger.error("[CalendlyService] Fetch events failed, falling back to simulator:", err);
      return email ? simulatedBookings.filter((b) => b.email.toLowerCase() === email.toLowerCase()) : simulatedBookings;
    }
  },

  /**
   * Create a simulated booking locally or send webhook registration mock
   */
  async createBooking(payload: CalendlyEventPayload) {
    logger.info(`[CalendlyService] Registering booking for ${payload.email}`);
    const newBooking = {
      id: `evt_sim_${Math.random().toString(36).substring(2, 10)}`,
      name: payload.name,
      email: payload.email,
      startTime: payload.startTime,
      endTime: payload.endTime,
      notes: payload.notes || "N/A",
      service: payload.service || "General Legal Consultation",
      status: "active",
      calendlyUrl: process.env.CALENDLY_LINK || "https://calendly.com/legomark/15min"
    };

    simulatedBookings.unshift(newBooking);
    return newBooking;
  },

  /**
   * Cancel an event
   */
  async cancelBooking(eventId: string, reason: string = "Cancelled by client request") {
    logger.info(`[CalendlyService] Cancelling booking ${eventId}`);
    const booking = simulatedBookings.find((b) => b.id === eventId);
    if (booking) {
      booking.status = "cancelled";
      booking.cancelReason = reason;
      return { success: true, booking };
    }

    const isConfigured = this.getConnectionStatus().isConfigured;
    if (isConfigured) {
      try {
        const apiKey = process.env.CALENDLY_API_KEY || process.env.CALENDLY_PAT;
        const response = await fetch(`https://api.calendly.com/scheduled_events/${eventId}/cancellation`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reason })
        });
        const data = await response.json();
        return { success: response.ok, data };
      } catch (err: any) {
        logger.error("[CalendlyService] Calendly cancellation call failed:", err);
      }
    }

    return { success: false, message: "Booking record not found in system state." };
  },

  /**
   * Reschedule an event
   */
  async rescheduleBooking(eventId: string, newStartTime: string, newEndTime: string) {
    logger.info(`[CalendlyService] Rescheduling booking ${eventId} to start: ${newStartTime}`);
    const booking = simulatedBookings.find((b) => b.id === eventId);
    if (booking) {
      booking.startTime = newStartTime;
      booking.endTime = newEndTime;
      booking.status = "rescheduled";
      return { success: true, booking };
    }
    return { success: false, message: "Booking record not found in simulation." };
  }
};
