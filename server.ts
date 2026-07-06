/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import apiRouter from "./server/routes/api.js";
import { errorHandler } from "./server/middleware/errorHandler.js";
import { logger } from "./server/utils/logger.js";
import { runMigrations, verifyConnection } from "./database/index.js";

async function startServer() {
  console.log("\n=================================");
  console.log("STEP 1\nEnvironment Loaded");
  console.log("=================================\n");

  // Create Express App
  const app = express();
  console.log("=================================");
  console.log("STEP 2\nExpress Created");
  console.log("=================================\n");

  // CRITICAL: Express GET /health and GET /api/health registered IMMEDIATELY
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Basic parsing middlewares
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  // Serve uploaded files statically
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // Enable CORS
  app.use(
    cors({
      origin: process.env.CLIENT_URL || true, // Allow same-domain or configured URL
      credentials: true,
    })
  );

  // Configure Helmet security headers
  app.use(
    helmet({
      frameguard: false, // Disable X-Frame-Options SAMEORIGIN header to allow rendering in AI Studio preview iframe
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:*"],
          connectSrc: ["'self'", "ws:", "wss:"],
          frameAncestors: ["*"], // Allow embedding in Google AI Studio iframe preview
        },
      },
    })
  );

  // Rate Limiting for API routes
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true, // Return standard rate limit info headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
  });
  app.use("/api", limiter);

  // Mount API endpoints
  app.use("/api", apiRouter);

  // Vite Integration & Static Assets
  if (process.env.NODE_ENV !== "production") {
    logger.info("Initializing Vite in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    logger.info("Serving production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler (Must be registered last)
  app.use(errorHandler);

  console.log("=================================");
  console.log("STEP 3\nRoutes Registered");
  console.log("=================================\n");

  console.log("=================================");
  console.log("STEP 4\nHealth Endpoint Ready");
  console.log("=================================\n");

  // Print registered routes
  printRoutes(app);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Start HTTP Server immediately!
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("=================================");
    console.log("STEP 5\nHTTP Server Listening");
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log("=================================\n");

    // Begin background initializations AFTER server has successfully started listening
    initializeDatabase();
    initializeStorage();
    initializeOptionalServices();
  });

  // Graceful shutdown handler
  const handleShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Gracefully stopping HTTP server...`);
    server.close(() => {
      logger.info("HTTP server closed. Exiting process.");
      process.exit(0);
    });

    // Timeout-based fallback to guarantee exit
    setTimeout(() => {
      logger.error("Forced termination due to active connections remaining past timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

/**
 * Traverses Express routing tree to list all registered API endpoints
 */
function printRoutes(app: express.Express) {
  try {
    const routes: string[] = [];
    
    const printStack = (stack: any[], prefix = "") => {
      stack.forEach((layer: any) => {
        if (layer.route) {
          const path = layer.route.path;
          const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(",");
          routes.push(`${methods} ${prefix}${path}`);
        } else if (layer.name === "router" && layer.handle && layer.handle.stack) {
          let routerPath = "";
          if (layer.regexp) {
            const regexStr = layer.regexp.toString();
            if (regexStr.includes("auth")) routerPath = "/api/auth";
            else if (regexStr.includes("api")) routerPath = "/api";
          }
          printStack(layer.handle.stack, prefix + routerPath);
        }
      });
    };

    if (app._router && app._router.stack) {
      printStack(app._router.stack);
    }
    
    if (routes.length > 0) {
      console.log("=================================");
      console.log("REGISTERED EXPRESS ROUTES:");
      routes.forEach(r => console.log(`  ${r}`));
      console.log("=================================\n");
    }
  } catch (err) {
    logger.warn("Could not print registered routes:", err);
  }
}

/**
 * Initializes the MySQL connection and applies schema migrations in a non-blocking background task
 */
async function initializeDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  const dbHost = process.env.DB_HOST;

  if (!dbUrl && !dbHost) {
    logger.info("No database environment variables provided. Running with SQLite/Memory fallback logic.");
    console.log("=================================");
    console.log("STEP 6\nDatabase Connected (Using Memory Fallbacks)");
    console.log("=================================\n");
    return;
  }

  logger.info("Initiating background database connection and migrations...");
  let retries = 5;
  let connected = false;
  
  while (retries > 0 && !connected) {
    try {
      connected = await verifyConnection();
      if (connected) {
        const migrationsSuccess = await runMigrations();
        if (migrationsSuccess) {
          console.log("=================================");
          console.log("STEP 6\nDatabase Connected");
          console.log("=================================\n");
        } else {
          logger.warn("Database connected, but migrations failed. Server is remaining online.");
          console.log("=================================");
          console.log("STEP 6\nDatabase Connected (Migrations Failed)");
          console.log("=================================\n");
        }
        break;
      }
    } catch (err) {
      logger.error("Error during database initialization attempt:", err);
    }
    
    retries--;
    if (retries > 0) {
      logger.warn(`Database connection failed. Retrying in 5 seconds... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  if (!connected) {
    logger.error("❌ Could not connect to MySQL Database after initial retries. Server remains online. Re-trying in the background...");
    console.log("=================================");
    console.log("STEP 6\nDatabase Connection Postponed (will retry in background)");
    console.log("=================================\n");
    
    const intervalId = setInterval(async () => {
      try {
        const bgConnected = await verifyConnection();
        if (bgConnected) {
          logger.info("Background database connection established successfully! Running migrations...");
          await runMigrations();
          clearInterval(intervalId);
        }
      } catch (err) {
        logger.error("Background database connection retry failed:", err);
      }
    }, 15000);

    if (typeof intervalId.unref === "function") {
      intervalId.unref();
    }
  }
}

/**
 * Initializes physical folders and storages dynamically at startup
 */
function initializeStorage() {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    logger.info("Uploads storage folder initialized successfully.");
    console.log("=================================");
    console.log("STEP 7\nStorage Ready");
    console.log("=================================\n");
  } catch (err) {
    logger.error("Failed to initialize storage directories:", err);
    console.log("=================================");
    console.log("STEP 7\nStorage Initialization Failed (Non-blocking)");
    console.log("=================================\n");
  }
}

/**
 * Prints integration statuses of optional, third-party services
 */
function initializeOptionalServices() {
  const hasRazorpay = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  const hasSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
  const hasGoogle = !!process.env.GOOGLE_CLIENT_ID;
  const hasWhatsApp = !!process.env.WHATSAPP_API_KEY;
  const hasCalendly = !!process.env.CALENDLY_API_KEY;

  logger.info("Optional third-party services status:");
  logger.info(`  - Razorpay Gateway: ${hasRazorpay ? "CONFIGURED" : "FALLBACK SIMULATOR"}`);
  logger.info(`  - SMTP Email Pipeline: ${hasSmtp ? "CONFIGURED" : "FALLBACK DRY-RUN"}`);
  logger.info(`  - Google Integration: ${hasGoogle ? "CONFIGURED" : "DISABLED"}`);
  logger.info(`  - WhatsApp API Dispatcher: ${hasWhatsApp ? "CONFIGURED" : "DISABLED"}`);
  logger.info(`  - Calendly Integration: ${hasCalendly ? "CONFIGURED" : "DISABLED"}`);

  console.log("=================================");
  console.log("STEP 8\nOptional Services Ready");
  console.log("=================================\n");
}

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
