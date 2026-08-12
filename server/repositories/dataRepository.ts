/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDb, getConnectionConfig, verifyConnection } from "../../database/index.js";
import * as schema from "../../database/schema.js";
import { eq, and, desc } from "drizzle-orm";
import * as store from "./fallbackStore.js";
import fs from "fs";
import path from "path";

// Helper to determine if DB URL is active or if we should use fallback
export const isDbActive = (): boolean => {
  try {
    const db = getDb();
    if (!db) return false;
    return !!(
      process.env.DATABASE_URL ||
      process.env.DB_HOST ||
      process.env.DB_USER ||
      process.env.DB_NAME ||
      process.env.DB_PASSWORD
    );
  } catch {
    return false;
  }
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
        // Log details as requested in TASK 2
        const config = getConnectionConfig();
        const dbName = typeof config === "string" ? "URL-configured" : config.database;
        const dbUser = typeof config === "string" ? "URL-configured" : config.user;
        const dbHost = typeof config === "string" ? "URL-configured" : config.host;
        console.log(`🔍 [UserRepository.findByEmail] Connected database name: ${dbName}`);
        console.log(`🔍 [UserRepository.findByEmail] Current DB user: ${dbUser}`);
        console.log(`🔍 [UserRepository.findByEmail] Current DB host: ${dbHost}`);

        // Verify login query and run SELECT * FROM users WHERE email = ?
        try {
          const results = await db.select().from(schema.users).where(eq(schema.users.email, cleanEmail)).limit(1);
          if (results && results.length > 0) {
            return results[0];
          }
        } catch (sqlError: any) {
          console.error(`❌ SQL query execution failed (SELECT * FROM users WHERE email = '${cleanEmail}'):`, sqlError?.message || sqlError);
          throw sqlError;
        }
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
    return (store.leadsDb as any[]).filter((l) => !l.isDeleted);
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
  },

  async delete(id: string) {
    const timestamp = new Date();
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.leads).set({ isDeleted: true, updatedAt: timestamp }).where(eq(schema.leads.id, id));
        return true;
      }
    }
    const index = (store.leadsDb as any[]).findIndex((l) => l.id === id);
    if (index !== -1) {
      store.leadsDb[index] = {
        ...store.leadsDb[index],
        isDeleted: true,
        deletedAt: timestamp.toISOString()
      } as any;
      return true;
    }
    return false;
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

// Helper to load CMS data from JSON file on initialization
function loadCmsPersistence() {
  try {
    if (fs.existsSync(CMS_PERSIST_FILE)) {
      const fileContent = fs.readFileSync(CMS_PERSIST_FILE, "utf8");
      if (fileContent.trim()) {
        const data = JSON.parse(fileContent);
        if (data.homepageCmsDb) {
          for (const key in store.homepageCmsDb) {
            delete (store.homepageCmsDb as any)[key];
          }
          Object.assign(store.homepageCmsDb, data.homepageCmsDb);
        }
        if (data.contactInfoDb) {
          for (const key in store.contactInfoDb) {
            delete (store.contactInfoDb as any)[key];
          }
          Object.assign(store.contactInfoDb, data.contactInfoDb);
        }
        if (data.adminSettingsDb) {
          for (const key in store.adminSettingsDb) {
            delete (store.adminSettingsDb as any)[key];
          }
          Object.assign(store.adminSettingsDb, data.adminSettingsDb);
        }
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
        if (data.packagesDb) {
          store.packagesDb.length = 0;
          store.packagesDb.push(...data.packagesDb);
        }
      }
    }
  } catch (err) {
    console.error("Failed to read CMS persistence file:", err);
  }
}

// Helper to merge and save only a specific CMS section
function mergeCmsSectionAndSave(sectionKey: string, sectionData: any) {
  try {
    // Take an immutable copy of the incoming sectionData to prevent modification during loadCmsPersistence
    const snapshot = JSON.parse(JSON.stringify(sectionData));

    // 1. Ensure in-memory store has the latest persistent data
    loadCmsPersistence();

    // 2. Update the specific section in-memory
    if (sectionKey === "homepageCmsDb") {
      for (const key in store.homepageCmsDb) {
        delete (store.homepageCmsDb as any)[key];
      }
      Object.assign(store.homepageCmsDb, snapshot);
    } else if (sectionKey === "contactInfoDb") {
      for (const key in store.contactInfoDb) {
        delete (store.contactInfoDb as any)[key];
      }
      Object.assign(store.contactInfoDb, snapshot);
    } else if (sectionKey === "adminSettingsDb") {
      Object.assign(store.adminSettingsDb, snapshot);
    } else if (sectionKey === "mediaDb") {
      store.mediaDb.length = 0;
      store.mediaDb.push(...snapshot);
    } else if (sectionKey === "testimonialsDb") {
      store.testimonialsDb.length = 0;
      store.testimonialsDb.push(...snapshot);
    } else if (sectionKey === "logosDb") {
      store.logosDb.length = 0;
      store.logosDb.push(...snapshot);
    } else if (sectionKey === "faqsDb") {
      store.faqsDb.length = 0;
      store.faqsDb.push(...snapshot);
    } else if (sectionKey === "packagesDb") {
      store.packagesDb.length = 0;
      store.packagesDb.push(...snapshot);
    }

    // 3. Prepare the full data payload to write to disk
    const dataToSave = {
      homepageCmsDb: store.homepageCmsDb,
      contactInfoDb: store.contactInfoDb,
      adminSettingsDb: store.adminSettingsDb,
      mediaDb: store.mediaDb,
      testimonialsDb: store.testimonialsDb,
      logosDb: store.logosDb,
      faqsDb: store.faqsDb,
      packagesDb: store.packagesDb
    };

    // 4. Ensure directory exists and write atomically synchronously
    const dir = path.dirname(CMS_PERSIST_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CMS_PERSIST_FILE, JSON.stringify(dataToSave, null, 2), "utf8");

  } catch (err) {
    console.error(`Failed to merge and save CMS section ${sectionKey}:`, err);
  }
}

// Automatically load on initialization of this repository module
loadCmsPersistence();

function mapHomepageFromDb(row: any) {
  if (!row) return null;
  return {
    heroTitle: row.title || "",
    heroSub: row.subtitle || "",
    heroBadge: row.badge || "",
    ...(typeof row.content === "string" ? JSON.parse(row.content) : row.content || {})
  };
}

function mapHomepageToDb(updates: any) {
  const { heroTitle, heroSub, heroBadge, ...rest } = updates;
  return {
    title: heroTitle || null,
    subtitle: heroSub || null,
    badge: heroBadge || null,
    content: rest,
    updatedAt: new Date()
  };
}

async function getSettingFromDb(key: string, defaultValue: any) {
  const db = getDb();
  if (db) {
    const results = await db.select().from(schema.cmsSettings).where(eq(schema.cmsSettings.key, key)).limit(1);
    if (results[0]) {
      const val = results[0].value;
      return typeof val === "string" ? JSON.parse(val) : val;
    }
  }
  return defaultValue;
}

async function updateSettingInDb(key: string, value: any) {
  const db = getDb();
  if (db) {
    const existing = await db.select().from(schema.cmsSettings).where(eq(schema.cmsSettings.key, key)).limit(1);
    if (existing[0]) {
      await db.update(schema.cmsSettings).set({ value, updatedAt: new Date() }).where(eq(schema.cmsSettings.key, key));
    } else {
      await db.insert(schema.cmsSettings).values({
        id: `setting-${Math.floor(100 + Math.random() * 900)}`,
        key,
        value,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
}

export const CmsConfigRepository = {
  async getHomepage() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.homepageSections).where(eq(schema.homepageSections.sectionKey, "homepage")).limit(1);
        if (results[0]) {
          return mapHomepageFromDb(results[0]);
        }
      }
    }
    loadCmsPersistence();
    return store.homepageCmsDb;
  },
  async updateHomepage(updates: any) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const dbUpdates = mapHomepageToDb(updates);
        const existing = await db.select().from(schema.homepageSections).where(eq(schema.homepageSections.sectionKey, "homepage")).limit(1);
        if (existing[0]) {
          await db.update(schema.homepageSections).set(dbUpdates).where(eq(schema.homepageSections.sectionKey, "homepage"));
        } else {
          await db.insert(schema.homepageSections).values({
            id: `hp-${Math.floor(100 + Math.random() * 900)}`,
            sectionKey: "homepage",
            ...dbUpdates,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        return updates;
      }
    }
    mergeCmsSectionAndSave("homepageCmsDb", updates);
    return store.homepageCmsDb;
  },
  async getContact() {
    if (isDbActive()) {
      const val = await getSettingFromDb("contactInfoDb", null);
      if (val) return val;
    }
    loadCmsPersistence();
    return store.contactInfoDb;
  },
  async updateContact(updates: any) {
    if (isDbActive()) {
      await updateSettingInDb("contactInfoDb", updates);
      return updates;
    }
    mergeCmsSectionAndSave("contactInfoDb", updates);
    return store.contactInfoDb;
  },
  async getSettings() {
    if (isDbActive()) {
      const val = await getSettingFromDb("adminSettingsDb", null);
      if (val) return val;
    }
    loadCmsPersistence();
    return store.adminSettingsDb;
  },
  async updateSettings(updates: any) {
    if (isDbActive()) {
      await updateSettingInDb("adminSettingsDb", updates);
      return updates;
    }
    mergeCmsSectionAndSave("adminSettingsDb", updates);
    return store.adminSettingsDb;
  },
  async getMedia() {
    if (isDbActive()) {
      const val = await getSettingFromDb("mediaDb", null);
      if (val) return val;
    }
    loadCmsPersistence();
    return store.mediaDb;
  },
  async addMedia(file: any) {
    if (isDbActive()) {
      const current = await getSettingFromDb("mediaDb", []) || [];
      const updatedMedia = [...current, file];
      await updateSettingInDb("mediaDb", updatedMedia);
      return file;
    }
    loadCmsPersistence();
    const updatedMedia = [...store.mediaDb, file];
    mergeCmsSectionAndSave("mediaDb", updatedMedia);
    return file;
  },
  async getTestimonials() {
    if (isDbActive()) {
      const val = await getSettingFromDb("testimonialsDb", null);
      if (val) return val;
    }
    loadCmsPersistence();
    return store.testimonialsDb;
  },
  async updateTestimonials(list: any[]) {
    if (isDbActive()) {
      await updateSettingInDb("testimonialsDb", list);
      return list;
    }
    mergeCmsSectionAndSave("testimonialsDb", list);
    return store.testimonialsDb;
  },
  async getLogos() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        const results = await db.select().from(schema.clientLogos).orderBy(schema.clientLogos.sortOrder);
        if (results.length > 0) {
          return results.map((row: any) => ({
            id: row.id,
            clientName: row.clientName,
            imageUrl: row.imageUrl,
            sortOrder: row.sortOrder,
            status: row.status
          }));
        }
      }
    }
    loadCmsPersistence();
    return store.logosDb;
  },
  async updateLogos(list: any[]) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.delete(schema.clientLogos);
        for (const item of list) {
          await db.insert(schema.clientLogos).values({
            id: item.id || `logo-custom-${Math.floor(100 + Math.random() * 900)}`,
            clientName: item.clientName || "Client Logo",
            imageUrl: item.imageUrl || "",
            sortOrder: item.sortOrder || 0,
            status: item.status || "Active",
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        return list;
      }
    }
    mergeCmsSectionAndSave("logosDb", list);
    return store.logosDb;
  },
  async getFaqs() {
    if (isDbActive()) {
      const val = await getSettingFromDb("faqsDb", null);
      if (val) return val;
    }
    loadCmsPersistence();
    return store.faqsDb;
  },
  async updateFaqs(list: any[]) {
    if (isDbActive()) {
      await updateSettingInDb("faqsDb", list);
      return list;
    }
    mergeCmsSectionAndSave("faqsDb", list);
    return store.faqsDb;
  }
};

// ==========================================
// CLIENT LOGOS REPOSITORY
// ==========================================
export const ClientLogosRepository = {
  async list() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.clientLogos).orderBy(schema.clientLogos.sortOrder);
      }
    }
    loadCmsPersistence();
    return store.logosDb;
  },

  async create(logo: any) {
    const id = logo.id || `logo-custom-${Math.floor(100 + Math.random() * 900)}`;
    const newLogo = {
      id,
      clientName: logo.clientName || "Client Logo",
      imageUrl: logo.imageUrl || "",
      sortOrder: logo.sortOrder || 0,
      status: logo.status || "Active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.clientLogos).values(newLogo);
        return newLogo;
      }
    }

    store.logosDb.push({
      id: newLogo.id,
      clientName: newLogo.clientName,
      imageUrl: newLogo.imageUrl,
      sortOrder: newLogo.sortOrder,
      status: newLogo.status
    });
    mergeCmsSectionAndSave("logosDb", store.logosDb);
    return newLogo;
  },

  async update(id: string, updates: any) {
    const dbUpdates = {
      ...updates,
      updatedAt: new Date()
    };

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.clientLogos).set(dbUpdates).where(eq(schema.clientLogos.id, id));
        const results = await db.select().from(schema.clientLogos).where(eq(schema.clientLogos.id, id)).limit(1);
        return results[0] || null;
      }
    }

    const index = store.logosDb.findIndex((l) => l.id === id);
    if (index !== -1) {
      store.logosDb[index] = { ...store.logosDb[index], ...updates };
      mergeCmsSectionAndSave("logosDb", store.logosDb);
      return store.logosDb[index];
    }
    return null;
  },

  async delete(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.delete(schema.clientLogos).where(eq(schema.clientLogos.id, id));
        return true;
      }
    }

    const index = store.logosDb.findIndex((l) => l.id === id);
    if (index !== -1) {
      store.logosDb.splice(index, 1);
      mergeCmsSectionAndSave("logosDb", store.logosDb);
      return true;
    }
    return false;
  }
};

// ==========================================
// HOMEPAGE SECTIONS REPOSITORY
// ==========================================
export const HomepageSectionsRepository = {
  async list() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.homepageSections);
      }
    }
    loadCmsPersistence();
    return [{
      id: "homepage",
      sectionKey: "homepage",
      title: store.homepageCmsDb.heroTitle,
      subtitle: store.homepageCmsDb.heroSub,
      badge: store.homepageCmsDb.heroBadge,
      content: store.homepageCmsDb
    }];
  },

  async create(section: any) {
    const id = section.id || `section-${Math.floor(100 + Math.random() * 900)}`;
    const newSection = {
      id,
      sectionKey: section.sectionKey || "custom-section",
      title: section.title || null,
      subtitle: section.subtitle || null,
      badge: section.badge || null,
      content: section.content || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.homepageSections).values(newSection);
        return newSection;
      }
    }

    if (newSection.sectionKey === "homepage") {
      const merged = {
        ...store.homepageCmsDb,
        heroTitle: newSection.title || store.homepageCmsDb.heroTitle,
        heroSub: newSection.subtitle || store.homepageCmsDb.heroSub,
        heroBadge: newSection.badge || store.homepageCmsDb.heroBadge,
        ...(newSection.content || {})
      };
      for (const k in store.homepageCmsDb) {
        delete (store.homepageCmsDb as any)[k];
      }
      Object.assign(store.homepageCmsDb, merged);
      mergeCmsSectionAndSave("homepageCmsDb", store.homepageCmsDb);
    }
    return newSection;
  },

  async update(id: string, updates: any) {
    const dbUpdates = {
      ...updates,
      updatedAt: new Date()
    };

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.homepageSections).set(dbUpdates).where(eq(schema.homepageSections.id, id));
        const results = await db.select().from(schema.homepageSections).where(eq(schema.homepageSections.id, id)).limit(1);
        return results[0] || null;
      }
    }

    if (id === "homepage" || updates.sectionKey === "homepage") {
      const merged = {
        ...store.homepageCmsDb,
        heroTitle: updates.title !== undefined ? updates.title : store.homepageCmsDb.heroTitle,
        heroSub: updates.subtitle !== undefined ? updates.subtitle : store.homepageCmsDb.heroSub,
        heroBadge: updates.badge !== undefined ? updates.badge : store.homepageCmsDb.heroBadge,
        ...(updates.content || {})
      };
      for (const k in store.homepageCmsDb) {
        delete (store.homepageCmsDb as any)[k];
      }
      Object.assign(store.homepageCmsDb, merged);
      mergeCmsSectionAndSave("homepageCmsDb", store.homepageCmsDb);
      return { id, ...updates };
    }
    return null;
  },

  async delete(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.delete(schema.homepageSections).where(eq(schema.homepageSections.id, id));
        return true;
      }
    }
    return true;
  }
};

// ==========================================
// CMS SETTINGS REPOSITORY
// ==========================================
export const CmsSettingsRepository = {
  async list() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.cmsSettings);
      }
    }
    loadCmsPersistence();
    return [
      { id: "contact", key: "contactInfoDb", value: store.contactInfoDb },
      { id: "settings", key: "adminSettingsDb", value: store.adminSettingsDb },
      { id: "testimonials", key: "testimonialsDb", value: store.testimonialsDb },
      { id: "faqs", key: "faqsDb", value: store.faqsDb },
      { id: "media", key: "mediaDb", value: store.mediaDb }
    ];
  },

  async create(setting: any) {
    const id = setting.id || `setting-${Math.floor(100 + Math.random() * 900)}`;
    const newSetting = {
      id,
      key: setting.key,
      value: setting.value,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.cmsSettings).values(newSetting);
        return newSetting;
      }
    }

    if (newSetting.key === "contactInfoDb") {
      for (const k in store.contactInfoDb) { delete (store.contactInfoDb as any)[k]; }
      Object.assign(store.contactInfoDb, newSetting.value);
      mergeCmsSectionAndSave("contactInfoDb", store.contactInfoDb);
    } else if (newSetting.key === "adminSettingsDb") {
      for (const k in store.adminSettingsDb) { delete (store.adminSettingsDb as any)[k]; }
      Object.assign(store.adminSettingsDb, newSetting.value);
      mergeCmsSectionAndSave("adminSettingsDb", store.adminSettingsDb);
    } else if (newSetting.key === "testimonialsDb") {
      store.testimonialsDb.length = 0;
      store.testimonialsDb.push(...(Array.isArray(newSetting.value) ? newSetting.value : []));
      mergeCmsSectionAndSave("testimonialsDb", store.testimonialsDb);
    } else if (newSetting.key === "faqsDb") {
      store.faqsDb.length = 0;
      store.faqsDb.push(...(Array.isArray(newSetting.value) ? newSetting.value : []));
      mergeCmsSectionAndSave("faqsDb", store.faqsDb);
    } else if (newSetting.key === "mediaDb") {
      store.mediaDb.length = 0;
      store.mediaDb.push(...(Array.isArray(newSetting.value) ? newSetting.value : []));
      mergeCmsSectionAndSave("mediaDb", store.mediaDb);
    }
    return newSetting;
  },

  async update(id: string, updates: any) {
    const dbUpdates = {
      ...updates,
      updatedAt: new Date()
    };

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.cmsSettings).set(dbUpdates).where(eq(schema.cmsSettings.id, id));
        const results = await db.select().from(schema.cmsSettings).where(eq(schema.cmsSettings.id, id)).limit(1);
        return results[0] || null;
      }
    }

    if (updates.key) {
      if (updates.key === "contactInfoDb") {
        Object.assign(store.contactInfoDb, updates.value || {});
        mergeCmsSectionAndSave("contactInfoDb", store.contactInfoDb);
      } else if (updates.key === "adminSettingsDb") {
        Object.assign(store.adminSettingsDb, updates.value || {});
        mergeCmsSectionAndSave("adminSettingsDb", store.adminSettingsDb);
      }
      return { id, ...updates };
    }
    return null;
  },

  async delete(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.delete(schema.cmsSettings).where(eq(schema.cmsSettings.id, id));
        return true;
      }
    }
    return true;
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

// ==========================================
// PACKAGE REPOSITORY
// ==========================================
export const PackageRepository = {
  async getAll() {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        return db.select().from(schema.packages).where(eq(schema.packages.isDeleted, false));
      }
    }
    loadCmsPersistence();
    return store.packagesDb.filter((p) => !p.isDeleted);
  },

  async create(pkg: any) {
    const cleanPkg = { ...pkg };
    if (cleanPkg.createdAt) {
      if (typeof cleanPkg.createdAt === "string") {
        const parsed = new Date(cleanPkg.createdAt);
        if (!isNaN(parsed.getTime())) {
          cleanPkg.createdAt = parsed;
        }
      }
    } else {
      cleanPkg.createdAt = new Date();
    }

    if (cleanPkg.updatedAt) {
      if (typeof cleanPkg.updatedAt === "string") {
        const parsed = new Date(cleanPkg.updatedAt);
        if (!isNaN(parsed.getTime())) {
          cleanPkg.updatedAt = parsed;
        }
      }
    } else {
      cleanPkg.updatedAt = new Date();
    }

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.insert(schema.packages).values(cleanPkg);
        return pkg;
      }
    }

    store.packagesDb.push(cleanPkg);
    mergeCmsSectionAndSave("packagesDb", store.packagesDb);
    return cleanPkg;
  },

  async update(id: string, updates: any) {
    const cleanUpdates = { ...updates };
    if (cleanUpdates.createdAt) {
      if (typeof cleanUpdates.createdAt === "string") {
        const parsed = new Date(cleanUpdates.createdAt);
        if (!isNaN(parsed.getTime())) {
          cleanUpdates.createdAt = parsed;
        }
      }
    }
    if (cleanUpdates.updatedAt) {
      if (typeof cleanUpdates.updatedAt === "string") {
        const parsed = new Date(cleanUpdates.updatedAt);
        if (!isNaN(parsed.getTime())) {
          cleanUpdates.updatedAt = parsed;
        }
      }
    }

    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.packages).set(cleanUpdates).where(eq(schema.packages.id, id));
        return { id, ...updates };
      }
    }

    const index = store.packagesDb.findIndex((p) => p.id === id);
    if (index !== -1) {
      store.packagesDb[index] = { ...store.packagesDb[index], ...cleanUpdates };
      mergeCmsSectionAndSave("packagesDb", store.packagesDb);
      return store.packagesDb[index];
    }
    return null;
  },

  async delete(id: string) {
    if (isDbActive()) {
      const db = getDb();
      if (db) {
        await db.update(schema.packages).set({ isDeleted: true }).where(eq(schema.packages.id, id));
        return true;
      }
    }

    const index = store.packagesDb.findIndex((p) => p.id === id);
    if (index !== -1) {
      store.packagesDb[index].isDeleted = true;
      mergeCmsSectionAndSave("packagesDb", store.packagesDb);
      return true;
    }
    return false;
  }
};



