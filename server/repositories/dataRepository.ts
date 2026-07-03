/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDb } from "../../database/index.js";
import * as schema from "../../database/schema.js";
import { eq, and, desc } from "drizzle-orm";
import * as store from "./fallbackStore.js";
import fs from "fs";
import path from "path";

// Helper to determine if DB URL is active or if we should use fallback
const isDbActive = (): boolean => {
  return !!process.env.DATABASE_URL;
};

// ==========================================
// USER REPOSITORY
// ==========================================
export const UserRepository = {
  async findByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.users).where(eq(schema.users.email, cleanEmail)).limit(1);
        return results[0] || null;
      }
    }
    // Fallback
    const user = store.usersDb.find((u) => u.email.toLowerCase() === cleanEmail);
    return user || null;
  },

  async findById(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
        return results[0] || null;
      }
    }
    // Fallback
    const user = store.usersDb.find((u) => u.id === id);
    return user || null;
  },

  async create(user: { id: string; email: string; fullName: string; passwordHash: string; role: string }) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.users).values(user);
        return user;
      }
    }
    // Fallback
    const newUser = {
      ...user,
      role: user.role as "ADMIN" | "CLIENT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.usersDb.push(newUser);
    return newUser;
  }
};

// ==========================================
// LEAD REPOSITORY
// ==========================================
export const LeadRepository = {
  async getAll() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.leads).where(eq(schema.leads.isDeleted, false));
      }
    }
    return store.leadsDb;
  },

  async findById(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
        return results[0] || null;
      }
    }
    return store.leadsDb.find((l) => l.id === id) || null;
  },

  async create(lead: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.leads).values(lead);
        return lead;
      }
    }
    store.leadsDb.push(lead);
    return lead;
  },

  async update(id: string, updates: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.leads).set(updates).where(eq(schema.leads.id, id));
        return { id, ...updates };
      }
    }
    const index = store.leadsDb.findIndex((l) => l.id === id);
    if (index !== -1) {
      store.leadsDb[index] = { ...store.leadsDb[index], ...updates };
      return store.leadsDb[index];
    }
    return null;
  }
};

// ==========================================
// ORDER REPOSITORY
// ==========================================
export const OrderRepository = {
  async getAll() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.orders).where(eq(schema.orders.isDeleted, false));
      }
    }
    return store.ordersDb;
  },

  async findById(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
        return results[0] || null;
      }
    }
    return store.ordersDb.find((o) => o.id === id) || null;
  },

  async create(order: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.orders).values(order);
        return order;
      }
    }
    store.ordersDb.push(order);
    return order;
  },

  async update(id: string, updates: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.orders).set(updates).where(eq(schema.orders.id, id));
        return { id, ...updates };
      }
    }
    const index = store.ordersDb.findIndex((o) => o.id === id);
    if (index !== -1) {
      store.ordersDb[index] = { ...store.ordersDb[index], ...updates };
      return store.ordersDb[index];
    }
    return null;
  }
};

// ==========================================
// BLOG REPOSITORY
// ==========================================
export const BlogRepository = {
  async getAll() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.blogs).where(eq(schema.blogs.isDeleted, false));
      }
    }
    return store.blogsDb;
  },

  async create(blog: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.blogs).values(blog);
        return blog;
      }
    }
    store.blogsDb.push(blog);
    return blog;
  },

  async update(id: string, updates: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.blogs).set(updates).where(eq(schema.blogs.id, id));
        return { id, ...updates };
      }
    }
    const index = store.blogsDb.findIndex((b) => b.id === id);
    if (index !== -1) {
      store.blogsDb[index] = { ...store.blogsDb[index], ...updates };
      return store.blogsDb[index];
    }
    return null;
  },

  async delete(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.blogs).set({ isDeleted: true }).where(eq(schema.blogs.id, id));
        return true;
      }
    }
    const index = store.blogsDb.findIndex((b) => b.id === id);
    if (index !== -1) {
      store.blogsDb.splice(index, 1);
      return true;
    }
    return false;
  }
};

// ==========================================
// TASK REPOSITORY
// ==========================================
export const TaskRepository = {
  async getAll() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.tasks).where(eq(schema.tasks.isDeleted, false));
      }
    }
    return store.tasksDb;
  },

  async findById(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).limit(1);
        return results[0] || null;
      }
    }
    return store.tasksDb.find((t) => t.id === id) || null;
  },

  async create(task: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.tasks).values(task);
        return task;
      }
    }
    store.tasksDb.push(task);
    return task;
  },

  async update(id: string, updates: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.tasks).set(updates).where(eq(schema.tasks.id, id));
        return { id, ...updates };
      }
    }
    const index = store.tasksDb.findIndex((t) => t.id === id);
    if (index !== -1) {
      store.tasksDb[index] = { ...store.tasksDb[index], ...updates };
      return store.tasksDb[index];
    }
    return null;
  }
};

// ==========================================
// FINANCIAL REPOSITORY
// ==========================================
export const FinancialRepository = {
  async getQuotations() {
    return store.quotationsDb;
  },
  async getProformas() {
    return store.proformasDb;
  },
  async getInvoices() {
    return store.invoicesDb;
  },
  async getPayments() {
    return store.paymentsDb;
  },
  async getReceipts() {
    return store.receiptsDb;
  },
  async getRefunds() {
    return store.refundsDb;
  },
  async getCreditNotes() {
    return store.creditNotesDb;
  },
  async getLedger() {
    return store.ledgerDb;
  },

  async createQuotation(data: any) {
    store.quotationsDb.push(data);
    return data;
  },
  async createProforma(data: any) {
    store.proformasDb.push(data);
    return data;
  },
  async createInvoice(data: any) {
    store.invoicesDb.push(data);
    return data;
  },
  async createPayment(data: any) {
    store.paymentsDb.push(data);
    return data;
  },
  async createReceipt(data: any) {
    store.receiptsDb.push(data);
    return data;
  },
  async createRefund(data: any) {
    store.refundsDb.push(data);
    return data;
  },
  async createCreditNote(data: any) {
    store.creditNotesDb.push(data);
    return data;
  },
  async createLedgerEntry(data: any) {
    store.ledgerDb.push(data);
    return data;
  },

  async updateQuotationStatus(id: string, status: string) {
    const item = store.quotationsDb.find((q) => q.id === id);
    if (item) {
      item.status = status as any;
      return item;
    }
    return null;
  },
  async updateInvoiceStatus(id: string, status: string, method?: string) {
    const item = store.invoicesDb.find((inv) => inv.id === id);
    if (item) {
      item.paymentStatus = status as any;
      if (method) item.paymentMethod = method;
      return item;
    }
    return null;
  }
};

// ==========================================
// SUPPORT REPOSITORY
// ==========================================
export const SupportRepository = {
  async getTickets() {
    return store.ticketsDb;
  },
  async getTicketsByEmail(email: string) {
    return store.ticketsDb.filter((t) => t.clientEmail === email);
  },
  async createTicket(ticket: any) {
    store.ticketsDb.push(ticket);
    return ticket;
  },
  async updateTicket(id: string, updates: any) {
    const item = store.ticketsDb.find((t) => t.id === id);
    if (item) {
      Object.assign(item, updates);
      return item;
    }
    return null;
  }
};

// ==========================================
// NOTIFICATIONS REPOSITORY
// ==========================================
export const NotificationsRepository = {
  async getNotifications() {
    return store.notificationsDb;
  },
  async createNotification(notif: any) {
    store.notificationsDb.push(notif);
    return notif;
  },
  async markAsRead(id: string) {
    const item = store.notificationsDb.find((n) => n.id === id);
    if (item) {
      item.read = true;
      return true;
    }
    return false;
  }
};

// ==========================================
// CMS / CONFIG REPOSITORY
// ==========================================
const CMS_PERSIST_FILE = path.join(process.cwd(), "database", "cms_persistence.json");

// Helper to save current CMS data to JSON file
function saveCmsPersistence() {
  try {
    const dataToSave = {
      homepageCmsDb: store.homepageCmsDb,
      contactInfoDb: store.contactInfoDb,
      adminSettingsDb: store.adminSettingsDb,
      mediaDb: store.mediaDb,
      testimonialsDb: store.testimonialsDb,
      logosDb: store.logosDb,
      faqsDb: store.faqsDb
    };
    fs.writeFileSync(CMS_PERSIST_FILE, JSON.stringify(dataToSave, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write CMS persistence file:", err);
  }
}

// Helper to load CMS data from JSON file on initialization
function loadCmsPersistence() {
  try {
    if (fs.existsSync(CMS_PERSIST_FILE)) {
      const fileContent = fs.readFileSync(CMS_PERSIST_FILE, "utf8");
      if (fileContent.trim()) {
        const data = JSON.parse(fileContent);
        if (data.homepageCmsDb) Object.assign(store.homepageCmsDb, data.homepageCmsDb);
        if (data.contactInfoDb) Object.assign(store.contactInfoDb, data.contactInfoDb);
        if (data.adminSettingsDb) Object.assign(store.adminSettingsDb, data.adminSettingsDb);
        if (data.mediaDb) {
          store.mediaDb.length = 0;
          store.mediaDb.push(...data.mediaDb);
        }
        if (data.testimonialsDb) {
          store.testimonialsDb.length = 0;
          store.testimonialsDb.push(...data.testimonialsDb);
        }
        if (data.logosDb) {
          store.logosDb.length = 0;
          store.logosDb.push(...data.logosDb);
        }
        if (data.faqsDb) {
          store.faqsDb.length = 0;
          store.faqsDb.push(...data.faqsDb);
        }
      }
    }
  } catch (err) {
    console.error("Failed to read CMS persistence file:", err);
  }
}

// Automatically load on initialization of this repository module
loadCmsPersistence();

export const CmsConfigRepository = {
  async getHomepage() {
    return store.homepageCmsDb;
  },
  async updateHomepage(updates: any) {
    Object.assign(store.homepageCmsDb, updates);
    saveCmsPersistence();
    return store.homepageCmsDb;
  },
  async getContact() {
    return store.contactInfoDb;
  },
  async updateContact(updates: any) {
    Object.assign(store.contactInfoDb, updates);
    saveCmsPersistence();
    return store.contactInfoDb;
  },
  async getSettings() {
    return store.adminSettingsDb;
  },
  async updateSettings(updates: any) {
    Object.assign(store.adminSettingsDb, updates);
    saveCmsPersistence();
    return store.adminSettingsDb;
  },
  async getMedia() {
    return store.mediaDb;
  },
  async addMedia(file: any) {
    store.mediaDb.push(file);
    saveCmsPersistence();
    return file;
  },
  async getTestimonials() {
    return store.testimonialsDb;
  },
  async updateTestimonials(list: any[]) {
    store.testimonialsDb.length = 0;
    store.testimonialsDb.push(...list);
    saveCmsPersistence();
    return store.testimonialsDb;
  },
  async getLogos() {
    return store.logosDb;
  },
  async updateLogos(list: any[]) {
    store.logosDb.length = 0;
    store.logosDb.push(...list);
    saveCmsPersistence();
    return store.logosDb;
  },
  async getFaqs() {
    return store.faqsDb;
  },
  async updateFaqs(list: any[]) {
    store.faqsDb.length = 0;
    store.faqsDb.push(...list);
    saveCmsPersistence();
    return store.faqsDb;
  }
};

// ==========================================
// EMAIL REPOSITORY
// ==========================================
export const EmailRepository = {
  async getAll() {
    return store.emailsDb;
  },

  async create(emailItem: any) {
    const freshItem = {
      id: emailItem.id || `EML-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: emailItem.recipient,
      subject: emailItem.subject,
      templateName: emailItem.templateName,
      variables: emailItem.variables || {},
      status: emailItem.status || "Pending",
      attempts: emailItem.attempts || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: emailItem.attachments || [],
      error: emailItem.error || undefined,
      lastAttemptAt: emailItem.lastAttemptAt || undefined
    };
    store.emailsDb.push(freshItem);
    return freshItem;
  },

  async update(id: string, updates: Partial<store.EmailQueueItem>) {
    const item = store.emailsDb.find((e) => e.id === id);
    if (item) {
      Object.assign(item, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return item;
    }
    return null;
  }
};

// ==========================================
// SESSION REPOSITORY
// ==========================================
export const SessionRepository = {
  async createSession(session: store.SessionRecord) {
    store.sessionsDb.push(session);
    return session;
  },

  async findSessionById(id: string) {
    return store.sessionsDb.find((s) => s.id === id) || null;
  },

  async findSessionByRefreshToken(token: string) {
    return store.sessionsDb.find((s) => s.refreshToken === token && !s.isRevoked) || null;
  },

  async revokeSession(id: string) {
    const s = store.sessionsDb.find((sess) => sess.id === id);
    if (s) {
      s.isRevoked = true;
      return true;
    }
    return false;
  },

  async revokeAllSessionsForUser(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    store.sessionsDb.forEach((s) => {
      if (s.email.toLowerCase() === cleanEmail) {
        s.isRevoked = true;
      }
    });
    return true;
  },

  async getActiveSessionsForUser(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();
    return store.sessionsDb.filter(
      (s) => s.email.toLowerCase() === cleanEmail && !s.isRevoked && s.expiresAt > now
    );
  },

  async getAllActiveSessions() {
    const now = new Date().toISOString();
    return store.sessionsDb.filter((s) => !s.isRevoked && s.expiresAt > now);
  }
};

// ==========================================
// SECURITY REPOSITORY
// ==========================================
export const SecurityRepository = {
  async logAudit(email: string, event: string, ipAddress: string, userAgent: string) {
    const log: store.AuditLogRecord = {
      id: `aud-${Math.random().toString(36).substring(2, 8)}`,
      email: email.toLowerCase().trim(),
      event,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent
    };
    store.auditLogsDb.push(log);
    return log;
  },

  async getAuditLogs() {
    return store.auditLogsDb;
  },

  async getFailedAttempts(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const record = store.failedLoginsDb.find((f) => f.email === cleanEmail);
    if (!record) {
      return { count: 0, lockUntil: undefined };
    }
    return {
      count: record.count,
      lockUntil: record.lockUntil
    };
  },

  async incrementFailedAttempts(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    let record = store.failedLoginsDb.find((f) => f.email === cleanEmail);
    if (!record) {
      record = { email: cleanEmail, count: 0 };
      store.failedLoginsDb.push(record);
    }
    record.count += 1;
    if (record.count >= 5) {
      // Temporary account lock for 15 minutes
      const lockDuration = 15 * 60 * 1000;
      record.lockUntil = new Date(Date.now() + lockDuration).toISOString();
    }
    return record;
  },

  async resetFailedAttempts(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const record = store.failedLoginsDb.find((f) => f.email === cleanEmail);
    if (record) {
      record.count = 0;
      record.lockUntil = undefined;
    }
    return true;
  },

  async createPasswordReset(email: string, token: string, expiresAt: string) {
    const record: store.PasswordResetRecord = {
      id: `pr-${Math.random().toString(36).substring(2, 8)}`,
      email: email.toLowerCase().trim(),
      token,
      expiresAt,
      isUsed: false
    };
    store.passwordResetsDb.push(record);
    return record;
  },

  async findPasswordReset(token: string) {
    return store.passwordResetsDb.find((pr) => pr.token === token && !pr.isUsed) || null;
  },

  async markPasswordResetUsed(token: string) {
    const pr = store.passwordResetsDb.find((r) => r.token === token);
    if (pr) {
      pr.isUsed = true;
      return true;
    }
    return false;
  },

  async createEmailVerification(email: string, token: string, expiresAt: string) {
    const record: store.EmailVerificationRecord = {
      id: `ev-${Math.random().toString(36).substring(2, 8)}`,
      email: email.toLowerCase().trim(),
      token,
      expiresAt,
      isUsed: false
    };
    store.emailVerificationsDb.push(record);
    return record;
  },

  async findEmailVerification(token: string) {
    return store.emailVerificationsDb.find((ev) => ev.token === token && !ev.isUsed) || null;
  },

  async markEmailVerificationUsed(token: string) {
    const ev = store.emailVerificationsDb.find((v) => v.token === token);
    if (ev) {
      ev.isUsed = true;
      store.userVerificationStatusDb[ev.email.toLowerCase()] = true;
      return true;
    }
    return false;
  },

  async getUserVerificationStatus(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (store.userVerificationStatusDb[cleanEmail] === undefined) {
      // By default true for pre-existing records, false for new registrations until verified
      return false;
    }
    return store.userVerificationStatusDb[cleanEmail];
  },

  async setUserVerificationStatus(email: string, verified: boolean) {
    const cleanEmail = email.toLowerCase().trim();
    store.userVerificationStatusDb[cleanEmail] = verified;
    return true;
  }
};


