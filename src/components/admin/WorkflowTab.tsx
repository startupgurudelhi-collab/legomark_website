/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Save,
  CheckCircle2,
  ChevronRight,
  Trash2,
  HelpCircle,
  Kanban,
  List,
  User,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  ArrowRight,
  Activity,
  Calendar,
  TrendingUp,
  CheckSquare,
  FileText,
  Filter,
  Users,
  Bell,
  X,
  Play
} from "lucide-react";

import {
  AdminTask,
  WorkflowTemplate,
  workflowTemplates,
  initialTasks,
  AdminOrder,
  TaskComment,
  TaskActivityLog,
  TaskDocumentChecklistItem
} from "../../data/adminStore.js";

// List of available executives for assignment
const EXECUTIVES = [
  "Rajesh Kumar",
  "Sanjana Sen",
  "Mohit Verma",
  "Priya Sharma",
  "Vivek Anand"
];

// Helper to calculate difference in days
const getRemainingDays = (dueDateStr: string, status: string): { days: number; text: string; isOverdue: boolean } => {
  if (status === "Completed" || status === "Cancelled") {
    return { days: 0, text: "Finished", isOverdue: false };
  }
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(dueDateStr);
  due.setHours(0,0,0,0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { days: Math.abs(diffDays), text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
  } else if (diffDays === 0) {
    return { days: 0, text: "Due today", isOverdue: false };
  } else {
    return { days: diffDays, text: `${diffDays} days left`, isOverdue: false };
  }
};

interface WorkflowTabProps {
  orders: AdminOrder[];
  tasks: AdminTask[];
  onUpdateTasks: (tasks: AdminTask[]) => void;
}

export default function WorkflowTab({ orders, tasks, onUpdateTasks }: WorkflowTabProps) {
  // Current Tab Inside the Workflow Tab
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "board" | "list" | "initialize" | "notifications">("board");
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExecutiveFilter, setSelectedExecutiveFilter] = useState("All");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("All");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("All");
  
  // Selected Task for Details Modal
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);
  
  // New Task form states (Quick Task Create)
  const [isCreatingQuickTask, setIsCreatingQuickTask] = useState(false);
  const [quickTaskOrder, setQuickTaskOrder] = useState("");
  const [quickTaskName, setQuickTaskName] = useState("");
  const [quickTaskDesc, setQuickTaskDesc] = useState("");
  const [quickTaskExec, setQuickTaskExec] = useState(EXECUTIVES[0]);
  const [quickTaskPriority, setQuickTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [quickTaskDueDate, setQuickTaskDueDate] = useState("");
  
  // Interactive Modal comments / checklist states
  const [newCommentText, setNewCommentText] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [modalTaskNotes, setModalTaskNotes] = useState("");
  
  // Initialize Workflow variables
  const [initOrderSelected, setInitOrderSelected] = useState("");
  const [initTemplateSelected, setInitTemplateSelected] = useState("");
  const [initSuccessMessage, setInitSuccessMessage] = useState("");

  // Notification triggers & simulation log state
  const [simulatedNotifications, setSimulatedNotifications] = useState<Array<{ id: string; event: string; title: string; message: string; timestamp: string; type: "info" | "warning" | "success" | "error" }>>(() => {
    const saved = localStorage.getItem("legomark_workflow_notifications");
    return saved ? JSON.parse(saved) : [
      { id: "not-01", event: "Task Assigned", title: "Task Assigned", message: "Verify Promoter PAN and Aadhaar assigned to Rajesh Kumar", timestamp: "2026-06-28 08:35 AM", type: "success" },
      { id: "not-02", event: "Due Tomorrow", title: "Due Tomorrow", message: "FSSAI Application Submission (TSK-002) is due in 24 hours.", timestamp: "2026-06-28T08:14:00.000Z", type: "warning" }
    ];
  });

  // Keep simulated notifications stored
  useEffect(() => {
    localStorage.setItem("legomark_workflow_notifications", JSON.stringify(simulatedNotifications));
  }, [simulatedNotifications]);

  // Log simulation helper
  const triggerNotification = (event: string, title: string, message: string, type: "info" | "warning" | "success" | "error") => {
    const newNot = {
      id: `sys-not-${Date.now()}`,
      event,
      title,
      message,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setSimulatedNotifications(prev => [newNot, ...prev]);
  };

  // Sync state note edits to tasks
  useEffect(() => {
    if (selectedTask) {
      setModalTaskNotes(selectedTask.notes);
    } else {
      setModalTaskNotes("");
    }
  }, [selectedTask]);

  // Handle Drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  // Handle Drop status
  const handleDrop = (e: React.DragEvent, targetStatus: AdminTask["status"]) => {
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    
    updateTaskStatus(taskId, targetStatus);
  };

  // Update Task Status with History Logs and Notification Triggering
  const updateTaskStatus = (taskId: string, targetStatus: AdminTask["status"]) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        if (t.status === targetStatus) return t;
        
        const timestamp = new Date().toISOString();
        const prevStatus = t.status;
        const logEntry: TaskActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          action: "Status Updated",
          description: `Status changed from "${prevStatus}" to "${targetStatus}"`,
          timestamp,
          performedBy: "Lead Admin"
        };

        const isCompleted = targetStatus === "Completed";
        
        // Trigger notifications based on status
        if (isCompleted) {
          triggerNotification("Completed", "Task Completed Successfully", `Task '${t.taskName}' under ${t.service} has been finalized.`, "success");
        } else if (targetStatus === "Waiting Client") {
          triggerNotification("Waiting Client", "Client Input Requested", `Task '${t.taskName}' is now stalled waiting for client action.`, "warning");
        } else if (targetStatus === "Under Review") {
          triggerNotification("Approved", "Task Pending Approval", `Task '${t.taskName}' has been submitted for Lead Admin approval.`, "info");
        }

        return {
          ...t,
          status: targetStatus,
          completedDate: isCompleted ? timestamp.split("T")[0] : t.completedDate,
          activityLog: [logEntry, ...t.activityLog]
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    
    // If the selected task is currently being viewed, update modal preview
    const newlyUpdated = updated.find(t => t.id === taskId);
    if (newlyUpdated && selectedTask?.id === taskId) {
      setSelectedTask(newlyUpdated);
    }
  };

  // Quick Task Creation
  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskName || !quickTaskDueDate) return;

    const matchedOrder = orders.find(o => o.id === quickTaskOrder);
    const serviceName = matchedOrder ? matchedOrder.service : "General Consulting";

    const newTask: AdminTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      orderId: quickTaskOrder || "N/A",
      service: serviceName,
      taskName: quickTaskName,
      description: quickTaskDesc,
      assignedExecutive: quickTaskExec,
      priority: quickTaskPriority,
      status: "Pending",
      dueDate: quickTaskDueDate,
      notes: "",
      documentChecklist: [],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: "Task Created",
          description: `Task initialized for Order ${quickTaskOrder || "General Operations"}`,
          timestamp: new Date().toISOString(),
          performedBy: "Lead Admin"
        },
        {
          id: `act-${Date.now() + 1}`,
          action: "Assigned",
          description: `Executive assignment bound to ${quickTaskExec}`,
          timestamp: new Date().toISOString(),
          performedBy: "Lead Admin"
        }
      ]
    };

    onUpdateTasks([newTask, ...tasks]);
    triggerNotification("Task Assigned", "New Task Initialized", `Task '${quickTaskName}' assigned to ${quickTaskExec}`, "info");
    
    // Reset form
    setQuickTaskName("");
    setQuickTaskDesc("");
    setQuickTaskDueDate("");
    setIsCreatingQuickTask(false);
  };

  // Reassign Task Executive
  const handleReassignExecutive = (taskId: string, targetExec: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        if (t.assignedExecutive === targetExec) return t;

        const logEntry: TaskActivityLog = {
          id: `log-${Date.now()}`,
          action: "Assigned",
          description: `Executive reassigned from "${t.assignedExecutive}" to "${targetExec}"`,
          timestamp: new Date().toISOString(),
          performedBy: "Lead Admin"
        };

        triggerNotification("Task Assigned", "Task Reassigned", `Task '${t.taskName}' reassigned to ${targetExec}`, "info");

        return {
          ...t,
          assignedExecutive: targetExec,
          activityLog: [logEntry, ...t.activityLog]
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
      setSelectedTask(updatedTask);
    }
  };

  // Toggle Document checklist item
  const handleToggleChecklist = (taskId: string, itemName: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const itemIndex = t.documentChecklist.findIndex(i => i.name === itemName);
        if (itemIndex === -1) return t;

        const updatedChecklist = [...t.documentChecklist];
        const prevChecked = updatedChecklist[itemIndex].checked;
        updatedChecklist[itemIndex] = {
          ...updatedChecklist[itemIndex],
          checked: !prevChecked
        };

        const logEntry: TaskActivityLog = {
          id: `log-${Date.now()}`,
          action: "Checklist Toggled",
          description: `Document '${itemName}' verification status set to ${!prevChecked ? "APPROVED" : "PENDING"}`,
          timestamp: new Date().toISOString(),
          performedBy: "Lead Admin"
        };

        return {
          ...t,
          documentChecklist: updatedChecklist,
          activityLog: [logEntry, ...t.activityLog]
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
      setSelectedTask(updatedTask);
    }
  };

  // Add customized document checklist item
  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItem.trim() || !selectedTask) return;

    const newItem: TaskDocumentChecklistItem = {
      name: newChecklistItem.trim(),
      required: true,
      checked: false
    };

    const updated = tasks.map(t => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          documentChecklist: [...t.documentChecklist, newItem],
          activityLog: [
            {
              id: `log-${Date.now()}`,
              action: "Checklist Item Added",
              description: `Added custom required document checklist requirement: "${newChecklistItem}"`,
              timestamp: new Date().toISOString(),
              performedBy: "Lead Admin"
            },
            ...t.activityLog
          ]
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    setNewChecklistItem("");
    setSelectedTask(updated.find(t => t.id === selectedTask.id) || null);
  };

  // Save Task Notes manually inside Modal
  const handleSaveNotes = () => {
    if (!selectedTask) return;

    const updated = tasks.map(t => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          notes: modalTaskNotes,
          activityLog: [
            {
              id: `log-${Date.now()}`,
              action: "Notes Edited",
              description: "Internal task remarks/notes revised.",
              timestamp: new Date().toISOString(),
              performedBy: "Lead Admin"
            },
            ...t.activityLog
          ]
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    setSelectedTask(updated.find(t => t.id === selectedTask.id) || null);
    alert("Internal notes updated successfully.");
  };

  // Submit internal comment & support mention triggers
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;

    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      author: "Lead Admin",
      comment: newCommentText.trim(),
      timestamp: new Date().toISOString()
    };

    // Parse comment to check for @Executive mentions
    EXECUTIVES.forEach(exec => {
      if (newCommentText.toLowerCase().includes(`@${exec.toLowerCase()}`)) {
        triggerNotification(
          "Mention Triggered", 
          "Executive Mentioned", 
          `Lead Admin tagged @${exec} inside task comments for '${selectedTask.taskName}'`,
          "info"
        );
      }
    });

    const updated = tasks.map(t => {
      if (t.id === selectedTask.id) {
        return {
          ...t,
          comments: [...t.comments, newComment],
          activityLog: [
            {
              id: `log-${Date.now()}`,
              action: "Comment Added",
              description: `Comment posted by Lead Admin`,
              timestamp: new Date().toISOString(),
              performedBy: "Lead Admin"
            },
            ...t.activityLog
          ]
        };
      }
      return t;
    });

    onUpdateTasks(updated);
    setNewCommentText("");
    setSelectedTask(updated.find(t => t.id === selectedTask.id) || null);
  };

  // Autocomplete support for @ mentions
  const handleCommentChange = (text: string) => {
    setNewCommentText(text);
    const lastWord = text.split(" ").pop() || "";
    if (lastWord.startsWith("@")) {
      setMentionQuery(lastWord.slice(1));
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleSelectMention = (execName: string) => {
    const words = newCommentText.split(" ");
    words.pop(); // remove the @word
    setNewCommentText([...words, `@${execName} `].join(" "));
    setShowMentionDropdown(false);
  };

  // Reusable Workflow Template Initializer
  const handleInitializeWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initOrderSelected || !initTemplateSelected) return;

    const targetOrder = orders.find(o => o.id === initOrderSelected);
    const targetTemplate = workflowTemplates.find(w => w.service === initTemplateSelected);

    if (!targetOrder || !targetTemplate) return;

    // Map each step from the template to a real task for this specific Order
    const newTasksForOrder: AdminTask[] = targetTemplate.steps.map((step, idx) => {
      const today = new Date();
      today.setDate(today.getDate() + step.durationDays + (idx * 2)); // Stagger due dates sequentially
      const dueDateStr = today.toISOString().split("T")[0];

      const docChecklist: TaskDocumentChecklistItem[] = step.documentChecklist.map(docName => ({
        name: docName,
        required: true,
        checked: false
      }));

      return {
        id: `TSK-${Date.now().toString().slice(-4)}-${idx + 1}`,
        orderId: targetOrder.id,
        service: targetOrder.service,
        taskName: step.name,
        description: step.description,
        assignedExecutive: targetOrder.assignedExecutive || "Rajesh Kumar",
        priority: step.priority,
        status: idx === 0 ? "In Progress" : "Pending", // first task is immediately in-progress
        dueDate: dueDateStr,
        notes: `Automatically initialized from '${targetTemplate.service}' master workflow engine script.`,
        documentChecklist: docChecklist,
        comments: [],
        activityLog: [
          {
            id: `log-init-${Date.now()}-${idx}`,
            action: "Task Created",
            description: `Auto-generated task during template instantiation workflow for '${targetTemplate.service}'`,
            timestamp: new Date().toISOString(),
            performedBy: "Master Workflow Script"
          },
          {
            id: `log-init-assign-${Date.now()}-${idx}`,
            action: "Assigned",
            description: `Auto-bound assignment to executive ${targetOrder.assignedExecutive || "Rajesh Kumar"}`,
            timestamp: new Date().toISOString(),
            performedBy: "Master Workflow Script"
          }
        ]
      };
    });

    onUpdateTasks([...newTasksForOrder, ...tasks]);
    triggerNotification(
      "Workflow Assigned", 
      "Workflow Process Initialized", 
      `Initialized ${newTasksForOrder.length} sequential tasks for Order '${targetOrder.id}' (${targetOrder.customer.name})`,
      "success"
    );

    setInitSuccessMessage(`Successfully provisioned operational workflow with ${newTasksForOrder.length} compliant tasks under '${targetTemplate.service}' template for Client ${targetOrder.customer.name}!`);
    setTimeout(() => setInitSuccessMessage(""), 5000);
    setInitOrderSelected("");
    setInitTemplateSelected("");
  };

  // Filter Tasks list
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.taskName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExec = selectedExecutiveFilter === "All" || t.assignedExecutive === selectedExecutiveFilter;
    const matchesService = selectedServiceFilter === "All" || t.service === selectedServiceFilter;
    const matchesPriority = selectedPriorityFilter === "All" || t.priority === selectedPriorityFilter;

    return matchesSearch && matchesExec && matchesService && matchesPriority;
  });

  // Calculate high-level stats for Analytics Panel
  const totalTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(t => t.status === "Pending" || t.status === "In Progress" || t.status === "Waiting Client" || t.status === "Waiting Government" || t.status === "Under Review").length;
  const completedTodayCount = tasks.filter(t => t.status === "Completed" && t.completedDate === new Date().toISOString().split("T")[0]).length;
  const overdueTasks = tasks.filter(t => {
    const d = getRemainingDays(t.dueDate, t.status);
    return d.isOverdue && t.status !== "Completed" && t.status !== "Cancelled";
  });

  // Executive Workload Indicator Calculations
  const executiveWorkload = EXECUTIVES.map(exec => {
    const execTasks = tasks.filter(t => t.assignedExecutive === exec && t.status !== "Completed" && t.status !== "Cancelled");
    const highPriorityCount = execTasks.filter(t => t.priority === "High").length;
    return {
      name: exec,
      taskCount: execTasks.length,
      highPriorityCount
    };
  });

  // Service Breakdowns
  const servicesRepresented = Array.from(new Set(tasks.map(t => t.service)));

  return (
    <div className="bg-white rounded-xl border border-slate-150 shadow-sm overflow-hidden" id="workflow-engine-root">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Kanban className="w-5 h-5 text-brand-primary-900" />
              Operational Workflow & Task Engine
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Enterprise Task Scheduler, Master Service Templates, Compliance Checklists, & Immutable Audit Timelines.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingQuickTask(true)}
              className="px-3 py-1.5 bg-brand-primary-900 text-white rounded-lg text-xs font-bold hover:bg-brand-primary-800 transition flex items-center gap-1.5"
              id="btn-quick-task"
            >
              <Plus className="w-4 h-4" /> Quick Task
            </button>
          </div>
        </div>

        {/* WORKFLOW NAVIGATION TABS */}
        <div className="flex flex-wrap gap-1 mt-5 border-b border-slate-250/30">
          <button
            onClick={() => { setActiveSubTab("board"); setSelectedTask(null); }}
            className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 -mb-px ${
              activeSubTab === "board"
                ? "border-brand-primary-900 text-brand-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" /> Kanban Workflow Board
          </button>
          
          <button
            onClick={() => { setActiveSubTab("list"); setSelectedTask(null); }}
            className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 -mb-px ${
              activeSubTab === "list"
                ? "border-brand-primary-900 text-brand-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <List className="w-3.5 h-3.5" /> Comprehensive Task List
          </button>

          <button
            onClick={() => { setActiveSubTab("initialize"); setSelectedTask(null); }}
            className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 -mb-px ${
              activeSubTab === "initialize"
                ? "border-brand-primary-900 text-brand-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Play className="w-3.5 h-3.5" /> Initialize Service Workflow
          </button>

          <button
            onClick={() => { setActiveSubTab("dashboard"); setSelectedTask(null); }}
            className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 -mb-px ${
              activeSubTab === "dashboard"
                ? "border-brand-primary-900 text-brand-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Analytics Dashboard
          </button>

          <button
            onClick={() => { setActiveSubTab("notifications"); setSelectedTask(null); }}
            className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 border-b-2 -mb-px relative ${
              activeSubTab === "notifications"
                ? "border-brand-primary-900 text-brand-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Logged Notifications
            <span className="absolute top-1.5 right-0.5 bg-red-500 text-white font-mono text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90">
              {simulatedNotifications.length}
            </span>
          </button>
        </div>
      </div>

      {/* QUICK TASK DIALOG/FORM POPUP */}
      {isCreatingQuickTask && (
        <div className="p-5 bg-blue-50/50 border-b border-blue-100 flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <h4 className="text-xs font-black uppercase text-blue-800 tracking-wider font-mono flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-700" /> Quick Operational Task Setup
            </h4>
            <p className="text-xs text-blue-600 mt-0.5">Initialize a quick standalone compliance action tied to any active client order.</p>
            
            <form onSubmit={handleCreateQuickTask} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Client Order</label>
                <select
                  value={quickTaskOrder}
                  onChange={(e) => setQuickTaskOrder(e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                  required
                >
                  <option value="">-- Choose Order --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} - {o.customer.name} ({o.service})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Task Name</label>
                <input
                  type="text"
                  placeholder="e.g. Draft Board Resolution"
                  value={quickTaskName}
                  onChange={(e) => setQuickTaskName(e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Executive</label>
                <select
                  value={quickTaskExec}
                  onChange={(e) => setQuickTaskExec(e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                >
                  {EXECUTIVES.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={quickTaskDueDate}
                  onChange={(e) => setQuickTaskDueDate(e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Brief Description</label>
                <input
                  type="text"
                  placeholder="Task specifications..."
                  value={quickTaskDesc}
                  onChange={(e) => setQuickTaskDesc(e.target.value)}
                  className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Task Priority</label>
                <select
                  value={quickTaskPriority}
                  onChange={(e) => setQuickTaskPriority(e.target.value as any)}
                  className="w-full text-xs p-1.5 rounded border border-slate-200 bg-white"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div className="flex items-end gap-1.5">
                <button
                  type="submit"
                  className="flex-grow p-1.5 bg-blue-700 text-white rounded text-xs font-bold hover:bg-blue-800 transition"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingQuickTask(false)}
                  className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER CONTROLS BAR (For Board and List view) */}
      {(activeSubTab === "board" || activeSubTab === "list") && (
        <div className="p-4 bg-slate-50/40 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks by ID, name, order ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-primary-900 bg-white"
            />
          </div>

          <div>
            <select
              value={selectedExecutiveFilter}
              onChange={(e) => setSelectedExecutiveFilter(e.target.value)}
              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="All">All Executives</option>
              {EXECUTIVES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="All">All Services</option>
              {servicesRepresented.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* SUB-TAB CONTENTS */}
      <div className="p-5">
        
        {/* SUB-TAB 1: ANALYTICS DASHBOARD */}
        {activeSubTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* KPI METRIC WIDGETS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Total Registry Tasks</span>
                  <h4 className="text-xl font-black text-slate-800 mt-0.5">{totalTasksCount} Active</h4>
                  <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">Synced to Compliance Orders</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Pending Backlog</span>
                  <h4 className="text-xl font-black text-slate-800 mt-0.5">{pendingTasksCount} Waiting</h4>
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Active Operational Work</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-150 bg-red-50 border-red-150 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-400 block tracking-wider font-mono">Overdue Compliance</span>
                  <h4 className="text-xl font-black text-red-700 mt-0.5">{overdueTasks.length} Overdue</h4>
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">High risk of MCA fines</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-150 bg-green-50 border-green-150 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-green-400 block tracking-wider font-mono">Completed Today</span>
                  <h4 className="text-xl font-black text-green-700 mt-0.5">{completedTodayCount} Completed</h4>
                  <p className="text-[10px] text-green-500 font-semibold mt-0.5">100% Turnaround SLA</p>
                </div>
              </div>
            </div>

            {/* CHARTS / ANALYTICS TWO-COLUMN SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Executive Workload Meter */}
              <div className="lg:col-span-2 p-5 rounded-xl border border-slate-150 bg-white">
                <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-brand-primary-900" />
                  Executive Workload Indicators
                </h4>
                
                <div className="space-y-4">
                  {executiveWorkload.map(exec => {
                    const maxPossibleTasks = 10; // Scale target
                    const pct = Math.min((exec.taskCount / maxPossibleTasks) * 100, 100);
                    
                    return (
                      <div key={exec.name} className="space-y-1.5">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-700">{exec.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {exec.taskCount} active ({exec.highPriorityCount} High priority)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              exec.taskCount > 4
                                ? "bg-red-500"
                                : exec.taskCount > 2
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                          <span>0 Tasks</span>
                          <span>{exec.taskCount > 4 ? "🚨 OVERLOADED" : exec.taskCount > 2 ? "⚠️ OCCUPIED" : "✅ BALANCED"}</span>
                          <span>Max 10 Capacity</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Average Completion KPI Pane */}
              <div className="p-5 rounded-xl border border-slate-150 bg-slate-50/40">
                <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  SLA Completion Metrics
                </h4>
                
                <div className="space-y-4 font-sans mt-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-150">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Average Completion Time</span>
                    <h5 className="text-2xl font-black text-slate-800 mt-1">4.2 Days</h5>
                    <p className="text-[9px] text-green-600 font-bold mt-0.5">▼ 12% faster than last quarter</p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-150">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Tasks By Service</span>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Pvt Ltd Company</span>
                        <span className="font-bold text-slate-800">60%</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">GST Registration</span>
                        <span className="font-bold text-slate-800">25%</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Trademark Filing</span>
                        <span className="font-bold text-slate-800">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MASTER WORKFLOW SCRIPTS DETAILS PANE */}
            <div className="p-5 bg-indigo-50/40 rounded-xl border border-indigo-100">
              <h4 className="text-xs font-black uppercase text-indigo-800 tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-700" /> MASTER COMPLIANCE TEMPLATE BLUEPRINTS
              </h4>
              <p className="text-xs text-indigo-600 mt-0.5">Predefined step templates for Indian Corporate & Indirect Tax Registration SLA compliance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {workflowTemplates.map(tmpl => (
                  <div key={tmpl.service} className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-xs font-extrabold text-slate-900">{tmpl.service}</h5>
                      <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                        {tmpl.steps.length} Milestones
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Auto-sequences task instantiation.</p>
                    <ol className="mt-3 space-y-1.5 text-[11px] text-slate-600 list-decimal list-inside border-t border-slate-100 pt-3">
                      {tmpl.steps.map((st, i) => (
                        <li key={i} className="truncate">
                          <span className="font-semibold text-slate-700">{st.name}</span>
                          <span className="text-[9px] text-slate-400 ml-1 font-mono">({st.durationDays}d)</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUB-TAB 2: KANBAN BOARD */}
        {activeSubTab === "board" && (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-[1100px] pb-4">
              
              {/* Columns defined by Statuses */}
              {(["Pending", "In Progress", "Waiting Client", "Waiting Government", "Under Review", "Completed", "Cancelled"] as AdminTask["status"][]).map(colStatus => {
                const colTasks = filteredTasks.filter(t => t.status === colStatus);
                
                return (
                  <div
                    key={colStatus}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, colStatus)}
                    className="flex-1 min-w-[240px] bg-slate-50 rounded-xl p-3 border border-slate-150 flex flex-col min-h-[500px]"
                  >
                    {/* Column Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          colStatus === "Completed" ? "bg-green-500" :
                          colStatus === "In Progress" ? "bg-blue-500 animate-pulse" :
                          colStatus === "Waiting Client" ? "bg-amber-500" :
                          colStatus === "Waiting Government" ? "bg-purple-500" :
                          colStatus === "Under Review" ? "bg-cyan-500" :
                          colStatus === "Cancelled" ? "bg-slate-400" : "bg-slate-300"
                        }`} />
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">{colStatus}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Column Tasks List */}
                    <div className="space-y-3 flex-grow overflow-y-auto max-h-[600px] pr-1">
                      {colTasks.length === 0 ? (
                        <div className="h-24 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          Drag tasks here
                        </div>
                      ) : (
                        colTasks.map(task => {
                          const rem = getRemainingDays(task.dueDate, task.status);
                          const totalDocs = task.documentChecklist.length;
                          const checkedDocs = task.documentChecklist.filter(d => d.checked).length;
                          
                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              onClick={() => setSelectedTask(task)}
                              className="bg-white p-3 rounded-lg border border-slate-150 hover:border-brand-primary-900 hover:shadow-xs transition cursor-grab active:cursor-grabbing space-y-2.5 text-left relative group"
                            >
                              {/* Task Header info */}
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                                  {task.id}
                                </span>
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  task.priority === "High" ? "bg-red-50 text-red-700 border border-red-100" :
                                  task.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                  "bg-slate-50 text-slate-600 border border-slate-150"
                                }`}>
                                  {task.priority}
                                </span>
                              </div>

                              <div>
                                <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-brand-primary-900 transition">
                                  {task.taskName}
                                </h5>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5 font-semibold">
                                  Order Ref: {task.orderId}
                                </p>
                              </div>

                              {/* Progress bar / document checklist indicator */}
                              {totalDocs > 0 && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] text-slate-500">
                                    <span className="font-semibold">Documents Checklist</span>
                                    <span className="font-mono font-bold text-slate-700">{checkedDocs}/{totalDocs} Verified</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                    <div
                                      className="bg-green-500 h-full rounded-full transition-all duration-300"
                                      style={{ width: `${(checkedDocs / totalDocs) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Footer details */}
                              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                                <div className="flex items-center gap-1 font-medium">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span className="truncate max-w-[80px]">{task.assignedExecutive}</span>
                                </div>
                                
                                <div className={`flex items-center gap-1 font-mono text-[9px] font-extrabold ${
                                  rem.isOverdue ? "text-red-600" : "text-slate-400"
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  <span>{task.dueDate}</span>
                                </div>
                              </div>

                              {/* Remaining status indicator */}
                              {rem.text && task.status !== "Completed" && task.status !== "Cancelled" && (
                                <div className="flex items-center justify-between text-[9px]">
                                  <span className={`inline-flex px-1 rounded font-bold ${
                                    rem.isOverdue ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {rem.text}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* SUB-TAB 3: TASK LIST VIEW */}
        {activeSubTab === "list" && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-[9px] font-mono border-b border-slate-150">
                  <th className="p-3">Task ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Task Name</th>
                  <th className="p-3">Assigned Exec</th>
                  <th className="p-3 text-center">Priority</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">SLA Status</th>
                  <th className="p-3">Checklist</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400 font-mono">
                      No matching workflow tasks detected inside database.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(t => {
                    const rem = getRemainingDays(t.dueDate, t.status);
                    const docCount = t.documentChecklist.length;
                    const docVerified = t.documentChecklist.filter(d => d.checked).length;
                    
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/30 transition">
                        <td className="p-3 font-mono font-bold text-slate-900">{t.id}</td>
                        <td className="p-3 font-mono text-slate-500">{t.orderId}</td>
                        <td className="p-3 font-bold text-slate-800">{t.service}</td>
                        <td className="p-3 font-semibold text-slate-900 hover:text-brand-primary-900 cursor-pointer" onClick={() => setSelectedTask(t)}>
                          {t.taskName}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" /> {t.assignedExecutive}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            t.priority === "High" ? "bg-red-50 text-red-700 border border-red-200" :
                            t.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{t.dueDate}</td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            t.status === "Completed" ? "bg-green-50 text-green-700 border border-green-200" :
                            t.status === "In Progress" ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse" :
                            t.status === "Waiting Client" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10px]">
                          {docCount > 0 ? (
                            <span className={docVerified === docCount ? "text-green-600 font-bold" : "text-slate-500"}>
                              {docVerified}/{docCount} Docs
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[9px]">No docs</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedTask(t)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded transition"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUB-TAB 4: INITIALIZE SERVICE WORKFLOW */}
        {activeSubTab === "initialize" && (
          <div className="max-w-2xl mx-auto p-6 bg-slate-50/50 rounded-xl border border-slate-150 space-y-6 text-left">
            <div>
              <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Play className="w-4 h-4 text-brand-primary-900" />
                Initialize Service compliance Workflow
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Instantiate a standardized multi-step operational workflow sequence for any registered corporate order.
              </p>
            </div>

            {initSuccessMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
                {initSuccessMessage}
              </div>
            )}

            <form onSubmit={handleInitializeWorkflow} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">1. Select Target Client Order</label>
                <select
                  value={initOrderSelected}
                  onChange={(e) => setInitOrderSelected(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  required
                >
                  <option value="">-- Choose Client Order --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.customer.name} ({o.service}) [Exec: {o.assignedExecutive}]
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Selected Order's executive will be auto-bound to all sequence steps.</p>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">2. Choose Predefined Service Template</label>
                <select
                  value={initTemplateSelected}
                  onChange={(e) => setInitTemplateSelected(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  required
                >
                  <option value="">-- Choose Predefined Workflow Template --</option>
                  {workflowTemplates.map(w => (
                    <option key={w.service} value={w.service}>{w.service} Workflow Template</option>
                  ))}
                </select>
              </div>

              {initTemplateSelected && (
                <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Previewing Sequential Steps to generate:</span>
                  <div className="space-y-2">
                    {workflowTemplates.find(w => w.service === initTemplateSelected)?.steps.map((st, i) => (
                      <div key={i} className="flex gap-3 text-xs">
                        <span className="font-mono font-bold text-slate-400">Step {i+1}</span>
                        <div>
                          <p className="font-bold text-slate-700">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.description}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[8px] font-mono bg-indigo-50 text-indigo-600 px-1 rounded font-bold">Priority: {st.priority}</span>
                            <span className="text-[8px] font-mono bg-slate-50 text-slate-500 px-1 rounded">Estimated due: +{st.durationDays} days</span>
                            <span className="text-[8px] font-mono text-green-700 font-bold">Required Docs: {st.documentChecklist.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!initOrderSelected || !initTemplateSelected}
                className="w-full p-2.5 bg-brand-primary-900 text-white rounded-lg text-xs font-bold hover:bg-brand-primary-800 disabled:opacity-55 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" /> Spin Up compliant Task Sequences
              </button>
            </form>
          </div>
        )}

        {/* SUB-TAB 5: NOTIFICATIONS COMPONENT LOG */}
        {activeSubTab === "notifications" && (
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
                  Triggered Event Log (Notification Architecture)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit logs of event-driven alerts triggered by system milestones. Email/WhatsApp dispatch mock.
                </p>
              </div>

              <button
                onClick={() => {
                  setSimulatedNotifications([]);
                  localStorage.removeItem("legomark_workflow_notifications");
                }}
                className="text-xs text-red-600 hover:text-red-700 font-bold"
              >
                Clear Audit History
              </button>
            </div>

            {/* Simulated triggers toolbar */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Simulate event triggers:</span>
              <button
                onClick={() => triggerNotification("Due Tomorrow", "Task Due in 24 Hours", "Private Limited Company filing is due tomorrow morning.", "warning")}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] border border-slate-200 text-slate-700 font-semibold rounded shadow-xs"
              >
                Due Tomorrow
              </button>
              <button
                onClick={() => triggerNotification("Overdue", "Overdue SLA Breach Alert", "GST Registration step has exceeded the MCA submission window by 3 days.", "error")}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] border border-slate-200 text-slate-700 font-semibold rounded shadow-xs"
              >
                Overdue
              </button>
              <button
                onClick={() => triggerNotification("Task Assigned", "Compliance Officer Assigned", "DSC Preparation task successfully delegated to Sanjana Sen.", "info")}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] border border-slate-200 text-slate-700 font-semibold rounded shadow-xs"
              >
                Task Assigned
              </button>
              <button
                onClick={() => triggerNotification("Approved", "Task Document Approved", "Trademark Search certificate verified and approved by compliance controller.", "success")}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] border border-slate-200 text-slate-700 font-semibold rounded shadow-xs"
              >
                Completed/Approved
              </button>
            </div>

            <div className="space-y-2 border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {simulatedNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-xs">
                  No active notification events triggered inside logs.
                </div>
              ) : (
                simulatedNotifications.map(not => (
                  <div key={not.id} className="p-3.5 hover:bg-slate-50/50 transition flex items-start gap-3.5 text-xs">
                    <div className={`p-2 rounded-full mt-0.5 ${
                      not.type === "success" ? "bg-green-50 text-green-600" :
                      not.type === "warning" ? "bg-amber-50 text-amber-600" :
                      not.type === "error" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono font-black text-slate-400 uppercase text-[9px] tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                          {not.event}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{not.timestamp}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 mt-1">{not.title}</h5>
                      <p className="text-slate-500 mt-0.5">{not.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* TASK DETAIL INTERACTIVE MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left" id="task-detail-modal">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                    {selectedTask.id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    selectedTask.status === "Completed" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedTask.taskName}</h3>
                <p className="text-xs text-slate-400 font-semibold font-mono">Associated Order: {selectedTask.orderId} ({selectedTask.service})</p>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Workspace */}
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Details, Status, Executive Assignment */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Task Description</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    {selectedTask.description || "No specific detailed description provided for this compliance task."}
                  </p>
                </div>

                {/* Document Checklist Area */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Required Document Checklist</h4>
                  
                  <div className="space-y-1.5 bg-white p-3.5 border border-slate-150 rounded-xl">
                    {selectedTask.documentChecklist.length === 0 ? (
                      <p className="text-xs text-slate-400 font-mono">No document requirements loaded for this step yet.</p>
                    ) : (
                      selectedTask.documentChecklist.map(doc => (
                        <div key={doc.name} className="flex justify-between items-center text-xs p-1.5 hover:bg-slate-50/50 rounded transition">
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={doc.checked}
                              onChange={() => handleToggleChecklist(selectedTask.id, doc.name)}
                              className="w-3.5 h-3.5 accent-brand-primary-900 border-slate-300 rounded"
                            />
                            <span className={doc.checked ? "line-through text-slate-400 font-semibold" : "font-bold text-slate-800"}>
                              {doc.name}
                            </span>
                            {doc.required && <span className="text-[8px] text-red-500 font-bold font-mono">*REQUIRED</span>}
                          </label>

                          <div className="flex items-center gap-1.5">
                            {doc.uploadedUrl ? (
                              <a
                                href={doc.uploadedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[9px] font-mono text-indigo-600 hover:underline font-bold flex items-center gap-0.5"
                              >
                                <Paperclip className="w-3 h-3" /> View Upload
                              </a>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-mono">No attachment uploaded (Mock)</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    {/* Add checklist item */}
                    <form onSubmit={handleAddChecklistItem} className="flex gap-2 border-t border-slate-100 pt-3 mt-3">
                      <input
                        type="text"
                        placeholder="Add required document step (e.g. Utility Bill)..."
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        className="flex-grow text-xs px-2.5 py-1 rounded border border-slate-200 bg-white"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        Add Doc
                      </button>
                    </form>
                  </div>
                </div>

                {/* Internal Notes area */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Operational Remarks / Notes</h4>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      className="flex-grow text-xs p-2.5 rounded-lg border border-slate-250 font-mono bg-slate-50/20 focus:outline-none focus:ring-1 focus:ring-brand-primary-900"
                      value={modalTaskNotes}
                      onChange={(e) => setModalTaskNotes(e.target.value)}
                      placeholder="Input regulatory logs, client call notes, file references..."
                    />
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition flex flex-col justify-center items-center gap-1"
                    >
                      <Save className="w-4 h-4" /> Save Notes
                    </button>
                  </div>
                </div>

                {/* Task Comments Section */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Internal Office Comments</h4>
                  
                  {/* Comments Stack */}
                  <div className="space-y-3 max-h-[220px] overflow-y-auto border border-slate-150 p-3 rounded-lg divide-y divide-slate-100 bg-slate-50/10">
                    {selectedTask.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4 font-mono">No comments posted yet. Type below to ping compliance team.</p>
                    ) : (
                      selectedTask.comments.map(c => (
                        <div key={c.id} className="pt-2 text-xs">
                          <div className="flex justify-between font-mono text-[9px] text-slate-400">
                            <span className="font-extrabold text-indigo-700">{c.author}</span>
                            <span>{new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-700 mt-1 font-sans">{c.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment Input */}
                  <form onSubmit={handleAddComment} className="relative">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add internal comment (use @Rajesh or @Sanjana Sen)..."
                        value={newCommentText}
                        onChange={(e) => handleCommentChange(e.target.value)}
                        className="flex-grow text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-primary-900 text-white font-bold rounded-lg text-xs hover:bg-brand-primary-800 transition flex items-center gap-1"
                      >
                        Comment
                      </button>
                    </div>

                    {/* Mentions query list drop */}
                    {showMentionDropdown && (
                      <div className="absolute bottom-11 left-0 bg-white border border-slate-200 shadow-lg rounded-md w-48 py-1 z-10 text-xs">
                        <div className="p-1 px-2 text-[10px] font-bold uppercase text-slate-400 bg-slate-50">Mention Team Member:</div>
                        {EXECUTIVES.filter(e => e.toLowerCase().includes(mentionQuery.toLowerCase())).map(execName => (
                          <button
                            type="button"
                            key={execName}
                            onClick={() => handleSelectMention(execName)}
                            className="w-full text-left p-1.5 px-2.5 hover:bg-slate-100 text-slate-700 font-medium"
                          >
                            @{execName}
                          </button>
                        ))}
                      </div>
                    )}
                  </form>
                </div>

              </div>

              {/* Right Column: Control Parameters, Status, Assignee, Logs Timeline */}
              <div className="space-y-5 border-l border-slate-100 pl-2 md:pl-4">
                
                {/* Status selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">SLA Compliance Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting Client">Waiting Client</option>
                    <option value="Waiting Government">Waiting Government</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Executive Assignee */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Executive Officer</label>
                  <select
                    value={selectedTask.assignedExecutive}
                    onChange={(e) => handleReassignExecutive(selectedTask.id, e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
                  >
                    {EXECUTIVES.map(exec => (
                      <option key={exec} value={exec}>{exec}</option>
                    ))}
                  </select>
                </div>

                {/* Deadline indicator */}
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-xs space-y-1.5 font-sans">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Service Due Date</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{selectedTask.dueDate}</span>
                  </div>
                  <div>
                    {(() => {
                      const rem = getRemainingDays(selectedTask.dueDate, selectedTask.status);
                      return (
                        <span className={`inline-flex px-2 py-0.5 rounded font-extrabold font-mono text-[10px] uppercase ${
                          rem.isOverdue ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                        }`}>
                          {rem.text}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* IMMUTABLE HISTORIC TIMELINE ACTIVITY LOG */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" /> Compliance Audit Trail
                  </h4>
                  
                  <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 border border-slate-100 p-2.5 rounded-lg bg-slate-50/30">
                    {selectedTask.activityLog.map((log, i) => (
                      <div key={log.id || i} className="text-[10px] border-l border-slate-200 pl-2.5 py-0.5 relative">
                        <span className="absolute -left-[4.5px] top-[4px] w-2 h-2 rounded-full bg-slate-300" />
                        <div className="flex justify-between items-baseline font-mono text-[8px] text-slate-400">
                          <span className="font-extrabold text-slate-500 uppercase">{log.action}</span>
                          <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 font-sans">{log.description}</p>
                        <p className="text-slate-400 font-semibold italic text-[8px]">by {log.performedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
