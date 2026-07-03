/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  LifeBuoy,
  User,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  Download,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Lock,
  Plus,
  Phone,
  Mail,
  ArrowLeft,
  File,
  Shield,
  HelpCircle,
  ArrowRight,
  Sliders,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext.js";
import { useToast } from "../contexts/ToastContext.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";
import {
  AdminOrder,
  initialOrders,
  getStoredState,
  setStoredState,
  AdminQuotation,
  initialQuotations,
  ProformaInvoice,
  initialProformas,
  TaxInvoice,
  initialInvoices,
  PaymentRecord,
  initialPayments,
  ReceiptRecord,
  initialReceipts,
  RefundRecord,
  initialRefunds,
  CreditDebitNote,
  initialCreditDebitNotes,
  LedgerEntry,
  initialLedgerEntries
} from "../data/adminStore.js";

// Types for ticketing
interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  messages: {
    id: string;
    sender: "client" | "support";
    senderName: string;
    content: string;
    createdAt: string;
  }[];
}

interface ClientNotification {
  id: string;
  title: string;
  description: string;
  type: "order" | "document" | "payment" | "support";
  date: string;
  read: boolean;
}

export default function ClientPortalPage() {
  const { config: brandConfig } = useBrandMedia();
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Client Portal | Legomark India Secure Workspace";
  }, []);

  // 1. Sidebar and Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "documents" | "invoices" | "tickets" | "profile">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // 2. Global Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 3. Document Simulation States
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [customFiles, setCustomFiles] = useState<{ id: string; name: string; size: string; date: string; orderId?: string }[]>(() => {
    return getStoredState("client_uploaded_files", [
      { id: "f-1", name: "Incorporation_Receipt.pdf", size: "220 KB", date: "2026-06-25", orderId: "ORD-2026-002" },
      { id: "f-2", name: "PAN_Card_Signed.pdf", size: "145 KB", date: "2026-06-21", orderId: "ORD-2026-001" },
    ]);
  });

  // 4. Notifications State
  const [notifications, setNotifications] = useState<ClientNotification[]>(() => {
    return getStoredState("client_notifications", [
      { id: "n-1", title: "Order Assigned to Expert", description: "Your Trademark Filing has been assigned to Rajesh Kumar.", type: "order", date: "2 hours ago", read: false },
      { id: "n-2", title: "Document Action Needed", description: "Please upload self-attested PAN card draft.", type: "document", date: "1 day ago", read: false },
      { id: "n-3", title: "Payment Confirmed", description: "Payment of ₹13,160 was received for Private Limited Company.", type: "payment", date: "2 days ago", read: true },
      { id: "n-4", title: "Support Reply Recieved", description: "Your support ticket #TKT-884 has a new message.", type: "support", date: "3 days ago", read: true }
    ]);
  });
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // 5. Ticketing States
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    return getStoredState("client_tickets", [
      {
        id: "TKT-2026-001",
        subject: "DSC Verification Video OTP link issue",
        description: "The link sent for video recording of DSC is showing expired. Kindly re-trigger.",
        priority: "High",
        status: "Open",
        createdAt: "2026-06-27 11:30 AM",
        messages: [
          {
            id: "m-1",
            sender: "client",
            senderName: user?.fullName || "Client",
            content: "The link sent for video recording of DSC is showing expired. Kindly re-trigger.",
            createdAt: "2026-06-27 11:30 AM"
          },
          {
            id: "m-2",
            sender: "support",
            senderName: "Sanjana Sen",
            content: "We apologize for the inconvenience. Let me request a fresh verification link from the e-Mudhra system immediately.",
            createdAt: "2026-06-27 11:45 AM"
          }
        ]
      },
      {
        id: "TKT-2026-002",
        subject: "GST Registration turnaround duration",
        description: "Can we expect the GSTIN by the end of this month? We need it for contract signing.",
        priority: "Medium",
        status: "In Progress",
        createdAt: "2026-06-24 03:15 PM",
        messages: [
          {
            id: "m-3",
            sender: "client",
            senderName: user?.fullName || "Client",
            content: "Can we expect the GSTIN by the end of this month? We need it for contract signing.",
            createdAt: "2026-06-24 03:15 PM"
          }
        ]
      }
    ]);
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketMessageText, setTicketMessageText] = useState("");

  // 6. Profile States
  const [profileName, setProfileName] = useState(user?.fullName || "");
  const [profilePhone, setProfilePhone] = useState("98765 43210");
  const [profileCompany, setProfileCompany] = useState("");
  const [profileGst, setProfileGst] = useState("29AAFCL1234F1Z5");
  const [profileAddress, setProfileAddress] = useState("12, Industrial Main Road, Koramangala, Bengaluru - 560034");
  const [passCurrent, setPassCurrent] = useState("");
  const [passNew, setPassNew] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  // Save changes to local states
  useEffect(() => {
    setStoredState("client_uploaded_files", customFiles);
  }, [customFiles]);

  useEffect(() => {
    setStoredState("client_notifications", notifications);
  }, [notifications]);

  useEffect(() => {
    setStoredState("client_tickets", tickets);
  }, [tickets]);

  // Sync state initially with user metadata if login changed
  useEffect(() => {
    if (user) {
      setProfileName(user.fullName || "");
      if (user.email === "sunita@deshmukhfoods.co") {
        setProfileCompany("Deshmukh Foods Private Limited");
        setProfilePhone("94445 55666");
      } else if (user.email === "aman@malhotrasports.com") {
        setProfileCompany("Malhotra Sports PLC");
        setProfilePhone("98765 43210");
      } else {
        setProfileCompany("Sharma Enterprises Ltd");
        setProfilePhone("91234 56789");
      }
    }
  }, [user]);

  // 7. Load and Sync Admin Orders
  const [allOrders, setAllOrders] = useState<AdminOrder[]>(() => {
    return getStoredState("orders", initialOrders);
  });

  // Load and sync financial states
  const [quotations, setQuotations] = useState<AdminQuotation[]>(() => getStoredState("quotations", initialQuotations));
  const [proformas, setProformas] = useState<ProformaInvoice[]>(() => getStoredState("proformas", initialProformas));
  const [invoices, setInvoices] = useState<TaxInvoice[]>(() => getStoredState("invoices", initialInvoices));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getStoredState("payments", initialPayments));
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(() => getStoredState("receipts", initialReceipts));
  const [refunds, setRefunds] = useState<RefundRecord[]>(() => getStoredState("refunds", initialRefunds));
  const [creditNotes, setCreditNotes] = useState<CreditDebitNote[]>(() => getStoredState("credit_debit_notes", initialCreditDebitNotes));
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => getStoredState("ledger_entries", initialLedgerEntries));

  // Load live billing and compliance records from the production Express backend on mount
  useEffect(() => {
    async function loadClientBackendData() {
      if (!user) return;
      const token = localStorage.getItem("efilingg_token");
      if (!token) return;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      try {
        const [ordersRes, billingRes, ticketsRes] = await Promise.all([
          fetch("/api/orders", { headers }).then(r => r.json()).catch(() => ({ success: false })),
          fetch("/api/billing/dashboard", { headers }).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`/api/support/tickets/client/${user.email}`, { headers }).then(r => r.json()).catch(() => ({ success: false }))
        ]);

        if (ordersRes.success && ordersRes.data) {
          setAllOrders(ordersRes.data);
        }

        if (billingRes.success && billingRes.data) {
          const { quotations: q, proformas: pf, invoices: inv, payments: pay, receipts: rec, refunds: ref, creditNotes: cn, ledger: led } = billingRes.data;
          if (q) setQuotations(q);
          if (pf) setProformas(pf);
          if (inv) setInvoices(inv);
          if (pay) setPayments(pay);
          if (rec) setReceipts(rec);
          if (ref) setRefunds(ref);
          if (cn) setCreditNotes(cn);
          if (led) setLedger(led);
        }

        if (ticketsRes.success && ticketsRes.data) {
          setTickets(ticketsRes.data);
        }
      } catch (err) {
        console.warn("Client Portal API sync fallback: server data unavailable.", err);
      }
    }
    loadClientBackendData();
  }, [user]);

  const saveQuotations = (data: AdminQuotation[]) => { setQuotations(data); setStoredState("quotations", data); };
  const saveProformas = (data: ProformaInvoice[]) => { setProformas(data); setStoredState("proformas", data); };
  const saveInvoices = (data: TaxInvoice[]) => { setInvoices(data); setStoredState("invoices", data); };
  const savePayments = (data: PaymentRecord[]) => { setPayments(data); setStoredState("payments", data); };
  const saveReceipts = (data: ReceiptRecord[]) => { setReceipts(data); setStoredState("receipts", data); };
  const saveLedger = (data: LedgerEntry[]) => { setLedger(data); setStoredState("ledger_entries", data); };

  const clientQuotations = useMemo(() => {
    if (!user) return [];
    return quotations.filter(q => q.customer.email.toLowerCase() === user.email.toLowerCase());
  }, [quotations, user]);

  const clientProformas = useMemo(() => {
    if (!user) return [];
    return proformas.filter(p => p.customer.email.toLowerCase() === user.email.toLowerCase());
  }, [proformas, user]);

  const clientInvoices = useMemo(() => {
    if (!user) return [];
    return invoices.filter(i => i.customer.email.toLowerCase() === user.email.toLowerCase());
  }, [invoices, user]);

  const clientPayments = useMemo(() => {
    if (!user) return [];
    return payments.filter(p => p.customerEmail.toLowerCase() === user.email.toLowerCase());
  }, [payments, user]);

  const clientReceipts = useMemo(() => {
    if (!user) return [];
    return receipts.filter(r => r.customer.email.toLowerCase() === user.email.toLowerCase());
  }, [receipts, user]);

  const clientLedger = useMemo(() => {
    if (!user) return [];
    return ledger.filter(l => l.customerEmail.toLowerCase() === user.email.toLowerCase());
  }, [ledger, user]);

  const [payingInvoice, setPayingInvoice] = useState<TaxInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "UPI" | "Bank Transfer">("UPI");
  const [paymentRefInput, setPaymentRefInput] = useState("");
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Automatically check if logged-in customer has any orders. If client@example.com is logged in, auto-seed 2 premium orders so they see rich analytics!
  useEffect(() => {
    if (!user) return;
    const currentOrders = getStoredState<AdminOrder[]>("orders", initialOrders);
    const clientEmail = user.email.toLowerCase();

    const hasOrder = currentOrders.some(
      (o) => o.customer.email.toLowerCase() === clientEmail
    );

    if (!hasOrder) {
      // Create beautiful custom orders for demo client
      const demoOrders: AdminOrder[] = [
        {
          id: "ORD-2026-003",
          customer: {
            name: user.fullName,
            email: clientEmail,
            phone: profilePhone,
            companyName: profileCompany || "Sharma Enterprises Ltd"
          },
          service: "Trademark Registration",
          packageName: "Express Logo & Wordmark Protection",
          price: 6500,
          gst: 1170,
          discount: 500,
          totalAmount: 7170,
          assignedExecutive: "Rajesh Kumar",
          paymentStatus: "Paid",
          serviceStatus: "Documents Received",
          createdAt: "2026-06-25",
          updatedAt: "2026-06-27",
          attachments: [
            { id: "att-3-1", name: "Logo_Trademark_Proof.png", type: "document", size: "320 KB", uploadDate: "2026-06-26" }
          ],
          notesHistory: [
            { id: "note-3-1", author: "Rajesh Kumar", note: "MSME Certificate verified. Applied for government discounted fee.", date: "2026-06-26" }
          ],
          statusHistory: [
            { id: "sh-3-1", fromStatus: "Documents Pending", toStatus: "Documents Received", updatedBy: "System", date: "2026-06-26" }
          ]
        },
        {
          id: "ORD-2026-004",
          customer: {
            name: user.fullName,
            email: clientEmail,
            phone: profilePhone,
            companyName: profileCompany || "Sharma Enterprises Ltd"
          },
          service: "Private Limited Company",
          packageName: "Premium Growth Bundle (DSC + DIN + MoA)",
          price: 15000,
          gst: 2700,
          discount: 1500,
          totalAmount: 16200,
          assignedExecutive: "Sanjana Sen",
          paymentStatus: "Paid",
          serviceStatus: "Awaiting Approval",
          createdAt: "2026-06-18",
          updatedAt: "2026-06-28",
          attachments: [
            { id: "att-4-1", name: "MoA_Draft_Approved.pdf", type: "document", size: "1.2 MB", uploadDate: "2026-06-24" },
            { id: "att-4-2", name: "AoA_Draft_Signed.pdf", type: "document", size: "850 KB", uploadDate: "2026-06-24" }
          ],
          notesHistory: [
            { id: "note-4-1", author: "Sanjana Sen", note: "SPICe+ Part B filed. Government approval awaited from MCA registrar.", date: "2026-06-28" }
          ],
          statusHistory: [
            { id: "sh-4-1", fromStatus: "Documents Pending", toStatus: "Documents Received", updatedBy: "Sanjana Sen", date: "2026-06-19" },
            { id: "sh-4-2", fromStatus: "Documents Received", toStatus: "Work Started", updatedBy: "Sanjana Sen", date: "2026-06-20" },
            { id: "sh-4-3", fromStatus: "Work Started", toStatus: "Government Submission", updatedBy: "Sanjana Sen", date: "2026-06-23" },
            { id: "sh-4-4", fromStatus: "Government Submission", toStatus: "Awaiting Approval", updatedBy: "Sanjana Sen", date: "2026-06-28" }
          ]
        }
      ];

      const merged = [...currentOrders, ...demoOrders];
      setAllOrders(merged);
      setStoredState("orders", merged);
    }
  }, [user, profilePhone, profileCompany]);

  // Filter orders to only display those belonging to current client email
  const clientOrders = useMemo(() => {
    if (!user) return [];
    const clientEmail = user.email.toLowerCase();
    return allOrders.filter(
      (o) => o.customer.email.toLowerCase() === clientEmail
    );
  }, [allOrders, user]);

  // 8. Overview Stats Calculations
  const activeOrdersCount = useMemo(() => {
    return clientOrders.filter(o => o.serviceStatus !== "Completed" && o.serviceStatus !== "Delivered").length;
  }, [clientOrders]);

  const completedServicesCount = useMemo(() => {
    return clientOrders.filter(o => o.serviceStatus === "Completed" || o.serviceStatus === "Delivered").length;
  }, [clientOrders]);

  const pendingDocumentsCount = useMemo(() => {
    return clientOrders.filter(o => o.serviceStatus === "Documents Pending").length;
  }, [clientOrders]);

  const totalBilled = useMemo(() => {
    return clientOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [clientOrders]);

  // 9. Global Search matching logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { orders: [], tickets: [], files: [] };
    const query = searchQuery.toLowerCase();

    const matchedOrders = clientOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.service.toLowerCase().includes(query) ||
        o.packageName.toLowerCase().includes(query)
    );

    const matchedTickets = tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );

    // Filter matching files (both custom uploads and default attachments)
    const matchedFiles: { name: string; size: string; type: string; orderId?: string }[] = [];
    clientOrders.forEach(o => {
      o.attachments?.forEach(a => {
        if (a.name.toLowerCase().includes(query)) {
          matchedFiles.push({ name: a.name, size: a.size, type: "Order File", orderId: o.id });
        }
      });
    });
    customFiles.forEach(cf => {
      if (cf.name.toLowerCase().includes(query)) {
        matchedFiles.push({ name: cf.name, size: cf.size, type: "Client Upload", orderId: cf.orderId });
      }
    });

    return {
      orders: matchedOrders,
      tickets: matchedTickets,
      files: matchedFiles
    };
  }, [searchQuery, clientOrders, tickets, customFiles]);

  const handleGlobalSearchClick = (type: "order" | "ticket" | "file", id?: string) => {
    setSearchQuery("");
    setShowSearchResults(false);
    if (type === "order" && id) {
      setSelectedOrderId(id);
      setActiveTab("orders");
    } else if (type === "ticket" && id) {
      setSelectedTicketId(id);
      setActiveTab("tickets");
    } else {
      setActiveTab("documents");
    }
  };

  // 10. Handler for Document Upload simulation
  const handleFileUploadSimulate = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newFile = {
              id: `f-${Date.now()}`,
              name: file.name,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              date: new Date().toISOString().split("T")[0],
              orderId: selectedOrderId || undefined
            };
            setCustomFiles(prevFiles => [newFile, ...prevFiles]);
            setUploadProgress(null);
            setUploadFileName("");
            toast.success(`"${file.name}" uploaded successfully.`, "File Deposited");
            
            // Log as notification
            const newNotif: ClientNotification = {
              id: `n-${Date.now()}`,
              title: "Document Uploaded",
              description: `You successfully uploaded "${file.name}" to your workspace.`,
              type: "document",
              date: "Just now",
              read: false
            };
            setNotifications(prevNotif => [newNotif, ...prevNotif]);
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // 11. Handler for sending Support Messages
  const handleSendTicketMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketMessageText.trim() || !selectedTicketId) return;

    const messageContent = ticketMessageText.trim();
    setTicketMessageText("");

    setTickets(prevTickets =>
      prevTickets.map(t => {
        if (t.id === selectedTicketId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender: "client",
                senderName: user?.fullName || "Client",
                content: messageContent,
                createdAt: "Just now"
              }
            ]
          };
        }
        return t;
      })
    );

    // Simulate instant notification and executive response
    setTimeout(() => {
      setTickets(prevTickets =>
        prevTickets.map(t => {
          if (t.id === selectedTicketId) {
            return {
              ...t,
              status: "In Progress",
              messages: [
                ...t.messages,
                {
                  id: `msg-rep-${Date.now()}`,
                  sender: "support",
                  senderName: "Sanjana Sen (Legomark Expert)",
                  content: `Hi ${user?.fullName || "Client"}, thank you for your query. An executive has been notified of your update and will verify this in our system shortly.`,
                  createdAt: "1 sec ago"
                }
              ]
            };
          }
          return t;
        })
      );
      toast.info("Legomark executive is responding...", "Support Reply");
    }, 1500);
  };

  // 12. Handler for Creating Support Ticket
  const handleCreateTicketSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketDesc.trim()) {
      toast.error("Please fill in all ticket details.", "Error");
      return;
    }

    const newTicket: SupportTicket = {
      id: `TKT-2026-00${tickets.length + 1}`,
      subject: newTicketSubject,
      description: newTicketDesc,
      priority: newTicketPriority,
      status: "Open",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: "client",
          senderName: user?.fullName || "Client",
          content: newTicketDesc,
          createdAt: "Just now"
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setNewTicketSubject("");
    setNewTicketDesc("");
    setShowNewTicketModal(false);
    setSelectedTicketId(newTicket.id);
    toast.success(`Ticket ${newTicket.id} has been opened.`, "Ticket Created");
  };

  // 13. PDF Download simulation handler
  const handlePdfDownloadSimulate = (invoiceId: string, serviceName: string) => {
    toast.info(`Preparing secure PDF packaging for invoice ${invoiceId}...`, "Invoice Generation");
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#";
      toast.success(`Downloaded Invoice_${invoiceId}_Receipt.pdf successfully!`, "Download Complete");
    }, 1200);
  };

  // Quotation accept & convert handler
  const handleAcceptQuotation = (quote: AdminQuotation) => {
    const updatedQuotes = quotations.map(q => {
      if (q.id === quote.id) {
        return { ...q, status: "Accepted" as const };
      }
      return q;
    });
    saveQuotations(updatedQuotes);

    // Auto-create corresponding AdminOrder if not exists
    const orderId = `ORD-2026-${quote.id.split("-").pop()}`;
    const orderExists = allOrders.some(o => o.id === orderId);

    if (!orderExists) {
      const newOrder: AdminOrder = {
        id: orderId,
        customer: {
          name: quote.customer.name,
          email: quote.customer.email,
          phone: quote.customer.phone || "9876543210",
          companyName: quote.customer.companyName || ""
        },
        service: quote.service,
        packageName: quote.packageName || "Standard Compliance Package",
        price: quote.items.reduce((sum, item) => sum + item.amount, 0),
        gst: quote.gstAmount || 0,
        discount: quote.discount || 0,
        totalAmount: quote.totalAmount,
        paymentStatus: "Pending",
        serviceStatus: "Documents Pending",
        assignedExecutive: "Sanjana Sen",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        attachments: [],
        notesHistory: [
          { id: "note-1", author: "System", note: `Order generated automatically from accepted Quotation ${quote.id}.`, date: new Date().toISOString().split("T")[0] }
        ],
        statusHistory: [
          { id: "sh-1", fromStatus: "New", toStatus: "Documents Pending", updatedBy: "System", date: new Date().toISOString().split("T")[0] }
        ]
      };
      const merged = [newOrder, ...allOrders];
      setAllOrders(merged);
      setStoredState("orders", merged);
    }

    // Auto-generate Proforma Invoice
    const proformaId = `PI-2026-${quote.id.split("-").pop()}`;
    const proformaExists = proformas.some(p => p.id === proformaId);
    if (!proformaExists) {
      const newProforma: ProformaInvoice = {
        id: proformaId,
        customer: quote.customer,
        service: quote.service,
        packageName: quote.packageName || "Standard Package",
        price: quote.items.reduce((sum, item) => sum + item.amount, 0),
        discount: quote.discount || 0,
        gstPercent: quote.gstPercent || 18,
        gstAmount: quote.gstAmount || 0,
        totalAmount: quote.totalAmount,
        notes: "Proforma generated from accepted Quotation.",
        terms: "Payment due within 7 days of proforma issuance.",
        status: "Sent",
        createdAt: new Date().toISOString().split("T")[0]
      };
      saveProformas([newProforma, ...proformas]);
    }

    // Add Ledger Entry
    const newLedgerEntry: LedgerEntry = {
      id: `LD-${Date.now()}`,
      customerEmail: quote.customer.email,
      date: new Date().toISOString().split("T")[0],
      description: `Quotation Accepted & Order Initialized: ${quote.service}`,
      type: "Quotation",
      amount: quote.totalAmount,
      refId: quote.id,
      balanceEffect: "neutral"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    // Send Notification
    const newNotif: ClientNotification = {
      id: `notif-${Date.now()}`,
      title: "Quotation Accepted & Order Placed",
      description: `Your trademark/corporate order for ${quote.service} has been scheduled successfully.`,
      type: "order",
      date: "Just now",
      read: false
    };
    setNotifications([newNotif, ...notifications]);

    toast.success(`Quotation ${quote.id} Accepted! Order and Proforma Invoice generated successfully.`, "Quote Accepted");
  };

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!payingInvoice) return;
    setIsProcessingPayment(true);
    const token = localStorage.getItem("efilingg_token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      // 1. Create order on Express backend
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers,
        body: JSON.stringify({ invoiceId: payingInvoice.id })
      }).then(r => r.json());

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to initiate Razorpay order");
      }

      const { order, keyId, customer } = orderRes.data;

      // 2. Try loading checkout.js script
      const scriptLoaded = await loadRazorpayScript();
      const RazorpayConstructor = (window as any).Razorpay;

      // If script is loaded and we have a valid constructor, open Razorpay Checkout
      if (scriptLoaded && RazorpayConstructor) {
        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Legomark India",
          description: `Invoice Payment: ${payingInvoice.id}`,
          order_id: order.id,
          prefill: {
            name: customer.name || "",
            email: customer.email || "",
            contact: customer.phone || ""
          },
          theme: {
            color: "#0F172A"
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers,
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  invoiceId: payingInvoice.id
                })
              }).then(r => r.json());

              if (verifyRes.success) {
                toast.success(`Payment verified and receipt ${verifyRes.data.receipt.id} generated!`, "Success");
                
                // Refresh client dashboard records from backend
                const syncRes = await fetch("/api/billing/dashboard", { headers }).then(r => r.json());
                if (syncRes.success && syncRes.data) {
                  const { quotations: q, proformas: pf, invoices: inv, payments: pay, receipts: rec, refunds: ref, creditNotes: cn, ledger: led } = syncRes.data;
                  if (q) setQuotations(q);
                  if (pf) setProformas(pf);
                  if (inv) setInvoices(inv);
                  if (pay) setPayments(pay);
                  if (rec) setReceipts(rec);
                  if (ref) setRefunds(ref);
                  if (cn) setCreditNotes(cn);
                  if (led) setLedger(led);
                }
                
                setPayingInvoice(null);
              } else {
                toast.error(verifyRes.message || "Verification failed.", "Signature Alert");
              }
            } catch (err) {
              toast.error("Internal verification response failed.", "Error");
            }
          }
        };

        const rzp = new RazorpayConstructor(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`, "Transaction Terminated");
        });
        rzp.open();
      } else {
        // Fallback Simulator: Beautiful local high-fidelity gateway simulation
        toast.info("Opening Razorpay Sandbox Simulation", "Sandbox Active");
        
        const mockPaymentId = `pay_sim_${Math.random().toString(36).substring(2, 10)}`;
        const mockSignature = `sig_sim_${Math.random().toString(36).substring(2, 20)}`;

        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers,
          body: JSON.stringify({
            razorpay_order_id: order.id,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: mockSignature,
            invoiceId: payingInvoice.id
          })
        }).then(r => r.json());

        if (verifyRes.success) {
          toast.success(`Razorpay Payment processed and verified via Backend!`, "Success");
          
          // Sync with server state
          const syncRes = await fetch("/api/billing/dashboard", { headers }).then(r => r.json());
          if (syncRes.success && syncRes.data) {
            const { quotations: q, proformas: pf, invoices: inv, payments: pay, receipts: rec, refunds: ref, creditNotes: cn, ledger: led } = syncRes.data;
            if (q) setQuotations(q);
            if (pf) setProformas(pf);
            if (inv) setInvoices(inv);
            if (pay) setPayments(pay);
            if (rec) setReceipts(rec);
            if (ref) setRefunds(ref);
            if (cn) setCreditNotes(cn);
            if (led) setLedger(led);
          }
          setPayingInvoice(null);
        } else {
          toast.error(verifyRes.message || "Simulation failed.", "Signature Failure");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize Razorpay checkout");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Payment process simulation
  const handleProcessPayment = () => {
    if (!payingInvoice) return;

    if (paymentMethod === "Razorpay") {
      handleRazorpayPayment();
      return;
    }

    const refNum = paymentRefInput.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Mark Invoice as Paid
    const updatedInvoices = invoices.map(i => {
      if (i.id === payingInvoice.id) {
        return { ...i, paymentStatus: "Paid" as const };
      }
      return i;
    });
    saveInvoices(updatedInvoices);

    // 2. Mark Order as Paid
    const matchingOrderId = `ORD-2026-${payingInvoice.id.split("-").pop()}`;
    const updatedOrders = allOrders.map(o => {
      if (o.id === matchingOrderId || o.id === payingInvoice.id) {
        return { ...o, paymentStatus: "Paid" as const };
      }
      return o;
    });
    setAllOrders(updatedOrders);
    setStoredState("orders", updatedOrders);

    // 3. Register Payment Record
    const newPayment: PaymentRecord = {
      id: `PMT-${Date.now()}`,
      invoiceId: payingInvoice.id,
      customerEmail: payingInvoice.customer.email.toLowerCase(),
      amount: payingInvoice.totalAmount,
      paidDate: new Date().toISOString().split("T")[0],
      method: paymentMethod as any,
      transactionRef: refNum,
      status: "Success"
    };
    savePayments([newPayment, ...payments]);

    // 4. Generate Receipt Record
    const newReceipt: ReceiptRecord = {
      id: `RCT-2026-${payingInvoice.id.split("-").pop()}`,
      paymentRef: newPayment.id,
      customer: payingInvoice.customer,
      amount: payingInvoice.totalAmount,
      date: newPayment.paidDate,
      invoiceId: payingInvoice.id
    };
    saveReceipts([newReceipt, ...receipts]);

    // 5. Add Ledger Entry
    const newLedgerEntry: LedgerEntry = {
      id: `LD-${Date.now()}`,
      customerEmail: payingInvoice.customer.email,
      date: new Date().toISOString().split("T")[0],
      description: `Payment Received via ${paymentMethod} (${refNum})`,
      type: "Payment",
      amount: payingInvoice.totalAmount,
      refId: newReceipt.id,
      balanceEffect: "credit"
    };
    saveLedger([newLedgerEntry, ...ledger]);

    // 6. Notify Client
    const newNotif: ClientNotification = {
      id: `notif-${Date.now()}`,
      title: "Payment Confirmed Successfully",
      description: `Receipt ${newReceipt.id} generated for amount ₹${payingInvoice.totalAmount.toLocaleString()}.`,
      type: "payment",
      date: "Just now",
      read: false
    };
    setNotifications([newNotif, ...notifications]);

    toast.success(`Payment of ₹${payingInvoice.totalAmount.toLocaleString()} confirmed via ${paymentMethod}!`, "Payment Received");
    setPayingInvoice(null);
    setPaymentRefInput("");
  };

  // 14. Update Profile handler
  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Company profile settings updated successfully in active session.", "Profile Saved");
  };

  // 15. Change Password architecture handler
  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!passCurrent || !passNew || !passConfirm) {
      toast.error("Please fill in all password fields.", "Error");
      return;
    }
    if (passNew !== passConfirm) {
      toast.error("New passwords do not match.", "Mismatch");
      return;
    }
    toast.success("Security credentials updated. Next log in will require new password (Architecture only).", "Password Reset");
    setPassCurrent("");
    setPassNew("");
    setPassConfirm("");
  };

  // Mark notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read.", "Cleared");
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="client-workspace-root">
      {/* 1. Header Navigation Bar */}
      <header className="bg-brand-primary-950 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              id="mobile-sidebar-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center p-0.5 border border-slate-700 shadow-sm">
                <img
                  key={brandConfig.logo.url}
                  src={brandConfig.logo.url || "/logo.png"}
                  alt="Legomark India Logo"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = "true";
                      target.src = "/logo.png";
                    }
                  }}
                />
              </div>
              <div>
                <span className="font-display font-black tracking-tight text-lg text-white">
                  LEGOMARK
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-secondary-400 block -mt-1 font-bold">
                  Workspace
                </span>
              </div>
            </div>
          </div>

          {/* Breadcrumbs for desktop */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-brand-secondary-400 uppercase tracking-wider font-semibold">
              {activeTab}
            </span>
            {selectedOrderId && activeTab === "orders" && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white font-semibold">{selectedOrderId}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Global Search Inputs */}
            <div className="relative hidden sm:block w-64 md:w-80">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search orders, tickets, files..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="w-full text-xs py-2 pl-9 pr-4 bg-slate-800/80 hover:bg-slate-800 focus:bg-white text-slate-100 focus:text-slate-900 placeholder-slate-400 rounded-lg border border-slate-700/60 focus:border-brand-secondary-500 focus:outline-none transition-all duration-200 shadow-inner font-sans font-medium"
                id="global-workspace-search"
                onFocus={() => setShowSearchResults(true)}
              />

              {/* Global Search Results Overlay */}
              {showSearchResults && searchQuery.trim().length > 0 && (
                <div className="absolute top-11 right-0 w-[350px] md:w-[450px] bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Search Results</span>
                    <button onClick={() => setShowSearchResults(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
                    {/* Orders Section */}
                    {searchResults.orders.length > 0 && (
                      <div className="p-2.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Matching Orders</div>
                        {searchResults.orders.map(o => (
                          <button
                            key={o.id}
                            onClick={() => handleGlobalSearchClick("order", o.id)}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs transition"
                          >
                            <span className="font-semibold text-slate-800">{o.service}</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{o.id}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tickets Section */}
                    {searchResults.tickets.length > 0 && (
                      <div className="p-2.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Matching Tickets</div>
                        {searchResults.tickets.map(t => (
                          <button
                            key={t.id}
                            onClick={() => handleGlobalSearchClick("ticket", t.id)}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs transition"
                          >
                            <span className="font-semibold text-slate-800 truncate max-w-[200px]">{t.subject}</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{t.id}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Files Section */}
                    {searchResults.files.length > 0 && (
                      <div className="p-2.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Matching Documents</div>
                        {searchResults.files.map((f, i) => (
                          <button
                            key={i}
                            onClick={() => handleGlobalSearchClick("file", f.orderId)}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs transition"
                          >
                            <span className="font-semibold text-slate-800 truncate max-w-[220px]">{f.name}</span>
                            <span className="text-[10px] text-brand-secondary-600 font-bold">{f.type}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.orders.length === 0 && searchResults.tickets.length === 0 && searchResults.files.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No matches found for &quot;<span className="font-bold text-slate-600">{searchQuery}</span>&quot;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition relative cursor-pointer"
                id="notification-bell"
              >
                <Bell className="h-5.5 w-5.5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-brand-secondary-500 rounded-full ring-2 ring-brand-primary-950 animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {showNotificationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3.5 w-80 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden"
                  >
                    <div className="p-3 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Notifications ({unreadNotifCount})</span>
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[10px] font-bold text-brand-secondary-600 hover:text-brand-secondary-700 transition"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer ${!n.read ? "bg-brand-secondary-500/5 font-medium border-l-2 border-brand-secondary-500" : ""}`}
                          onClick={() => {
                            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                            setShowNotificationDropdown(false);
                            if (n.type === "order") {
                              setActiveTab("orders");
                            } else if (n.type === "document") {
                              setActiveTab("documents");
                            } else if (n.type === "support") {
                              setActiveTab("tickets");
                            }
                          }}
                        >
                          <div className="flex justify-between font-bold text-slate-800 mb-0.5">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.date}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-snug">{n.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Info Card */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-secondary-500 flex items-center justify-center font-bold text-brand-primary-950 shadow border border-brand-primary-900 text-xs">
                {user?.fullName?.substring(0, 2).toUpperCase() || "EC"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold tracking-wide text-white">{user?.fullName || "Guest Client"}</p>
                <p className="text-[10px] text-slate-400 font-mono -mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        
        {/* 2. Responsive Sidebar (Desktop) */}
        <aside className={`lg:w-64 bg-brand-primary-950 text-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] border-r border-brand-primary-900 shrink-0 z-30 transition-transform duration-300 flex flex-col justify-between fixed lg:static top-16 bottom-0 left-0 ${mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}`} id="client-sidebar">
          <div className="py-6 px-4 space-y-7 flex-1 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block px-2">Customer Gateway</span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab("dashboard"); setSelectedOrderId(null); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "dashboard" ? "bg-brand-secondary-500 text-brand-primary-950 font-extrabold shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  <span>Overview Portal</span>
                </button>
                <button
                  onClick={() => { setActiveTab("orders"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "orders" ? "bg-brand-secondary-500 text-brand-primary-950 font-extrabold shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                >
                  <FileText className="h-4.5 w-4.5" />
                  <div className="flex-1 flex justify-between items-center">
                    <span>My Services & Orders</span>
                    {activeOrdersCount > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${activeTab === "orders" ? "bg-brand-primary-950 text-white" : "bg-brand-secondary-500 text-brand-primary-950"}`}>
                        {activeOrdersCount}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab("documents"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "documents" ? "bg-brand-secondary-500 text-brand-primary-950 font-extrabold shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                >
                  <UploadCloud className="h-4.5 w-4.5" />
                  <span>Document Vault</span>
                </button>
                <button
                  onClick={() => { setActiveTab("invoices"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "invoices" ? "bg-brand-secondary-500 text-brand-primary-950 font-extrabold shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                >
                  <Receipt className="h-4.5 w-4.5" />
                  <span>Invoices & GST</span>
                </button>
                <button
                  onClick={() => { setActiveTab("tickets"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "tickets" ? "bg-brand-secondary-500 text-brand-primary-950 font-extrabold shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                >
                  <LifeBuoy className="h-4.5 w-4.5" />
                  <div className="flex-1 flex justify-between items-center">
                    <span>Support Desk</span>
                    <span className="h-2 w-2 rounded-full bg-green-400" title="Online Helpdesk Status" />
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === "profile" ? "bg-brand-secondary-500 text-brand-primary-950 font-extrabold shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                >
                  <User className="h-4.5 w-4.5" />
                  <span>Profile & Company</span>
                </button>
              </nav>
            </div>

            <div className="p-3 bg-brand-primary-900/60 rounded-xl border border-brand-primary-800 flex items-center gap-2.5">
              <Shield className="h-4.5 w-4.5 text-brand-secondary-500 shrink-0" />
              <div>
                <p className="text-[10px] font-mono tracking-wide text-brand-secondary-400 font-bold uppercase">Assigned Attendant</p>
                <p className="text-[11px] font-bold text-white">Sanjana Sen</p>
                <a href="mailto:info@legomarkindia.com" className="text-[10px] text-slate-400 hover:text-white underline block">info@legomarkindia.com</a>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-brand-primary-900 bg-brand-primary-950/80">
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-300 hover:text-red-100 hover:bg-red-500/10 font-bold transition-all cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Log Out Securely</span>
            </button>
          </div>
        </aside>

        {/* 3. Main Display Screen */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          
          {/* A. DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header section with Welcome text */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    Welcome back, <span className="text-brand-primary-950">{user?.fullName || "Executive Client"}</span>
                    <Sparkles className="h-5 w-5 text-brand-secondary-500 fill-brand-secondary-400" />
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Your Legomark customer portal connects you directly to our live filings engine.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-slate-700 bg-slate-200 border border-slate-300/60 rounded-full">
                    CLIENT GATEWAY SECURE
                  </span>
                </div>
              </div>

              {/* Status Widgets Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                  <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                    <Clock className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-400 block">Active Filings</span>
                    <span className="text-xl font-extrabold text-slate-800">{activeOrdersCount}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                  <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold">
                    <CheckCircle2 className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-400 block">Completed</span>
                    <span className="text-xl font-extrabold text-slate-800">{completedServicesCount}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                  <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                    <FileText className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-400 block">Documents Due</span>
                    <span className="text-xl font-extrabold text-slate-800">{pendingDocumentsCount}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4 hover:shadow-md transition col-span-2 sm:col-span-1">
                  <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                    <Receipt className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-400 block">Total Investment</span>
                    <span className="text-xl font-extrabold text-slate-800">₹{totalBilled.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Two Column details (Left: Active Orders progress & Actions, Right: Notifications & Quick Invoice) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Columns (Span 2): Services and Action Needed */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Active Orders List */}
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Your Live Filings</span>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 flex items-center gap-1 transition"
                      >
                        All Filings <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {clientOrders.map(order => (
                        <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-800">{order.service}</span>
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                {order.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Package: <span className="text-slate-700 font-medium">{order.packageName}</span> &bull; Executive: <span className="text-slate-700 font-medium">{order.assignedExecutive}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.serviceStatus === "Completed" || order.serviceStatus === "Delivered"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : order.serviceStatus === "Documents Pending"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {order.serviceStatus}
                              </span>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Updated: {order.updatedAt}</p>
                            </div>

                            <button
                              onClick={() => { setSelectedOrderId(order.id); setActiveTab("orders"); }}
                              className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold rounded-lg transition"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}

                      {clientOrders.length === 0 && (
                        <div className="p-10 text-center text-slate-400 text-xs">
                          No active services or orders found.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upcoming Actions and Document Request Panel */}
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Required Client Milestones</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/20 flex items-start gap-3.5">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1.5">
                          <p className="text-xs font-bold text-slate-800">Draft DSC Authorization Needed</p>
                          <p className="text-slate-500 text-[11px] leading-relaxed">
                            Your MCA director credentials require signature verification. Kindly verify and download our DSC client instruction document from the vault, or record your 30 second e-verification OTP video.
                          </p>
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              onClick={() => setActiveTab("documents")}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] transition shadow-sm"
                            >
                              Go to Vault
                            </button>
                            <button
                              onClick={() => { setSelectedTicketId("TKT-2026-001"); setActiveTab("tickets"); }}
                              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-[10px] transition"
                            >
                              Query Attendant
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/20 flex items-start gap-3.5">
                        <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold text-slate-800">Company Name Registrar Approval Status</p>
                          <p className="text-slate-500 text-[11px] leading-relaxed">
                            Awaiting MCA registrar validation for your proposed company names. Estimated feedback duration: 24-48 working hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Recent Activity and Invoices */}
                <div className="space-y-6">
                  
                  {/* Latest Invoices Widget */}
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Latest Invoices</span>
                      <button onClick={() => setActiveTab("invoices")} className="text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 transition">
                        View All
                      </button>
                    </div>
                    <div className="p-4 divide-y divide-slate-100">
                      {clientOrders.slice(0, 2).map(o => (
                        <div key={o.id} className="py-3 first:pt-0 last:pb-0 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-slate-800">{o.service}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${o.paymentStatus === "Paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                              {o.paymentStatus}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500 text-[11px]">
                            <span>₹{o.totalAmount.toLocaleString()} &bull; {o.createdAt}</span>
                            <button
                              onClick={() => handlePdfDownloadSimulate(o.id, o.service)}
                              className="text-brand-secondary-600 hover:text-brand-secondary-700 font-bold flex items-center gap-0.5 transition"
                            >
                              <Download className="h-3.5 w-3.5" /> PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Contacts Assistance Panel */}
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Escalation Desk</span>
                      <p className="text-[10px] text-slate-400">Need immediate administrative or pricing adjustments?</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <LifeBuoy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Support Hotline</p>
                        <p className="text-[11px] text-slate-500">+91 75308 47878</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Email Escalation</p>
                        <p className="text-[11px] text-slate-500">info@legomarkindia.com</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowNewTicketModal(true)}
                      className="w-full py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Open Support Ticket</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* B. MY ORDERS MODULE */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              
              {/* Back to filings overview list */}
              {selectedOrderId ? (
                <div>
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 transition mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to All Filings
                  </button>

                  {/* Order Details View Container */}
                  {(() => {
                    const order = clientOrders.find(o => o.id === selectedOrderId);
                    if (!order) return <p className="text-slate-500">Order not found.</p>;

                    // Map service statuses to numerical steps
                    const statusSteps = [
                      "Documents Pending",
                      "Documents Received",
                      "Work Started",
                      "Government Submission",
                      "Awaiting Approval",
                      "Completed",
                      "Delivered"
                    ];
                    const currentStepIndex = statusSteps.indexOf(order.serviceStatus);

                    return (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                            <div>
                              <span className="text-xs font-bold font-mono text-brand-secondary-600 bg-brand-secondary-50 border border-brand-secondary-200/50 px-2 py-0.5 rounded-full uppercase">
                                Service File Details
                              </span>
                              <h3 className="text-lg font-extrabold text-slate-800 mt-1">{order.service}</h3>
                              <p className="text-slate-400 text-[11px] font-mono mt-0.5">Order ID: {order.id} &bull; Created {order.createdAt}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-xs text-slate-400 block font-bold uppercase font-mono">Status</span>
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                                {order.serviceStatus}
                              </span>
                            </div>
                          </div>

                          {/* 1. VISUAL PROGRESS TIMELINE */}
                          <div className="space-y-4 py-4">
                            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Live Incorporation Timeline</h4>
                            
                            {/* Horizontal timeline bar for desktop */}
                            <div className="hidden md:flex items-center justify-between relative pt-4 pb-6">
                              <div className="absolute left-0 right-0 top-7 h-0.5 bg-slate-200 z-0" />
                              <div className="absolute left-0 top-7 h-0.5 bg-brand-secondary-500 transition-all z-0" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />

                              {statusSteps.map((step, idx) => {
                                const isPassed = idx < currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                return (
                                  <div key={idx} className="flex flex-col items-center relative z-10 w-24 text-center space-y-2">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                                      isPassed ? "bg-green-500 border-green-500 text-white" : isCurrent ? "bg-brand-primary-950 border-brand-secondary-500 text-brand-secondary-500" : "bg-white border-slate-300 text-slate-400"
                                    }`}>
                                      {isPassed ? "✓" : idx + 1}
                                    </div>
                                    <span className={`text-[10px] font-bold leading-tight ${isCurrent ? "text-brand-primary-950 font-extrabold" : "text-slate-400"}`}>
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Vertical timeline for mobile */}
                            <div className="md:hidden space-y-4 relative pl-6 border-l-2 border-slate-200 py-2">
                              {statusSteps.map((step, idx) => {
                                const isPassed = idx < currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                return (
                                  <div key={idx} className="relative space-y-1">
                                    <div className={`absolute -left-9 top-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                                      isPassed ? "bg-green-500 border-green-500 text-white" : isCurrent ? "bg-brand-primary-950 border-brand-secondary-500 text-brand-secondary-500" : "bg-white border-slate-300 text-slate-400"
                                    }`}>
                                      {isPassed ? "✓" : idx + 1}
                                    </div>
                                    <h5 className={`text-xs font-bold ${isCurrent ? "text-brand-primary-950 font-extrabold" : "text-slate-500"}`}>{step}</h5>
                                    {isCurrent && <p className="text-[10px] text-slate-400">Our corporate team is actively filing on this stage.</p>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Order Metadata Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                            <div>
                              <h5 className="text-[11px] font-mono uppercase text-slate-400 font-bold">Client Metadata</h5>
                              <div className="mt-2 text-xs space-y-1.5 text-slate-700">
                                <p><span className="text-slate-400">Company:</span> <span className="font-semibold">{order.customer.companyName || "N/A"}</span></p>
                                <p><span className="text-slate-400">Representing:</span> {order.customer.name}</p>
                                <p><span className="text-slate-400">Contact phone:</span> {order.customer.phone}</p>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-[11px] font-mono uppercase text-slate-400 font-bold">Investment Breakdown</h5>
                              <div className="mt-2 text-xs space-y-1.5 text-slate-700">
                                <p><span className="text-slate-400">Package Title:</span> {order.packageName}</p>
                                <p><span className="text-slate-400">Price Structure:</span> ₹{order.price.toLocaleString()} + 18% GST (₹{order.gst.toLocaleString()})</p>
                                <p><span className="text-slate-400">Total Billed:</span> <span className="font-semibold text-slate-800">₹{order.totalAmount.toLocaleString()}</span></p>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-[11px] font-mono uppercase text-slate-400 font-bold">Assigned Legomark Officer</h5>
                              <div className="mt-2 text-xs space-y-2 text-slate-700">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-700">
                                    {order.assignedExecutive.substring(0, 2).toUpperCase()}
                                  </div>
                                  <p className="font-bold text-slate-800">{order.assignedExecutive}</p>
                                </div>
                                <p className="text-slate-400 text-[10px]">Your assigned corporate officer manages communications with government registrars.</p>
                                <a
                                  href={`https://wa.me/917530847878?text=Hello%20Legomark,%20regarding%20my%20order%20${order.id}`}
                                  target="_blank"
                                  referrerPolicy="no-referrer"
                                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-secondary-600 hover:text-brand-secondary-700 transition"
                                >
                                  Simulate WhatsApp Chat <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Order Specific Documents & History Logs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Order Documents */}
                          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Associated Filing Documents</h4>
                            <div className="space-y-3">
                              {order.attachments && order.attachments.length > 0 ? (
                                order.attachments.map(doc => (
                                  <div key={doc.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <File className="h-4.5 w-4.5 text-brand-secondary-600 shrink-0" />
                                      <div>
                                        <p className="font-bold text-slate-700">{doc.name}</p>
                                        <p className="text-[10px] text-slate-400">Size: {doc.size} &bull; Uploaded {doc.uploadDate}</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => toast.success(`Simulated secure file download for ${doc.name}`, "Success")}
                                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800 transition"
                                      title="Download File"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-slate-400 text-xs text-center py-6">No documents have been mapped to this filing yet.</p>
                              )}
                            </div>
                          </div>

                          {/* Order Progress Notes */}
                          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Executive Status Logs</h4>
                            <div className="space-y-3">
                              {order.notesHistory && order.notesHistory.length > 0 ? (
                                order.notesHistory.map((log, i) => (
                                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                      <span className="font-bold text-slate-600">{log.author}</span>
                                      <span>{log.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">{log.note}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-slate-400 text-xs text-center py-6">No updates logged yet on this filing record.</p>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Your Active Services & Filings</h3>
                    <p className="text-xs text-slate-500">Search, monitor and track live SPICe+ MCA registrars or GST return submissions.</p>
                  </div>

                  {/* Filter and Search Orders List */}
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Portfolio</span>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {clientOrders.length} Services Registered
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {clientOrders.map(order => (
                        <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-800">{order.service}</h4>
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                {order.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Package: <span className="text-slate-700 font-medium">{order.packageName}</span> &bull; File Date: <span className="text-slate-700 font-mono font-medium">{order.createdAt}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.serviceStatus === "Completed" || order.serviceStatus === "Delivered"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {order.serviceStatus}
                              </span>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">Officer: {order.assignedExecutive}</p>
                            </div>

                            <button
                              onClick={() => setSelectedOrderId(order.id)}
                              className="px-3.5 py-1.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                            >
                              Track Progress
                            </button>
                          </div>
                        </div>
                      ))}

                      {clientOrders.length === 0 && (
                        <div className="p-10 text-center text-slate-400 text-xs">
                          No orders matched.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* C. DOCUMENT CENTER */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Filing Document Vault</h3>
                <p className="text-xs text-slate-500">Download registration certificates, review DSC authorization drafts or upload corporate proofs.</p>
              </div>

              {/* Upload Simulated Form with Progress */}
              <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Deposit Supporting Credentials</h4>
                
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50/50 transition cursor-pointer text-center relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUploadSimulate}
                    disabled={uploadProgress !== null}
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 bg-brand-secondary-50 text-brand-secondary-600 rounded-full flex items-center justify-center">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Drag and drop or click to select files</p>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 10MB) &bull; Encrypted Vault</p>
                  </div>
                </div>

                {uploadProgress !== null && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 truncate">{uploadFileName}</span>
                      <span className="font-mono text-slate-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-secondary-500 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* List of files in the vault */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-150">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Vault Files Repository</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {customFiles.map(file => (
                    <div key={file.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <File className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{file.name}</p>
                          <p className="text-[10px] text-slate-400">Size: {file.size} &bull; Deposited: {file.date} {file.orderId && `• Order: ${file.orderId}`}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.success(`Initiated local file download for ${file.name}`, "Success")}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-white text-slate-600 font-bold rounded-lg transition flex items-center gap-1 cursor-pointer text-[10px]"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* D. INVOICES & GST */}
          {activeTab === "invoices" && (
            <div className="space-y-6" id="client-billing-hub">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">Corporate Billing & Financial Hub</h3>
                  <p className="text-xs text-slate-500">Manage quotations, process tax invoices, download receipts, and track your chronological accounting ledger.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-mono font-bold border border-green-200">
                    <Shield className="h-3 w-3" /> PCI DSS SECURE
                  </span>
                </div>
              </div>

              {/* 1. FINANCIAL SUMMARY WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Total Capital Invoiced</span>
                    <h4 className="text-xl font-black text-slate-800 mt-1">
                      ₹{clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{clientInvoices.length} Registered Tax Invoices</p>
                  </div>
                  <div className="h-10 w-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Total Capital Deposited</span>
                    <h4 className="text-xl font-black text-green-700 mt-1">
                      ₹{clientPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{clientPayments.length} Cleared Transactions</p>
                  </div>
                  <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between animate-pulse">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Outstanding Payable Balance</span>
                    <h4 className="text-xl font-black text-amber-700 mt-1">
                      ₹{clientInvoices.filter(i => i.paymentStatus !== "Paid").reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Please clear immediately to avoid MCA delays</p>
                  </div>
                  <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 2. SUB-SECTIONS NAVIGATOR */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Secondary navigation for billing tabs */}
                <div className="flex border-b border-slate-150 overflow-x-auto scrollbar-none bg-slate-50/50">
                  <button
                    onClick={() => setViewingDoc(null)}
                    className="px-5 py-3 text-xs font-bold border-b-2 border-brand-primary-950 text-brand-primary-950 whitespace-nowrap"
                  >
                    Interactive Document Ledger
                  </button>
                </div>

                <div className="p-5 space-y-8">
                  
                  {/* SECTION A: ACTIVE QUOTATIONS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500" /> Commercial Quotations
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{clientQuotations.length} quotes</span>
                    </div>

                    {clientQuotations.length === 0 ? (
                      <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                        No active commercial quotes received.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-150 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono uppercase text-slate-400">
                              <th className="p-3">Quote ID</th>
                              <th className="p-3">Service & Package</th>
                              <th className="p-3 text-right">Fee (Excl GST)</th>
                              <th className="p-3 text-right">GST (18%)</th>
                              <th className="p-3 text-right">Net Total</th>
                              <th className="p-3">Valid Until</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {clientQuotations.map(q => (
                              <tr key={q.id} className="hover:bg-slate-50/30 transition">
                                <td className="p-3 font-mono font-bold text-slate-900">{q.id}</td>
                                <td className="p-3">
                                  <p className="font-bold text-slate-800">{q.service}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{q.packageName}</p>
                                </td>
                                <td className="p-3 text-right font-mono">₹{(q.totalAmount - (q.gstAmount || 0)).toLocaleString()}</td>
                                <td className="p-3 text-right font-mono text-slate-500">₹{(q.gstAmount || 0).toLocaleString()}</td>
                                <td className="p-3 text-right font-mono font-bold text-slate-900">₹{q.totalAmount.toLocaleString()}</td>
                                <td className="p-3 text-slate-500">{q.validUntil}</td>
                                <td className="p-3">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                                    q.status === "Accepted" ? "bg-green-50 text-green-700 border border-green-200" :
                                    q.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                                    "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                                  }`}>
                                    {q.status}
                                  </span>
                                </td>
                                <td className="p-3 text-center space-x-1 whitespace-nowrap">
                                  <button
                                    onClick={() => setViewingDoc({ type: "Quotation", ...q })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition"
                                  >
                                    View
                                  </button>
                                  {q.status === "Sent" && (
                                    <button
                                      onClick={() => handleAcceptQuotation(q)}
                                      className="px-2.5 py-1 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-brand-primary-950 font-black rounded text-[10px] transition shadow-xs"
                                    >
                                      Accept & Approve
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SECTION B: PROFORMA INVOICES */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Proforma Invoices
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{clientProformas.length} proformas</span>
                    </div>

                    {clientProformas.length === 0 ? (
                      <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                        No proforma invoices available.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-150 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono uppercase text-slate-400">
                              <th className="p-3">Proforma ID</th>
                              <th className="p-3">Service & Package</th>
                              <th className="p-3 text-right">Fee</th>
                              <th className="p-3 text-right">GST (18%)</th>
                              <th className="p-3 text-right">Total</th>
                              <th className="p-3">Valid Until</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {clientProformas.map(p => (
                              <tr key={p.id} className="hover:bg-slate-50/30 transition">
                                <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                                <td className="p-3">
                                  <p className="font-bold text-slate-800">{p.service}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{p.packageName}</p>
                                </td>
                                <td className="p-3 text-right font-mono">₹{(p.totalAmount - p.gstAmount).toLocaleString()}</td>
                                <td className="p-3 text-right font-mono text-slate-500">₹{p.gstAmount.toLocaleString()}</td>
                                <td className="p-3 text-right font-mono font-bold text-slate-900">₹{p.totalAmount.toLocaleString()}</td>
                                <td className="p-3 text-slate-500">{p.createdAt}</td>
                                <td className="p-3">
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                    {p.status}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => setViewingDoc({ type: "Proforma Invoice", ...p })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition"
                                  >
                                    View Document
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SECTION C: TAX INVOICES (GST COMPLIANT) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> GST-Compliant Tax Invoices
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{clientInvoices.length} Invoices</span>
                    </div>

                    {clientInvoices.length === 0 ? (
                      <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                        No official tax invoices generated yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-150 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono uppercase text-slate-400">
                              <th className="p-3">Invoice ID</th>
                              <th className="p-3">Date</th>
                              <th className="p-3">Billing Service</th>
                              <th className="p-3 text-right">Fee</th>
                              <th className="p-3 text-right">GST (18%)</th>
                              <th className="p-3 text-right">Total</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {clientInvoices.map(i => (
                              <tr key={i.id} className="hover:bg-slate-50/30 transition">
                                <td className="p-3 font-mono font-bold text-slate-900">{i.id}</td>
                                <td className="p-3 text-slate-500">{i.invoiceDate}</td>
                                <td className="p-3">
                                  <p className="font-bold text-slate-800">{i.service}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{i.packageName}</p>
                                </td>
                                <td className="p-3 text-right font-mono">₹{i.taxableAmount.toLocaleString()}</td>
                                <td className="p-3 text-right font-mono text-slate-500">₹{(i.cgstAmount + i.sgstAmount + i.igstAmount).toLocaleString()}</td>
                                <td className="p-3 text-right font-mono font-bold text-slate-900">₹{i.totalAmount.toLocaleString()}</td>
                                <td className="p-3">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                                    i.paymentStatus === "Paid" ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                  }`}>
                                    {i.paymentStatus}
                                  </span>
                                </td>
                                <td className="p-3 text-center space-x-1 whitespace-nowrap">
                                  <button
                                    onClick={() => setViewingDoc({ type: "Tax Invoice", ...i })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition"
                                  >
                                    View
                                  </button>
                                  {i.paymentStatus !== "Paid" && (
                                    <button
                                      onClick={() => setPayingInvoice(i)}
                                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-[10px] transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                                    >
                                      <Lock className="h-3 w-3" /> Pay Now
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SECTION D: REGISTERED RECEIPTS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" /> Payment Receipts
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{clientReceipts.length} receipts</span>
                    </div>

                    {clientReceipts.length === 0 ? (
                      <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                        No payment receipts available. Receipts are automatically generated upon payment verification.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-150 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono uppercase text-slate-400">
                              <th className="p-3">Receipt No</th>
                              <th className="p-3">Clearing Date</th>
                              <th className="p-3">Invoice Ref</th>
                              <th className="p-3">Method</th>
                              <th className="p-3 text-right">Amount Cleared</th>
                              <th className="p-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {clientReceipts.map(r => (
                              <tr key={r.id} className="hover:bg-slate-50/30 transition">
                                <td className="p-3 font-mono font-bold text-slate-900">{r.id}</td>
                                <td className="p-3 text-slate-500">{r.date}</td>
                                <td className="p-3 font-mono text-slate-500">{r.invoiceId}</td>
                                <td className="p-3">
                                  <span className="inline-flex px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-mono font-bold">
                                    {payments.find(p => p.id === r.paymentRef)?.method || "Transfer"}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-mono font-bold text-slate-900">₹{r.amount.toLocaleString()}</td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => setViewingDoc({ type: "Payment Receipt", ...r })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] transition"
                                  >
                                    View Receipt
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SECTION E: CHRONOLOGICAL ACCOUNT STATEMENT LEDGER */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-500" /> Chronological Client Ledger Account
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{clientLedger.length} ledger entries</span>
                    </div>

                    {clientLedger.length === 0 ? (
                      <div className="p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                        No financial ledger records found.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-150 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-mono uppercase text-slate-400">
                              <th className="p-3">Entry Date</th>
                              <th className="p-3">Transaction Description / Particulars</th>
                              <th className="p-3">Reference Doc</th>
                              <th className="p-3 text-right">Debit (Charge)</th>
                              <th className="p-3 text-right">Credit (Deposit)</th>
                              <th className="p-3 text-right font-bold">Running Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {(() => {
                              let balance = 0;
                              return clientLedger.map(l => {
                                if (l.balanceEffect === "debit") balance += l.amount;
                                if (l.balanceEffect === "credit") balance -= l.amount;
                                return (
                                  <tr key={l.id} className="hover:bg-slate-50/30 transition">
                                    <td className="p-3 text-slate-500 font-mono">{l.date}</td>
                                    <td className="p-3 font-semibold text-slate-800">{l.description}</td>
                                    <td className="p-3 text-slate-400 font-mono text-[10px]">{l.refId}</td>
                                    <td className="p-3 text-right font-mono text-red-600">
                                      {l.balanceEffect === "debit" ? `₹${l.amount.toLocaleString()}` : "-"}
                                    </td>
                                    <td className="p-3 text-right font-mono text-green-600">
                                      {l.balanceEffect === "credit" ? `₹${l.amount.toLocaleString()}` : "-"}
                                    </td>
                                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                                      ₹{balance.toLocaleString()}
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* 3. MOCK PAYMENT GATEWAY INTERACTIVE MODAL */}
              {payingInvoice && (
                <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-xs">
                  <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-slate-950 text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-500 text-slate-950 rounded-lg">
                          <Lock className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider">Secure Payment Gateway</h4>
                          <span className="text-[9px] text-slate-400 font-mono block">Legomark India Finance</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setPayingInvoice(null)}
                        className="text-slate-400 hover:text-white transition cursor-pointer text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-5 overflow-y-auto space-y-4">
                      {/* Bill details */}
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Total Due Amount</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <h5 className="text-xl font-black text-slate-900">₹{payingInvoice.totalAmount.toLocaleString()}</h5>
                          <span className="text-[10px] font-mono font-bold text-slate-500">Invoiced GST (18%) included</span>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-600 space-y-0.5 border-t border-slate-200 pt-1.5">
                          <p><strong>Service:</strong> {payingInvoice.service}</p>
                          <p><strong>Invoice Number:</strong> {payingInvoice.id}</p>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono font-extrabold text-slate-400">Select Billing Channel</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("UPI")}
                            className={`py-2 rounded-lg border text-xs font-bold text-center transition flex flex-col items-center justify-center gap-1 ${
                              paymentMethod === "UPI" ? "border-green-500 bg-green-50/30 text-green-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <span className="text-xs">⚡ UPI</span>
                            <span className="text-[8px] font-mono block">Scan & Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("Bank Transfer")}
                            className={`py-2 rounded-lg border text-xs font-bold text-center transition flex flex-col items-center justify-center gap-1 ${
                              paymentMethod === "Bank Transfer" ? "border-green-500 bg-green-50/30 text-green-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <span className="text-xs">🏛️ Bank</span>
                            <span className="text-[8px] font-mono block">NEFT/IMPS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("Razorpay")}
                            className={`py-2 rounded-lg border text-xs font-bold text-center transition flex flex-col items-center justify-center gap-1 ${
                              paymentMethod === "Razorpay" ? "border-green-500 bg-green-50/30 text-green-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <span className="text-xs">💳 Card</span>
                            <span className="text-[8px] font-mono block">Razorpay Sec</span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-form based on choice */}
                      {paymentMethod === "UPI" && (
                        <div className="p-3 border border-slate-150 rounded-xl space-y-3 text-center">
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            Scan the secure UPI QR code using BHIM, GooglePay, PhonePe, or Paytm.
                          </p>
                          <div className="mx-auto h-36 w-36 border border-slate-200 rounded-xl p-1.5 bg-white flex items-center justify-center">
                            {/* QR code vector simulator */}
                            <svg className="h-full w-full" viewBox="0 0 100 100">
                              <rect width="100" height="100" fill="none" />
                              <rect x="5" y="5" width="20" height="20" fill="currentColor" className="text-slate-900" />
                              <rect x="7" y="7" width="16" height="16" fill="white" />
                              <rect x="10" y="10" width="10" height="10" fill="currentColor" className="text-slate-900" />
                              <rect x="75" y="5" width="20" height="20" fill="currentColor" className="text-slate-900" />
                              <rect x="77" y="7" width="16" height="16" fill="white" />
                              <rect x="80" y="10" width="10" height="10" fill="currentColor" className="text-slate-900" />
                              <rect x="5" y="75" width="20" height="20" fill="currentColor" className="text-slate-900" />
                              <rect x="7" y="77" width="16" height="16" fill="white" />
                              <rect x="10" y="80" width="10" height="10" fill="currentColor" className="text-slate-900" />
                              {/* Randomized pixels */}
                              <rect x="35" y="10" width="5" height="5" fill="currentColor" className="text-slate-900" />
                              <rect x="45" y="15" width="10" height="5" fill="currentColor" className="text-slate-900" />
                              <rect x="30" y="30" width="15" height="5" fill="currentColor" className="text-slate-900" />
                              <rect x="55" y="35" width="5" height="15" fill="currentColor" className="text-slate-900" />
                              <rect x="10" y="45" width="5" height="10" fill="currentColor" className="text-slate-900" />
                              <rect x="35" y="60" width="20" height="5" fill="currentColor" className="text-slate-900" />
                              <rect x="65" y="70" width="10" height="15" fill="currentColor" className="text-slate-900" />
                              <rect x="80" y="45" width="10" height="10" fill="currentColor" className="text-slate-900" />
                            </svg>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-slate-500 block">UPI: payments@legomarkindia.com</span>
                        </div>
                      )}

                      {paymentMethod === "Bank Transfer" && (
                        <div className="p-3 border border-slate-150 rounded-xl space-y-2 text-xs bg-slate-50 text-slate-700">
                          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">
                            Legomark India Corporate Account
                          </p>
                          <p><strong>Bank:</strong> HDFC Bank Limited</p>
                          <p><strong>Account Name:</strong> LEGOMARK CONSULTANCY SERVICES PVT LTD</p>
                          <p><strong>Account Number:</strong> 50200088194452</p>
                          <p><strong>IFSC Code:</strong> HDFC0000104</p>
                          <p><strong>Branch:</strong> Koramangala Outer Ring Rd, Bengaluru</p>
                        </div>
                      )}

                      {paymentMethod === "Razorpay" && (
                        <div className="p-3 border border-slate-150 rounded-xl space-y-3">
                          <p className="text-[10px] text-slate-400 font-mono text-center">RAZORPAY LIVE SECURE SANDBOX</p>
                          <div className="space-y-2 text-xs">
                            <div className="relative">
                              <span className="absolute left-2.5 top-2.5 text-slate-400">💳</span>
                              <input
                                type="text"
                                placeholder="4111 2222 3333 4444"
                                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs"
                                disabled
                                value="•••• •••• •••• 4111 (Demo Card Enabled)"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs text-center"
                                value="12/29"
                                disabled
                              />
                              <input
                                type="text"
                                placeholder="CVV"
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs text-center"
                                value="***"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transaction reference ID input */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono font-extrabold text-slate-400 block">
                          Transaction Reference Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="E.g., Bank Ref No., UPI Ref, or leave empty to auto-generate"
                          value={paymentRefInput}
                          onChange={(e) => setPaymentRefInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-900 placeholder:text-slate-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between gap-3">
                      <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                        🔒 SSL 256-BIT
                      </span>
                      <button
                        onClick={handleProcessPayment}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        Verify & Complete Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. VISUAL HIGH-FIDELITY DOCUMENT PREVIEW MODAL */}
              {viewingDoc && (
                <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-xs">
                  <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-slate-100 border-b border-slate-250 flex justify-between items-center select-none">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                        <span>Physical Printer Format Simulator &bull; {viewingDoc.type} Preview</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            window.print();
                            toast.success("Document print trigger simulated successfully.");
                          }}
                          className="px-3 py-1 bg-slate-950 text-white hover:bg-slate-800 text-[10px] font-bold rounded-md transition cursor-pointer"
                        >
                          Print Document
                        </button>
                        <button
                          onClick={() => setViewingDoc(null)}
                          className="text-slate-400 hover:text-slate-600 transition text-sm cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Standardized Physical Letterhead Content */}
                    <div className="p-8 overflow-y-auto bg-white flex-1 text-slate-800 select-none font-sans" id="physical-document-canvas">
                      
                      {/* Logo header */}
                      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
                        <div className="flex gap-4 items-start">
                          <img
                            key={brandConfig.logo.url}
                            src={brandConfig.logo.url || "/logo.png"}
                            alt="Legomark India Logo"
                            className="h-12 w-12 object-contain"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.fallback) {
                                target.dataset.fallback = "true";
                                target.src = "/logo.png";
                              }
                            }}
                          />
                          <div>
                            <h1 className="text-lg font-black tracking-wider text-slate-900 uppercase">LEGOMARK INDIA</h1>
                            <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-0.5">LEGOMARK CONSULTANCY SERVICES PRIVATE LIMITED</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed font-semibold">
                              D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025
                            </p>
                            <p className="text-[10px] text-slate-400">GSTIN: 29AAFCL8492K1Z8 &bull; info@legomarkindia.com</p>
                          </div>
                        </div>
                        <div className="text-right border-l-2 border-brand-primary-900 pl-4">
                          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">{viewingDoc.type}</h2>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">
                            Doc Reference: {viewingDoc.id}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Date: {viewingDoc.invoiceDate || viewingDoc.date || viewingDoc.createdAt || new Date().toISOString().split("T")[0]}</p>
                        </div>
                      </div>

                      {/* Customer Info Box */}
                      <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-150 mb-6 text-xs text-slate-700">
                        <div>
                          <p className="text-[9px] uppercase font-mono font-extrabold text-slate-400">Billed To (Recipient)</p>
                          <p className="font-extrabold text-slate-900 mt-1">{viewingDoc.customer?.name}</p>
                          {viewingDoc.customer?.companyName && <p className="font-semibold text-slate-700 mt-0.5">{viewingDoc.customer?.companyName}</p>}
                          <p className="mt-1 font-semibold">{viewingDoc.customer?.email}</p>
                          <p className="text-[10px] text-slate-400">Phone: {viewingDoc.customer?.phone || "Client Verified"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-mono font-extrabold text-slate-400">Regulatory Details</p>
                          <p className="mt-1"><strong>Entity Type:</strong> Private Limited Compliance / Corporate Partner</p>
                          <p className="mt-0.5"><strong>Client GSTIN:</strong> {profileGst || "29AAFCL1234F1Z5"}</p>
                          <p className="mt-0.5"><strong>Billing Place:</strong> Delhi (IGST 18% Exempted / Local CGST+SGST Applied)</p>
                        </div>
                      </div>

                      {/* Items Listing table */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 text-xs text-slate-700">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400 font-bold">
                              <th className="p-3">Compliance Item Description</th>
                              <th className="p-3 text-center">Qty</th>
                              <th className="p-3 text-right">Unit Rate (INR)</th>
                              <th className="p-3 text-right">Net Value (INR)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 font-medium">
                            {viewingDoc.items ? viewingDoc.items.map((item: any, idx: number) => (
                              <tr key={idx} className="text-slate-800">
                                <td className="p-3">
                                  <p className="font-bold">{item.description}</p>
                                  <p className="text-[10px] text-slate-400">Professional statutory processing fee inclusive</p>
                                </td>
                                <td className="p-3 text-center font-mono">{item.quantity}</td>
                                <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString()}</td>
                                <td className="p-3 text-right font-mono">₹{item.total.toLocaleString()}</td>
                              </tr>
                            )) : (
                              <tr className="text-slate-800">
                                <td className="p-3">
                                  <p className="font-bold">{viewingDoc.service}</p>
                                  <p className="text-[10px] text-slate-400">{viewingDoc.packageName}</p>
                                </td>
                                <td className="p-3 text-center font-mono">1</td>
                                <td className="p-3 text-right font-mono">₹{(viewingDoc.total || viewingDoc.amountPaid || 0).toLocaleString()}</td>
                                <td className="p-3 text-right font-mono">₹{(viewingDoc.total || viewingDoc.amountPaid || 0).toLocaleString()}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Math Summary block */}
                      <div className="flex justify-end mb-8 text-xs text-slate-700">
                        <div className="w-64 space-y-2 border-t-2 border-slate-100 pt-3">
                          <div className="flex justify-between">
                            <span>Subtotal (Base Value):</span>
                            <span className="font-mono">₹{((viewingDoc.totalAmount || viewingDoc.amount || 0) - (viewingDoc.gstAmount || viewingDoc.gst || 0)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Central GST (9% CGST):</span>
                            <span className="font-mono">₹{((viewingDoc.gstAmount || 0) / 2).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>State GST (9% SGST):</span>
                            <span className="font-mono">₹{((viewingDoc.gstAmount || 0) / 2).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-900 font-extrabold text-sm">
                            <span>Total Gross Amount:</span>
                            <span className="font-mono">₹{(viewingDoc.totalAmount || viewingDoc.amount || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stamp & Authorized Signature block */}
                      <div className="flex justify-between items-end border-t border-slate-100 pt-6 text-[11px] text-slate-400 font-semibold select-none">
                        <div>
                          <p className="text-slate-500">Important Compliance Terms:</p>
                          <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[10px] leading-relaxed max-w-sm">
                            <li>All processing dates are subject to government portal registry uptime.</li>
                            <li>Statutory fees once cleared to MCA/registry are non-refundable.</li>
                            <li>Payment is certified securely under PCI DSS tokenization guidelines.</li>
                          </ul>
                        </div>
                        <div className="text-center">
                          <div className="h-12 w-32 border border-dashed border-brand-primary-200/50 rounded-lg flex items-center justify-center relative opacity-85 overflow-hidden">
                            <span className="text-[8px] font-mono text-brand-primary-900 font-black rotate-12 absolute">LEGOMARK FINANCE STAMP</span>
                            <span className="text-[10px] text-blue-500 font-serif italic font-extrabold absolute mt-4 pr-3">Verified Digital Seal</span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-2 font-bold">Authorized Signatory</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* E. SUPPORT TICKETS */}
          {activeTab === "tickets" && (
            <div className="space-y-6" id="client-support-tab">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">Support Desk Help Center</h3>
                  <p className="text-xs text-slate-500">Submit compliance tickets, request DSC links or verify application queries directly with attorneys.</p>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 self-start cursor-pointer shadow-md"
                >
                  <Plus className="h-4.5 w-4.5" /> Open New Ticket
                </button>
              </div>

              {/* Chat Thread layout */}
              {selectedTicketId ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (Span 2): Active Ticket Chat Panel */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col h-[520px]">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <button
                          onClick={() => setSelectedTicketId(null)}
                          className="text-xs font-bold text-brand-secondary-600 hover:text-brand-secondary-700 flex items-center gap-1 transition"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back to Help Desk
                        </button>
                        {(() => {
                          const ticket = tickets.find(t => t.id === selectedTicketId);
                          return ticket ? (
                            <h4 className="text-xs font-extrabold text-slate-800 mt-2">
                              {ticket.subject} <span className="text-[10px] font-mono text-slate-400 font-normal ml-1">#{ticket.id}</span>
                            </h4>
                          ) : null;
                        })()}
                      </div>
                      {(() => {
                        const ticket = tickets.find(t => t.id === selectedTicketId);
                        return ticket ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ticket.status === "Open" ? "bg-blue-50 text-blue-700" : ticket.status === "In Progress" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                            {ticket.status}
                          </span>
                        ) : null;
                      })()}
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                      {(() => {
                        const ticket = tickets.find(t => t.id === selectedTicketId);
                        if (!ticket) return null;
                        return ticket.messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] ${msg.sender === "client" ? "ml-auto items-end" : "mr-auto items-start"}`}
                          >
                            <span className="text-[10px] text-slate-400 font-mono mb-1">{msg.senderName} &bull; {msg.createdAt}</span>
                            <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans font-medium ${msg.sender === "client" ? "bg-brand-primary-950 text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-200/80 shadow-xs"}`}>
                              {msg.content}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Message typing box */}
                    <form onSubmit={handleSendTicketMessage} className="p-3 bg-white border-t border-slate-150 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type reply message to executive support team..."
                        value={ticketMessageText}
                        onChange={(e) => setTicketMessageText(e.target.value)}
                        className="flex-1 py-2 px-3 border border-slate-200 focus:border-brand-secondary-500 rounded-lg text-xs focus:outline-none bg-slate-50 focus:bg-white transition-all font-sans"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-brand-primary-950 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  {/* Right Column (Span 1): Ticket Details Panel */}
                  {(() => {
                    const ticket = tickets.find(t => t.id === selectedTicketId);
                    if (!ticket) return null;
                    return (
                      <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4 h-fit">
                        <div className="border-b border-slate-100 pb-3">
                          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Ticket Metadata</h4>
                        </div>
                        <div className="text-xs space-y-3">
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Topic description</span>
                            <p className="text-slate-600 mt-1 leading-relaxed font-sans">{ticket.description}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Priority level</span>
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${ticket.priority === "High" ? "bg-red-50 text-red-700" : ticket.priority === "Medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                              {ticket.priority} Priority
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Created epoch</span>
                            <p className="text-slate-600 mt-1 font-mono">{ticket.createdAt}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-150">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Support Desk Ticket History</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800 truncate block max-w-sm">{ticket.subject}</span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                              {ticket.id}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] truncate block max-w-md">{ticket.description}</p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-right space-y-1">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${ticket.priority === "High" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                              {ticket.priority}
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">Status: {ticket.status}</p>
                          </div>

                          <button
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg transition"
                          >
                            Open Thread
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support FAQ references section */}
              <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="h-4.5 w-4.5 text-brand-secondary-500" /> Instant Filing Reference FAQs
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-800">How long does SPICe+ Part B registrar take?</p>
                    <p className="text-slate-500 leading-relaxed font-sans">Generally takes 4-6 business days after name reservation approval from MCA registrar offices.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-800">What documents are compulsory for GST registration?</p>
                    <p className="text-slate-500 leading-relaxed font-sans">PAN Card, Aadhaar Card, proof of business address (Electricity Bill with Owner NOC), and active bank proof.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* F. PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Profile & Corporate Configurations</h3>
                <p className="text-xs text-slate-500">Manage tax identification, corporate office details and account authorization passwords.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile update form */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enterprise & Personal Records</h4>
                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs text-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Full Name *</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Official Mobile Number *</label>
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Corporate Name (Company Name)</label>
                        <input
                          type="text"
                          value={profileCompany}
                          onChange={(e) => setProfileCompany(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">Corporate GSTIN Number</label>
                        <input
                          type="text"
                          value={profileGst}
                          onChange={(e) => setProfileGst(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Principal Place of Business (Office Address)</label>
                      <textarea
                        rows={3}
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                    >
                      Save Configuration
                    </button>
                  </form>
                </div>

                {/* Password reset panel */}
                <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="h-4.5 w-4.5 text-brand-secondary-500" /> Account Security
                  </h4>
                  <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 font-bold">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passCurrent}
                        onChange={(e) => setPassCurrent(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 font-bold">New Password</label>
                      <input
                        type="password"
                        placeholder="Min 6 characters"
                        value={passNew}
                        onChange={(e) => setPassNew(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 font-bold">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Repeat new password"
                        value={passConfirm}
                        onChange={(e) => setPassConfirm(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-xs transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* G. NEW TICKET MODAL OVERLAY */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-brand-primary-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Open Support Assistance Ticket</span>
                <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="p-5 space-y-4 text-xs text-slate-700">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Ticket Subject *</label>
                  <input
                    type="text"
                    placeholder="e.g. Turnaround time for SPICe+ MCA filing"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Priority Level *</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e: any) => setNewTicketPriority(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium bg-white"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500">Query Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Provide exact details of your filing query or document issue..."
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Attachment Support</span>
                  <p className="text-[11px] text-slate-500">You can upload support screenshots once the ticket thread has been created (Architecture only).</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-slate-100 border-t border-slate-200 text-center py-4 text-xs text-slate-500 font-mono mt-auto">
        &copy; 2026 Legomark India Secure Client Workspace &bull; DC-007A Complete &bull; Enterprise Legal Filing Portal
      </footer>
    </div>
  );
}
