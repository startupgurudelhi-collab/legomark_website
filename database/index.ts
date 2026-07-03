/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let dbInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ DATABASE_URL is not set in production. Database features will be unavailable.");
      return null;
    }
    console.info("ℹ️ DATABASE_URL is not set. Using local development database configuration.");
    dbUrl = "postgresql://postgres:postgres@localhost:5432/legomark_india";
  }

  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  } catch (error) {
    console.error("❌ Failed to initialize database client:", error);
    return null;
  }
}

/**
 * Verifies connection to the database.
 * Returns true if successful, false otherwise.
 */
export async function verifyConnection(): Promise<boolean> {
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ Skipping database connection verification (DATABASE_URL missing in production).");
      return false;
    }
    dbUrl = "postgresql://postgres:postgres@localhost:5432/legomark_india";
  }

  const activePool = pool || new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await activePool.connect();
    const result = await client.query("SELECT 1 as connected");
    client.release();
    const isConnected = result.rows[0]?.connected === 1;
    if (isConnected) {
      console.log("✅ Database connection verified successfully!");
    }
    return isConnected;
  } catch (err) {
    console.error("❌ Database connection verification failed:", err);
    return false;
  }
}
