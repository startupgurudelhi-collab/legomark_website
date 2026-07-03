/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "An unexpected error occurred on the server.";

  logger.error(`Error on path ${req.path}: ${message}`, err);

  const response: ApiResponse = {
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : message,
    errors: err.errors || undefined,
  };

  res.status(status).json(response);
}
