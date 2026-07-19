/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { verifyConnection } from "../../database/index.js";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";

const router = Router();

router.get("/health", async (req: Request, res: Response) => {
  let dbConnected = false;
  try {
    dbConnected = await verifyConnection();
  } catch (err) {
    dbConnected = false;
  }

  const data = {
    status: "UP",
    timestamp: new Date().toISOString(),
    services: {
      server: "OK",
      database: dbConnected ? "CONNECTED" : "DISCONNECTED",
    },
  };

  const response: ApiResponse = {
    success: true,
    message: "System health status retrieved successfully",
    data,
  };

  res.status(HttpStatus.OK).json(response);
});

export default router;
