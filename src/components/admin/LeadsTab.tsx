/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Plus,
  Mail,
  Phone,
  Calendar,
  Bookmark,
  Trash2,
  Check,
  User,
  ArrowRight,
  TrendingUp,
  Sliders,
  List,
  KanbanSquare,
  Sparkles,
  Paperclip,
  UploadCloud,
  FileDown,
  ChevronRight,
  Clock,
  Send,
  Building,
  AlertCircle
} from "lucide-react";
import { AdminLead, AdminOrder, LeadAttachment, LeadNoteLog, LeadStatusLog, LeadFollowUpLog } from "../../data/adminStore.js";
import { Input } from "../Input.js";
import { useToast } from "../../contexts/ToastContext.js";

interface LeadsTabProps {
  leads: AdminLead[];
  onUpdateLeads: (leads: AdminLead[]) => void;
  onAddOrder: (order: AdminOrder) => void;
}

const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Payment Pending",
  "Won",
  "Lost"
] as const;

export default function LeadsTab({ leads, onUpdateLeads, onAddOrder }: LeadsTabProps) {
  const toast = useToast();
  
  // View states
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(leads[0] || null);

  // Inspector panel tabs
  const [inspectorTab, setInspectorTab] = useState<"details" | "documents" | "history" | "email">("details");

  // Lead update fields state
  const [editCompany, setEditCompany] = useState("");
  const [editExecutive, setEditExecutive] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [editFollowUpDate, setEditFollowUpDate] = useState("");
  const [editStatus, setEditStatus] = useState<AdminLead["status"]>("New");
  const [editNotes, setEditNotes] = useState("");

  // History log entry forms
  const [newNoteText, setNewNoteText] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState("");
  const [newFollowUpType, setNewFollowUpType] = useState("Phone Call");
  const [newFollowUpOutcome, setNewFollowUpOutcome] = useState("Awaiting Response");
  const [newFollowUpDesc, setNewFollowUpDesc] = useState("");

  // Document Upload Sim
  const [leadDocCat, setLeadDocCat] = useState("PAN");
  const [leadMockFile, setLeadMockFile] = useState("");

  // Email Template Sandbox
  const [selectedLeadTemplate, setSelectedLeadTemplate] = useState<"welcome" | "proposal">("welcome");

  // Conversion Modal State
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [convPackage, setConvPackage] = useState("Standard Filing");
  const [convBasePrice, setConvBasePrice] = useState(9000);
  const [convDiscount, setConvDiscount] = useState(500);

  // Manual Lead Intake Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  
  // Custom confirmation modal
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [newService, setNewService] = useState("Private Limited Company");
  const [newSource, setNewSource] = useState("Direct Panel Entry");
  const [newCompany, setNewCompany] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Filter out demo data if real leads exist
  const demoIds = ["lead-001", "lead-002", "lead-003", "lead-004"];
  const hasRealLeads = (leads || []).some(l => l && !demoIds.includes(l.id));
  const effectiveLeads = hasRealLeads 
    ? (leads || []).filter(l => l && !demoIds.includes(l.id))
    : (leads || []);

  // Sync selectedLead when effectiveLeads changes
  useEffect(() => {
    if (selectedLead) {
      const exists = effectiveLeads.some(l => l.id === selectedLead.id);
      if (!exists) {
        setSelectedLead(effectiveLeads[0] || null);
      }
    } else {
      setSelectedLead(effectiveLeads[0] || null);
    }
  }, [leads]);

  // Filters calculation
  const filteredLeads = effectiveLeads.filter((lead) => {
    if (!lead) return false;
    const nameStr = lead.name ? String(lead.name).toLowerCase() : "";
    const emailStr = lead.email ? String(lead.email).toLowerCase() : "";
    const phoneStr = lead.phone ? String(lead.phone) : "";
    const serviceStr = lead.service ? String(lead.service).toLowerCase() : "";
    const companyStr = lead.companyName ? String(lead.companyName).toLowerCase() : "";
    const searchLower = (searchTerm || "").toLowerCase();

    const matchesSearch =
      nameStr.includes(searchLower) ||
      emailStr.includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      serviceStr.includes(searchLower) ||
      companyStr.includes(searchLower);

    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Select Lead handler
  const handleSelectLead = (lead: AdminLead) => {
    setSelectedLead(lead);
    setEditCompany(lead.companyName || "");
    setEditExecutive(lead.assignedExecutive || "Unassigned");
    setEditPriority(lead.priority || "Medium");
    setEditFollowUpDate(lead.followUpDate || "");
    setEditStatus(lead.status || "New");
    setEditNotes(lead.notes || "");
  };

  // Drag and drop events for Kanban View
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: AdminLead["status"]) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    const leadToMove = leads.find((l) => l.id === leadId);
    if (!leadToMove) return;

    if (leadToMove.status === targetStatus) return;

    updateLeadStatusDirectly(leadToMove, targetStatus);
    toast.success(`Moved ${leadToMove.name} to '${targetStatus}'`, "Pipeline Synchronized");
  };

  // Centralised Lead Status update handler
  const updateLeadStatusDirectly = (lead: AdminLead, targetStatus: AdminLead["status"]) => {
    const previousStatus = lead.status;
    const log: LeadStatusLog = {
      id: `lsl-${Date.now()}`,
      fromStatus: previousStatus,
      toStatus: targetStatus,
      updatedBy: "Admin Executive",
      date: new Date().toISOString().split("T")[0]
    };

    const updated = leads.map((l) => {
      if (l.id === lead.id) {
        const history = l.statusHistory || [];
        return {
          ...l,
          status: targetStatus,
          statusHistory: [...history, log],
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return l;
    });

    onUpdateLeads(updated);
    
    // Auto sync selected Lead UI
    if (selectedLead?.id === lead.id) {
      setSelectedLead({
        ...selectedLead,
        status: targetStatus,
        statusHistory: [...(selectedLead.statusHistory || []), log],
        updatedAt: new Date().toISOString().split("T")[0]
      });
      setEditStatus(targetStatus);
    }

    // Trigger conversion trigger if Won
    if (targetStatus === "Won") {
      setShowConversionModal(true);
    }
  };

  // Lead metadata updates
  const handleSaveLeadDetails = () => {
    if (!selectedLead) return;

    const previousStatus = selectedLead.status;
    const isStatusChanged = previousStatus !== editStatus;

    let statusHist = selectedLead.statusHistory || [];
    if (isStatusChanged) {
      statusHist = [
        ...statusHist,
        {
          id: `lsl-${Date.now()}`,
          fromStatus: previousStatus,
          toStatus: editStatus,
          updatedBy: "Lead Admin Office",
          date: new Date().toISOString().split("T")[0]
        }
      ];
    }

    const updated = leads.map((l) => {
      if (l.id === selectedLead.id) {
        return {
          ...l,
          companyName: editCompany,
          assignedExecutive: editExecutive,
          priority: editPriority,
          followUpDate: editFollowUpDate,
          status: editStatus,
          notes: editNotes,
          statusHistory: statusHist,
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return l;
    });

    onUpdateLeads(updated);
    setSelectedLead({
      ...selectedLead,
      companyName: editCompany,
      assignedExecutive: editExecutive,
      priority: editPriority,
      followUpDate: editFollowUpDate,
      status: editStatus,
      notes: editNotes,
      statusHistory: statusHist,
      updatedAt: new Date().toISOString().split("T")[0]
    });

    toast.success("Client metadata record saved.", "Inquire Database Synced");

    // Order Conversion trigger
    if (isStatusChanged && editStatus === "Won") {
      setShowConversionModal(true);
    }
  };

  // Add notes log
  const handleAddNoteLog = () => {
    if (!selectedLead || !newNoteText.trim()) return;

    const newNote: LeadNoteLog = {
      id: `lnote-${Date.now()}`,
      author: "Admin Consultant",
      note: newNoteText.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    const updated = leads.map((l) => {
      if (l.id === selectedLead.id) {
        const history = l.notesHistory || [];
        return {
          ...l,
          notesHistory: [...history, newNote],
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return l;
    });

    onUpdateLeads(updated);
    setSelectedLead({
      ...selectedLead,
      notesHistory: [...(selectedLead.notesHistory || []), newNote]
    });
    setNewNoteText("");
    toast.success("Consultation memo logged.", "Internal Remarks Appended");
  };

  // Add follow-up log entry
  const handleAddFollowUpLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newFollowUpDate || !newFollowUpDesc.trim()) {
      alert("Please specify Date and conversation summary.");
      return;
    }

    const newLog: LeadFollowUpLog = {
      id: `lfl-${Date.now()}`,
      date: newFollowUpDate,
      type: newFollowUpType,
      outcome: newFollowUpOutcome,
      description: newFollowUpDesc.trim()
    };

    const updated = leads.map((l) => {
      if (l.id === selectedLead.id) {
        const history = l.followUpHistory || [];
        return {
          ...l,
          followUpHistory: [...history, newLog],
          followUpDate: newFollowUpDate, // auto adjust upcoming follow-up schedule
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return l;
    });

    onUpdateLeads(updated);
    setSelectedLead({
      ...selectedLead,
      followUpHistory: [...(selectedLead.followUpHistory || []), newLog],
      followUpDate: newFollowUpDate
    });
    setEditFollowUpDate(newFollowUpDate);

    setNewFollowUpDate("");
    setNewFollowUpDesc("");
    toast.success(`Logged follow-up action of type '${newFollowUpType}'`, "CRM Logs Updated");
  };

  // Simulated Document upload
  const handleLeadDocUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    const fileName = leadMockFile.trim() || `${leadDocCat}_Verification_${Math.floor(100 + Math.random() * 900)}.pdf`;

    const newAttachment: LeadAttachment = {
      id: `doc-${Date.now()}`,
      name: fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`,
      type: "document",
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0]
    };

    const updated = leads.map((l) => {
      if (l.id === selectedLead.id) {
        const atts = l.attachments || [];
        return {
          ...l,
          attachments: [...atts, newAttachment],
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return l;
    });

    onUpdateLeads(updated);
    setSelectedLead({
      ...selectedLead,
      attachments: [...(selectedLead.attachments || []), newAttachment]
    });
    setLeadMockFile("");
    toast.success(`Simulated secure file lock: '${newAttachment.name}'`, "Dossier Appended");
  };

  // Delete lead simulated document
  const handleDeleteLeadDoc = (id: string) => {
    if (!selectedLead) return;

    const updated = leads.map((l) => {
      if (l.id === selectedLead.id) {
        const atts = l.attachments || [];
        return {
          ...l,
          attachments: atts.filter((a) => a.id !== id),
          updatedAt: new Date().toISOString().split("T")[0]
        };
      }
      return l;
    });

    onUpdateLeads(updated);
    setSelectedLead({
      ...selectedLead,
      attachments: (selectedLead.attachments || []).filter((a) => a.id !== id)
    });
    toast.info("KYC file register cleared.", "Dossier Restored");
  };

  const handleDeleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    setConfirmDelete({ id, name: lead.name });
  };

  const executeDeleteLead = (id: string) => {
    try {
      onUpdateLeads(leads.filter((l) => l.id !== id));
      setSelectedLead(leads[0] || null);
      toast.success("Item deleted successfully.", "Lead Deleted");
    } catch (err) {
      toast.error("Failed to delete the lead.", "Deletion Failed");
    }
  };

  // Manual Lead Creation
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newEmail.trim()) {
      alert("Please fill in Name, Phone, and Email.");
      return;
    }

    const freshLead: AdminLead = {
      id: `L-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      phone: newPhone,
      email: newEmail,
      service: newService,
      source: newSource,
      date: new Date().toISOString().split("T")[0],
      status: "New",
      notes: newNotes,
      companyName: newCompany,
      assignedExecutive: "Unassigned",
      priority: "Medium",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      attachments: [],
      notesHistory: [],
      statusHistory: [
        {
          id: `sl-${Date.now()}`,
          fromStatus: "None",
          toStatus: "New",
          updatedBy: "Operator",
          date: new Date().toISOString().split("T")[0]
        }
      ],
      followUpHistory: []
    };

    onUpdateLeads([freshLead, ...leads]);
    setSelectedLead(freshLead);
    setShowAddModal(false);

    // reset forms
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewCompany("");
    setNewNotes("");

    toast.success(`Client Intake Successful: ${freshLead.name}`, "Database Appended");
  };

  // Order Conversion Submittal
  const handleFinalizeConversion = () => {
    if (!selectedLead) return;

    const grossPrice = convBasePrice;
    const discountAmt = convDiscount;
    const gstAmt = Math.round((grossPrice - discountAmt) * 0.18);
    const finalTotal = grossPrice + gstAmt - discountAmt;

    const newOrder: AdminOrder = {
      id: `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      leadId: selectedLead.id,
      customer: {
        name: selectedLead.name,
        email: selectedLead.email,
        phone: selectedLead.phone,
        companyName: editCompany || selectedLead.companyName || "N/A"
      },
      service: selectedLead.service,
      packageName: convPackage,
      price: grossPrice,
      gst: gstAmt,
      discount: discountAmt,
      totalAmount: finalTotal,
      assignedExecutive: editExecutive === "Unassigned" ? "Senior Executive" : editExecutive,
      paymentStatus: "Pending",
      serviceStatus: "Documents Pending",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      attachments: selectedLead.attachments || [], // Carry over director documents automatically!
      notesHistory: [
        {
          id: `onote-${Date.now()}`,
          author: "Billing Automaton",
          note: `Order converted automatically from Won client lead ${selectedLead.id}. Pre-requisite documents synchronized.`,
          date: new Date().toISOString().split("T")[0]
        }
      ],
      statusHistory: []
    };

    onAddOrder(newOrder);
    setShowConversionModal(false);
    toast.success(`Order created successfully! Assigned ID: ${newOrder.id}`, "Lead Converted to Order");
  };

  // Email Campaign trigger
  const handleSimulateLeadEmail = () => {
    if (!selectedLead) return;
    toast.success(`Campaign Dispatched: Preview sent to ${selectedLead.email}`, "SMTP Dispatch Simulator Active");
  };

  // Personalized Email preview
  const getPersonalizedCampaignPreview = () => {
    if (!selectedLead) return { subject: "", body: "" };

    const leadName = selectedLead.name;
    const serviceTarget = selectedLead.service;

    if (selectedLeadTemplate === "welcome") {
      return {
        subject: `[Legomark India] Complimentary Legal Advisory - ${serviceTarget}`,
        body: `Dear ${leadName},

Thank you for choosing Legomark India to explore legal pathways for "${serviceTarget}".

Our corporate lawyers and certified Chartered Accountants are ready to assist. Below is a summary of benefits we prepared for you:
- Complete SPICe+ MCA filing representation
- Free name reservation guidance
- Lifetime digital filing repository access

Our executive will contact you shortly on your registered coordinates (${selectedLead.phone}) for a free 15-minute consultation.

Sincerely,
Corporate Advisory Division
Legomark India (Efilingg)`
      };
    } else {
      return {
        subject: `[Proposal] Legomark India Filing Quote - ${serviceTarget}`,
        body: `Dear ${leadName},

Following our brief intake consultation, please review the commercial fee estimate for compiling your SPICe+ dossiers:

Service Request: ${serviceTarget}
Government Stamp Duties: Inclusive (up to ₹1,00,000 capital limits)
Professional Filing Fee: Call for discounted tier rates
Execution Timeline: 7-10 business days

Should you agree, we will immediately initiate Name Approval filings on the MCA register.

Sincerely,
Commercial Operations Desk
Legomark India`
      };
    }
  };

  const campaignPreview = getPersonalizedCampaignPreview();

  return (
    <div className="space-y-6" id="lead-management-hub">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="h-5 w-5 text-brand-secondary-600" />
            <span>ENTERPRISE SALES PIPELINE & LEAD ENGINE</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track client acquisition lifecycles, manage sales funnels, log consultations, and convert qualified prospects to active orders.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          {/* View Toggles */}
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === "list" ? "bg-white font-bold text-slate-900 shadow-3xs" : "text-slate-500"
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded flex items-center gap-1 cursor-pointer transition-all ${
                viewMode === "kanban" ? "bg-white font-bold text-slate-900 shadow-3xs" : "text-slate-500"
              }`}
              title="Kanban Board"
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Intake</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, company, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-250 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-250 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Funnel Statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-250 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
      </div>

      {/* Main Workspace Layout (Toggles depending on List/Kanban) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* VIEW 1: LIST QUEUE VIEW */}
        {viewMode === "list" && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col max-h-[650px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-150 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Prospect</th>
                  <th className="py-3 px-4">Company & Service</th>
                  <th className="py-3 px-4 text-center">Filing Status</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      No prospects match this query or filter configuration.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSel = selectedLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => handleSelectLead(lead)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer text-xs ${
                          isSel ? "bg-slate-50 font-medium" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-extrabold text-slate-900 leading-none">{lead.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                            <span>{lead.email}</span>
                            <span>|</span>
                            <span>{lead.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="font-bold text-slate-700">{lead.service}</div>
                          {lead.companyName && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Building className="h-2.5 w-2.5 shrink-0" /> {lead.companyName}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase border ${
                            lead.status === "New"
                              ? "bg-blue-50 border-blue-100 text-blue-600"
                              : lead.status === "Contacted"
                              ? "bg-amber-50 border-amber-100 text-amber-600"
                              : lead.status === "Qualified"
                              ? "bg-purple-50 border-purple-100 text-purple-600"
                              : lead.status === "Proposal Sent"
                              ? "bg-violet-50 border-violet-100 text-violet-600"
                              : lead.status === "Negotiation"
                              ? "bg-pink-50 border-pink-100 text-pink-600"
                              : lead.status === "Payment Pending"
                              ? "bg-red-50 border-red-100 text-red-600"
                              : lead.status === "Won"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600 animate-pulse font-extrabold"
                              : "bg-slate-50 border-slate-100 text-slate-500"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                            lead.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : lead.priority === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}>
                            {lead.priority || "Medium"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 2: DRAG-AND-DROP KANBAN PIPELINE */}
        {viewMode === "kanban" && (
          <div className="lg:col-span-2 overflow-x-auto pb-4 max-h-[650px]" id="kanban-scroller">
            <div className="flex gap-4 min-w-[1200px] h-full">
              {LEAD_STATUSES.map((status) => {
                const columnLeads = filteredLeads.filter((l) => l.status === status);
                return (
                  <div
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                    className="flex-1 min-w-[150px] bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3 text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                      <span>{status}</span>
                      <span className="bg-slate-200/80 px-2 py-0.5 rounded-full font-mono text-slate-500">
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Cards Stack */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px] pb-8 pr-1">
                      {columnLeads.map((lead) => {
                        const isSelected = selectedLead?.id === lead.id;
                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onClick={() => handleSelectLead(lead)}
                            className={`p-3 bg-white border rounded-lg shadow-3xs cursor-grab active:cursor-grabbing transition-all ${
                              isSelected
                                ? "border-brand-secondary-500 ring-1 ring-brand-secondary-400"
                                : "border-slate-200 hover:border-slate-350"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1 text-[9px] font-bold text-slate-400 font-mono">
                              <span>{lead.id}</span>
                              <span className={`px-1 rounded uppercase ${
                                lead.priority === "High" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                              }`}>
                                {lead.priority || "Med"}
                              </span>
                            </div>

                            <div className="font-extrabold text-slate-800 text-xs mb-1 line-clamp-1">
                              {lead.name}
                            </div>

                            <div className="text-[10px] text-slate-500 font-semibold truncate mb-1">
                              {lead.service}
                            </div>

                            <div className="text-[9px] text-slate-400 truncate">
                              Source: {lead.source}
                            </div>
                          </div>
                        );
                      })}

                      {columnLeads.length === 0 && (
                        <div className="text-center py-8 text-slate-300 font-mono text-[9px] border border-dashed border-slate-200 rounded-lg">
                          Drop Leads Here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lead Inspector Detail Board */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between">
          {selectedLead ? (
            <div className="flex-grow flex flex-col">
              {/* Header block with basic summary */}
              <div className="p-4 bg-slate-900 text-white border-b border-slate-850">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] font-bold text-brand-secondary-400">
                    {selectedLead.id}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Calendar className="h-3 w-3" /> Registered: {selectedLead.date}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1">
                  {selectedLead.name}
                </h3>
                <p className="text-[11px] text-slate-400 truncate font-mono">
                  {selectedLead.email} | {selectedLead.phone}
                </p>
                
                {/* Convert to Order Alert if Won */}
                {selectedLead.status === "Won" && (
                  <button
                    onClick={() => setShowConversionModal(true)}
                    className="w-full mt-3 py-1.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-slate-950 font-bold rounded text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs animate-bounce"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Compile active order invoice</span>
                  </button>
                )}
              </div>

              {/* Inspector Navigation Sub-tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-2 text-[11px] font-bold">
                {[
                  { id: "details", label: "Consultation" },
                  { id: "documents", label: "Registry KYC" },
                  { id: "email", label: "Advise Hub" },
                  { id: "history", label: "Activity Logs" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInspectorTab(tab.id as any)}
                    className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                      inspectorTab === tab.id
                        ? "border-brand-primary-950 text-slate-900 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Workspace content */}
              <div className="p-4 text-xs space-y-4 flex-grow">
                
                {/* SUB TAB 1: CONSULTATION DETAILS */}
                {inspectorTab === "details" && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Target Legal Request</span>
                      <p className="text-xs font-semibold text-slate-800 bg-slate-100/60 px-2.5 py-1.5 rounded-lg border border-slate-150 inline-block w-full">
                        {selectedLead.service}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Priority Level</label>
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as any)}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs font-medium text-slate-700"
                        >
                          <option value="Low">🟢 Low Priority</option>
                          <option value="Medium">🟡 Medium Priority</option>
                          <option value="High">🔴 High Priority</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Assigned Counsel</label>
                        <select
                          value={editExecutive}
                          onChange={(e) => setEditExecutive(e.target.value)}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs font-medium text-slate-700"
                        >
                          <option value="Unassigned">Unassigned</option>
                          <option value="Rajesh Kumar (CA)">Rajesh Kumar (CA)</option>
                          <option value="Sanjana Sen (Advocate)">Sanjana Sen (Advocate)</option>
                          <option value="Mohit Verma (Consultant)">Mohit Verma (Consultant)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Company Affiliation</label>
                        <input
                          type="text"
                          placeholder="e.g. Gopal Foods PLC"
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Follow-up Date</label>
                        <input
                          type="date"
                          value={editFollowUpDate}
                          onChange={(e) => setEditFollowUpDate(e.target.value)}
                          className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs text-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">Sales Funnel Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full p-2 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status === "Won" ? "🏆 Won (Active Order)" : status === "Lost" ? "❌ Lost Lead" : `● ${status}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5">First Consultation Notes</label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-slate-200 bg-slate-50/50 rounded-lg text-xs leading-relaxed text-slate-850"
                        placeholder="Key client objectives or DSC validation remarks..."
                      />
                    </div>

                    <button
                      onClick={handleSaveLeadDetails}
                      className="w-full py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save Consultation Details</span>
                    </button>
                  </div>
                )}

                {/* SUB TAB 2: REGISTRY KYC DOCUMENTS */}
                {inspectorTab === "documents" && (
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Registry KYC Checklist</h4>
                      <p className="text-[10px] text-slate-400">Attach compliance documents for MCA company registration dossiers.</p>
                    </div>

                    {/* Document list */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
                      {["PAN", "Aadhaar", "GST Documents", "NOC"].map((cat) => {
                        const file = selectedLead.attachments?.find((a) =>
                          a.name.toLowerCase().startsWith(cat.toLowerCase().replace(" ", "_")) || a.name.toLowerCase().includes(cat.toLowerCase().split(" ")[0])
                        );

                        return (
                          <div key={cat} className="p-2.5 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Building className={`h-3.5 w-3.5 ${file ? "text-emerald-500" : "text-slate-300"}`} />
                              <div>
                                <span className="font-bold text-slate-700 block">{cat} Check</span>
                                {file ? (
                                  <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{file.name} ({file.size})</span>
                                ) : (
                                  <span className="text-[9px] text-red-500 font-medium block mt-0.5">⚠️ Document Missing</span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-1.5">
                              {file ? (
                                <>
                                  <button
                                    onClick={() => toast.success(`Simulated file download: ${file.name}`, "Secure Handshake")}
                                    className="p-1 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 rounded"
                                  >
                                    <FileDown className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLeadDoc(file.id)}
                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setLeadDocCat(cat);
                                    setLeadMockFile(`${cat.replace(" ", "_")}_Copy.pdf`);
                                    toast.info(`Intake category selected: ${cat}`, "Ready to Upload");
                                  }}
                                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[9px] font-bold text-slate-600 border border-slate-200"
                                >
                                  Upload
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upload Simulator */}
                    <form onSubmit={handleLeadDocUpload} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <span className="text-[9px] font-bold uppercase text-slate-500 font-mono flex items-center gap-1">
                        <UploadCloud className="h-3.5 w-3.5" /> Simulation Upload terminal
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={leadDocCat}
                          onChange={(e) => {
                            setLeadDocCat(e.target.value);
                            setLeadMockFile(`${e.target.value.replace(" ", "_")}_Card.pdf`);
                          }}
                          className="w-full p-2 border border-slate-250 bg-white rounded text-xs text-slate-800"
                        >
                          <option value="PAN">PAN Card</option>
                          <option value="Aadhaar">Aadhaar Card</option>
                          <option value="GST Documents">GST Documents</option>
                          <option value="NOC">NOC Address Proof</option>
                        </select>
                        <input
                          type="text"
                          placeholder="file_name.pdf"
                          value={leadMockFile}
                          onChange={(e) => setLeadMockFile(e.target.value)}
                          className="w-full p-2 border border-slate-250 bg-white rounded text-xs text-slate-800"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded text-xs tracking-wide transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>Simulate KYC Document Upload</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB TAB 3: EMAIL ADVISE HUB */}
                {inspectorTab === "email" && (
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Filing Communication Advisory</h4>
                      <p className="text-[10px] text-slate-400">Personalize and simulate email dispatches directly to prospects.</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedLeadTemplate("welcome")}
                        className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedLeadTemplate === "welcome"
                            ? "bg-brand-primary-950 text-white border-brand-primary-950"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        Welcome Advisory
                      </button>
                      <button
                        onClick={() => setSelectedLeadTemplate("proposal")}
                        className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedLeadTemplate === "proposal"
                            ? "bg-brand-primary-950 text-white border-brand-primary-950"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        Service Proposal
                      </button>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 text-[10px]">
                        <span className="font-bold text-slate-400 uppercase font-mono w-14">Subject:</span>
                        <span className="text-slate-800 font-extrabold truncate">{campaignPreview.subject}</span>
                      </div>
                      <pre className="p-2.5 bg-white border border-slate-200 rounded text-[9px] text-slate-700 font-mono whitespace-pre-wrap max-h-[160px] overflow-y-auto leading-normal">
                        {campaignPreview.body}
                      </pre>
                    </div>

                    <button
                      onClick={handleSimulateLeadEmail}
                      className="w-full py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                      <span>Simulate Campaign Outflow</span>
                    </button>
                  </div>
                )}

                {/* SUB TAB 4: ACTIVITY LOGS & NOTES */}
                {inspectorTab === "history" && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {/* Notes history list */}
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Consultation History Timeline</span>
                        {selectedLead.notesHistory && selectedLead.notesHistory.length > 0 ? (
                          selectedLead.notesHistory.map((note) => (
                            <div key={note.id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px]">
                              <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand-secondary-600">
                                <span>✍️ {note.author}</span>
                                <span className="text-slate-400">{note.date}</span>
                              </div>
                              <p className="text-slate-700 font-sans leading-relaxed">{note.note}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic text-center py-4">No consultation logs filed.</p>
                        )}
                      </div>

                      {/* Add note text */}
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          placeholder="Type advisory note memo..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          className="flex-grow p-2 border border-slate-250 bg-slate-50/50 rounded-lg text-xs"
                        />
                        <button
                          onClick={handleAddNoteLog}
                          className="px-3 py-2 bg-brand-primary-950 text-white hover:bg-slate-800 font-bold rounded-lg text-xs cursor-pointer shadow-3xs"
                        >
                          Append
                        </button>
                      </div>
                    </div>

                    {/* Schedule Outbound / Follow-up list */}
                    <div className="pt-3 border-t border-slate-150 space-y-3">
                      <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Log Follow-up & Outcomes</span>
                      <form onSubmit={handleAddFollowUpLog} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={newFollowUpDate}
                            onChange={(e) => setNewFollowUpDate(e.target.value)}
                            className="p-1.5 border border-slate-250 bg-white rounded text-xs text-slate-800 font-mono"
                            required
                          />
                          <select
                            value={newFollowUpType}
                            onChange={(e) => setNewFollowUpType(e.target.value)}
                            className="p-1.5 border border-slate-250 bg-white rounded text-xs text-slate-800"
                          >
                            <option value="Phone Call">Phone Call</option>
                            <option value="E-Mail Campaign">E-Mail Campaign</option>
                            <option value="WhatsApp Advisory">WhatsApp Advisory</option>
                            <option value="Zoom Meeting">Zoom Meeting</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <select
                            value={newFollowUpOutcome}
                            onChange={(e) => setNewFollowUpOutcome(e.target.value)}
                            className="p-1.5 border border-slate-250 bg-white rounded text-xs text-slate-800"
                          >
                            <option value="Awaiting Response">Awaiting Response</option>
                            <option value="Interested - Send Proposal">Interested - Send Proposal</option>
                            <option value="Negotiating Price">Negotiating Price</option>
                            <option value="Dossiers Pending Delivery">Dossiers Pending Delivery</option>
                            <option value="Not Interested / Lost">Not Interested / Lost</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Brief conversation summary..."
                            value={newFollowUpDesc}
                            onChange={(e) => setNewFollowUpDesc(e.target.value)}
                            className="p-1.5 border border-slate-250 bg-white rounded text-xs text-slate-850"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded text-xs tracking-wide transition-all shadow-xs cursor-pointer"
                        >
                          Add Action Log
                        </button>
                      </form>

                      {/* Display historic campaigns */}
                      {selectedLead.followUpHistory && selectedLead.followUpHistory.length > 0 && (
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto font-mono text-[9px] text-slate-500">
                          {selectedLead.followUpHistory.map((h) => (
                            <div key={h.id} className="border-b border-slate-100 pb-1 last:border-b-0">
                              <span className="font-bold text-slate-700">[{h.date}] {h.type}</span> ➔ Outcome: <span className="text-brand-secondary-600 font-bold">{h.outcome}</span>
                              <p className="font-sans text-slate-500 text-[10px] mt-0.5">{h.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a lead card to view full consultation details.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ORDER INVOICING CONVERSION MODAL */}
      {showConversionModal && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden font-sans">
            <div className="px-6 py-4.5 bg-brand-primary-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">Automated Order Conversion Desk</h3>
                <span className="text-[9px] text-brand-secondary-400 font-mono">ID conversion target: {selectedLead.id}</span>
              </div>
              <button
                onClick={() => setShowConversionModal(false)}
                className="text-white/70 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-brand-primary-50 border border-brand-primary-100/50 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-brand-primary-950 uppercase font-mono block">Prospect Information</span>
                <p className="font-extrabold text-slate-900">{selectedLead.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{selectedLead.email} | {selectedLead.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Service Target</label>
                  <input
                    type="text"
                    value={selectedLead.service}
                    className="w-full p-2.5 bg-slate-100 border border-slate-250 rounded-lg text-slate-600 font-semibold"
                    disabled
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Compliance Package</label>
                  <select
                    value={convPackage}
                    onChange={(e) => {
                      setConvPackage(e.target.value);
                      const prices: Record<string, number> = {
                        "Standard Filing": 9000,
                        "Professional Incorporation": 14000,
                        "Premium Growth Package": 19500
                      };
                      setConvBasePrice(prices[e.target.value] || 9000);
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="Standard Filing">Standard Filing (Base)</option>
                    <option value="Professional Incorporation">Professional Incorporation</option>
                    <option value="Premium Growth Package">Premium Growth Package</option>
                  </select>
                </div>
              </div>

              {/* Invoicing calculations */}
              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-3 font-mono text-[11px]">
                <span className="text-[9px] font-bold uppercase text-slate-500 block">Commercial Fees & GST Breakdown (18%)</span>
                
                <div className="flex justify-between items-center">
                  <span>Gross Package Fee:</span>
                  <div className="flex items-center gap-1">
                    <span>₹</span>
                    <input
                      type="number"
                      value={convBasePrice}
                      onChange={(e) => setConvBasePrice(Number(e.target.value))}
                      className="w-20 p-1 border border-slate-250 bg-white text-right rounded font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-red-600">
                  <span>Loyalty Discount:</span>
                  <div className="flex items-center gap-1">
                    <span>-₹</span>
                    <input
                      type="number"
                      value={convDiscount}
                      onChange={(e) => setConvDiscount(Number(e.target.value))}
                      className="w-20 p-1 border border-slate-250 bg-white text-right rounded font-mono text-red-600 font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>Computed IGST (18%):</span>
                  <span>₹{Math.round((convBasePrice - convDiscount) * 0.18).toLocaleString("en-IN")}</span>
                </div>

                <div className="border-t border-slate-250 pt-2 flex justify-between items-center text-slate-950 font-bold text-sm font-sans uppercase">
                  <span>Total Due (INR):</span>
                  <span className="font-mono">
                    ₹{(
                      convBasePrice +
                      Math.round((convBasePrice - convDiscount) * 0.18) -
                      convDiscount
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-sans">
                💡 <strong>Audit Trail:</strong> Submitting finalizes this client dossier into an invoice ready active order inside the legomark operational registry.
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConversionModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalizeConversion}
                  className="px-5 py-2.5 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-slate-950 font-black rounded-lg text-xs tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Finalize Order & Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL CLIENT INTAKE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-250 overflow-hidden font-sans">
            <div className="px-6 py-4.5 bg-brand-primary-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wider uppercase">Manual Prospect Intake Desk</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLead} className="p-6 space-y-4 text-xs text-slate-700">
              <Input
                label="Full Name *"
                placeholder="e.g. Anand Gopal"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                id="intake-name"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phone *"
                  placeholder="e.g. 9876543210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  id="intake-phone"
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="e.g. anand@corp.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  id="intake-email"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Service Interested Target
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
                  >
                    <option value="Private Limited Company">Private Limited Company</option>
                    <option value="One Person Company">One Person Company</option>
                    <option value="LLP Registration">Limited Liability Partnership</option>
                    <option value="GST Registration">GST Registration</option>
                    <option value="GST Return Filing">GST Return Filing</option>
                    <option value="Income Tax Return">Income Tax Return</option>
                    <option value="Trademark Registration">Trademark Registration</option>
                    <option value="FSSAI Food License">FSSAI Food License</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Lead Source Channel
                  </label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
                  >
                    <option value="Manual Entry">Direct Panel Entry</option>
                    <option value="Website">Website Forms</option>
                    <option value="WhatsApp">WhatsApp Assistant</option>
                    <option value="Facebook">Facebook Ads</option>
                    <option value="Referral">Direct Referral</option>
                  </select>
                </div>
              </div>

              <Input
                label="Company Affiliation (Optional)"
                placeholder="e.g. Gopal Enterprises"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                id="intake-company"
              />

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Initial Consultation Remarks
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  className="block w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
                  placeholder="Any company name reservations or DSC status notes..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow cursor-pointer"
                >
                  Add to Active Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" id="delete-lead-dialog">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Confirm Lead Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the lead record of <strong className="text-slate-800">"{confirmDelete.name}"</strong>? This action is permanent and cannot be undone.
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  executeDeleteLead(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-md shadow-red-200 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
