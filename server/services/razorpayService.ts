/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Razorpay from "razorpay";
import crypto from "crypto";
import { logger } from "../utils/logger.js";

let razorpayInstance: any = null;

/**
 * Lazy initialization of Razorpay SDK to prevent server crash when environment keys are missing.
 */
function getRazorpayInstance(): any {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!keyId || !keySecret) {
      logger.warn("[RazorpayService] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured. Falling back to simulator mode.");
      return null;
    }

    try {
      razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      logger.info("[RazorpayService] Razorpay client initialized successfully.");
    } catch (err) {
      logger.error("[RazorpayService] Failed to initialize Razorpay SDK:", err);
      return null;
    }
  }
  return razorpayInstance;
}

export interface RazorpayOrderPayload {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export const RazorpayService = {
  /**
   * Check connection status
   */
  getConnectionStatus() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    return {
      isConfigured: !!(keyId && keySecret),
      keyId: keyId ? `${keyId.substring(0, 8)}...` : "Missing",
      hasSecret: !!keySecret,
      mode: process.env.NODE_ENV === "production" ? "Production" : "Test Mode"
    };
  },

  /**
   * Create an order in Razorpay
   */
  async createOrder(payload: RazorpayOrderPayload) {
    const instance = getRazorpayInstance();
    if (!instance) {
      logger.info("[RazorpayService] [SIMULATOR] Creating simulated Razorpay order.");
      // Create a mock order structure for developer/test flow stability
      const mockOrderId = `order_sim_${Math.random().toString(36).substring(2, 10)}`;
      return {
        id: mockOrderId,
        entity: "order",
        amount: payload.amount,
        amount_paid: 0,
        amount_due: payload.amount,
        currency: payload.currency || "INR",
        receipt: payload.receipt,
        status: "created",
        attempts: 0,
        notes: payload.notes || {},
        created_at: Math.floor(Date.now() / 1000),
        is_simulated: true,
      };
    }

    try {
      logger.info(`[RazorpayService] Calling Razorpay API to create order for receipt ${payload.receipt}`);
      const order = await instance.orders.create({
        amount: payload.amount,
        currency: payload.currency || "INR",
        receipt: payload.receipt,
        notes: payload.notes || {},
      });
      return order;
    } catch (err: any) {
      logger.error("[RazorpayService] Failed to create Razorpay order:", err);
      throw new Error(err.message || "Failed to create Razorpay order");
    }
  },

  /**
   * Verify the payment signature sent by Razorpay client side
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    if (!keySecret) {
      logger.warn("[RazorpayService] Missing secret key. Assuming signature valid in simulation mode.");
      return orderId.startsWith("order_sim_");
    }

    try {
      const generated = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(generated, "utf-8"),
        Buffer.from(signature, "utf-8")
      );

      logger.info(`[RazorpayService] Payment signature verification result: ${isValid}`);
      return isValid;
    } catch (err) {
      logger.error("[RazorpayService] Signature verification exception:", err);
      return false;
    }
  },

  /**
   * Retrieve a payment from Razorpay
   */
  async fetchPayment(paymentId: string) {
    const instance = getRazorpayInstance();
    if (!instance || paymentId.startsWith("pay_sim_")) {
      logger.info(`[RazorpayService] [SIMULATOR] Fetching simulated payment info for ${paymentId}`);
      return {
        id: paymentId,
        entity: "payment",
        amount: 1180000,
        currency: "INR",
        status: "captured",
        order_id: "order_sim_12345",
        invoice_id: null,
        international: false,
        method: "upi",
        amount_refunded: 0,
        refund_status: null,
        captured: true,
        description: "Simulated payment",
        card_id: null,
        bank: null,
        wallet: null,
        vpa: "success@razorpay",
        email: "founder@legomark.com",
        contact: "+919999999999",
        notes: {},
        fee: 236,
        tax: 36,
        error_code: null,
        error_description: null,
        created_at: Math.floor(Date.now() / 1000)
      };
    }

    try {
      const payment = await instance.payments.fetch(paymentId);
      return payment;
    } catch (err: any) {
      logger.error(`[RazorpayService] Failed to fetch payment info for ${paymentId}:`, err);
      throw new Error(err.message || "Failed to fetch payment from Razorpay");
    }
  },

  /**
   * Capture a payment
   */
  async capturePayment(paymentId: string, amount: number, currency: string = "INR") {
    const instance = getRazorpayInstance();
    if (!instance || paymentId.startsWith("pay_sim_")) {
      logger.info(`[RazorpayService] [SIMULATOR] Capturing simulated payment ${paymentId} for amount ${amount}`);
      return { id: paymentId, status: "captured", amount, currency };
    }

    try {
      const payment = await instance.payments.capture(paymentId, amount, currency);
      return payment;
    } catch (err: any) {
      logger.error(`[RazorpayService] Failed to capture payment ${paymentId}:`, err);
      throw new Error(err.message || "Failed to capture payment in Razorpay");
    }
  },

  /**
   * Refund a payment (architecture stub)
   */
  async refundPayment(paymentId: string, amount?: number, notes?: any) {
    const instance = getRazorpayInstance();
    if (!instance || paymentId.startsWith("pay_sim_")) {
      logger.info(`[RazorpayService] [SIMULATOR] Refunding simulated payment ${paymentId}`);
      return {
        id: `rfnd_sim_${Math.random().toString(36).substring(2, 10)}`,
        entity: "refund",
        amount: amount || 1180000,
        currency: "INR",
        payment_id: paymentId,
        notes: notes || {},
        status: "processed",
        created_at: Math.floor(Date.now() / 1000)
      };
    }

    try {
      const refundOptions: any = {};
      if (amount) refundOptions.amount = amount;
      if (notes) refundOptions.notes = notes;

      const refund = await instance.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (err: any) {
      logger.error(`[RazorpayService] Failed to issue refund for payment ${paymentId}:`, err);
      throw new Error(err.message || "Failed to initiate refund in Razorpay");
    }
  },

  /**
   * Verify signature of Webhook requests
   */
  verifyWebhookSignature(rawBody: string, signature: string, webhookSecret: string): boolean {
    if (!webhookSecret) {
      logger.warn("[RazorpayService] No webhook secret configured. Accepting webhook for development.");
      return true;
    }

    try {
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(expected, "utf-8"),
        Buffer.from(signature, "utf-8")
      );

      logger.info(`[RazorpayService] Webhook signature verification result: ${isValid}`);
      return isValid;
    } catch (err) {
      logger.error("[RazorpayService] Webhook signature verification failed:", err);
      return false;
    }
  }
};
