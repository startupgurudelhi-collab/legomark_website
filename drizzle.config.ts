/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "mysql://root:@localhost:3306/legomark_india",
  },
});
