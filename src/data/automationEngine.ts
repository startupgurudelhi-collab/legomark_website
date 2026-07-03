/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized Automation Engine (Business Rules & Event Engine)
// DC-007E Core Specifications

export type EventType =
  | "Lead Created"
  | "Lead Assigned"
  | "Lead Converted"
  | "Order Created"
  | "Order Updated"
  | "Payment Received"
  | "Invoice Generated"
  | "Task Assigned"
  | "Task Completed"
  | "Workflow Completed"
  | "Client Registered"
  | "Support Ticket Created"
  | "Support Ticket Closed";

export interface AutomationAction {
  type: string;
  targetService?: string;
  params: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: EventType;
  conditions: string; // e.g., "Any" or custom description "priority is High"
  actions: AutomationAction[];
  priority: "Low" | "Medium" | "High" | "Critical";
  enabled: boolean;
  executionCount: number;
}

export interface QueueJob {
  id: string;
  event: EventType;
  ruleName: string;
  status: "Pending" | "Running" | "Completed" | "Failed";
  retryCount: number;
  createdTime: string;
  executedTime?: string;
  failureReason?: string;
  payload: any;
}

export interface ExecutionLog {
  id: string;
  event: EventType;
  ruleName: string;
  triggerTime: string;
  executionTime: string;
  result: string;
  durationMs: number;
  errors?: string;
}

export interface AuditTrailRecord {
  id: string;
  user: string;
  timestamp: string;
  action: string;
  previousState: string;
  newState: string;
}

// Initial default automation business rules
export const initialRules: AutomationRule[] = [
  {
    id: "RULE-001",
    name: "Auto-Assign Executive & Set Follow-Up on Lead Creation",
    trigger: "Lead Created",
    conditions: "Lead Priority is Medium or High",
    priority: "High",
    enabled: true,
    executionCount: 24,
    actions: [
      { type: "Assign Executive", params: { executive: "Rajesh Kumar" } },
      { type: "Create Lead Follow-Up", params: { type: "Introduction Call", offsetDays: 1 } },
      { type: "Dispatch Integration Notification", params: { provider: "WhatsApp API", template: "lead_welcome_alert" } }
    ]
  },
  {
    id: "RULE-002",
    name: "Auto-Initialize Compliance Workflow & Task Generation",
    trigger: "Order Created",
    conditions: "Order Amount >= ₹5,000",
    priority: "Critical",
    enabled: true,
    executionCount: 18,
    actions: [
      { type: "Create Service Workflow", params: { matchServiceTemplate: true } },
      { type: "Generate Step-by-Step Compliance Tasks", params: { autoAssignToExecutive: true } },
      { type: "Dispatch Integration Notification", params: { provider: "SMTP Email Server", template: "order_confirmation_mail" } }
    ]
  },
  {
    id: "RULE-003",
    name: "Generate Tax Invoice & Unlock Client Portal on Payment",
    trigger: "Payment Received",
    conditions: "Payment Status is Success",
    priority: "Critical",
    enabled: true,
    executionCount: 15,
    actions: [
      { type: "Generate Compliant Tax Invoice", params: { placeOfSupply: "Local State" } },
      { type: "Generate Payment Receipt", params: { recordLedgerCredit: true } },
      { type: "Unlock Client Portal Access", params: { credentialMailing: true } },
      { type: "Dispatch Integration Notification", params: { provider: "WhatsApp API & Email", template: "invoice_payment_secured" } }
    ]
  },
  {
    id: "RULE-004",
    name: "Auto-Archive Workflows & Dispatch Final Registration Certs",
    trigger: "Workflow Completed",
    conditions: "All Checklist items validated by Attorney",
    priority: "High",
    enabled: true,
    executionCount: 9,
    actions: [
      { type: "Mark Order ServiceStatus", params: { status: "Delivered" } },
      { type: "Compile Final Government Certificates", params: { format: "PDF Packaging" } },
      { type: "Archive Workflow History", params: { databaseStorage: "Secure Cold Vault" } },
      { type: "Dispatch Integration Notification", params: { provider: "SMTP Email Server", template: "certificate_handover_mail" } }
    ]
  },
  {
    id: "RULE-005",
    name: "Escalate Support Ticket to Senior Attorney",
    trigger: "Support Ticket Created",
    conditions: "Ticket Category is Incorporation Dispute",
    priority: "Medium",
    enabled: true,
    executionCount: 4,
    actions: [
      { type: "Assign Executive", params: { executive: "Sanjana Sen (Senior Counsel)" } },
      { type: "Dispatch Integration Notification", params: { provider: "Internal Slack Hook", alert: "dispute_escalation" } }
    ]
  }
];

// Initial mock queue jobs (Execution Queue History)
export const initialQueueJobs: QueueJob[] = [
  {
    id: "JOB-2026-001",
    event: "Payment Received",
    ruleName: "Generate Tax Invoice & Unlock Client Portal on Payment",
    status: "Completed",
    retryCount: 0,
    createdTime: "2026-06-28T08:10:00Z",
    executedTime: "2026-06-28T08:10:02Z",
    payload: { paymentId: "PAY-2026-002", amount: 6490 }
  },
  {
    id: "JOB-2026-002",
    event: "Lead Created",
    ruleName: "Auto-Assign Executive & Set Follow-Up on Lead Creation",
    status: "Completed",
    retryCount: 0,
    createdTime: "2026-06-28T08:15:00Z",
    executedTime: "2026-06-28T08:15:01Z",
    payload: { leadId: "lead-001", name: "Aman Malhotra" }
  },
  {
    id: "JOB-2026-003",
    event: "Support Ticket Created",
    ruleName: "Escalate Support Ticket to Senior Attorney",
    status: "Failed",
    retryCount: 3,
    createdTime: "2026-06-28T08:20:00Z",
    executedTime: "2026-06-28T08:23:15Z",
    failureReason: "Integration Layer Timeout: SMTP dispatch failure (Authentication Rejected)",
    payload: { ticketId: "TCK-402", title: "MCA Portal DSC Signature Mismatch" }
  }
];

// Initial execution logs
export const initialExecutionLogs: ExecutionLog[] = [
  {
    id: "LOG-001",
    event: "Payment Received",
    ruleName: "Generate Tax Invoice & Unlock Client Portal on Payment",
    triggerTime: "2026-06-28T08:10:00Z",
    executionTime: "2026-06-28T08:10:02Z",
    result: "Success: Created Tax Invoice INV-2026-002. Dispatched payment success alert to WhatsApp API integration payload successfully.",
    durationMs: 145
  },
  {
    id: "LOG-002",
    event: "Lead Created",
    ruleName: "Auto-Assign Executive & Set Follow-Up on Lead Creation",
    triggerTime: "2026-06-28T08:15:00Z",
    executionTime: "2026-06-28T08:15:01Z",
    result: "Success: Assigned executive Rajesh Kumar. Generated a follow-up log for 'Introduction Call' due 2026-06-29.",
    durationMs: 98
  },
  {
    id: "LOG-003",
    event: "Support Ticket Created",
    ruleName: "Escalate Support Ticket to Senior Attorney",
    triggerTime: "2026-06-28T08:20:00Z",
    executionTime: "2026-06-28T08:23:15Z",
    result: "Failed: Execution retry threshold exceeded. Integration SMTP failed after 3 attempts.",
    durationMs: 420,
    errors: "SMTP pipeline error: socket hang up at sendgrid connection point"
  }
];

// Initial audit trail records
export const initialAuditTrail: AuditTrailRecord[] = [
  {
    id: "AUD-001",
    user: "System Daemon",
    timestamp: "2026-06-28T08:10:02Z",
    action: "Trigger Rule Execution",
    previousState: "Pending Job Queue",
    newState: "Dispatched to Integration Layer & Completed"
  },
  {
    id: "AUD-002",
    user: "System Daemon",
    timestamp: "2026-06-28T08:15:01Z",
    action: "Evaluate Conditions",
    previousState: "Lead Priority Evaluated",
    newState: "Passed. Executed 3 Actions successfully."
  },
  {
    id: "AUD-003",
    user: "Admin (foujianehal@gmail.com)",
    timestamp: "2026-06-28T08:25:00Z",
    action: "Enable Rule RULE-003",
    previousState: "Disabled",
    newState: "Enabled"
  }
];
