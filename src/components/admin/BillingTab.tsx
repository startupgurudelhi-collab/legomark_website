/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  Receipt,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  ArrowRight,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  Printer,
  X,
  CreditCard,
  User,
  Search,
  Filter,
  RefreshCw,
  CornerDownRight,
  History,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react";
import {
  getStoredState,
  setStoredState,
  AdminOrder,
  AdminQuotation,
  ProformaInvoice,
  TaxInvoice,
  PaymentRecord,
  ReceiptRecord,
  RefundRecord,
  CreditDebitNote,
  LedgerEntry,
  initialQuotations,
  initialProformas,
  initialInvoices,
  initialPayments,
  initialReceipts,
  initialRefunds,
  initialCreditDebitNotes,
  initialLedgerEntries
} from "../../data/adminStore.js";
import { useToast } from "../../contexts/ToastContext.js";

interface BillingTabProps {
  orders: AdminOrder[];
  onOrdersUpdated: (updated: AdminOrder[]) => void;
}

export default function BillingTab({ orders, onOrdersUpdated }: BillingTabProps) {
  const toast = useToast();

  // Local persistence states
  const [quotations, setQuotations] = useState<AdminQuotation[]>(() => getStoredState("quotations", initialQuotations));
  const [proformas, setProformas] = useState<ProformaInvoice[]>(() => getStoredState("proformas", initialProformas));
  const [invoices, setInvoices] = useState<TaxInvoice[]>(() => getStoredState("invoices", initialInvoices));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getStoredState("payments", initialPayments));
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(() => getStoredState("receipts", initialReceipts));
  const [refunds, setRefunds] = useState<RefundRecord[]>(() => getStoredState("refunds", initialRefunds));
  const [creditNotes, setCreditNotes] = useState<CreditDebitNote[]>(() => getStoredState("credit_debit_notes", initialCreditDebitNotes));
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => getStoredState("ledger_entries", initialLedgerEntries));

  // Sync state helpers
  const saveQuotations = (data: AdminQuotation[]) => { setQuotations(data); setStoredState("quotations", data); };
  const saveProformas = (data: ProformaInvoice[]) => { setProformas(data); setStoredState("proformas", data); };
  const saveInvoices = (data: TaxInvoice[]) => { setInvoices(data); setStoredState("invoices", data); };
  const savePayments = (data: PaymentRecord[]) => { setPayments(data); setStoredState("payments", data); };
  const saveReceipts = (data: ReceiptRecord[]) => { setReceipts(data); setStoredState("receipts", data); };
  const saveRefunds = (data: RefundRecord[]) => { setRefunds(data); setStoredState("refunds", data); };
  const saveCreditNotes = (data: CreditDebitNote[]) => { setCreditNotes(data); setStoredState("credit_debit_notes", data); };
  const saveLedger = (data: LedgerEntry[]) => { setLedger(data); setStoredState("ledger_entries", data); };

  // Sub-tabs state
  const [billingSubTab, setBillingSubTab] = useState<"dashboard" | "quotations" | "proforma" | "invoices" | "payments" | "receipts" | "refunds" | "credit-notes" | "ledger">("dashboard");

  // Selection/filter state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string>("all");

  // Print/View PDF Simulator state
  const [viewingDoc, setViewingDoc] = useState<{
    type: "Quotation" | "Proforma" | "Invoice" | "Receipt" | "Credit Note";
    id: string;
    data: any;
  } | null>(null);

  // New Quotation Modal State
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [newQuoteCustName, setNewQuoteCustName] = useState("");
  const [newQuoteCustEmail, setNewQuoteCustEmail] = useState("");
  const [newQuoteCustPhone, setNewQuoteCustPhone] = useState("");
  const [newQuoteCustCompany, setNewQuoteCustCompany] = useState("");
  const [newQuoteService, setNewQuoteService] = useState("Private Limited Company");
  const [newQuotePackage, setNewQuotePackage] = useState("Standard Filing");
  const [newQuoteUnitPrice, setNewQuoteUnitPrice] = useState<number>(10000);
  const [newQuoteDiscount, setNewQuoteDiscount] = useState<number>(1000);
  const [newQuoteGst, setNewQuoteGst] = useState<number>(18);
  const [newQuoteNotes, setNewQuoteNotes] = useState("");

  // New Proforma Modal State
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [newProfCustName, setNewProfCustName] = useState("");
  const [newProfCustEmail, setNewProfCustEmail] = useState("");
  const [newProfCustPhone, setNewProfCustPhone] = useState("");
  const [newProfCustCompany, setNewProfCustCompany] = useState("");
  const [newProfService, setNewProfService] = useState("Private Limited Company");
  const [newProfPackage, setNewProfPackage] = useState("Standard Filing");
  const [newProfPrice, setNewProfPrice] = useState<number>(12000);
  const [newProfDiscount, setNewProfDiscount] = useState<number>(1000);
  const [newProfGst, setNewProfGst] = useState<number>(18);
  const [newProfTerms, setNewProfTerms] = useState("100% advance execution.");
  const [newProfNotes, setNewProfNotes] = useState("");

  // New Tax Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInvCustName, setNewInvCustName] = useState("");
  const [newInvCustEmail, setNewInvCustEmail] = useState("");
  const [newInvCustPhone, setNewInvCustPhone] = useState("");
  const [newInvCustCompany, setNewInvCustCompany] = useState("");
  const [newInvCustGstin, setNewInvCustGstin] = useState("");
  const [newInvPlaceSupply, setNewInvPlaceSupply] = useState("Delhi");
  const [newInvService, setNewInvService] = useState("Private Limited Company");
  const [newInvPackage, setNewInvPackage] = useState("Standard Filing");
  const [newInvHsnSac, setNewInvHsnSac] = useState("998221");
  const [newInvTaxable, setNewInvTaxable] = useState<number>(10000);
  const [newInvGstRate, setNewInvGstRate] = useState<number>(18);

  // New Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payInvoiceId, setPayInvoiceId] = useState("");
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<"Razorpay" | "UPI" | "Bank Transfer" | "Cash" | "Manual Payment">("UPI");
  const [payRef, setPayRef] = useState("");

  // New Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refPaymentId, setRefPaymentId] = useState("");
  const [refAmount, setRefAmount] = useState<number>(0);
  const [refReason, setRefReason] = useState("");

  // New Credit Note Modal State
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditType, setCreditType] = useState<"Credit Note" | "Debit Note">("Credit Note");
  const [creditInvoiceId, setCreditInvoiceId] = useState("");
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditReason, setCreditReason] = useState("");

  // ==========================================
  // CALCULATE DASHBOARD ANALYTICS OVERVIEWS
  // ==========================================
  const analytics = useMemo(() => {
    // 1. Total Invoice Volume
    const totalRevenue = invoices
      .filter(i => i.paymentStatus === "Paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);

    // 2. Outstanding amount (Unpaid & Partial invoices)
    const outstandingInvoices = invoices.filter(i => i.paymentStatus === "Unpaid" || i.paymentStatus === "Partial");
    const outstandingAmount = outstandingInvoices.reduce((sum, i) => {
      // Find payments registered for this invoice to subtract
      const registeredPayments = payments
        .filter(p => p.invoiceId === i.id && p.status === "Success")
        .reduce((s, p) => s + p.amount, 0);
      return sum + (i.totalAmount - registeredPayments);
    }, 0);

    // 3. Paid & Pending invoice counts
    const paidInvoicesCount = invoices.filter(i => i.paymentStatus === "Paid").length;
    const pendingPaymentsCount = invoices.filter(i => i.paymentStatus === "Unpaid" || i.paymentStatus === "Partial").length;

    // 4. Total logged refunds
    const approvedRefundsAmount = refunds
      .filter(r => r.status === "Approved")
      .reduce((sum, r) => sum + r.amount, 0);

    // 5. Monthly Billing breakdown (simulation based on dates)
    const monthlyBilling = invoices.reduce((acc: Record<string, number>, i) => {
      const month = i.invoiceDate.substring(0, 7); // e.g. "2026-06"
      acc[month] = (acc[month] || 0) + i.totalAmount;
      return acc;
    }, {});

    return {
      totalRevenue,
      outstandingAmount,
      paidInvoicesCount,
      pendingPaymentsCount,
      approvedRefundsAmount,
      monthlyBilling
    };
  }, [invoices, payments, refunds]);

  // Unique customers mapped from existing state to facilitate selection dropdowns
  const customersList = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; companyName?: string }>();
    orders.forEach(o => {
      map.set(o.customer.email.toLowerCase(), {
        name: o.customer.name,
        email: o.customer.email,
        phone: o.customer.phone,
        companyName: o.customer.companyName
      });
    });
    // Add default test client
    map.set("client@example.com", {
      name: "Rahul Sharma",
      email: "client@example.com",
      phone: "9123456789",
      companyName: "Sharma Enterprises Ltd"
    });
    return Array.from(map.values());
  }, [orders]);

  // ==========================================
  // ENGINE CONVERSIONS & ACTIONS
  // ==========================================

  // 1. Convert Quotation → Order & Proforma
  const handleConvertQuotation = (quote: AdminQuotation) => {
    // A. Check if already Accepted
    const updatedQuotes = quotations.map(q => {
      if (q.id === quote.id) {
        return { ...q, status: "Accepted" as const };
      }
      return q;
    });
    saveQuotations(updatedQuotes);

    // B. Create a corresponding Operational Order
    const newOrderId = `ORD-2026-00${orders.length + 1}`;
    const newOrder: AdminOrder = {
      id: newOrderId,
      leadId: undefined,
      customer: {
        name: quote.customer.name,
        email: quote.customer.email,
        phone: quote.customer.phone,
        companyName: quote.customer.companyName
      },
      service: quote.service,
      packageName: quote.packageName,
      price: quote.unitPrice * quote.quantity,
      gst: quote.gstAmount,
      discount: quote.discount,
      totalAmount: quote.totalAmount,
      assignedExecutive: "Sanjana Sen",
      paymentStatus: "Pending",
      serviceStatus: "Documents Pending",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      notesHistory: [
        { id: `note-${Date.now()}`, author: "System Engine", note: `Order established automatically from accepted Quotation ${quote.id}.`, date: new Date().toISOString().split("T")[0] }
      ]
    };

    onOrdersUpdated([newOrder, ...orders]);

    // C. Create automatic corresponding Proforma Invoice
    const newProformaId = `PRO-2026-00${proformas.length + 1}`;
    const newProforma: ProformaInvoice = {
      id: newProformaId,
      customer: { ...quote.customer },
      service: quote.service,
      packageName: quote.packageName,
      price: quote.unitPrice * quote.quantity,
      discount: quote.discount,
      gstPercent: quote.gstPercent,
      gstAmount: quote.gstAmount,
      totalAmount: quote.totalAmount,
      terms: "100% advance on governmental submission preparation.",
      notes: `Automatically generated from approved quotation ${quote.id}.`,
      status: "Sent",
      createdAt: new Date().toISOString().split("T")[0]
    };
    saveProformas([newProforma, ...proformas]);

    // D. Log to Chronological Ledger
    const newLedgerEntry: LedgerEntry = {
      id: `LDG-${Date.now()}`,
      customerEmail: quote.customer.email.toLowerCase(),
      type: "Order",
      refId: newOrderId,
      date: new Date().toISOString().split("T")[0],
      description: `Quotation ${quote.id} converted to Operational Order ${newOrderId}. Service status: Documents Pending.`,
      amount: quote.totalAmount,
      balanceEffect: "neutral"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    toast.success(`Converted ${quote.id} to Order ${newOrderId} and Proforma ${newProformaId}!`, "Conversion Successful");
  };

  // 2. Convert Proforma → Tax Invoice
  const handleConvertProforma = (proforma: ProformaInvoice) => {
    // A. Check if already marked Paid
    const updatedProformas = proformas.map(p => {
      if (p.id === proforma.id) {
        return { ...p, status: "Paid" as const };
      }
      return p;
    });
    saveProformas(updatedProformas);

    // B. Build GST-compliant Tax Invoice
    const newInvoiceId = `INV-2026-00${invoices.length + 1}`;
    
    // Intra-state / Inter-state logic simulation based on random state selection
    const places = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Gujarat"];
    const placeOfSupply = places[Math.floor(Math.random() * places.length)];
    const isIntraState = placeOfSupply === "Delhi"; // Assuming Legomark HQ is in Delhi

    const cgstRate = isIntraState ? proforma.gstPercent / 2 : 0;
    const sgstRate = isIntraState ? proforma.gstPercent / 2 : 0;
    const igstRate = isIntraState ? 0 : proforma.gstPercent;

    const cgstAmount = isIntraState ? proforma.gstAmount / 2 : 0;
    const sgstAmount = isIntraState ? proforma.gstAmount / 2 : 0;
    const igstAmount = isIntraState ? 0 : proforma.gstAmount;

    const newTaxInvoice: TaxInvoice = {
      id: newInvoiceId,
      invoiceDate: new Date().toISOString().split("T")[0],
      customer: {
        ...proforma.customer,
        gstin: proforma.customer.companyName ? `29AAACF${Math.floor(1000 + Math.random() * 9000)}F1ZX` : undefined
      },
      placeOfSupply,
      service: proforma.service,
      packageName: proforma.packageName,
      hsnSac: proforma.service.includes("FSSAI") ? "998222" : "998221",
      taxableAmount: proforma.price - proforma.discount,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount: proforma.totalAmount,
      paymentStatus: "Unpaid",
    };
    saveInvoices([newTaxInvoice, ...invoices]);

    // C. Log to Ledger
    const newLedgerEntry: LedgerEntry = {
      id: `LDG-${Date.now()}`,
      customerEmail: proforma.customer.email.toLowerCase(),
      type: "Invoice",
      refId: newInvoiceId,
      date: new Date().toISOString().split("T")[0],
      description: `Proforma ${proforma.id} converted to Tax Invoice ${newInvoiceId} under Supply Rule.`,
      amount: proforma.totalAmount,
      balanceEffect: "debit"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    toast.success(`Promoted Proforma ${proforma.id} to Tax Invoice ${newInvoiceId}!`, "Invoice Issued");
  };

  // 3. Register manual or Razorpay-ready payment
  const handleRegisterPaymentSubmit = (e: any) => {
    e.preventDefault();
    if (!payInvoiceId || payAmount <= 0) {
      toast.error("Invalid payment configuration details", "Validation Error");
      return;
    }

    // A. Find invoice to modify paymentStatus
    const targetInvoice = invoices.find(i => i.id === payInvoiceId);
    if (!targetInvoice) {
      toast.error("Tax invoice not found in directory", "Database Error");
      return;
    }

    // B. Build unique payment ID
    const newPaymentId = `PAY-2026-00${payments.length + 1}`;
    const newPayment: PaymentRecord = {
      id: newPaymentId,
      invoiceId: payInvoiceId,
      customerEmail: targetInvoice.customer.email,
      method: payMethod,
      amount: payAmount,
      status: "Success",
      transactionRef: payRef || `MANUAL-${Date.now().toString().substring(6)}`,
      paidDate: new Date().toISOString().split("T")[0]
    };
    savePayments([newPayment, ...payments]);

    // C. Calculate payment completeness to assign Status
    const totalReceivedOnInvoice = payments
      .filter(p => p.invoiceId === payInvoiceId && p.status === "Success")
      .reduce((sum, p) => sum + p.amount, 0) + payAmount;

    let targetStatus: "Paid" | "Partial" | "Unpaid" = "Unpaid";
    if (totalReceivedOnInvoice >= targetInvoice.totalAmount) {
      targetStatus = "Paid";
    } else if (totalReceivedOnInvoice > 0) {
      targetStatus = "Partial";
    }

    const updatedInvoices = invoices.map(i => {
      if (i.id === payInvoiceId) {
        return { ...i, paymentStatus: targetStatus, paymentMethod: payMethod };
      }
      return i;
    });
    saveInvoices(updatedInvoices);

    // D. Auto-update matching order payment status
    const updatedOrders: AdminOrder[] = orders.map(o => {
      if (o.customer.email.toLowerCase() === targetInvoice.customer.email.toLowerCase() && o.service === targetInvoice.service) {
        const orderPaymentStatus: "Pending" | "Partial" | "Paid" | "Refunded" = 
          targetStatus === "Unpaid" ? "Pending" : targetStatus;
        return { ...o, paymentStatus: orderPaymentStatus };
      }
      return o;
    });
    onOrdersUpdated(updatedOrders);

    // E. Auto-generate receipt
    const newReceiptId = `REC-2026-00${receipts.length + 1}`;
    const newReceipt: ReceiptRecord = {
      id: newReceiptId,
      paymentRef: newPaymentId,
      amount: payAmount,
      date: new Date().toISOString().split("T")[0],
      customer: {
        name: targetInvoice.customer.name,
        email: targetInvoice.customer.email,
        companyName: targetInvoice.customer.companyName
      },
      invoiceId: payInvoiceId
    };
    saveReceipts([newReceipt, ...receipts]);

    // F. Log to Chronological Ledger
    const newLedgerEntry: LedgerEntry = {
      id: `LDG-${Date.now()}`,
      customerEmail: targetInvoice.customer.email.toLowerCase(),
      type: "Payment",
      refId: newPaymentId,
      date: new Date().toISOString().split("T")[0],
      description: `Payment recorded via ${payMethod}. Outstanding cleared. Receipt ${newReceiptId} issued.`,
      amount: payAmount,
      balanceEffect: "credit"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    setShowPaymentModal(false);
    setPayInvoiceId("");
    setPayAmount(0);
    setPayRef("");
    toast.success(`Payment of ₹${payAmount} registered! Receipt ${newReceiptId} generated.`, "Payment Succeeded");
  };

  // 4. Create manual quotation submission
  const handleCreateQuotationSubmit = (e: any) => {
    e.preventDefault();
    if (!newQuoteCustEmail || !newQuoteCustName) {
      toast.error("Please provide customer specifications", "Validation Error");
      return;
    }

    const newQuoteId = `QT-2026-00${quotations.length + 1}`;
    const calculatedGst = Math.round(((newQuoteUnitPrice - newQuoteDiscount) * newQuoteGst) / 100);
    const calculatedTotal = (newQuoteUnitPrice - newQuoteDiscount) + calculatedGst;

    const newQuotation: AdminQuotation = {
      id: newQuoteId,
      customer: {
        name: newQuoteCustName,
        email: newQuoteCustEmail,
        phone: newQuoteCustPhone,
        companyName: newQuoteCustCompany || undefined
      },
      service: newQuoteService,
      packageName: newQuotePackage,
      items: [
        { description: `${newQuoteService} - ${newQuotePackage} base consulting`, quantity: 1, unitPrice: newQuoteUnitPrice, amount: newQuoteUnitPrice }
      ],
      quantity: 1,
      unitPrice: newQuoteUnitPrice,
      discount: newQuoteDiscount,
      gstPercent: newQuoteGst,
      gstAmount: calculatedGst,
      totalAmount: calculatedTotal,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notes: newQuoteNotes || "Thank you for inquiring with Legomark India.",
      status: "Sent",
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveQuotations([newQuotation, ...quotations]);

    // Log to ledger
    const newLedgerEntry: LedgerEntry = {
      id: `LDG-${Date.now()}`,
      customerEmail: newQuoteCustEmail.toLowerCase(),
      type: "Quotation",
      refId: newQuoteId,
      date: new Date().toISOString().split("T")[0],
      description: `New quotation ${newQuoteId} generated for ${newQuoteService}.`,
      amount: calculatedTotal,
      balanceEffect: "neutral"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    setShowQuotationModal(false);
    toast.success(`Quotation ${newQuoteId} issued successfully to ${newQuoteCustEmail}!`, "Quotation Dispatched");
  };

  // 5. Create Proforma Submission
  const handleCreateProformaSubmit = (e: any) => {
    e.preventDefault();
    if (!newProfCustEmail || !newProfCustName) {
      toast.error("Please provide customer specifications", "Validation Error");
      return;
    }

    const newProformaId = `PRO-2026-00${proformas.length + 1}`;
    const calculatedGst = Math.round(((newProfPrice - newProfDiscount) * newProfGst) / 100);
    const calculatedTotal = (newProfPrice - newProfDiscount) + calculatedGst;

    const newProforma: ProformaInvoice = {
      id: newProformaId,
      customer: {
        name: newProfCustName,
        email: newProfCustEmail,
        phone: newProfCustPhone,
        companyName: newProfCustCompany || undefined
      },
      service: newProfService,
      packageName: newProfPackage,
      price: newProfPrice,
      discount: newProfDiscount,
      gstPercent: newProfGst,
      gstAmount: calculatedGst,
      totalAmount: calculatedTotal,
      terms: newProfTerms,
      notes: newProfNotes,
      status: "Sent",
      createdAt: new Date().toISOString().split("T")[0]
    };

    saveProformas([newProforma, ...proformas]);
    setShowProformaModal(false);
    toast.success(`Proforma Invoice ${newProformaId} issued to customer mailbox!`, "Proforma Generated");
  };

  // 6. Create Direct Tax Invoice
  const handleCreateInvoiceSubmit = (e: any) => {
    e.preventDefault();
    if (!newInvCustEmail || !newInvCustName) {
      toast.error("Customer details required", "Validation Error");
      return;
    }

    const newInvoiceId = `INV-2026-00${invoices.length + 1}`;
    const calculatedGstAmount = Math.round((newInvTaxable * newInvGstRate) / 100);
    const calculatedTotal = newInvTaxable + calculatedGstAmount;

    const isIntraState = newInvPlaceSupply === "Delhi";
    const cgstRate = isIntraState ? newInvGstRate / 2 : 0;
    const cgstAmount = isIntraState ? calculatedGstAmount / 2 : 0;
    const sgstRate = isIntraState ? newInvGstRate / 2 : 0;
    const sgstAmount = isIntraState ? calculatedGstAmount / 2 : 0;
    const igstRate = isIntraState ? 0 : newInvGstRate;
    const igstAmount = isIntraState ? 0 : calculatedGstAmount;

    const newTaxInvoice: TaxInvoice = {
      id: newInvoiceId,
      invoiceDate: new Date().toISOString().split("T")[0],
      customer: {
        name: newInvCustName,
        email: newInvCustEmail,
        phone: newInvCustPhone,
        companyName: newInvCustCompany || undefined,
        gstin: newInvCustGstin || undefined
      },
      placeOfSupply: newInvPlaceSupply,
      service: newInvService,
      packageName: newInvPackage,
      hsnSac: newInvHsnSac,
      taxableAmount: newInvTaxable,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount: calculatedTotal,
      paymentStatus: "Unpaid"
    };

    saveInvoices([newTaxInvoice, ...invoices]);

    // Ledger Log
    const newLedgerEntry: LedgerEntry = {
      id: `LDG-${Date.now()}`,
      customerEmail: newInvCustEmail.toLowerCase(),
      type: "Invoice",
      refId: newInvoiceId,
      date: new Date().toISOString().split("T")[0],
      description: `Tax Invoice ${newInvoiceId} directly raised.`,
      amount: calculatedTotal,
      balanceEffect: "debit"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    setShowInvoiceModal(false);
    toast.success(`Tax Invoice ${newInvoiceId} generated under GST regulations!`, "Invoice Issued");
  };

  // 7. Initiate refund (Architecture log only)
  const handleCreateRefundSubmit = (e: any) => {
    e.preventDefault();
    if (!refPaymentId || refAmount <= 0) {
      toast.error("Please fill in correct payment references and refund amount.", "Error");
      return;
    }

    const newRefundId = `REF-2026-00${refunds.length + 1}`;
    const newRefund: RefundRecord = {
      id: newRefundId,
      paymentId: refPaymentId,
      amount: refAmount,
      reason: refReason || "Customer cancellation claim",
      status: "Approved",
      approvedBy: "Lead Admin",
      date: new Date().toISOString().split("T")[0]
    };

    saveRefunds([newRefund, ...refunds]);

    // Track original payment record to find customer email
    const originalPayment = payments.find(p => p.id === refPaymentId);
    if (originalPayment) {
      // Create ledger logs
      const newLedgerEntry: LedgerEntry = {
        id: `LDG-${Date.now()}`,
        customerEmail: originalPayment.customerEmail.toLowerCase(),
        type: "Refund",
        refId: newRefundId,
        date: new Date().toISOString().split("T")[0],
        description: `Refund ${newRefundId} approved and credited back to client bank ledger.`,
        amount: refAmount,
        balanceEffect: "debit"
      };
      saveLedger([newLedgerEntry, ...ledger]);

      // Update payment status as Refunded
      const updatedPayments = payments.map(p => {
        if (p.id === refPaymentId) {
          return { ...p, status: "Refunded" as const };
        }
        return p;
      });
      savePayments(updatedPayments);
    }

    setShowRefundModal(false);
    toast.success(`Refund Log ${newRefundId} authorized and processed!`, "Refund Success");
  };

  // 8. Credit / Debit note register
  const handleCreateCreditSubmit = (e: any) => {
    e.preventDefault();
    if (!creditInvoiceId || creditAmount <= 0) {
      toast.error("Valid invoice ID and adjustment amount required", "Error");
      return;
    }

    const targetInvoice = invoices.find(i => i.id === creditInvoiceId);
    if (!targetInvoice) {
      toast.error("Original Invoice not found", "Error");
      return;
    }

    const prefix = creditType === "Credit Note" ? "CN" : "DN";
    const noteId = `${prefix}-2026-00${creditNotes.length + 1}`;
    const newNote: CreditDebitNote = {
      id: noteId,
      type: creditType,
      originalInvoiceId: creditInvoiceId,
      customer: {
        name: targetInvoice.customer.name,
        email: targetInvoice.customer.email,
        companyName: targetInvoice.customer.companyName
      },
      amount: creditAmount,
      reason: creditReason || "Rate adjustment corrections under audit review.",
      date: new Date().toISOString().split("T")[0]
    };

    saveCreditNotes([newNote, ...creditNotes]);

    // Ledger Log
    const newLedgerEntry: LedgerEntry = {
      id: `LDG-${Date.now()}`,
      customerEmail: targetInvoice.customer.email.toLowerCase(),
      type: creditType === "Credit Note" ? "Credit Note" : "Debit Note",
      refId: noteId,
      date: new Date().toISOString().split("T")[0],
      description: `${creditType} ${noteId} generated to settle balance on invoice ${creditInvoiceId}.`,
      amount: creditAmount,
      balanceEffect: creditType === "Credit Note" ? "credit" : "debit"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    setShowCreditModal(false);
    toast.success(`${creditType} ${noteId} recorded on matching accounts.`, "Adjustment Logged");
  };


  // Filtering logs
  const filteredQuotations = useMemo(() => {
    return quotations.filter(q =>
      q.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      q.customer.name.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      q.customer.email.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
    );
  }, [quotations, invoiceSearchQuery]);

  const filteredProformas = useMemo(() => {
    return proformas.filter(p =>
      p.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      p.customer.name.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      p.customer.email.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
    );
  }, [proformas, invoiceSearchQuery]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i =>
      i.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      i.customer.name.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
      i.customer.email.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
    );
  }, [invoices, invoiceSearchQuery]);

  const customerLedgerEntries = useMemo(() => {
    if (selectedCustomerEmail === "all") return ledger;
    return ledger.filter(item => item.customerEmail.toLowerCase() === selectedCustomerEmail.toLowerCase());
  }, [ledger, selectedCustomerEmail]);

  return (
    <div className="space-y-6" id="transaction-billing-panel">
      {/* 1. Module Header Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Transaction & Billing Engine
              <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest font-bold bg-teal-100 text-teal-800 uppercase">
                DC-007B COMPLIANT
              </span>
            </h2>
            <p className="text-slate-500 text-xs">
              Manage Indian corporate invoicing, quotations, tax computations, and audit chronological client ledgers.
            </p>
          </div>
        </div>

        {/* Global Finance action tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setNewQuoteCustName("");
              setNewQuoteCustEmail("");
              setNewQuoteCustPhone("");
              setNewQuoteCustCompany("");
              setShowQuotationModal(true);
            }}
            className="px-3.5 py-2 bg-brand-primary-950 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Quotation</span>
          </button>
          <button
            onClick={() => {
              setNewProfCustName("");
              setNewProfCustEmail("");
              setNewProfCustPhone("");
              setNewProfCustCompany("");
              setShowProformaModal(true);
            }}
            className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Proforma</span>
          </button>
        </div>
      </div>

      {/* 2. Billing Tab Selector */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2" id="billing-subtab-navigation">
        {[
          { id: "dashboard", label: "Financial Console", icon: DollarSign },
          { id: "quotations", label: "Quotation Desk", icon: FileText },
          { id: "proforma", label: "Proforma Register", icon: FileSpreadsheet },
          { id: "invoices", label: "Tax Invoices (GST)", icon: Receipt },
          { id: "payments", label: "Payments Audit", icon: CreditCard },
          { id: "receipts", label: "Receipt Engine", icon: CheckCircle },
          { id: "refunds", label: "Refund Architecture", icon: RefreshCw },
          { id: "credit-notes", label: "Credit / Debit Notes", icon: CornerDownRight },
          { id: "ledger", label: "Client Ledgers", icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setBillingSubTab(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition flex items-center gap-2 cursor-pointer ${
              billingSubTab === tab.id
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Sub-tab Contents */}

      {/* A. FINANCIAL DASHBOARD VIEW */}
      {billingSubTab === "dashboard" && (
        <div className="space-y-6" id="billing-subtab-dashboard">
          {/* Analytics grid widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400 block">Total Revenue (Settled)</span>
                <span className="text-2xl font-black text-slate-900">₹{analytics.totalRevenue.toLocaleString("en-IN")}</span>
                <span className="text-[10px] text-green-600 font-bold block flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> +18.4% since last week
                </span>
              </div>
              <div className="h-12 w-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400 block">Outstanding Receivables</span>
                <span className="text-2xl font-black text-slate-900">₹{analytics.outstandingAmount.toLocaleString("en-IN")}</span>
                <span className="text-[10px] text-amber-600 font-bold block">
                  Awaiting client UPI / bank wire
                </span>
              </div>
              <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition sm:col-span-2 lg:col-span-1">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400 block">Tax Invoices Handled</span>
                <span className="text-2xl font-black text-slate-900">
                  {analytics.paidInvoicesCount} Paid / {analytics.pendingPaymentsCount} Pending
                </span>
                <span className="text-[10px] text-teal-600 font-bold block">
                  100% Goods & Services Tax (GST) Compliant
                </span>
              </div>
              <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center font-bold">
                <Receipt className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual breakdown mockup column */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Monthly Billings Accumulation</span>
              <div className="space-y-3 pt-2">
                {Object.entries(analytics.monthlyBilling).map(([month, amount]) => (
                  <div key={month} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">{month} 2026</span>
                      <span className="font-mono text-slate-900 font-bold">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Abstraction disclaimer and gateway state */}
              <div className="p-4 bg-slate-50/75 rounded-lg border border-slate-150 flex items-start gap-3.5">
                <AlertCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Razorpay Unified Abstraction Active</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Legomark uses a centralized financial abstraction provider. No live Razorpay API calls are issued on this page as per contract DC-007B rules, but multiple payment mechanisms are supported for manual ledger checkoffs and UTR registries.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Matrix Sidebar */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Audit Quick Trigger Actions</span>
              
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full p-2.5 text-left border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-between text-slate-700 transition"
                >
                  <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-slate-500" /> Log Inward Payment</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="w-full p-2.5 text-left border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-between text-slate-700 transition"
                >
                  <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-slate-500" /> Register Client Refund</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="w-full p-2.5 text-left border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-between text-slate-700 transition"
                >
                  <span className="flex items-center gap-2"><CornerDownRight className="h-4 w-4 text-slate-500" /> Issue Credit / Debit Note</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>

              {/* Outstanding overview list */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue Tax Invoices</span>
                <div className="space-y-2">
                  {invoices.filter(i => i.paymentStatus !== "Paid").slice(0, 2).map(i => (
                    <div key={i.id} className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{i.id}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{i.customer.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">₹{i.totalAmount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. QUOTATIONS SUB-TAB */}
      {billingSubTab === "quotations" && (
        <div className="space-y-4" id="billing-subtab-quotations">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
            <div className="relative w-full sm:w-72">
              <Search className="absolute inset-y-0 left-2.5 h-4 w-4 text-slate-400 flex items-center pointer-events-none mt-2" />
              <input
                type="text"
                placeholder="Search quotations..."
                value={invoiceSearchQuery}
                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 focus:border-teal-500 focus:outline-none rounded-md"
              />
            </div>
            <button
              onClick={() => setShowQuotationModal(true)}
              className="px-3.5 py-1.5 bg-brand-primary-950 text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Quotation</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Quote Number</th>
                  <th className="p-3">Client Specification</th>
                  <th className="p-3">Inquired Service</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">GST Amt</th>
                  <th className="p-3">Total Payable</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredQuotations.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{q.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{q.customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{q.customer.email}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-slate-800">{q.service}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{q.packageName}</p>
                    </td>
                    <td className="p-3 font-mono">₹{(q.unitPrice * q.quantity - q.discount).toLocaleString()}</td>
                    <td className="p-3 font-mono text-slate-500">₹{q.gstAmount.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{q.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        q.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : q.status === "Sent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setViewingDoc({ type: "Quotation", id: q.id, data: q })}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold rounded text-slate-700 transition"
                      >
                        PDF Mock
                      </button>
                      {q.status !== "Accepted" && (
                        <button
                          onClick={() => handleConvertQuotation(q)}
                          className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded transition"
                        >
                          Approve & Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* C. PROFORMA SUB-TAB */}
      {billingSubTab === "proforma" && (
        <div className="space-y-4" id="billing-subtab-proforma">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
            <div className="relative w-full sm:w-72">
              <Search className="absolute inset-y-0 left-2.5 h-4 w-4 text-slate-400 flex items-center pointer-events-none mt-2" />
              <input
                type="text"
                placeholder="Search proformas..."
                value={invoiceSearchQuery}
                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 focus:border-teal-500 focus:outline-none rounded-md"
              />
            </div>
            <button
              onClick={() => setShowProformaModal(true)}
              className="px-3.5 py-1.5 bg-brand-primary-950 text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Proforma</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Proforma ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">GST Component</th>
                  <th className="p-3">Terms of Supply</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredProformas.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{p.customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.customer.email}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{p.service}</td>
                    <td className="p-3 font-mono">₹{p.gstAmount.toLocaleString()} ({p.gstPercent}%)</td>
                    <td className="p-3 text-slate-500 max-w-[200px] truncate">{p.terms}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{p.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        p.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : p.status === "Sent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setViewingDoc({ type: "Proforma", id: p.id, data: p })}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold rounded text-slate-700 transition"
                      >
                        PDF Mock
                      </button>
                      {p.status !== "Paid" && (
                        <button
                          onClick={() => handleConvertProforma(p)}
                          className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded transition"
                        >
                          Promote to Tax Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* D. TAX INVOICE SUB-TAB */}
      {billingSubTab === "invoices" && (
        <div className="space-y-4" id="billing-subtab-tax-invoices">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
            <div className="relative w-full sm:w-72">
              <Search className="absolute inset-y-0 left-2.5 h-4 w-4 text-slate-400 flex items-center pointer-events-none mt-2" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={invoiceSearchQuery}
                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 focus:border-teal-500 focus:outline-none rounded-md"
              />
            </div>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-1.5 bg-brand-primary-950 text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Raise GST Tax Invoice</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Invoice Date</th>
                  <th className="p-3">Customer Details</th>
                  <th className="p-3">Place of Supply</th>
                  <th className="p-3">GST Rates</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredInvoices.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{i.id}</td>
                    <td className="p-3 font-mono text-slate-500">{i.invoiceDate}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{i.customer.name}</p>
                      {i.customer.gstin && (
                        <p className="text-[10px] text-teal-600 font-mono font-bold uppercase">GSTIN: {i.customer.gstin}</p>
                      )}
                    </td>
                    <td className="p-3 font-medium">{i.placeOfSupply}</td>
                    <td className="p-3">
                      {i.cgstAmount > 0 ? (
                        <span className="text-[10px] text-slate-500">CGST/SGST 9%+9%</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">IGST 18%</span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{i.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        i.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : i.paymentStatus === "Partial"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {i.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setViewingDoc({ type: "Invoice", id: i.id, data: i })}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold rounded text-slate-700 transition"
                      >
                        PDF Mock View
                      </button>
                      {i.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => { setPayInvoiceId(i.id); setPayAmount(i.totalAmount); setShowPaymentModal(true); }}
                          className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded transition"
                        >
                          Log Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* E. PAYMENTS AUDIT SUB-TAB */}
      {billingSubTab === "payments" && (
        <div className="space-y-4" id="billing-subtab-payments-audit">
          <div className="bg-white p-3 border border-slate-200 rounded-lg flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Abstraction Log Register</span>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3 py-1.5 bg-brand-primary-950 text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Add Inward Wire
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Linked Invoice</th>
                  <th className="p-3">Client Email</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Trans Ref Number</th>
                  <th className="p-3">Logged Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3 font-mono text-slate-600">{p.invoiceId}</td>
                    <td className="p-3 font-mono text-slate-500">{p.customerEmail}</td>
                    <td className="p-3 font-bold text-slate-800">{p.method}</td>
                    <td className="p-3 font-mono text-slate-400">{p.transactionRef}</td>
                    <td className="p-3 text-slate-500 font-mono">{p.paidDate}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{p.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* F. RECEIPTS SUB-TAB */}
      {billingSubTab === "receipts" && (
        <div className="space-y-4" id="billing-subtab-receipts">
          <div className="bg-white p-4 border border-slate-200 rounded-lg">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Automatic Compliant Receipts</span>
            <p className="text-slate-500 text-[11px] mt-1">
              Legomark automatically generates a tax receipt once an inward payment matches an outstanding Tax Invoice or Proforma deposit.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Receipt ID</th>
                  <th className="p-3">Inward Reference</th>
                  <th className="p-3">Associated Invoice</th>
                  <th className="p-3">Customer Entity</th>
                  <th className="p-3">Receipt Date</th>
                  <th className="p-3">Cleared Amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {receipts.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{rec.id}</td>
                    <td className="p-3 font-mono text-slate-500">{rec.paymentRef}</td>
                    <td className="p-3 font-mono text-slate-500">{rec.invoiceId}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{rec.customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{rec.customer.email}</p>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{rec.date}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{rec.amount.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setViewingDoc({ type: "Receipt", id: rec.id, data: rec })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold rounded text-slate-700 transition"
                      >
                        PDF Mock Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* G. REFUNDS SUB-TAB */}
      {billingSubTab === "refunds" && (
        <div className="space-y-4" id="billing-subtab-refunds">
          <div className="bg-white p-3 border border-slate-200 rounded-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Refund Audit Registers</span>
              <span className="text-slate-400 text-[10px]">Verify and issue customer settlement refunds manually below.</span>
            </div>
            <button
              onClick={() => setShowRefundModal(true)}
              className="px-3.5 py-1.5 bg-brand-primary-950 text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Trigger Refund Claim
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Refund ID</th>
                  <th className="p-3">Associated Payment</th>
                  <th className="p-3">Authorized Date</th>
                  <th className="p-3">Refund Reasons</th>
                  <th className="p-3">Approved By</th>
                  <th className="p-3">Refunded Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {refunds.map(ref => (
                  <tr key={ref.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{ref.id}</td>
                    <td className="p-3 font-mono text-slate-500">{ref.paymentId}</td>
                    <td className="p-3 font-mono text-slate-500">{ref.date}</td>
                    <td className="p-3 text-slate-600 italic max-w-[200px] truncate">{ref.reason}</td>
                    <td className="p-3 text-slate-700 font-medium">{ref.approvedBy}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{ref.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-800">
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* H. CREDIT/DEBIT NOTES SUB-TAB */}
      {billingSubTab === "credit-notes" && (
        <div className="space-y-4" id="billing-subtab-notes">
          <div className="bg-white p-3 border border-slate-200 rounded-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Credit & Debit Surcharges</span>
              <span className="text-slate-400 text-[10px]">Post adjustments to tax liabilities according to central audit compliance rules.</span>
            </div>
            <button
              onClick={() => setShowCreditModal(true)}
              className="px-3.5 py-1.5 bg-brand-primary-950 text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Issue Adjustment Note
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-150">
                <tr>
                  <th className="p-3">Note Number</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Linked Invoice</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Authorized Date</th>
                  <th className="p-3">Adjustment Reason</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {creditNotes.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{n.id}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                        n.type === "Credit Note" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"
                      }`}>
                        {n.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{n.originalInvoiceId}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{n.customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{n.customer.email}</p>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{n.date}</td>
                    <td className="p-3 text-slate-500 truncate max-w-[150px]">{n.reason}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{n.amount.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setViewingDoc({ type: "Credit Note", id: n.id, data: n })}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold rounded text-slate-700 transition"
                      >
                        PDF Mock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* I. CHRONOLOGICAL LEDGER SUB-TAB */}
      {billingSubTab === "ledger" && (
        <div className="space-y-4" id="billing-subtab-ledger">
          <div className="bg-white p-3.5 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Filter Ledger Accounts</span>
            </div>
            
            <select
              value={selectedCustomerEmail}
              onChange={(e) => setSelectedCustomerEmail(e.target.value)}
              className="text-xs border border-slate-200 p-1.5 focus:border-teal-500 focus:outline-none rounded-md max-w-xs font-sans"
            >
              <option value="all">-- All Customers Combined Ledger --</option>
              {customersList.map(c => (
                <option key={c.email} value={c.email}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50/50 border-b border-slate-150 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Ledger Ledger Postings</span>
              <span className="text-[10px] text-slate-500">Chronological history mapping cash offsets</span>
            </div>

            <div className="p-4 divide-y divide-slate-100">
              {customerLedgerEntries.map(log => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4 text-xs">
                  <div className="flex gap-3">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-0.5">
                      {log.type}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">{log.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Ref ID: {log.refId} &bull; Date: {log.date} &bull; Client: {log.customerEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${
                      log.balanceEffect === "credit"
                        ? "text-green-600"
                        : log.balanceEffect === "debit"
                        ? "text-red-600"
                        : "text-slate-500"
                    }`}>
                      {log.balanceEffect === "credit" ? "+" : log.balanceEffect === "debit" ? "-" : ""}
                      ₹{log.amount.toLocaleString()}
                    </span>
                    <p className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest">{log.balanceEffect}</p>
                  </div>
                </div>
              ))}

              {customerLedgerEntries.length === 0 && (
                <div className="p-10 text-center text-slate-400 text-xs">
                  No registered entries in this client ledger accounts yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL 1: CREATE QUOTATION
          ========================================== */}
      {showQuotationModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Create Quotation Invoice</span>
              <button onClick={() => setShowQuotationModal(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateQuotationSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name *</label>
                  <input type="text" required value={newQuoteCustName} onChange={(e) => setNewQuoteCustName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Email *</label>
                  <input type="email" required value={newQuoteCustEmail} onChange={(e) => setNewQuoteCustEmail(e.target.value)} placeholder="e.g. rahul@sharma.in" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Phone</label>
                  <input type="text" value={newQuoteCustPhone} onChange={(e) => setNewQuoteCustPhone(e.target.value)} placeholder="e.g. 91234 56789" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input type="text" value={newQuoteCustCompany} onChange={(e) => setNewQuoteCustCompany(e.target.value)} placeholder="e.g. Sharma Enterprises Ltd" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service</label>
                  <select value={newQuoteService} onChange={(e) => setNewQuoteService(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none">
                    <option value="Private Limited Company">Private Limited Company</option>
                    <option value="One Person Company">One Person Company</option>
                    <option value="Limited Liability Partnership">Limited Liability Partnership</option>
                    <option value="GST Registration">GST Registration</option>
                    <option value="GST Return Filing">GST Return Filing</option>
                    <option value="Trademark Registration">Trademark Registration</option>
                    <option value="FSSAI Food License">FSSAI Food License</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Package Name</label>
                  <input type="text" value={newQuotePackage} onChange={(e) => setNewQuotePackage(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Price (₹)</label>
                  <input type="number" required value={newQuoteUnitPrice} onChange={(e) => setNewQuoteUnitPrice(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount (₹)</label>
                  <input type="number" value={newQuoteDiscount} onChange={(e) => setNewQuoteDiscount(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST %</label>
                  <select value={newQuoteGst} onChange={(e) => setNewQuoteGst(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono">
                    <option value={0}>0% Exempted</option>
                    <option value={18}>18% Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes</label>
                <textarea rows={2} value={newQuoteNotes} onChange={(e) => setNewQuoteNotes(e.target.value)} placeholder="Waiver guidelines, terms..." className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-sans" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowQuotationModal(false)} className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded">Generate Quotation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: CREATE PROFORMA
          ========================================== */}
      {showProformaModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Create Proforma Invoice</span>
              <button onClick={() => setShowProformaModal(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateProformaSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name *</label>
                  <input type="text" required value={newProfCustName} onChange={(e) => setNewProfCustName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Email *</label>
                  <input type="email" required value={newProfCustEmail} onChange={(e) => setNewProfCustEmail(e.target.value)} placeholder="e.g. rahul@sharma.in" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Phone</label>
                  <input type="text" value={newProfCustPhone} onChange={(e) => setNewProfCustPhone(e.target.value)} placeholder="e.g. 91234 56789" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input type="text" value={newProfCustCompany} onChange={(e) => setNewProfCustCompany(e.target.value)} placeholder="e.g. Sharma Enterprises Ltd" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service</label>
                  <select value={newProfService} onChange={(e) => setNewProfService(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none">
                    <option value="Private Limited Company">Private Limited Company</option>
                    <option value="GST Registration">GST Registration</option>
                    <option value="Trademark Registration">Trademark Registration</option>
                    <option value="FSSAI Food License">FSSAI Food License</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Package Name</label>
                  <input type="text" value={newProfPackage} onChange={(e) => setNewProfPackage(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input type="number" required value={newProfPrice} onChange={(e) => setNewProfPrice(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount (₹)</label>
                  <input type="number" value={newProfDiscount} onChange={(e) => setNewProfDiscount(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST %</label>
                  <select value={newProfGst} onChange={(e) => setNewProfGst(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono">
                    <option value={18}>18% Standard</option>
                    <option value={0}>0% Exempted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Terms of Supply</label>
                <input type="text" value={newProfTerms} onChange={(e) => setNewProfTerms(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProformaModal(false)} className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded">Generate Proforma</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: DIRECT TAX INVOICE (GST COMPLIANT)
          ========================================== */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Issue GST-Compliant Tax Invoice</span>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateInvoiceSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name *</label>
                  <input type="text" required value={newInvCustName} onChange={(e) => setNewInvCustName(e.target.value)} placeholder="Rahul Sharma" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Email *</label>
                  <input type="email" required value={newInvCustEmail} onChange={(e) => setNewInvCustEmail(e.target.value)} placeholder="sharma@corp.in" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer GSTIN</label>
                  <input type="text" value={newInvCustGstin} onChange={(e) => setNewInvCustGstin(e.target.value)} placeholder="e.g. 29AAACF1234F1ZX" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono uppercase" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Place of Supply *</label>
                  <select value={newInvPlaceSupply} onChange={(e) => setNewInvPlaceSupply(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none">
                    <option value="Delhi">Delhi (Intrastate - CGST/SGST)</option>
                    <option value="Karnataka">Karnataka (Interstate - IGST)</option>
                    <option value="Maharashtra">Maharashtra (Interstate - IGST)</option>
                    <option value="Tamil Nadu">Tamil Nadu (Interstate - IGST)</option>
                    <option value="Gujarat">Gujarat (Interstate - IGST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service & HSN/SAC Code</label>
                  <select value={newInvHsnSac} onChange={(e) => {
                    setNewInvHsnSac(e.target.value);
                    if (e.target.value === "998221") {
                      setNewInvService("Private Limited Company");
                    } else if (e.target.value === "998222") {
                      setNewInvService("GST Registration");
                    }
                  }} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-sans">
                    <option value="998221">Legal Consultancy services (998221)</option>
                    <option value="998222">Accounting / Auditing (998222)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Package Designation</label>
                  <input type="text" value={newInvPackage} onChange={(e) => setNewInvPackage(e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taxable Amount (₹) *</label>
                  <input type="number" required value={newInvTaxable} onChange={(e) => setNewInvTaxable(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST Rate % *</label>
                  <select value={newInvGstRate} onChange={(e) => setNewInvGstRate(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono">
                    <option value={18}>18% Standard</option>
                    <option value={0}>0% Exempted</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowInvoiceModal(false)} className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded">Issue Tax Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 4: RECORD INWARD PAYMENT (UPI / MANUAL WIRE)
          ========================================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Log Incoming Payment wire</span>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleRegisterPaymentSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Tax Invoice Number *</label>
                <select
                  required
                  value={payInvoiceId}
                  onChange={(e) => {
                    setPayInvoiceId(e.target.value);
                    const inv = invoices.find(i => i.id === e.target.value);
                    if (inv) setPayAmount(inv.totalAmount);
                  }}
                  className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono"
                >
                  <option value="">-- Choose Invoice to credit --</option>
                  {invoices.filter(i => i.paymentStatus !== "Paid").map(i => (
                    <option key={i.id} value={i.id}>{i.id} ({i.customer.name}) - ₹{i.totalAmount.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount Received (₹) *</label>
                <input type="number" required value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method *</label>
                  <select value={payMethod} onChange={(e) => setPayMethod(e.target.value as any)} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-bold">
                    <option value="UPI">UPI Transfer</option>
                    <option value="Bank Transfer">Bank wire (NEFT/RTGS)</option>
                    <option value="Razorpay">Razorpay Checkout Sandbox</option>
                    <option value="Cash">Cash Deposit</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">UTR / UPI Transaction Ref</label>
                  <input type="text" value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. UTR-99882244" className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded">Credit Account Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 5: PROCESS CLIENT REFUND
          ========================================== */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-red-400">Trigger Approved Bank Refund</span>
              <button onClick={() => setShowRefundModal(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateRefundSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Original Payment Reference ID *</label>
                <select
                  required
                  value={refPaymentId}
                  onChange={(e) => {
                    setRefPaymentId(e.target.value);
                    const pay = payments.find(p => p.id === e.target.value);
                    if (pay) setRefAmount(pay.amount);
                  }}
                  className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono"
                >
                  <option value="">-- Choose Payment ID --</option>
                  {payments.filter(p => p.status === "Success").map(p => (
                    <option key={p.id} value={p.id}>{p.id} ({p.customerEmail}) - ₹{p.amount.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Refund Amount (₹) *</label>
                <input type="number" required value={refAmount} onChange={(e) => setRefAmount(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono text-red-600" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Settlement Refund *</label>
                <textarea required rows={2} value={refReason} onChange={(e) => setRefReason(e.target.value)} placeholder="MCA filing fee waiver, etc..." className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRefundModal(false)} className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded">Approve Refund</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 6: CREDIT / DEBIT NOTE
          ========================================== */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Issue Credit / Debit Adjustment Surcharge</span>
              <button onClick={() => setShowCreditModal(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateCreditSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCreditType("Credit Note")}
                  className={`py-2 text-center text-xs font-bold rounded-lg border cursor-pointer transition ${
                    creditType === "Credit Note" ? "bg-purple-50 text-purple-700 border-purple-300" : "border-slate-200 text-slate-500"
                  }`}
                >
                  Credit Note (Refund Offset)
                </button>
                <button
                  type="button"
                  onClick={() => setCreditType("Debit Note")}
                  className={`py-2 text-center text-xs font-bold rounded-lg border cursor-pointer transition ${
                    creditType === "Debit Note" ? "bg-orange-50 text-orange-700 border-orange-300" : "border-slate-200 text-slate-500"
                  }`}
                >
                  Debit Note (Surcharge Fee)
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Tax Invoice Number *</label>
                <select
                  required
                  value={creditInvoiceId}
                  onChange={(e) => setCreditInvoiceId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono"
                >
                  <option value="">-- Choose Invoice --</option>
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>{i.id} ({i.customer.name}) - ₹{i.totalAmount.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Adjustment Amount (₹) *</label>
                <input type="number" required value={creditAmount} onChange={(e) => setCreditAmount(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none font-mono" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Audit Adjustment Reason *</label>
                <textarea required rows={2} value={creditReason} onChange={(e) => setCreditReason(e.target.value)} placeholder="Intra-state rate tax adjustment corrections..." className="w-full p-2 border border-slate-200 rounded focus:border-teal-500 focus:outline-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreditModal(false)} className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 font-bold">Cancel</button>
                <button type="submit" className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded">Issue Note</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL 7: HIGH-FIDELITY PRINT LETTERHEAD/PDF SIMULATOR
          ========================================== */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="bg-brand-primary-950 p-4 text-white flex justify-between items-center print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Compliant Document Layout Simulator ({viewingDoc.type})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toast.success("Triggering physical hardware print overlay...");
                    window.print();
                  }}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Out
                </button>
                <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Simulated exact physical print letterhead layout canvas */}
            <div className="p-8 sm:p-12 bg-white text-slate-800 font-sans shadow-inner leading-relaxed text-xs space-y-8" id="visual-pdf-printhead">
              
              {/* Header Company Information block */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-brand-primary-950 text-brand-secondary-500 rounded flex items-center justify-center font-black">
                      LM
                    </div>
                    <span className="text-sm font-display font-black tracking-tight text-brand-primary-950">
                      LEGOMARK INDIA
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal max-w-xs">
                    D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025<br />
                    GSTIN: 29AAACL9988A1Z5 &bull; info@legomarkindia.com
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <h3 className="text-lg font-display font-black text-slate-900 uppercase tracking-tight">{viewingDoc.type}</h3>
                  <p className="font-mono text-slate-500">Number: <span className="text-slate-900 font-bold">{viewingDoc.id}</span></p>
                  <p className="font-mono text-slate-500">Date: <span className="text-slate-900 font-bold">{viewingDoc.data.createdAt || viewingDoc.data.invoiceDate || viewingDoc.data.date}</span></p>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-8 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px] font-mono">Billed to Customer:</span>
                  <p className="font-bold text-slate-900 text-sm">{viewingDoc.data.customer.name}</p>
                  {viewingDoc.data.customer.companyName && (
                    <p className="font-semibold text-slate-700">{viewingDoc.data.customer.companyName}</p>
                  )}
                  <p className="text-slate-500">Email: {viewingDoc.data.customer.email}</p>
                  <p className="text-slate-500">Phone: {viewingDoc.data.customer.phone || "+91 75308 47878"}</p>
                  {viewingDoc.data.customer.gstin && (
                    <p className="font-mono text-teal-600 font-bold">GSTIN: {viewingDoc.data.customer.gstin}</p>
                  )}
                </div>
                <div className="space-y-1 text-right">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px] font-mono">Supplier Entity:</span>
                  <p className="font-bold text-brand-primary-950 text-sm">Legomark India Private Ltd</p>
                  <p className="text-slate-500">Corporate Compliance & Legal Filing Division</p>
                  <p className="text-slate-500">HQ Office: Delhi Office</p>
                  {viewingDoc.data.placeOfSupply && (
                    <p className="font-medium text-slate-700">Place of Supply: {viewingDoc.data.placeOfSupply}</p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden mt-6">
                <table className="w-full text-left text-slate-800">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono font-bold text-slate-500">
                    <tr>
                      <th className="p-3">Particulars & HSN/SAC Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Discount</th>
                      <th className="p-3 text-right">Total Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-[11px]">
                    {viewingDoc.type === "Quotation" ? (
                      viewingDoc.data.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-slate-900">
                            {item.description}
                          </td>
                          <td className="p-3 text-center font-mono">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono">₹{(viewingDoc.data.discount).toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-bold">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{viewingDoc.data.service}</p>
                          <p className="text-slate-400 text-[10px]">{viewingDoc.data.packageName}</p>
                          {viewingDoc.data.hsnSac && (
                            <p className="text-[10px] text-teal-600 font-mono mt-0.5">SAC Classification: {viewingDoc.data.hsnSac}</p>
                          )}
                        </td>
                        <td className="p-3 text-center font-mono">1</td>
                        <td className="p-3 text-right font-mono">₹{(viewingDoc.data.taxableAmount || viewingDoc.data.price || viewingDoc.data.amount).toLocaleString()}</td>
                        <td className="p-3 text-right font-mono">₹{(viewingDoc.data.discount || 0).toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold">₹{(viewingDoc.data.taxableAmount || viewingDoc.data.price || viewingDoc.data.amount).toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial calculations block */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 text-[11px] border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Subtotal (Taxable Value):</span>
                    <span className="font-mono text-slate-800">₹{(viewingDoc.data.taxableAmount || viewingDoc.data.price - (viewingDoc.data.discount || 0) || viewingDoc.data.amount).toLocaleString()}</span>
                  </div>

                  {viewingDoc.data.cgstAmount > 0 && (
                    <>
                      <div className="flex justify-between text-slate-500">
                        <span>CGST ({viewingDoc.data.cgstRate}%):</span>
                        <span className="font-mono">₹{viewingDoc.data.cgstAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>SGST ({viewingDoc.data.sgstRate}%):</span>
                        <span className="font-mono">₹{viewingDoc.data.sgstAmount.toLocaleString()}</span>
                      </div>
                    </>
                  )}

                  {viewingDoc.data.igstAmount > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>IGST ({viewingDoc.data.igstRate}%):</span>
                      <span className="font-mono">₹{viewingDoc.data.igstAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {!viewingDoc.data.igstAmount && !viewingDoc.data.cgstAmount && viewingDoc.data.gstAmount > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>GST ({viewingDoc.data.gstPercent}%):</span>
                      <span className="font-mono">₹{viewingDoc.data.gstAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm">
                    <span className="font-black text-slate-900">Total Payable Amount:</span>
                    <span className="font-mono font-black text-slate-900 text-base">₹{viewingDoc.data.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bottom footer declarations and signatures */}
              <div className="pt-10 border-t border-slate-100 flex justify-between items-end text-[10px]">
                <div className="space-y-1 max-w-sm">
                  <p className="font-bold text-slate-800">Terms & Declaration Guidelines:</p>
                  <p className="text-slate-400 leading-normal">
                    This document is digitally prepared under corporate audit rules. Value added calculations remain valid until final government filing review. Standard legal fees once deposited are subject to compliance escrow guidelines.
                  </p>
                </div>
                <div className="text-right space-y-3.5">
                  <p className="text-slate-400 font-semibold uppercase font-mono tracking-wider text-[8px]">Authorized Signatory</p>
                  <div className="h-6 w-32 border-b border-slate-300 ml-auto" />
                  <p className="font-bold text-slate-900">Legomark Filing Desk</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
