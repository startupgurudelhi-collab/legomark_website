/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "dotenv/config";
import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import apiRouter from "./server/routes/api.js";
import { errorHandler } from "./server/middleware/errorHandler.js";
import { logger } from "./server/utils/logger.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
  // We relax contentSecurityPolicy slightly to prevent issues with Vite's client bundle, assets, and iframe embedding
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

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`🚀 Legomark India foundation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
