/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Centered branding container that applies consistent Legomark India corporate identity
 */
export function wrapInCorporateBranding(title: string, bodyContent: string, ctaHtml: string = ""): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      color: #1e293b;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #0f172a; /* Deep Navy */
      padding: 30px 40px;
      text-align: center;
      border-bottom: 4px solid #d97706; /* Warm Amber Accent */
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0;
    }
    .header p {
      color: #94a3b8;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 5px 0 0 0;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    .content h2 {
      color: #0f172a;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 15px;
      color: #475569;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      background-color: #f8fafc;
      border-radius: 8px;
      overflow: hidden;
    }
    .data-table th {
      background-color: #f1f5f9;
      text-align: left;
      padding: 12px 16px;
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #334155;
      border-bottom: 1px solid #e2e8f0;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      font-weight: 600;
      font-size: 15px;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);
      transition: background-color 0.2s ease;
    }
    .btn:hover {
      background-color: #1e293b;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
    }
    .footer p {
      margin: 4px 0;
    }
    .footer a {
      color: #0f172a;
      text-decoration: underline;
    }
    .badge {
      display: inline-block;
      background-color: #fef3c7;
      color: #d97706;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>LEGOMARK INDIA</h1>
        <p>Legal Meets Speed</p>
      </div>
      <div class="content">
        ${bodyContent}
        ${ctaHtml ? `<div class="cta-container">${ctaHtml}</div>` : ""}
        
        <p style="margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #475569;">
          Best regards,<br>
          <strong>Legomark India Legal Operations</strong><br>
          <span style="font-size: 12px; color: #64748b;">Automated Service Infrastructure</span>
        </p>
      </div>
      <div class="footer">
        <p><strong>Legomark India LLP</strong></p>
        <p>D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025</p>
        <p>Support Hotline: +91 75308 47878, 011-45768289 | Email: info@legomarkindia.com</p>
        <p style="margin-top: 15px; font-size: 11px; color: #94a3b8;">
          This is an automated transmission from the Legomark India Compliance System. 
          Please do not reply directly to this mail.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Dictionary of templates with subject definitions and HTML generation helpers
 */
export const EmailTemplates: Record<
  string,
  {
    subject: string;
    generateHtml: (vars: Record<string, any>) => string;
  }
> = {
  "Welcome Email": {
    subject: "Welcome to Legomark India - Your Smart Corporate Filing Partner!",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Welcome to Legomark",
        `
        <div class="badge">Registration Confirmed</div>
        <h2>Dear ${vars.fullName || "Valued Client"},</h2>
        <p>Thank you for choosing <strong>Legomark India</strong> as your corporate filing and tax compliance partner. We are excited to support you in building your business empire.</p>
        <p>With your Legomark account, you can initiate company incorporations, request corporate legal drafts, apply for GST certificates, and track your ongoing compliance items in real-time.</p>
        <p>To access your dashboard and start uploading corporate documents, click the link below.</p>
        `,
        `<a href="${vars.dashboardUrl || "https://legomark.com/client-portal"}" class="btn">Launch Client Portal</a>`
      )
  },

  "Email Verification": {
    subject: "Verify Your Legomark India Account",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Email Verification Required",
        `
        <h2>Account Verification</h2>
        <p>Dear ${vars.fullName || "User"},</p>
        <p>Welcome to Legomark India! Please verify your email address to secure your account and activate your legal filing pipelines.</p>
        <p>To verify your email, please use the following security token or click the button below:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">
          ${vars.verificationCode || "LM-88931"}
        </div>
        <p>This verification token is valid for 24 hours.</p>
        `,
        `<a href="${vars.verifyUrl || "https://legomark.com/verify-email"}" class="btn">Verify Email Address</a>`
      )
  },

  "Password Reset": {
    subject: "Password Reset Request - Legomark India",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Password Reset",
        `
        <h2>Reset Your Password</h2>
        <p>Hello ${vars.fullName || "User"},</p>
        <p>We received a request to reset the password associated with your Legomark corporate account.</p>
        <p>If you made this request, please click the secure link below to choose a new password. If you did not initiate this request, you can safely ignore this email; your account remains secure.</p>
        <p>This link will remain active for 1 hour for your security.</p>
        `,
        `<a href="${vars.resetUrl || "https://legomark.com/reset-password"}" class="btn">Reset Password Securely</a>`
      )
  },

  "Lead Confirmation": {
    subject: "We Have Received Your Legal Consultation Request!",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Consultation Request Received",
        `
        <div class="badge">Lead Registered</div>
        <h2>Thank you, ${vars.fullName || "Client"}!</h2>
        <p>Your inquiry regarding <strong>${vars.service || "Company Incorporation"}</strong> has been logged in our smart routing engine.</p>
        <p>A Chartered Accountant (CA) or corporate filing expert is reviewing your details and will get back to you within 2 business hours.</p>
        <p><strong>Your Submission Summary:</strong></p>
        <table class="data-table">
          <tr>
            <th>Full Name</th>
            <td>${vars.fullName || "N/A"}</td>
          </tr>
          <tr>
            <th>Requested Service</th>
            <td>${vars.service || "General Incorporation"}</td>
          </tr>
          <tr>
            <th>Primary Phone</th>
            <td>${vars.phone || "N/A"}</td>
          </tr>
        </table>
        `
      )
  },

  "Consultation Booking": {
    subject: "Confirmed: Your Compliance Strategy Session with Legomark",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Consultation Confirmed",
        `
        <div class="badge">Session Confirmed</div>
        <h2>Corporate Strategy Session</h2>
        <p>Hello ${vars.fullName || "Valued Client"},</p>
        <p>Your consultation booking with Legomark India's senior legal advisors has been successfully scheduled.</p>
        <table class="data-table">
          <tr>
            <th>Advisor</th>
            <td>${vars.advisorName || "Senior Corporate Counsel"}</td>
          </tr>
          <tr>
            <th>Date & Time</th>
            <td>${vars.dateTime || "As Scheduled"}</td>
          </tr>
          <tr>
            <th>Meeting Link</th>
            <td><a href="${vars.meetingUrl || "#"}" style="color: #d97706; font-weight: 600;">Join Video Conference</a></td>
          </tr>
        </table>
        <p>Please prepare your soft copies of Director PAN and Address proofs beforehand so we can expedite your filing review during the call.</p>
        `,
        `<a href="${vars.meetingUrl || "#"}" class="btn">Join Strategy Session</a>`
      )
  },

  "Quotation": {
    subject: "Quotation Generated - ${id}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Commercial Quotation",
        `
        <div class="badge">Commercial Proposal</div>
        <h2>Quotation ${vars.id || "QT-2026"}</h2>
        <p>Dear ${vars.fullName || "Client"},</p>
        <p>We are pleased to submit our commercial quotation for the requested corporate filing services. Please find the cost breakdown details below:</p>
        <table class="data-table">
          <thead>
            <tr>
              <th>Service Item Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${vars.service || "Filing Assistance"} - ${vars.packageName || "Professional Package"}</td>
              <td style="text-align: right;">${vars.price || "₹0.00"}</td>
            </tr>
            <tr>
              <td>GST Assistance & Portal Surcharge</td>
              <td style="text-align: right;">${vars.gstAmount || "₹0.00"}</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid #0f172a;">
              <td>Grand Total (Incl. Taxes)</td>
              <td style="text-align: right; color: #d97706;">${vars.totalAmount || "₹0.00"}</td>
            </tr>
          </tbody>
        </table>
        <p>This quotation is valid until <strong>${vars.validUntil || "Next 30 Days"}</strong>.</p>
        `,
        `<a href="${vars.actionUrl || "https://legomark.com/client-portal"}" class="btn">Accept & Authorize Online</a>`
      )
  },

  "Proforma Invoice": {
    subject: "Proforma Invoice Dispatched - ${id}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Proforma Invoice Issued",
        `
        <div class="badge">Payment Requested</div>
        <h2>Proforma Invoice ${vars.id || "PRO-2026"}</h2>
        <p>Dear ${vars.fullName || "Client"},</p>
        <p>Our audit team has prepared a Proforma Invoice for the filing process of <strong>${vars.service || "Compliance Services"}</strong>.</p>
        <p>Please review the pricing summary below. We will initiate active document review and registrar filing immediately upon securing payment.</p>
        <table class="data-table">
          <tr>
            <th>Proforma Reference</th>
            <td>${vars.id || "N/A"}</td>
          </tr>
          <tr>
            <th>Filing Service Name</th>
            <td>${vars.service || "N/A"}</td>
          </tr>
          <tr>
            <th>Outstanding Payment</th>
            <td style="font-weight: bold; color: #d97706;">${vars.totalAmount || "₹0.00"}</td>
          </tr>
        </table>
        `,
        `<a href="${vars.paymentUrl || "https://legomark.com/client-portal/billing"}" class="btn">Pay Securely (Razorpay / UPI)</a>`
      )
  },

  "Tax Invoice": {
    subject: "Official Tax Invoice - ${id}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "GST Compliant Tax Invoice",
        `
        <div class="badge">Tax Invoice (Paid)</div>
        <h2>GST Invoice ${vars.id || "INV-2026"}</h2>
        <p>Dear ${vars.fullName || "Client"},</p>
        <p>We acknowledge receipt of payment for your filing order. Please find your legally compliant GST tax invoice summary below.</p>
        <table class="data-table">
          <tr>
            <th>Invoice Number</th>
            <td>${vars.id || "N/A"}</td>
          </tr>
          <tr>
            <th>Date of Issue</th>
            <td>${vars.invoiceDate || "Today"}</td>
          </tr>
          <tr>
            <th>GSTIN on File</th>
            <td>${vars.gstin || "N/A (Consumer)"}</td>
          </tr>
          <tr>
            <th>Taxable Value</th>
            <td>${vars.taxableAmount || "₹0.00"}</td>
          </tr>
          <tr>
            <th>GST Liability (18%)</th>
            <td>${vars.gstAmount || "₹0.00"}</td>
          </tr>
          <tr style="font-weight: bold; background-color: #f1f5f9;">
            <th>Total Paid Amount</th>
            <td style="color: #0f172a;">${vars.totalAmount || "₹0.00"}</td>
          </tr>
        </table>
        <p>The formal invoice PDF is generated and attached to this email for your accounting audits and Input Tax Credit (ITC) filings.</p>
        `,
        `<a href="${vars.invoiceUrl || "https://legomark.com/client-portal/billing"}" class="btn">View in Customer Ledger</a>`
      )
  },

  "Payment Confirmation": {
    subject: "Receipt of Payment Confirmed - ${id}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Payment Processed",
        `
        <div class="badge">Payment Secured</div>
        <h2>Receipt of Payment</h2>
        <p>Dear ${vars.fullName || "Client"},</p>
        <p>This is to confirm that your payment transaction has been processed and cleared in our system.</p>
        <table class="data-table">
          <tr>
            <th>Receipt Number</th>
            <td>${vars.id || "REC-2026"}</td>
          </tr>
          <tr>
            <th>Transaction Reference (UTR)</th>
            <td><strong style="font-family: monospace;">${vars.transactionRef || "N/A"}</strong></td>
          </tr>
          <tr>
            <th>Paid Amount</th>
            <td><strong>${vars.amount || "₹0.00"}</strong></td>
          </tr>
          <tr>
            <th>Payment Mode</th>
            <td>${vars.method || "Bank Transfer"}</td>
          </tr>
        </table>
        <p>Your order has been moved to <strong>Work In Progress</strong>. An assigned corporate expert has started prepping the Ministry of Corporate Affairs filings.</p>
        `
      )
  },

  "Workflow Status Update": {
    subject: "Legomark Alert: Filing Progress Status Changed for ${orderId}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Workflow Progress Alert",
        `
        <h2>Workflow Transition Update</h2>
        <p>Dear ${vars.fullName || "Client"},</p>
        <p>There has been a change in the state of your regulatory filing order <strong>${vars.orderId || "ORD-2026"}</strong>:</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706; margin: 25px 0;">
          <p style="margin: 4px 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Status Transition</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #0f172a;">
            ${vars.fromStatus || "Documents Pending"} <span style="color: #94a3b8;">&rarr;</span> ${vars.toStatus || "Work Started"}
          </p>
        </div>
        <p><strong>Latest Update Notes:</strong><br>
        <span style="font-style: italic; color: #475569;">"${vars.statusNotes || "Filing forms prepped and validated by internal CA team."}"</span></p>
        <p>Please log in to the Client Portal if any action, like e-signing or video KYC, is required from your end.</p>
        `,
        `<a href="https://legomark.com/client-portal" class="btn">View Real-Time Timeline</a>`
      )
  },

  "Task Assigned": {
    subject: "Action Required: Task Assigned for Order ${orderId}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Filing Task Assigned",
        `
        <div class="badge">Action Required</div>
        <h2>New Task Assigned</h2>
        <p>Hello,</p>
        <p>A compliance filing task has been allocated or requires your immediate attention:</p>
        <table class="data-table">
          <tr>
            <th>Order Ref</th>
            <td>${vars.orderId || "N/A"}</td>
          </tr>
          <tr>
            <th>Filing Task Name</th>
            <td><strong>${vars.taskName || "Verify KYC Records"}</strong></td>
          </tr>
          <tr>
            <th>Target Deadline</th>
            <td style="color: #b91c1c; font-weight: 600;">${vars.dueDate || "As Appointed"}</td>
          </tr>
          <tr>
            <th>Details</th>
            <td>${vars.description || "Verify PAN and Aadhar proofs against Ministry of Corporate Affairs data requirements."}</td>
          </tr>
        </table>
        `,
        `<a href="https://legomark.com/admin/tasks" class="btn">Access Working Panel</a>`
      )
  },

  "Support Ticket Reply": {
    subject: "Update: Reply Received on Support Ticket ${id}",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Support Ticket Update",
        `
        <h2>Reply Added to Support Ticket</h2>
        <p>Dear ${vars.fullName || "Client"},</p>
        <p>Our senior corporate legal counsel has logged a reply to your query regarding <strong>"${vars.subject || "Filing Query"}"</strong>.</p>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Reply from ${vars.senderName || "Legomark Legal Team"}:</p>
          <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.5; white-space: pre-line;">${vars.replyText || "Your DSC signature issue is being checked with NSDL..."}</p>
        </div>
        <p>If you have any further questions or documents to attach, please reply directly in the Support Section of your Client Portal.</p>
        `,
        `<a href="https://legomark.com/client-portal/support" class="btn">Open Support Room</a>`
      )
  },

  "Order Completed": {
    subject: "Congratulations! Your Company Incorporation / Registration is Complete!",
    generateHtml: (vars) =>
      wrapInCorporateBranding(
        "Filing Completed Successfully",
        `
        <div class="badge">Incorporation Complete</div>
        <h2>Congratulations, ${vars.fullName || "Founder"}!</h2>
        <p>We are delighted to inform you that your registration process for <strong>${vars.service || "Compliance Filing"}</strong> has been successfully finalized by the government authorities!</p>
        <p>Your official corporate incorporation files, Certificate of Incorporation (CoI), DINs, and GSTIN documents are compiled, audited, and ready for download.</p>
        <table class="data-table">
          <tr>
            <th>Service Completed</th>
            <td>${vars.service || "Private Limited Company Incorporation"}</td>
          </tr>
          <tr>
            <th>Official Registered Name</th>
            <td><strong>${vars.companyName || "N/A"}</strong></td>
          </tr>
          <tr>
            <th>Status</th>
            <td style="color: #15803d; font-weight: 600;">Successfully Delivered</td>
          </tr>
        </table>
        <p>All legal and compliance documents have been archived securely in your Client Portal vault for permanent, instant access.</p>
        `,
        `<a href="https://legomark.com/client-portal" class="btn">Download Corporate Certificates</a>`
      )
  }
};
