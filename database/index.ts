/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "path";
import * as schema from "./schema.js";

let pool: mysql.Pool | null = null;
let dbInstance: any = null;

// Helper to parse connection config
export function getConnectionConfig() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && (dbUrl.startsWith("mysql://") || dbUrl.startsWith("mysqls://"))) {
    return dbUrl;
  }

  // Fallback to individual variables or localhost default
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "legomark_india";

  return {
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 10,
    waitForConnections: true,
  };
}

export function getDb() {
  if (dbInstance) return dbInstance;

  try {
    const config = getConnectionConfig();
    pool = typeof config === "string" ? mysql.createPool(config) : mysql.createPool(config);
    dbInstance = drizzle(pool, { schema, mode: "default" });
    
    // Call verifyConnection and log EXACT mysql2 error if it fails
    verifyConnection().catch((err) => {
      console.error("❌ Pre-initialization verifyConnection failure:", err);
    });

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
  const config = getConnectionConfig();
  const activePool = pool || (typeof config === "string" ? mysql.createPool(config) : mysql.createPool(config));

  try {
    const connection = await activePool.getConnection();
    const [rows]: any = await connection.query("SELECT 1 as connected");
    connection.release();
    const isConnected = rows && rows[0] && (rows[0].connected === 1 || rows[0].connected === "1");
    if (isConnected) {
      console.log("✅ MySQL Database connection verified successfully!");
    }
    return !!isConnected;
  } catch (err) {
    console.error("❌ MySQL Database connection verification failed:", err);
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
    console.log("🔄 Starting database schema migration (Drizzle MySQL)...");
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
