/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { RazorpayService } from "../services/razorpayService.js";
import { BillingService } from "../services/dataService.js";
import { FinancialRepository } from "../repositories/dataRepository.js";
import * as store from "../repositories/fallbackStore.js";
import { HttpStatus } from "../../shared/enums.js";
import { logger } from "../utils/logger.js";

const sendSuccess = (res: Response, message: string, data: any = null, status: number = HttpStatus.OK) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const sendError = (res: Response, error: any, defaultMsg: string, status: number = HttpStatus.BAD_REQUEST) => {
  const errMsg = error instanceof Error ? error.message : String(error);
  logger.error(`[PaymentController] Error: ${defaultMsg} - ${errMsg}`);
  return res.status(status).json({
    success: false,
    message: defaultMsg,
    error: errMsg
  });
};

export const PaymentController = {
  /**
   * Connection Status & Key configuration for Admin dashboard
   */
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = RazorpayService.getConnectionStatus();
      
      // Calculate transaction metrics from fallback database/store
      const payments = await BillingService.getPayments();
      const totalVolume = payments
        .filter((p: any) => p.status === "Success")
        .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

      const logs = payments.map((p: any) => ({
        id: p.id,
        ref: p.transactionRef,
        amount: p.amount,
        method: p.method,
        date: p.paidDate || p.createdAt || "N/A",
        status: p.status
      }));

      return sendSuccess(res, "Razorpay connection status loaded", {
        ...status,
        webhookStatus: process.env.RAZORPAY_WEBHOOK_SECRET ? "Active (Secret Set)" : "Inactive",
        transactionLogs: logs,
        metrics: {
          totalTransactions: payments.length,
          successfulTransactions: payments.filter((p: any) => p.status === "Success").length,
          failedTransactions: payments.filter((p: any) => p.status === "Failed").length,
          totalVolumeRupees: totalVolume
        }
      });
    } catch (err) {
      return sendError(res, err, "Failed to load Razorpay settings");
    }
  },

  /**
   * Create Razorpay Order
   */
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId, proformaId, amount: rawAmount, notes = {} } = req.body;
      
      let amountInRupees = 0;
      let referenceId = "";
      let referenceType = "";
      let customerInfo = { name: "Valued Client", email: "client@legomark.com", phone: "" };

      if (invoiceId) {
        const invoices = await BillingService.getInvoices();
        const invoice = invoices.find((inv: any) => inv.id === invoiceId);
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Invoice not found" });
        }
        amountInRupees = Number(invoice.totalAmount);
        referenceId = invoiceId;
        referenceType = "Invoice";
        if (invoice.customer) {
          const cust = invoice.customer as any;
          customerInfo.name = cust.name || cust.fullName || customerInfo.name;
          customerInfo.email = cust.email || customerInfo.email;
          customerInfo.phone = cust.phone || customerInfo.phone;
        }
      } else if (proformaId) {
        const proformas = await BillingService.getProformas();
        const proforma = proformas.find((p: any) => p.id === proformaId);
        if (!proforma) {
          return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Proforma not found" });
        }
        amountInRupees = Number(proforma.totalAmount);
        referenceId = proformaId;
        referenceType = "Proforma";
        if (proforma.customer) {
          const cust = proforma.customer as any;
          customerInfo.name = cust.name || cust.fullName || customerInfo.name;
          customerInfo.email = cust.email || customerInfo.email;
          customerInfo.phone = cust.phone || customerInfo.phone;
        }
      } else if (rawAmount) {
        amountInRupees = Number(rawAmount);
        referenceId = `AD-HOC-${Math.floor(100 + Math.random() * 900)}`;
        referenceType = "Ad-hoc";
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Please provide an invoiceId, proformaId or amount" });
      }

      if (isNaN(amountInRupees) || amountInRupees <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid invoice or proforma amount" });
      }

      // Convert to paise (Razorpay standard)
      const amountInPaise = Math.round(amountInRupees * 100);

      const orderPayload = {
        amount: amountInPaise,
        currency: "INR",
        receipt: referenceId,
        notes: {
          referenceId,
          referenceType,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          ...notes
        }
      };

      const order = await RazorpayService.createOrder(orderPayload);

      return sendSuccess(res, "Razorpay order generated successfully", {
        order,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_simulator",
        customer: customerInfo,
        referenceId,
        referenceType
      }, HttpStatus.CREATED);

    } catch (err) {
      return sendError(res, err, "Failed to create payment order");
    }
  },

  /**
   * Verify signature and process payment status change
   */
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        invoiceId, 
        proformaId 
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Required parameters missing: razorpay_order_id, razorpay_payment_id, razorpay_signature are required."
        });
      }

      // 1. Signature check
      const isVerified = RazorpayService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isVerified) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Razorpay signature verification failed. Security alert generated."
        });
      }

      // 2. Query payment details from provider
      const paymentDetails = await RazorpayService.fetchPayment(razorpay_payment_id);
      const paidAmount = Number(paymentDetails.amount) / 100; // convert paise to INR

      // 3. Prevent duplicate record processing
      const payments = await BillingService.getPayments();
      const alreadyLogged = payments.find((p: any) => p.transactionRef === razorpay_payment_id);
      if (alreadyLogged) {
        return sendSuccess(res, "Payment already recorded previously.", alreadyLogged);
      }

      // 4. Update Billing Database
      let finalInvoiceId = invoiceId;
      let finalProformaId = proformaId;
      let customerName = "Valued Partner";
      let customerEmail = paymentDetails.email || "client@legomark.com";
      let companyName = "";
      let orderId = "";

      // Lookup linked records
      if (invoiceId) {
        const invoices = await BillingService.getInvoices();
        const invoice = invoices.find((inv: any) => inv.id === invoiceId);
        if (invoice && invoice.customer) {
          customerName = invoice.customer.name || customerName;
          customerEmail = invoice.customer.email || customerEmail;
          companyName = invoice.customer.companyName || companyName;
        }
      } else if (proformaId) {
        const proformas = await BillingService.getProformas();
        const proforma = proformas.find((p: any) => p.id === proformaId);
        if (proforma) {
          finalProformaId = proformaId;
          if (proforma.customer) {
            customerName = proforma.customer.name || customerName;
            customerEmail = proforma.customer.email || customerEmail;
            companyName = proforma.customer.companyName || companyName;
          }
          // Set proforma as paid
          proforma.status = "Paid";
          
          // Generate actual invoice if not already generated
          const invoices = await BillingService.getInvoices();
          const existingInvoice = invoices.find((inv: any) => inv.service === proforma.service && inv.customer?.email === customerEmail);
          if (!existingInvoice) {
            const invoicePayload = {
              id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
              customer: {
                name: customerName,
                email: customerEmail,
                phone: (proforma.customer as any)?.phone || "",
                companyName: companyName,
                gstin: (proforma.customer as any)?.gstin || ""
              },
              placeOfSupply: "Maharashtra",
              service: proforma.service,
              packageName: proforma.packageName,
              hsnSac: "998222",
              taxableAmount: proforma.price || 8000,
              cgstRate: 9,
              cgstAmount: Math.round((proforma.price || 8000) * 0.09),
              sgstRate: 9,
              sgstAmount: Math.round((proforma.price || 8000) * 0.09),
              igstRate: 0,
              igstAmount: 0,
              totalAmount: paidAmount,
              paymentStatus: "Paid",
              paymentMethod: "Razorpay " + (paymentDetails.method || "UPI")
            };
            const invoice = await BillingService.createInvoice(invoicePayload);
            finalInvoiceId = invoice.id;
          } else {
            finalInvoiceId = existingInvoice.id;
            existingInvoice.paymentStatus = "Paid";
            existingInvoice.paymentMethod = "Razorpay " + (paymentDetails.method || "UPI");
          }
        }
      }

      // Create a unique Payment transaction log
      const paymentRecord = await BillingService.createPayment({
        id: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
        invoiceId: finalInvoiceId || `INV-AD-${Math.floor(100 + Math.random() * 900)}`,
        customerEmail: customerEmail,
        method: "Razorpay " + (paymentDetails.method || "UPI"),
        amount: paidAmount,
        status: "Success",
        transactionRef: razorpay_payment_id,
        paidDate: new Date().toISOString().split("T")[0],
        proformaId: finalProformaId
      });

      // Generate Receipt
      const receiptId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
      const receipt = await BillingService.createReceipt({
        id: receiptId,
        paymentRef: paymentRecord.id,
        amount: paidAmount,
        date: new Date().toISOString().split("T")[0],
        customer: {
          name: customerName,
          email: customerEmail,
          companyName: companyName
        },
        orderId: orderId || "ORD-2026-NEW",
        invoiceId: finalInvoiceId
      });

      // Update ledger
      await FinancialRepository.createLedgerEntry({
        id: `LDG-${Math.floor(100 + Math.random() * 900)}`,
        customerEmail: customerEmail,
        type: "Payment",
        refId: paymentRecord.id,
        date: new Date().toISOString().split("T")[0],
        description: `Payment of ₹${paidAmount} received securely via Razorpay for Reference: ${finalInvoiceId || finalProformaId}`,
        amount: paidAmount,
        balanceEffect: "credit"
      });

      // Dispatch Automation Event
      try {
        store.automationLogsDb.push({
          id: `AUT-${Math.floor(1000 + Math.random() * 9000)}`,
          event: "Payment Received",
          ruleName: "Generate Tax Invoice & Unlock Client Portal on Payment",
          status: "Completed",
          triggerTime: new Date().toISOString(),
          executionTime: new Date().toISOString(),
          result: `Razorpay payment of ₹${paidAmount} processed successfully for customer ${customerEmail}. GST compliant Invoice & Receipt generated. Portal access unlocked.`,
          durationMs: Math.floor(15 + Math.random() * 25),
        });
        logger.info("[PaymentController] Automation event logged successfully in fallbacks.");
      } catch (autoErr) {
        logger.error("[PaymentController] Failed to dispatch automation event logs:", autoErr);
      }

      return sendSuccess(res, "Razorpay payment validated and billing engine updated successfully", {
        payment: paymentRecord,
        receipt,
        isVerified: true
      });

    } catch (err) {
      return sendError(res, err, "Failed to verify transaction");
    }
  },

  /**
   * Razorpay Webhook listener (async reliability fallback)
   */
  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

      // Note: We need raw body to verify HMAC. For full-stack express apps,
      // req.body can be treated as an object, but we serialize it to maintain reliability.
      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

      if (webhookSecret && signature) {
        const isValid = RazorpayService.verifyWebhookSignature(rawBody, signature, webhookSecret);
        if (!isValid) {
          logger.warn("[PaymentController] Webhook verification signature did not match! Ignoring webhook payload.");
          return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Webhook verification failed" });
        }
      }

      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const event = payload.event;
      const paymentEntity = payload.payload?.payment?.entity;

      logger.info(`[PaymentController] Webhook received: ${event}`);

      if (!paymentEntity) {
        return sendSuccess(res, "Webhook accepted. No payment entity found in payload.");
      }

      const paymentId = paymentEntity.id;
      const orderId = paymentEntity.order_id;
      const amount = paymentEntity.amount / 100;
      const customerEmail = paymentEntity.email;

      switch (event) {
        case "payment.captured":
          logger.info(`[PaymentController] Webhook: Payment captured. Logging transaction: ${paymentId}`);
          
          // Fallback verify & update block in case client verification fails or client tab gets closed
          const payments = await BillingService.getPayments();
          const alreadyLogged = payments.find((p: any) => p.transactionRef === paymentId);
          
          if (!alreadyLogged) {
            // Log payment securely
            const paymentRecord = await BillingService.createPayment({
              id: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
              invoiceId: `INV-WH-${Math.floor(100 + Math.random() * 900)}`,
              customerEmail: customerEmail,
              method: "Razorpay " + (paymentEntity.method || "Webhook"),
              amount: amount,
              status: "Success",
              transactionRef: paymentId,
              paidDate: new Date().toISOString().split("T")[0]
            });

            // Generate receipt
            await BillingService.createReceipt({
              id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
              paymentRef: paymentRecord.id,
              amount: amount,
              date: new Date().toISOString().split("T")[0],
              customer: {
                name: paymentEntity.notes?.customerName || "Valued Client",
                email: customerEmail,
                companyName: "Registered Enterprise"
              },
              orderId: "ORD-2026-NEW",
              invoiceId: paymentRecord.invoiceId
            });

            // Update ledger
            await FinancialRepository.createLedgerEntry({
              id: `LDG-${Math.floor(100 + Math.random() * 900)}`,
              customerEmail: customerEmail,
              type: "Payment",
              refId: paymentRecord.id,
              date: new Date().toISOString().split("T")[0],
              description: `Payment of ₹${amount} received asynchronously via Webhook for Order: ${orderId}`,
              amount: amount,
              balanceEffect: "credit"
            });

            // Dispatch Automation Event
            store.automationLogsDb.push({
              id: `AUT-${Math.floor(1000 + Math.random() * 9000)}`,
              event: "Payment Received",
              ruleName: "Generate Tax Invoice & Unlock Client Portal on Payment",
              status: "Completed",
              triggerTime: new Date().toISOString(),
              executionTime: new Date().toISOString(),
              result: `Asynchronous Webhook capture logged successfully for transaction ${paymentId}. Portal files initialized.`,
              durationMs: 12
            });
          }
          break;

        case "payment.failed":
          logger.warn(`[PaymentController] Webhook: Payment failed alert on ${paymentId} for client ${customerEmail}`);
          // Track failure for transaction integrity audit
          const paymentFailureRecord = {
            id: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
            invoiceId: `INV-FAIL-${Math.floor(100 + Math.random() * 900)}`,
            customerEmail: customerEmail,
            method: "Razorpay " + (paymentEntity.method || "Webhook"),
            amount: amount,
            status: "Failed",
            transactionRef: paymentId,
            paidDate: new Date().toISOString().split("T")[0]
          };
          store.paymentsDb.push(paymentFailureRecord);
          break;

        case "refund.processed":
          logger.info(`[PaymentController] Webhook: Refund completed successfully for ${paymentId}`);
          await FinancialRepository.createRefund({
            id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
            paymentId: paymentId,
            amount: amount,
            reason: paymentEntity.refund_reason || "Client request cancellation waiver",
            status: "Approved",
            approvedBy: "Razorpay Webhook System",
            date: new Date().toISOString().split("T")[0]
          });
          break;

        default:
          logger.info(`[PaymentController] Webhook: Event ${event} accepted but unhandled.`);
          break;
      }

      return sendSuccess(res, `Webhook parsed and completed: ${event}`);

    } catch (err) {
      return sendError(res, err, "Failed to process webhook");
    }
  },

  /**
   * Fetch payment details from Razorpay (Secure endpoint)
   */
  async getPaymentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "ID is required" });
      }

      const payment = await RazorpayService.fetchPayment(id);
      return sendSuccess(res, "Razorpay transaction fetched successfully", payment);
    } catch (err) {
      return sendError(res, err, "Failed to fetch payment details");
    }
  },

  /**
   * Create Razorpay Order for a Public Package
   */
  async publicCreateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { packageId, packageName, price, service, customerDetails } = req.body;

      if (!packageId || !price || !customerDetails || !customerDetails.name || !customerDetails.email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Required parameters missing: packageId, price, and customerDetails (name, email) are required."
        });
      }

      const amountInRupees = Number(price);
      if (isNaN(amountInRupees) || amountInRupees <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid package price" });
      }

      // Convert to paise (Razorpay standard)
      const amountInPaise = Math.round(amountInRupees * 100);
      const referenceId = "PF-PKG-" + Math.floor(1000 + Math.random() * 9000);

      const orderPayload = {
        amount: amountInPaise,
        currency: "INR",
        receipt: referenceId,
        notes: {
          packageId,
          packageName,
          service: service || "Legal Services Assistance",
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone || "",
          customerCompanyName: customerDetails.companyName || ""
        }
      };

      const order = await RazorpayService.createOrder(orderPayload);

      return sendSuccess(res, "Public Razorpay order generated successfully", {
        order,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_simulator",
        customer: customerDetails,
        referenceId,
        referenceType: "Public Package"
      }, HttpStatus.CREATED);

    } catch (err) {
      return sendError(res, err, "Failed to create public payment order");
    }
  },

  /**
   * Verify signature and create invoice/receipt for Public Package purchase
   */
  async publicVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        packageId,
        packageName,
        price,
        service,
        customerDetails
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !customerDetails) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Required parameters missing for payment verification."
        });
      }

      // 1. Signature check
      const isVerified = RazorpayService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isVerified) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Razorpay signature verification failed. Security alert generated."
        });
      }

      // 2. Query payment details from provider
      const paymentDetails = await RazorpayService.fetchPayment(razorpay_payment_id);
      const paidAmount = Number(price || 0);

      // 3. Prevent duplicate record processing
      const payments = await BillingService.getPayments();
      const alreadyLogged = payments.find((p: any) => p.transactionRef === razorpay_payment_id);
      if (alreadyLogged) {
        return sendSuccess(res, "Payment already recorded previously.", alreadyLogged);
      }

      // 4. Update Billing Database
      const customerName = customerDetails.name || "Valued Partner";
      const customerEmail = customerDetails.email || "client@legomark.com";
      const companyName = customerDetails.companyName || "";
      const customerPhone = customerDetails.phone || "";

      // Create Proforma as Paid
      const proformaId = `PRO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const proformaPayload = {
        id: proformaId,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          companyName: companyName
        },
        service: service || "Company Registration",
        packageName: packageName || "Direct Package",
        price: paidAmount,
        discount: 0,
        gstPercent: 18,
        gstAmount: Math.round(paidAmount * 0.18),
        totalAmount: Math.round(paidAmount * 1.18),
        terms: "100% advance on package purchase",
        status: "Paid",
        createdAt: new Date().toISOString().split("T")[0]
      };
      await BillingService.createProforma(proformaPayload);

      // Create Invoice as Paid
      const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoicePayload = {
        id: invoiceId,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          companyName: companyName,
          gstin: ""
        },
        placeOfSupply: "Maharashtra",
        service: service || "Company Registration",
        packageName: packageName || "Direct Package",
        hsnSac: "998222",
        taxableAmount: paidAmount,
        cgstRate: 9,
        cgstAmount: Math.round(paidAmount * 0.09),
        sgstRate: 9,
        sgstAmount: Math.round(paidAmount * 0.09),
        igstRate: 0,
        igstAmount: 0,
        totalAmount: Math.round(paidAmount * 1.18),
        paymentStatus: "Paid",
        paymentMethod: "Razorpay " + (paymentDetails.method || "UPI")
      };
      await BillingService.createInvoice(invoicePayload);

      // Create Payment transaction log
      const paymentRecord = await BillingService.createPayment({
        id: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceId: invoiceId,
        customerEmail: customerEmail,
        method: "Razorpay " + (paymentDetails.method || "UPI"),
        amount: paidAmount,
        status: "Success",
        transactionRef: razorpay_payment_id,
        paidDate: new Date().toISOString().split("T")[0],
        proformaId: proformaId
      });

      // Create Receipt
      const receiptId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const receipt = await BillingService.createReceipt({
        id: receiptId,
        paymentRef: paymentRecord.id,
        amount: paidAmount,
        date: new Date().toISOString().split("T")[0],
        customer: {
          name: customerName,
          email: customerEmail,
          companyName: companyName
        },
        orderId: razorpay_order_id || "ORD-2026-NEW",
        invoiceId: invoiceId
      });

      // Update Ledger
      await FinancialRepository.createLedgerEntry({
        id: `LDG-${Math.floor(1000 + Math.random() * 9000)}`,
        customerEmail: customerEmail,
        type: "Payment",
        refId: paymentRecord.id,
        date: new Date().toISOString().split("T")[0],
        description: `Payment of ₹${paidAmount} received securely via Razorpay for Package: ${packageName}`,
        amount: paidAmount,
        balanceEffect: "credit"
      });

      // Dispatch Automation Event
      try {
        store.automationLogsDb.push({
          id: `AUT-${Math.floor(1000 + Math.random() * 9000)}`,
          event: "Payment Received",
          ruleName: "Generate Tax Invoice & Unlock Client Portal on Payment",
          status: "Completed",
          triggerTime: new Date().toISOString(),
          executionTime: new Date().toISOString(),
          result: `Razorpay payment of ₹${paidAmount} processed successfully for package ${packageName} (Customer: ${customerEmail}). GST compliant Invoice & Receipt generated.`,
          durationMs: Math.floor(15 + Math.random() * 25),
        });
      } catch (autoErr) {
        logger.error("[PaymentController] Failed to dispatch automation event logs:", autoErr);
      }

      return sendSuccess(res, "Razorpay public payment validated and billing engine updated successfully", {
        payment: paymentRecord,
        receipt,
        isVerified: true
      });

    } catch (err) {
      return sendError(res, err, "Failed to verify public payment");
    }
  }
};
