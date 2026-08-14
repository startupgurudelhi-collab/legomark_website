/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import path from "path";
import * as schema from "./schema.js";
import { seedDatabaseIfEmpty } from "./seed.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let dbInstance: any = null;

// Helper to parse connection config
export function getConnectionConfig(): pg.PoolConfig {
  const dbUrl = process.env.DATABASE_URL;
  const isSsl = process.env.DB_SSL === "true" ||
    process.env.PGSSLMODE === "require" ||
    (typeof dbUrl === "string" && (dbUrl.includes("sslmode=require") || dbUrl.includes("ssl=true")));

  if (dbUrl && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
    return {
      connectionString: dbUrl,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    };
  }

  // Fallback to individual variables or localhost default
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "legomark_india";

  return {
    host,
    port,
    user,
    password,
    database,
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isSsl ? { rejectUnauthorized: false } : undefined,
  };
}

export function getDb() {
  if (dbInstance) return dbInstance;

  try {
    const config = getConnectionConfig();
    pool = pool || new Pool(config);
    dbInstance = drizzle(pool, { schema });
    
    // Call verifyConnection and log PostgreSQL error if it fails
    verifyConnection().catch((err) => {
      console.error("❌ Pre-initialization verifyConnection failure:", err);
    });

    return dbInstance;
  } catch (error) {
    console.error("❌ Failed to initialize PostgreSQL database client:", error);
    return null;
  }
}

/**
 * Verifies connection to the database.
 * Returns true if successful, false otherwise.
 */
export async function verifyConnection(): Promise<boolean> {
  const config = getConnectionConfig();
  const activePool = pool || new Pool(config);

  try {
    const client = await activePool.connect();
    const result = await client.query("SELECT 1 as connected");
    client.release();
    const isConnected = result && result.rows && result.rows[0] && (result.rows[0].connected === 1 || result.rows[0].connected === "1" || result.rows[0].connected === true);
    if (isConnected) {
      console.log("✅ PostgreSQL Database connection verified successfully!");
    }
    return !!isConnected;
  } catch (err) {
    console.error("❌ PostgreSQL Database connection verification failed:", err);
    throw err;
  }
}

/**
 * Runs pending database migrations.
 */
export async function runMigrations(): Promise<boolean> {
  const db = getDb();
  if (!db) {
    console.warn("⚠️ Database client is not initialized. Skipping schema migrations.");
    return false;
  }
  try {
    console.log("🔄 Starting database schema migration (Drizzle PostgreSQL)...");
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "database/migrations"),
    });
    console.log("✅ Database schema migrations applied successfully!");
    return true;
  } catch (err) {
    console.error("❌ Database schema migration failed with exact exception:", err);
    throw err;
  }
}

export { seedDatabaseIfEmpty };

