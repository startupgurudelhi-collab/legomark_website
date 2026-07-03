/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  User,
  ArrowRight,
  ShieldAlert,
  DollarSign,
  FileText,
  Send,
  Plus,
  Trash2,
  Printer,
  Check,
  ChevronRight,
  FileDown,
  Paperclip,
  UploadCloud,
  Clock,
  Briefcase
} from "lucide-react";
import { AdminOrder, LeadAttachment } from "../../data/adminStore.js";
import { useToast } from "../../contexts/ToastContext.js";

interface OrdersTabProps {
  orders: AdminOrder[];
  onUpdateOrders: (orders: AdminOrder[]) => void;
}

const SERVICE_STAGES = [
  "Documents Pending",
  "Documents Received",
  "Work Started",
  "Government Submission",
  "Awaiting Approval",
  "Completed",
  "Delivered"
] as const;

export default function OrdersTab({ orders, onUpdateOrders }: OrdersTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceStatusFilter, setServiceStatusFilter] = useState<string>("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(orders[0] || null);

  // Interaction tab inside details pane
  const [detailSubTab, setDetailSubTab] = useState<"timeline" | "documents" | "invoice" | "emails" | "notes">("timeline");

  // Notes state
  const [newOrderNote, setNewOrderNote] = useState("");

  // Document upload state
  const [docCategory, setDocCategory] = useState<string>("PAN");
  const [mockFileName, setMockFileName] = useState("");

  // Email state
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<"confirmation" | "invoice" | "completion">("confirmation");

  // Filters calculation
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(term) ||
      order.customer.name.toLowerCase().includes(term) ||
      order.customer.email.toLowerCase().includes(term) ||
      order.customer.phone.includes(term) ||
      order.service.toLowerCase().includes(term);

    const matchesServiceStatus =
      serviceStatusFilter === "All" || order.serviceStatus === serviceStatusFilter;

    const matchesPaymentStatus =
      paymentStatusFilter === "All" || order.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesServiceStatus && matchesPaymentStatus;
  });

  const handleSelectOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
  };

  // Timeline advance
  const handleSetServiceStatus = (status: typeof SERVICE_STAGES[number]) => {
    if (!selectedOrder) return;

    const previousStatus = selectedOrder.serviceStatus;
    if (previousStatus === status) return;

    const statusLog = {
      id: `osl-${Date.now()}`,
      fromStatus: previousStatus,
      toStatus: status,
      updatedBy: "Lead Admin Executive",
      date: new Date().toISOString().split("T")[0]
    };

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        const history = o.statusHistory || [];
        return {
          ...o,
          serviceStatus: status,
          updatedAt: new Date().toISOString().split("T")[0],
          statusHistory: [...history, statusLog]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    const updatedOrder = updated.find((o) => o.id === selectedOrder.id)!;
    setSelectedOrder(updatedOrder);
    toast.success(`Service workflow status updated to: ${status}`, "Workflow Synced");
  };

  // Payment status modification
  const handleSetPaymentStatus = (status: AdminOrder["paymentStatus"]) => {
    if (!selectedOrder) return;

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          paymentStatus: status,
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    const updatedOrder = updated.find((o) => o.id === selectedOrder.id)!;
    setSelectedOrder(updatedOrder);
    toast.info(`Payment status updated to: ${status}`, "Finance Synced");
  };

  // Add internal notes log
  const handleAddOrderNote = () => {
    if (!selectedOrder || !newOrderNote.trim()) return;

    const newNote = {
      id: `onote-${Date.now()}`,
      author: "Admin Officer",
      note: newOrderNote.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        const notes = o.notesHistory || [];
        return {
          ...o,
          notesHistory: [...notes, newNote],
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    const updatedOrder = updated.find((o) => o.id === selectedOrder.id)!;
    setSelectedOrder(updatedOrder);
    setNewOrderNote("");
    toast.success("Internal note appended to order logs.", "Notes Tracked");
  };

  // Document simulation upload
  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const nameToUse = mockFileName.trim() || `${docCategory}_Document_${Math.floor(100 + Math.random() * 900)}.pdf`;

    const newAttachment: LeadAttachment = {
      id: `doc-${Date.now()}`,
      name: nameToUse.endsWith(".pdf") ? nameToUse : `${nameToUse}.pdf`,
      type: "document",
      size: `${(Math.random() * 1.5 + 0.5).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0]
    };

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        const atts = o.attachments || [];
        return {
          ...o,
          attachments: [...atts, newAttachment],
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    const updatedOrder = updated.find((o) => o.id === selectedOrder.id)!;
    setSelectedOrder(updatedOrder);
    setMockFileName("");
    toast.success(`Simulated secure filing upload for '${newAttachment.name}'`, "Document Lodged");
  };

  // Delete simulated document
  const handleDeleteAttachment = (attId: string) => {
    if (!selectedOrder) return;

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        const atts = o.attachments || [];
        return {
          ...o,
          attachments: atts.filter((a) => a.id !== attId),
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    const updatedOrder = updated.find((o) => o.id === selectedOrder.id)!;
    setSelectedOrder(updatedOrder);
    toast.info("Document registration deleted.", "Filing Unlinked");
  };

  // Simulated Email Campaign
  const handleSimulateEmail = () => {
    if (!selectedOrder) return;
    toast.success(`E-mail Campaign triggered! Dispatching preview to ${selectedOrder.customer.email}`, "SMTP Architecture Prepared");
  };

  // Mock invoice print
  const handlePrintInvoice = () => {
    toast.info("Generating beautiful print spooler. Invoice receipt opened in system buffer.", "Invoice Generated");
  };

  // Email Templates personalized generator
  const getEmailTemplatePreview = () => {
    if (!selectedOrder) return { subject: "", body: "" };

    const cName = selectedOrder.customer.name;
    const sName = selectedOrder.service;
    const oId = selectedOrder.id;
    const priceStr = `₹${selectedOrder.totalAmount.toLocaleString("en-IN")}`;

    if (selectedEmailTemplate === "confirmation") {
      return {
        subject: `[Legomark India] Service Order Confirmed - ${oId}`,
        body: `Dear ${cName},

We are pleased to inform you that your application order for "${sName}" has been successfully logged with Legomark India.

Your designated Corporate Filing Executive is actively setting up your workspace. 

Order Reference ID: ${oId}
Service Target: ${sName}
Timeline Tier: 7-9 business days

Please log in to your future Client Portal to upload the required incorporation credentials (PAN, Aadhaar, Registry documents).

Sincerely,
Incorporations Team
Legomark India (Efilingg)`
      };
    } else if (selectedEmailTemplate === "invoice") {
      return {
        subject: `[Legomark India] Invoice Receipt for Service Order - ${oId}`,
        body: `Dear ${cName},

Thank you for selecting Legomark India. Please find enclosed the tax invoice details for order ${oId}:

Service Details: ${sName} (${selectedOrder.packageName})
Professional Fees: ₹${selectedOrder.price}
Discounts Applied: -₹${selectedOrder.discount}
GST Applied (18%): ₹${selectedOrder.gst}
------------------------------------------------
Total Invoice Amount: ${priceStr}
Current Payment Status: ${selectedOrder.paymentStatus.toUpperCase()}

This email serves as an official electronic receipt. 

Sincerely,
Accounts & Billing Department
Legomark India`
      };
    } else {
      return {
        subject: `[Legomark India] Service Filing Completed & Dispatched - ${oId}`,
        body: `Dear ${cName},

We have completed all governmental filing checklists for your requested service "${sName}".

The Certificate of Incorporation, GST Registration Card, or final legal approvals have been approved by the Ministry and are ready for download.

Your order is now fully completed and delivered.

Thank you for choosing Legomark India to build your corporate enterprise. We look forward to managing your annual compliances.

Sincerely,
Client Delivery Division
Legomark India`
      };
    }
  };

  const emailPreview = getEmailTemplatePreview();

  return (
    <div className="space-y-6" id="orders-engine-panel">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-secondary-600" />
            <span>OPERATIONAL ORDERS & COMPLIANCE ENGINE</span>
          </h2>
          <p className="text-xs text-slate-500">
            Monitor state workflow timelines, dispatch tax invoices, review client files, and simulate electronic communications.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="h-4 w-4" /> Live Client Database
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by ID, customer, service, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary-500 text-slate-950"
          />
        </div>

        <div>
          <select
            value={serviceStatusFilter}
            onChange={(e) => setServiceStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-250 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Workflow Stages</option>
            {SERVICE_STAGES.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-250 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Hand list of orders */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col max-h-[700px] overflow-y-auto">
          <div className="p-3 bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            Active Client Orders Queue ({filteredOrders.length})
          </div>
          <div className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No orders match your criteria.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isActive = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`p-4 cursor-pointer transition-colors text-xs ${
                      isActive ? "bg-slate-50/85 border-l-4 border-brand-secondary-500" : "hover:bg-slate-50/40"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-bold text-brand-secondary-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {order.id}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {order.createdAt}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1">
                      {order.customer.name}
                    </div>

                    <div className="text-slate-600 font-medium mb-3">
                      {order.service}
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-sans uppercase ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : order.paymentStatus === "Partial"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        Pay: {order.paymentStatus}
                      </span>

                      <span className="text-slate-300">|</span>

                      <span className="bg-slate-50 text-slate-700 border border-slate-150 px-2 py-0.5 rounded text-[9px] font-bold">
                        {order.serviceStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Hand order workspace control board */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedOrder ? (
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
              {/* Client Summary Header */}
              <div className="p-6 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-secondary-400 font-mono font-bold tracking-wide text-xs">
                      {selectedOrder.id}
                    </span>
                    <span className="text-white/40 font-mono text-xs">|</span>
                    <span className="text-slate-300 text-xs flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3" /> Registered: {selectedOrder.createdAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mt-1 text-white">
                    {selectedOrder.customer.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {selectedOrder.service} — <span className="font-semibold text-brand-secondary-400 font-sans">{selectedOrder.packageName}</span>
                  </p>
                </div>

                {/* Speed Controls for status */}
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Owner Exec: {selectedOrder.assignedExecutive}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleSetPaymentStatus(e.target.value as any)}
                      className="px-2 py-1 text-[11px] font-bold bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none"
                    >
                      <option value="Pending">🔴 Pending</option>
                      <option value="Partial">🟡 Partial</option>
                      <option value="Paid">🟢 Paid</option>
                      <option value="Refunded">🔵 Refunded</option>
                    </select>

                    <select
                      value={selectedOrder.serviceStatus}
                      onChange={(e) => handleSetServiceStatus(e.target.value as any)}
                      className="px-2 py-1 text-[11px] font-bold bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none"
                    >
                      {SERVICE_STAGES.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sub tabs navigation */}
              <div className="flex border-b border-slate-150 bg-slate-50 px-4 text-xs font-semibold">
                {[
                  { id: "timeline", label: "Filing Timeline" },
                  { id: "documents", label: "Client Documents" },
                  { id: "invoice", label: "Invoice Desk" },
                  { id: "emails", label: "Email Dispatch" },
                  { id: "notes", label: "Internal Logs" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailSubTab(tab.id as any)}
                    className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
                      detailSubTab === tab.id
                        ? "border-brand-primary-950 text-slate-900 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic workspace content area */}
              <div className="p-6 min-h-[380px] text-xs">
                
                {/* 1. TIMELINE WORKFLOW PANEL */}
                {detailSubTab === "timeline" && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Filing Stage Timeline Tracker</h4>
                      <p className="text-[11px] text-slate-500">
                        Tracks compliance requirements under Ministry guidelines. Click any phase to simulate moving stage progression.
                      </p>
                    </div>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {SERVICE_STAGES.map((stage, idx) => {
                        const currentStageIdx = SERVICE_STAGES.indexOf(selectedOrder.serviceStatus);
                        const isCompleted = idx < currentStageIdx;
                        const isCurrent = idx === currentStageIdx;
                        const isUpcoming = idx > currentStageIdx;

                        return (
                          <div
                            key={stage}
                            onClick={() => handleSetServiceStatus(stage)}
                            className="relative group cursor-pointer"
                          >
                            {/* Dot */}
                            <div className={`absolute -left-5 top-0.5 h-5 w-5 rounded-full flex items-center justify-center border transition-all z-10 ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500 text-white scale-110"
                                : isCurrent
                                ? "bg-brand-secondary-500 border-brand-secondary-500 text-slate-950 font-bold animate-pulse"
                                : "bg-white border-slate-300 text-slate-400 group-hover:border-slate-400"
                            }`}>
                              {isCompleted ? <Check className="h-3 w-3" /> : <span className="text-[9px] font-mono">{idx + 1}</span>}
                            </div>

                            {/* Label */}
                            <div className="pl-4">
                              <h5 className={`font-bold transition-colors ${
                                isCompleted ? "text-slate-500 line-through" : isCurrent ? "text-slate-950 font-extrabold text-sm" : "text-slate-400"
                              }`}>
                                {stage}
                              </h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {isCompleted
                                  ? "Stage certified compliant."
                                  : isCurrent
                                  ? "Active Phase. Filing officers are drafting and submitting requisites."
                                  : "Awaiting preceding legal approval."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Timeline logs */}
                    {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block mb-2">Stage Transition History Log</span>
                        <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 font-mono text-[10px] text-slate-600">
                          {selectedOrder.statusHistory.map((log) => (
                            <div key={log.id} className="flex justify-between border-b border-slate-200/50 pb-1 last:border-b-0 last:pb-0">
                              <span>
                                🚀 Changed <strong>{log.fromStatus}</strong> ➔ <strong>{log.toStatus}</strong>
                              </span>
                              <span className="text-slate-400">{log.date} by {log.updatedBy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CLIENT DOCUMENTS ARCHITECTURE */}
                {detailSubTab === "documents" && (
                  <div className="space-y-6">
                    <div className="space-y-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Client Legal Document Registry</h4>
                        <p className="text-[11px] text-slate-500">
                          Requires corporate directors' KYC details. File upload is simulation architecture only.
                        </p>
                      </div>
                    </div>

                    {/* Simulated Document list */}
                    <div className="bg-slate-50 border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-200">
                      {["PAN", "Aadhaar", "GST Documents", "Company Documents", "Other Files"].map((cat) => {
                        const file = selectedOrder.attachments?.find(
                          (a) => a.name.toLowerCase().startsWith(cat.toLowerCase().replace(" ", "_")) || a.name.toLowerCase().includes(cat.toLowerCase().split(" ")[0])
                        );

                        return (
                          <div key={cat} className="p-3 flex items-center justify-between text-xs hover:bg-slate-100/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <FileText className={`h-4.5 w-4.5 ${file ? "text-emerald-500" : "text-slate-400"}`} />
                              <div>
                                <span className="font-bold text-slate-700">{cat}</span>
                                {file ? (
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                    <span>{file.name}</span>
                                    <span>•</span>
                                    <span>{file.size}</span>
                                    <span>•</span>
                                    <span>Uploaded: {file.uploadDate}</span>
                                  </div>
                                ) : (
                                  <span className="block text-[10px] text-red-500 font-medium mt-0.5">⚠️ Document Pending Upload</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {file ? (
                                <>
                                  <button
                                    onClick={() => toast.success(`Simulated download trigger for: ${file.name}`, "Secure Handshake Download")}
                                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded border border-slate-200"
                                    title="Download File"
                                  >
                                    <FileDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAttachment(file.id)}
                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Unlink File"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setDocCategory(cat);
                                    setMockFileName(`${cat.replace(" ", "_")}_Verify.pdf`);
                                    toast.info(`Configured simulation upload target: ${cat}`, "Ready to Upload");
                                  }}
                                  className="px-2 py-1 text-[10px] font-bold text-brand-primary-950 hover:bg-brand-primary-950 hover:text-white border border-brand-primary-950 rounded transition-colors"
                                >
                                  Upload Sim
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upload execution panel */}
                    <form onSubmit={handleSimulateUpload} className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-3">
                      <span className="text-[10px] font-bold uppercase text-slate-500 font-mono flex items-center gap-1">
                        <UploadCloud className="h-3.5 w-3.5" /> Simulation Upload Terminal
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Filing Category</label>
                          <select
                            value={docCategory}
                            onChange={(e) => {
                              setDocCategory(e.target.value);
                              setMockFileName(`${e.target.value.replace(" ", "_")}_Checklist.pdf`);
                            }}
                            className="w-full p-2 border border-slate-250 bg-white rounded text-xs text-slate-800"
                          >
                            <option value="PAN">PAN Card</option>
                            <option value="Aadhaar">Aadhaar Card</option>
                            <option value="GST Documents">GST Documents</option>
                            <option value="Company Documents">Company NOC / MoA</option>
                            <option value="Other Files">Other Files</option>
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Simulated File Name</label>
                          <input
                            type="text"
                            placeholder="e.g. director_pan.pdf"
                            value={mockFileName}
                            onChange={(e) => setMockFileName(e.target.value)}
                            className="w-full p-2 border border-slate-250 bg-white rounded text-xs text-slate-850"
                          />
                        </div>

                        <button
                          type="submit"
                          className="py-2 px-4 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded text-xs transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          <span>Simulate Upload</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. TAX INVOICE DESK */}
                {detailSubTab === "invoice" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Automated Tax Invoice Generator</h4>
                        <p className="text-[11px] text-slate-500">Official commercial tax breakdown representing billing ledger.</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={handlePrintInvoice}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="h-3 w-3" /> Print
                        </button>
                        <button
                          onClick={() => toast.success("PDF invoice receipt loaded into secure client files.", "Billing Archive Ready")}
                          className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <FileDown className="h-3 w-3" /> Save PDF
                        </button>
                      </div>
                    </div>

                    {/* Invoice visual block */}
                    <div className="border border-slate-200 bg-white p-6 rounded-xl shadow-xs text-xs space-y-6 font-sans">
                      {/* Header block */}
                      <div className="flex justify-between items-start border-b border-slate-150 pb-4">
                        <div>
                          <h5 className="font-black text-slate-950 uppercase tracking-wider text-sm">LEGOMARK INDIA</h5>
                          <span className="text-[9px] text-slate-400 font-mono tracking-widest block mt-0.5">EFILINGG ENTERPRISE HUB</span>
                          <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                            D-561, Pocket 11, DDA Janta Flats, Jasola, New Delhi – 110025
                            <br />GSTIN: 29AAGCL1044A1ZS
                          </p>
                        </div>
                        <div className="text-right">
                          <h6 className="font-extrabold text-brand-secondary-600 text-sm font-mono uppercase">TAX INVOICE</h6>
                          <table className="text-[10px] text-slate-500 font-mono mt-2 ml-auto">
                            <tbody>
                              <tr>
                                <td className="text-left font-semibold pr-3">INVOICE ID:</td>
                                <td className="text-right text-slate-900 font-bold">{selectedOrder.id.replace("ORD", "INV")}</td>
                              </tr>
                              <tr>
                                <td className="text-left font-semibold pr-3">DATE:</td>
                                <td className="text-right text-slate-900">{selectedOrder.createdAt}</td>
                              </tr>
                              <tr>
                                <td className="text-left font-semibold pr-3">STATUS:</td>
                                <td className={`text-right font-bold uppercase ${selectedOrder.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                                  {selectedOrder.paymentStatus}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Client details block */}
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">BILLED TO:</span>
                        <p className="font-extrabold text-slate-900 text-xs mt-0.5">{selectedOrder.customer.name}</p>
                        <p className="text-slate-500 text-[10px] font-mono mt-0.5">
                          {selectedOrder.customer.companyName || "N/A"}
                          <br />{selectedOrder.customer.phone} | {selectedOrder.customer.email}
                        </p>
                      </div>

                      {/* Items ledger */}
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-1">Legal Service Description</th>
                            <th className="py-2 px-1 text-center">Package Tier</th>
                            <th className="py-2 px-1 text-right">Taxable Fee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-2.5 px-1 font-semibold text-slate-800">{selectedOrder.service}</td>
                            <td className="py-2.5 px-1 text-center font-mono text-slate-500">{selectedOrder.packageName}</td>
                            <td className="py-2.5 px-1 text-right font-mono text-slate-800">₹{selectedOrder.price.toLocaleString("en-IN")}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Ledger totals */}
                      <div className="flex justify-end pt-3 border-t border-slate-150">
                        <table className="w-64 font-mono text-[11px] text-slate-600 leading-relaxed">
                          <tbody>
                            <tr>
                              <td className="text-left font-semibold py-1">Gross Subtotal:</td>
                              <td className="text-right text-slate-900 py-1">₹{selectedOrder.price.toLocaleString("en-IN")}</td>
                            </tr>
                            {selectedOrder.discount > 0 && (
                              <tr className="text-red-500 font-semibold">
                                <td className="text-left py-1">Discount Applied:</td>
                                <td className="text-right py-1">-₹{selectedOrder.discount.toLocaleString("en-IN")}</td>
                              </tr>
                            )}
                            <tr>
                              <td className="text-left py-1">CGST (9%):</td>
                              <td className="text-right text-slate-900 py-1">₹{(selectedOrder.gst / 2).toLocaleString("en-IN")}</td>
                            </tr>
                            <tr className="border-b border-slate-150 pb-2">
                              <td className="text-left py-1">SGST (9%):</td>
                              <td className="text-right text-slate-900 py-1 pb-2">₹{(selectedOrder.gst / 2).toLocaleString("en-IN")}</td>
                            </tr>
                            <tr className="text-xs font-black text-slate-950 font-sans pt-2">
                              <td className="text-left py-2 text-sm uppercase">Total Due (INR):</td>
                              <td className="text-right py-2 text-sm font-mono">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. EMAIL DISPATCH SANDBOX */}
                {detailSubTab === "emails" && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Corporate Email Template Sandbox</h4>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Prepare and verify communication alerts. No real emails will be dispatched (SMTP disabled for DC-006).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: template select */}
                      <div className="space-y-2 md:col-span-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Template Library</span>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { id: "confirmation", label: "Order Confirmation" },
                            { id: "invoice", label: "Invoice Receipt" },
                            { id: "completion", label: "Completion & Delivery" }
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setSelectedEmailTemplate(t.id as any)}
                              className={`w-full py-2.5 px-3 border rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                                selectedEmailTemplate === t.id
                                  ? "bg-brand-primary-950 text-white border-brand-primary-950 shadow-xs"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-800 leading-relaxed font-sans mt-4">
                          ⚠️ <strong>SMTP Shield:</strong> Outbound mail relays are buffered. Dispatch triggers simulate sandbox logs inside activity registries.
                        </div>
                      </div>

                      {/* Right: Template preview block */}
                      <div className="md:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono w-16">Subject:</span>
                            <span className="text-slate-800 font-bold truncate">{emailPreview.subject}</span>
                          </div>
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono w-16">To Client:</span>
                            <span className="text-slate-700 font-mono truncate">{selectedOrder.customer.email}</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block mb-1">Body Preview</span>
                            <pre className="p-3 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-800 font-mono whitespace-pre-wrap h-64 overflow-y-auto leading-relaxed">
                              {emailPreview.body}
                            </pre>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulateEmail}
                          className="w-full py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Send className="h-4 w-4" />
                          <span>Trigger Simulated Dispatch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. INTERNAL NOTES LOG */}
                {detailSubTab === "notes" && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Internal Consultation Notes & Audit History</h4>
                      <p className="text-[11px] text-slate-500">
                        Append compliance remarks, physical dossier statuses, or executive handoff notes.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.notesHistory && selectedOrder.notesHistory.length > 0 ? (
                        <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                          {selectedOrder.notesHistory.map((log) => (
                            <div key={log.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-xs">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-brand-secondary-600 uppercase tracking-wider font-mono">✍️ {log.author}</span>
                                <span className="text-slate-400 font-mono">{log.date}</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed font-sans mt-1">{log.note}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400">
                          No notes have been logged for this order yet.
                        </div>
                      )}
                    </div>

                    {/* Note editor form */}
                    <div className="pt-4 border-t border-slate-100 flex gap-2">
                      <textarea
                        value={newOrderNote}
                        onChange={(e) => setNewOrderNote(e.target.value)}
                        placeholder="Type consultation report, regulatory update, or checklist note..."
                        className="flex-grow p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:bg-white resize-none"
                        rows={2}
                      />
                      <button
                        onClick={handleAddOrderNote}
                        className="px-4 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0 self-end py-3"
                      >
                        Append
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Preparing Client Portal Sync architecture preview (footer) */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="h-4 w-4 text-brand-primary-950 shrink-0" />
                  <div>
                    <span className="font-extrabold text-[10px] uppercase text-slate-700 tracking-wider font-sans block">Client Portal Sync Matrix</span>
                    <span className="text-[9px] text-slate-400 font-mono font-medium">Automatic handoff payload prepared for next deployment stage.</span>
                  </div>
                </div>

                {/* Payload simulator */}
                <button
                  onClick={() => {
                    const syncPayload = {
                      portalSynced: true,
                      clientToken: `usr-${selectedOrder.customer.email.split("@")[0]}`,
                      orderSyncId: selectedOrder.id,
                      currentStageIndex: SERVICE_STAGES.indexOf(selectedOrder.serviceStatus),
                      payloadStatus: "AWAITING_CLIENT_LOGIN"
                    };
                    alert(`JSON Metadata Sync Handshake Payload:\n\n${JSON.stringify(syncPayload, null, 2)}`);
                    toast.success("Handoff payload synchronized to portal register.", "Client Data Structured");
                  }}
                  className="px-3 py-1 bg-white border border-slate-250 hover:bg-slate-50 rounded text-[10px] font-bold text-slate-700 font-mono cursor-pointer shadow-3xs"
                >
                  Inspect Portal Sync Schema
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-full text-slate-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="max-w-md">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Order Selected</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Select an order card in the left queue to access the operational timeline, check document status, prepare invoices, or review templates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
