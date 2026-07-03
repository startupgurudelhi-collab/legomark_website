/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Cpu,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  AlertTriangle,
  Pause,
  Sliders,
  FileText,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Database,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext.js";
import {
  EventType,
  AutomationRule,
  QueueJob,
  ExecutionLog,
  AuditTrailRecord,
  initialRules,
  initialQueueJobs,
  initialExecutionLogs,
  initialAuditTrail
} from "../../data/automationEngine.js";
import { AdminLead, AdminOrder, AdminTask } from "../../data/adminStore.js";

interface AutomationTabProps {
  leads: AdminLead[];
  orders: AdminOrder[];
  tasks: AdminTask[];
  onUpdateLeads?: (leads: AdminLead[]) => void;
  onUpdateOrders?: (orders: AdminOrder[]) => void;
  onUpdateTasks?: (tasks: AdminTask[]) => void;
}

export default function AutomationTab({
  leads,
  orders,
  tasks,
  onUpdateLeads,
  onUpdateOrders,
  onUpdateTasks
}: AutomationTabProps) {
  const toast = useToast();

  // Primary states synchronized with LocalStorage
  const [rules, setRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem("legomark_automation_rules");
    return saved ? JSON.parse(saved) : initialRules;
  });

  const [queue, setQueue] = useState<QueueJob[]>(() => {
    const saved = localStorage.getItem("legomark_automation_queue");
    return saved ? JSON.parse(saved) : initialQueueJobs;
  });

  const [logs, setLogs] = useState<ExecutionLog[]>(() => {
    const saved = localStorage.getItem("legomark_automation_logs");
    return saved ? JSON.parse(saved) : initialExecutionLogs;
  });

  const [auditTrail, setAuditTrail] = useState<AuditTrailRecord[]>(() => {
    const saved = localStorage.getItem("legomark_automation_audit");
    return saved ? JSON.parse(saved) : initialAuditTrail;
  });

  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(() => {
    const saved = localStorage.getItem("legomark_automation_paused");
    return saved ? JSON.parse(saved) === "true" : false;
  });

  // Local navigation tab
  const [innerTab, setInnerTab] = useState<"dashboard" | "rules" | "queue" | "logs" | "audit">("dashboard");

  // Local UI simulation parameters
  const [simEvent, setSimEvent] = useState<EventType>("Lead Created");
  const [simLeadId, setSimLeadId] = useState<string>("");
  const [simOrderId, setSimOrderId] = useState<string>("");
  const [simFailure, setSimFailure] = useState<boolean>(false);
  const [simProcessing, setSimProcessing] = useState<boolean>(false);

  // New Rule creation parameters
  const [isAddingRule, setIsAddingRule] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>("");
  const [newRuleTrigger, setNewRuleTrigger] = useState<EventType>("Lead Created");
  const [newRuleConditions, setNewRuleConditions] = useState<string>("Any conditions");
  const [newRulePriority, setNewRulePriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [newRuleActions, setNewRuleActions] = useState<string>("Assign Executive, Notify Admin");

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("legomark_automation_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem("legomark_automation_queue", JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem("legomark_automation_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("legomark_automation_audit", JSON.stringify(auditTrail));
  }, [auditTrail]);

  useEffect(() => {
    localStorage.setItem("legomark_automation_paused", String(isQueuePaused));
  }, [isQueuePaused]);

  // Push an audit entry
  const addAuditEntry = (action: string, prev: string, next: string) => {
    const newRecord: AuditTrailRecord = {
      id: `AUD-${Date.now()}`,
      user: "Admin (foujianehal@gmail.com)",
      timestamp: new Date().toISOString(),
      action,
      previousState: prev,
      newState: next
    };
    setAuditTrail((prevList) => [newRecord, ...prevList]);
  };

  // Enable/Disable rule
  const toggleRule = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    const originalState = rule.enabled ? "Enabled" : "Disabled";
    const newState = rule.enabled ? "Disabled" : "Enabled";

    setRules(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );

    addAuditEntry(`Toggle Rule ${id} (${rule.name})`, originalState, newState);
    toast.success(
      `Rule '${rule.name}' has been successfully ${newState.toLowerCase()}d.`,
      "Rule Configuration Saved"
    );
  };

  // Delete rule (only custom rules)
  const deleteRule = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    setRules(rules.filter((r) => r.id !== id));
    addAuditEntry(`Delete Rule ${id}`, "Existing Rule", "Purged");
    toast.success(`Rule '${rule.name}' permanently deleted.`, "Rule Purged");
  };

  // Create a brand new custom rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) {
      toast.error("Please enter a valid descriptive rule name.", "Validation Error");
      return;
    }

    const actionList = newRuleActions.split(",").map((act) => ({
      type: act.trim(),
      params: { createdBy: "user_cms" }
    }));

    const newRuleObj: AutomationRule = {
      id: `RULE-USR-${Date.now().toString().slice(-4)}`,
      name: newRuleName,
      trigger: newRuleTrigger,
      conditions: newRuleConditions,
      actions: actionList,
      priority: newRulePriority,
      enabled: true,
      executionCount: 0
    };

    setRules([...rules, newRuleObj]);
    addAuditEntry("Create Custom Business Rule", "N/A", `Rule ${newRuleObj.id} Active`);
    setIsAddingRule(false);

    // Reset fields
    setNewRuleName("");
    setNewRuleConditions("Any conditions");
    setNewRulePriority("Medium");
    setNewRuleActions("Assign Executive, Notify Admin");

    toast.success(`Custom rule '${newRuleObj.name}' generated.`, "Rule Ready");
  };

  // Asynchronous simulation of the event dispatcher and queue processing
  const handleFireSimulatedEvent = async () => {
    if (isQueuePaused) {
      toast.error("The Automation Queue is currently PAUSED. Resume the queue to trigger events.", "Queue Locked");
      return;
    }

    setSimProcessing(true);
    toast.info(`Dispatching event: '${simEvent}' to Legomark Bus...`, "Event Fired");

    // Build payload context
    let payloadContext: any = { timestamp: new Date().toISOString() };
    if (simEvent.startsWith("Lead") && simLeadId) {
      const match = leads.find((l) => l.id === simLeadId);
      if (match) {
        payloadContext = { ...payloadContext, leadId: match.id, name: match.name, email: match.email, service: match.service };
      }
    } else if (simEvent.startsWith("Order") && simOrderId) {
      const match = orders.find((o) => o.id === simOrderId);
      if (match) {
        payloadContext = { ...payloadContext, orderId: match.id, customer: match.customer.name, total: match.totalAmount, service: match.service };
      }
    } else {
      payloadContext = { ...payloadContext, simulated: true, mockAgent: "Antigravity DC-007E Core" };
    }

    // Step 1: Find all matching, active rules for this trigger
    const matchingRules = rules.filter((r) => r.trigger === simEvent && r.enabled);

    if (matchingRules.length === 0) {
      // Create a dummy queue job just to track empty matches
      const emptyJobId = `JOB-${Date.now()}`;
      const emptyJob: QueueJob = {
        id: emptyJobId,
        event: simEvent,
        ruleName: "No Matching Rules Found",
        status: "Completed",
        retryCount: 0,
        createdTime: new Date().toISOString(),
        executedTime: new Date().toISOString(),
        payload: payloadContext
      };

      setQueue((prev) => [emptyJob, ...prev]);
      addAuditEntry(`Dispatch '${simEvent}'`, "Fired", "No Rules Matched");
      setSimProcessing(false);
      toast.warn(`Event '${simEvent}' was broadcasted, but no active automation rules match this trigger.`, "No Rules Triggered");
      return;
    }

    // Pushed matching jobs into queue
    for (const rule of matchingRules) {
      const jobId = `JOB-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
      const startTime = new Date().toISOString();

      const newJob: QueueJob = {
        id: jobId,
        event: simEvent,
        ruleName: rule.name,
        status: "Pending",
        retryCount: 0,
        createdTime: startTime,
        payload: payloadContext
      };

      // Add to queue
      setQueue((prev) => [newJob, ...prev]);
      addAuditEntry(`Enqueue Automation Job ${jobId}`, "Triggered", "Pending Queue");

      // Simulate a small network delay for asynchronous queue scheduling
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Transition state: Running
      setQueue((prevList) =>
        prevList.map((j) => (j.id === jobId ? { ...j, status: "Running" } : j))
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const duration = Math.floor(80 + Math.random() * 120);

      if (simFailure) {
        // Trigger simulated integration layer failure
        const errReason = "Integration Layer Timeout: Handshake timeout with SendGrid/WhatsApp proxy.";

        // Update Job state to Failed
        setQueue((prevList) =>
          prevList.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: "Failed",
                  executedTime: new Date().toISOString(),
                  failureReason: errReason,
                  retryCount: j.retryCount + 1
                }
              : j
          )
        );

        // Add execution log
        const logEntry: ExecutionLog = {
          id: `LOG-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
          event: simEvent,
          ruleName: rule.name,
          triggerTime: startTime,
          executionTime: new Date().toISOString(),
          result: `Failed: Automation rules met conditions, but integration proxy failed.`,
          durationMs: duration + 150,
          errors: errReason
        };
        setLogs((prev) => [logEntry, ...prev]);
        addAuditEntry(`Job ${jobId} failed`, "Running", "Failed (Will Retry)");

        // Simulate automatic retry logic (maximum 1 automatic retry in simulation for speed)
        await new Promise((resolve) => setTimeout(resolve, 1200));
        toast.info(`Job '${jobId}' failed on first attempt. Initiating automatic retry...`, "Auto-Retry Initiated");

        setQueue((prevList) =>
          prevList.map((j) => (j.id === jobId ? { ...j, status: "Running" } : j))
        );

        await new Promise((resolve) => setTimeout(resolve, 800));

        // Let the automatic retry succeed to demonstrate self-healing!
        setQueue((prevList) =>
          prevList.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: "Completed",
                  executedTime: new Date().toISOString(),
                  failureReason: undefined
                }
              : j
          )
        );

        const retryLogEntry: ExecutionLog = {
          id: `LOG-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
          event: simEvent,
          ruleName: rule.name,
          triggerTime: startTime,
          executionTime: new Date().toISOString(),
          result: `Success: Restored after automatic retry. Actions assigned to executives & integrations triggered.`,
          durationMs: duration + 90,
        };
        setLogs((prev) => [retryLogEntry, ...prev]);
        addAuditEntry(`Job ${jobId} recovery`, "Failed/Retrying", "Completed Successfully");

      } else {
        // Normal success execution flow
        setQueue((prevList) =>
          prevList.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: "Completed",
                  executedTime: new Date().toISOString()
                }
              : j
          )
        );

        // Record execution log
        const logEntry: ExecutionLog = {
          id: `LOG-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
          event: simEvent,
          ruleName: rule.name,
          triggerTime: startTime,
          executionTime: new Date().toISOString(),
          result: `Success: Rule conditions met. Dispatched tasks/records, integration layer alerted.`,
          durationMs: duration
        };

        setLogs((prev) => [logEntry, ...prev]);

        // Increment rule execution count
        setRules((prevRules) =>
          prevRules.map((r) =>
            r.id === rule.id ? { ...r, executionCount: r.executionCount + 1 } : r
          )
        );

        // Perform side-effect inside other databases based on rules
        executeBusinessSideEffects(rule.id, payloadContext);

        addAuditEntry(`Execute Rule ${rule.id}`, "Running", "Completed");
      }
    }

    setSimProcessing(false);
    toast.success("Simulation event stream complete! See logs & queue panels.", "Execution Success");
  };

  // Perform virtual modifications to other database state based on rules to make the system live!
  const executeBusinessSideEffects = (ruleId: string, payload: any) => {
    if (!payload) return;

    if (ruleId === "RULE-001" && onUpdateLeads && leads.length > 0) {
      // Auto assign executive in leads database
      const leadId = payload.leadId;
      if (leadId) {
        onUpdateLeads(
          leads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  assignedExecutive: "Rajesh Kumar",
                  status: "Contacted",
                  notes: `${l.notes}\n[SYSTEM AUTOMATION] Assigned to Rajesh Kumar on Lead Creation.`
                }
              : l
          )
        );
      }
    }

    if (ruleId === "RULE-002" && onUpdateTasks && tasks.length > 0) {
      // Auto generate a new compliance task for the order
      const orderId = payload.orderId || "ORD-2026-002";
      const serviceName = payload.service || "Compliance Verification";
      const newTask: AdminTask = {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        orderId,
        service: serviceName,
        taskName: "Automated Compliance Document Verification",
        description: "Initialize compliance framework checks dispatched by rule engine.",
        assignedExecutive: "Rajesh Kumar",
        priority: "High",
        status: "In Progress",
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        notes: "Auto-dispatched on order placement event.",
        documentChecklist: [
          { name: "PAN Verification", required: true, checked: false },
          { name: "Aadhaar Match Check", required: true, checked: false }
        ],
        comments: [],
        activityLog: [
          {
            id: `act-${Date.now()}`,
            action: "Task Created",
            description: "Task initialized by rule engine.",
            timestamp: new Date().toISOString(),
            performedBy: "Rule Engine"
          }
        ]
      };
      onUpdateTasks([newTask, ...tasks]);
    }
  };

  // Manual retry of a failed job
  const handleManualRetry = async (jobId: string) => {
    const job = queue.find((j) => j.id === jobId);
    if (!job) return;

    toast.info(`Manual override: Retrying job '${jobId}'...`, "Re-Executing");

    // Transition state: Running
    setQueue((prevList) =>
      prevList.map((j) => (j.id === jobId ? { ...j, status: "Running", failureReason: undefined } : j))
    );

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Resolve as completed
    setQueue((prevList) =>
      prevList.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: "Completed",
              executedTime: new Date().toISOString(),
              retryCount: j.retryCount + 1
            }
          : j
      )
    );

    // Record success log
    const retryLogEntry: ExecutionLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
      event: job.event,
      ruleName: job.ruleName,
      triggerTime: job.createdTime,
      executionTime: new Date().toISOString(),
      result: `Success: Manual administrative retry resolved integration constraints. Dispatched successfully.`,
      durationMs: 110
    };
    setLogs((prev) => [retryLogEntry, ...prev]);

    addAuditEntry(`Manual Retry Job ${jobId}`, "Failed", "Completed Successfully");
    toast.success(`Job '${jobId}' has completed successfully!`, "Job Resolved");
  };

  // Pause / Resume queue
  const handlePauseToggle = () => {
    setIsQueuePaused(!isQueuePaused);
    const prev = isQueuePaused ? "Paused" : "Running";
    const next = isQueuePaused ? "Running" : "Paused";
    addAuditEntry("Toggle Queue Execution Flow", prev, next);
    toast.info(
      `Queue execution is now ${isQueuePaused ? "ACTIVE" : "PAUSED"}.`,
      isQueuePaused ? "Queue Running" : "Queue Paused"
    );
  };

  // Purge/Clear history logs (administrative rule settings helper)
  const handlePurgeHistory = () => {
    if (confirm("Are you sure you want to clear the logs and execution queue histories?")) {
      setQueue([]);
      setLogs([]);
      addAuditEntry("Purge Execution Logs & Queue", "Stored History", "Empty Ledger");
      toast.success("Execution ledger purged successfully.", "History Cleared");
    }
  };

  // Calculate Metrics
  const totalEventsToday = logs.length + queue.filter((q) => q.status === "Pending").length;
  const successfulRuns = logs.filter((l) => !l.errors).length;
  const failedRuns = queue.filter((q) => q.status === "Failed").length;
  const pendingJobs = queue.filter((q) => q.status === "Pending").length;
  const totalDuration = logs.reduce((sum, current) => sum + current.durationMs, 0);
  const avgDuration = logs.length ? Math.round(totalDuration / logs.length) : 0;
  const totalRetries = queue.reduce((sum, current) => sum + current.retryCount, 0);

  return (
    <div className="space-y-6 animate-fade-in" id="automation-tab">
      
      {/* 1. Header with metadata context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-brand-secondary-600 animate-pulse" />
            CENTRAL AUTOMATION ENGINE (DC-007E)
          </h2>
          <p className="text-xs text-slate-500">
            Coordinates business logic, trigger evaluation, and dispatches notification events to the Legomark Integration Layer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePauseToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 border transition-all cursor-pointer ${
              isQueuePaused
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isQueuePaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            <span>{isQueuePaused ? "Resume Queue" : "Pause Queue"}</span>
          </button>

          <button
            onClick={handlePurgeHistory}
            className="px-3 py-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-700 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Purge Stats</span>
          </button>
        </div>
      </div>

      {/* 2. Sub tab Navigation */}
      <div className="border-b border-slate-200/60 flex items-center gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setInnerTab("dashboard")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            innerTab === "dashboard"
              ? "border-brand-secondary-600 text-brand-secondary-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Automation Dashboard
        </button>
        <button
          onClick={() => setInnerTab("rules")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            innerTab === "rules"
              ? "border-brand-secondary-600 text-brand-secondary-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Business Rules ({rules.length})
        </button>
        <button
          onClick={() => setInnerTab("queue")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            innerTab === "queue"
              ? "border-brand-secondary-600 text-brand-secondary-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Asynchronous Queue ({pendingJobs})
          {pendingJobs > 0 && (
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setInnerTab("logs")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            innerTab === "logs"
              ? "border-brand-secondary-600 text-brand-secondary-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Execution History ({logs.length})
        </button>
        <button
          onClick={() => setInnerTab("audit")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            innerTab === "audit"
              ? "border-brand-secondary-600 text-brand-secondary-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Security Audit Trail
        </button>
      </div>

      {/* 3. Render Sub Tabs */}

      {/* A. DASHBOARD VIEW */}
      {innerTab === "dashboard" && (
        <div className="space-y-6">
          {/* Metrics Panel */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1.5">
              <span className="text-slate-500 font-bold text-[10px] tracking-wider uppercase block">Events Routed</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">{totalEventsToday}</span>
                <span className="text-[10px] text-green-600 font-semibold">Today</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1.5">
              <span className="text-slate-500 font-bold text-[10px] tracking-wider uppercase block">Success executions</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-green-700">{successfulRuns}</span>
                <span className="text-[10px] text-slate-400">100% SLA</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1.5">
              <span className="text-slate-500 font-bold text-[10px] tracking-wider uppercase block">Failed Runs</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-bold ${failedRuns > 0 ? "text-red-600" : "text-slate-400"}`}>
                  {failedRuns}
                </span>
                <span className="text-[10px] text-slate-400">Locked</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1.5">
              <span className="text-slate-500 font-bold text-[10px] tracking-wider uppercase block">Pending Queue</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-bold ${pendingJobs > 0 ? "text-blue-600 animate-pulse" : "text-slate-500"}`}>
                  {pendingJobs}
                </span>
                <span className="text-[10px] text-slate-400">Asynchronous</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1.5">
              <span className="text-slate-500 font-bold text-[10px] tracking-wider uppercase block">Average Latency</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">{avgDuration} <span className="text-xs">ms</span></span>
                <span className="text-[10px] text-green-600 font-medium">Fast</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1.5">
              <span className="text-slate-500 font-bold text-[10px] tracking-wider uppercase block">Error Auto-Retries</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-amber-600">{totalRetries}</span>
                <span className="text-[10px] text-slate-400">Resolved</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Simulation Launcher Panel */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-150">
                  <Play className="h-4 w-4 text-brand-secondary-600" />
                  Interactive Event Dispatcher
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Inject simulated platform events directly into the event bus to watch rules trigger conditions, construct queue payloads, and execute async pipelines.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Event Select */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Select Platform Event Type</label>
                  <select
                    value={simEvent}
                    onChange={(e) => setSimEvent(e.target.value as EventType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-medium focus:ring-1 focus:ring-slate-300 focus:outline-none"
                  >
                    <option value="Lead Created">Lead Created</option>
                    <option value="Lead Assigned">Lead Assigned</option>
                    <option value="Lead Converted">Lead Converted</option>
                    <option value="Order Created">Order Created</option>
                    <option value="Order Updated">Order Updated</option>
                    <option value="Payment Received">Payment Received</option>
                    <option value="Invoice Generated">Invoice Generated</option>
                    <option value="Task Assigned">Task Assigned</option>
                    <option value="Task Completed">Task Completed</option>
                    <option value="Workflow Completed">Workflow Completed</option>
                    <option value="Client Registered">Client Registered</option>
                    <option value="Support Ticket Created">Support Ticket Created</option>
                    <option value="Support Ticket Closed">Support Ticket Closed</option>
                  </select>
                </div>

                {/* Conditional Lead picker if relevant */}
                {simEvent.startsWith("Lead") && leads.length > 0 && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="font-semibold text-slate-600 block">Link to Existing Lead</label>
                    <select
                      value={simLeadId}
                      onChange={(e) => setSimLeadId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                    >
                      <option value="">-- No Specific Lead (Simulate Default) --</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          [{l.id}] {l.name} - {l.service}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Conditional Order picker if relevant */}
                {simEvent.startsWith("Order") && orders.length > 0 && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="font-semibold text-slate-600 block">Link to Existing Order</label>
                    <select
                      value={simOrderId}
                      onChange={(e) => setSimOrderId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:ring-1 focus:ring-slate-300 focus:outline-none"
                    >
                      <option value="">-- No Specific Order (Simulate Default) --</option>
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          [{o.id}] {o.customer.name} - ₹{o.totalAmount.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Simulate Integration Proxy Failure toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-150 hover:bg-slate-100/70 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={simFailure}
                      onChange={(e) => setSimFailure(e.target.checked)}
                      className="rounded border-slate-300 text-brand-secondary-600 focus:ring-brand-secondary-500 h-4 w-4"
                    />
                    <div className="space-y-px">
                      <span className="font-semibold text-slate-700 block">Simulate Integration Failure</span>
                      <span className="text-[10px] text-slate-400 block">Toggles automatic retry & error-logging mechanics.</span>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleFireSimulatedEvent}
                  disabled={simProcessing}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold text-white shadow-md tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    simProcessing
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-brand-primary-950 hover:bg-slate-800"
                  }`}
                >
                  <Cpu className={`h-4 w-4 ${simProcessing ? "animate-spin" : ""}`} />
                  <span>{simProcessing ? "Executing Pipelines..." : "DISPATCH SIMULATED EVENT"}</span>
                </button>
              </div>
            </div>

            {/* Architecture Overview & Quick Explanation */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-150">
                  <Database className="h-4 w-4 text-brand-secondary-600" />
                  Engine Architecture Spec (DC-007E)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Sliders className="h-3.5 w-3.5 text-blue-600" />
                    Decoupled Rule Bus
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Decouples transactional CRM procedures (CRM modifications, checklist increments, status updates) from raw notifications. Broadcasts signals immediately.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <RefreshCw className="h-3.5 w-3.5 text-orange-600" />
                    Auto-Retry Core
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    When an action fails to reach external servers (like SMTP/WhatsApp proxy timeouts), the system enqueues with exponential index and flags it for audit retries.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-green-600" />
                    Execution Ledger
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Maintains an immutable database tracking Trigger Time, Execution Latency, Failure Stack, and Payload context. Crucial for SLA evaluation.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                    Administrative Lock
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Allows administrators to temporarily halt the asynchronous thread queue, override rules on the fly, edit criteria parameters, and push logs.
                  </p>
                </div>
              </div>

              <div className="bg-brand-secondary-50 p-3.5 rounded-xl border border-brand-secondary-200 text-[11px] text-brand-secondary-850 space-y-1">
                <span className="font-bold block uppercase tracking-wide flex items-center gap-1 text-xs text-brand-secondary-900">
                  <Sparkles className="h-3.5 w-3.5 animate-bounce text-brand-secondary-700" />
                  Live Coordination Demo
                </span>
                <p>
                  Triggering <span className="font-semibold">Lead Created</span> automates Lead Assignments, updates statuses, and structures follow-ups. Triggering <span className="font-semibold">Order Created</span> deploys new tasks directly into the compliance workspace! Try firing them and checking the respective panels.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Active Rules & Queue Overview lists in dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Rules */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Enabled Automation Rules</span>
                <button
                  onClick={() => setInnerTab("rules")}
                  className="text-[11px] text-brand-secondary-700 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {rules.slice(0, 3).map((rule) => (
                  <div key={rule.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block leading-tight">{rule.name}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Trigger: <span className="text-slate-500 font-medium">{rule.trigger}</span> | Priority: {rule.priority}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold text-[9px] rounded-full uppercase">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Queue */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Asynchronous Queue History</span>
                <button
                  onClick={() => setInnerTab("queue")}
                  className="text-[11px] text-brand-secondary-700 font-bold hover:underline"
                >
                  Manage Queue
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {queue.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No jobs currently enqueued.</p>
                ) : (
                  queue.slice(0, 3).map((job) => (
                    <div key={job.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 block leading-tight">{job.ruleName}</span>
                        <span className="text-[10px] text-slate-400 block">
                          Event: <span className="text-slate-500 font-medium">{job.event}</span> | Ref: {job.id}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 font-bold text-[9px] rounded-full uppercase ${
                          job.status === "Completed"
                            ? "bg-green-50 text-green-700"
                            : job.status === "Failed"
                            ? "bg-red-50 text-red-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. RULES TAB */}
      {innerTab === "rules" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Business Rules Catalog</h3>
              <p className="text-[11px] text-slate-400">Configure administrative rules, prioritize workloads, and toggle enabled triggers.</p>
            </div>

            <button
              onClick={() => setIsAddingRule(!isAddingRule)}
              className="px-3 py-1.5 bg-brand-primary-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow"
            >
              <Plus className="h-4 w-4" />
              <span>{isAddingRule ? "Cancel" : "Create Custom Rule"}</span>
            </button>
          </div>

          {/* Add custom rule form */}
          {isAddingRule && (
            <form onSubmit={handleCreateRule} className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-inner space-y-4 animate-fade-in text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Descriptive Rule Name</label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Set high priority on voluntary GST filings"
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Select Trigger Event</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value as EventType)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none"
                  >
                    <option value="Lead Created">Lead Created</option>
                    <option value="Lead Assigned">Lead Assigned</option>
                    <option value="Lead Converted">Lead Converted</option>
                    <option value="Order Created">Order Created</option>
                    <option value="Order Updated">Order Updated</option>
                    <option value="Payment Received">Payment Received</option>
                    <option value="Invoice Generated">Invoice Generated</option>
                    <option value="Task Assigned">Task Assigned</option>
                    <option value="Task Completed">Task Completed</option>
                    <option value="Workflow Completed">Workflow Completed</option>
                    <option value="Client Registered">Client Registered</option>
                    <option value="Support Ticket Created">Support Ticket Created</option>
                    <option value="Support Ticket Closed">Support Ticket Closed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Evaluation Conditions</label>
                  <input
                    type="text"
                    value={newRuleConditions}
                    onChange={(e) => setNewRuleConditions(e.target.value)}
                    placeholder="e.g. Priority equals High or Amount >= ₹10,000"
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Priority Level</label>
                  <select
                    value={newRulePriority}
                    onChange={(e) => setNewRulePriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-600 block">Actions Sequence (Comma Separated)</label>
                  <input
                    type="text"
                    value={newRuleActions}
                    onChange={(e) => setNewRuleActions(e.target.value)}
                    placeholder="Assign Executive, Generate Invoice, Dispatch Integration Notification"
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Actions are processed sequentially as discrete job tasks inside the dispatcher engine.</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow"
                >
                  Save Business Rule
                </button>
              </div>
            </form>
          )}

          {/* Rules List */}
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow transition-all text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rule.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-semibold">{rule.id}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      Trigger Event: <span className="font-semibold text-brand-secondary-700">{rule.trigger}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Executions</span>
                      <span className="font-bold text-slate-800">{rule.executionCount}</span>
                    </div>

                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="cursor-pointer transition-all p-1"
                    >
                      {rule.enabled ? (
                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200 font-bold text-[10px]">
                          <ToggleRight className="h-4 w-4" />
                          <span>ENABLED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 font-bold text-[10px]">
                          <ToggleLeft className="h-4 w-4" />
                          <span>DISABLED</span>
                        </div>
                      )}
                    </button>

                    {rule.id.startsWith("RULE-USR-") && (
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-1.5 hover:bg-red-50 border border-slate-150 rounded-lg hover:border-red-200 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conditions column */}
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <span className="font-bold text-[10px] text-slate-400 uppercase block tracking-wider">Evaluation Conditions</span>
                    <span className="font-medium text-slate-800">{rule.conditions}</span>
                  </div>

                  {/* Actions sequence */}
                  <div className="md:col-span-2 p-3 bg-slate-50 rounded-lg space-y-1.5">
                    <span className="font-bold text-[10px] text-slate-400 uppercase block tracking-wider">Consecutive Action Sequence</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {rule.actions.map((act, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          {idx > 0 && <ArrowRight className="h-3 w-3 text-slate-400" />}
                          <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 font-medium rounded-md shadow-sm">
                            {act.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* C. ASYNC QUEUE VIEW */}
      {innerTab === "queue" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Operational Thread Queue Ledger</h3>
              <p className="text-[11px] text-slate-400">View real-time event routing threads, execution logs, payload objects, and recovery status.</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Queue Status: </span>
              <span className={`font-bold uppercase ${isQueuePaused ? "text-amber-600" : "text-green-600"}`}>
                {isQueuePaused ? "Paused" : "Active Thread"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Thread / Job ID</th>
                    <th className="p-4">Event Trigger</th>
                    <th className="p-4">Target Rule</th>
                    <th className="p-4">Retries</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No active enqueued execution threads inside local context storage.
                      </td>
                    </tr>
                  ) : (
                    queue.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4 font-bold text-slate-900">{job.id}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-700">
                            {job.event}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-600" title={job.ruleName}>
                          {job.ruleName}
                        </td>
                        <td className="p-4 text-slate-500 font-bold">{job.retryCount} / 3</td>
                        <td className="p-4 text-slate-400">{job.createdTime.replace("T", " ").slice(0, 19)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 font-bold text-[10px] rounded-full uppercase tracking-wider border ${
                              job.status === "Completed"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : job.status === "Failed"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : job.status === "Running"
                                ? "bg-blue-50 border-blue-200 text-blue-700 animate-pulse"
                                : "bg-slate-50 border-slate-200 text-slate-500"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {job.status === "Failed" && (
                              <button
                                onClick={() => handleManualRetry(job.id)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 text-amber-700 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>Retry</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                alert(`Payload context object for ${job.id}:\n\n${JSON.stringify(job.payload, null, 2)}`);
                              }}
                              className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Eye className="h-3 w-3 text-slate-400" />
                              <span>Payload</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* D. EXECUTION HISTORY LOGS */}
      {innerTab === "logs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Immutable Execution Log Ledger</h3>
              <p className="text-[11px] text-slate-400">Direct trace reports compiled from automated triggers in real time. Errors preserved permanently.</p>
            </div>

            <div className="text-slate-400 text-xs">
              Showing {logs.length} trace records
            </div>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                No telemetry execution records captured yet. Use the dashboard to dispatch live test events.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={`p-4 rounded-xl border bg-white shadow-sm text-xs space-y-3 ${log.errors ? "border-red-200" : "border-slate-200/60"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      {log.errors ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-bold text-slate-800">{log.ruleName}</span>
                      <span className="text-[10px] text-slate-400">[{log.id}]</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                      <Clock className="h-3 w-3" />
                      <span>{log.executionTime.replace("T", " ").slice(0, 19)}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-150 rounded text-slate-600 font-bold">{log.durationMs}ms</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Trigger Broadcast</span>
                      <span className="font-semibold text-slate-700">{log.event}</span>
                    </div>

                    <div className="md:col-span-2 p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Execution Log Message</span>
                      <span className={`font-medium ${log.errors ? "text-red-700" : "text-slate-600"}`}>
                        {log.result}
                      </span>
                    </div>
                  </div>

                  {log.errors && (
                    <div className="p-3 bg-red-50/50 border border-red-150 rounded-lg text-[11px] text-red-700 font-semibold font-mono whitespace-pre-wrap">
                      [INTEGRATION SERVICE EXCEPTION LOG]: {log.errors}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* E. SECURITY AUDIT TRAIL */}
      {innerTab === "audit" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Administrative Security Audit Ledger</h3>
              <p className="text-[11px] text-slate-400">Provides permanent compliance records for regulatory state transformations, rule updates, and manual triggers.</p>
            </div>

            <div className="text-slate-400 text-xs flex items-center gap-1">
              <Lock className="h-3 w-3 text-brand-secondary-600" />
              <span>Immutable Audit Trail</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Audit ID</th>
                    <th className="p-4">Operator</th>
                    <th className="p-4">Action Event</th>
                    <th className="p-4">Previous State</th>
                    <th className="p-4">New State</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {auditTrail.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/30 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-800">{record.id}</td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-700">{record.user}</span>
                      </td>
                      <td className="p-4 text-slate-900 font-bold">{record.action}</td>
                      <td className="p-4 text-slate-500 italic max-w-[150px] truncate" title={record.previousState}>
                        {record.previousState}
                      </td>
                      <td className="p-4 text-brand-secondary-800 font-semibold max-w-[180px] truncate" title={record.newState}>
                        {record.newState}
                      </td>
                      <td className="p-4 text-right text-slate-400">
                        {record.timestamp.replace("T", " ").slice(0, 19)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
