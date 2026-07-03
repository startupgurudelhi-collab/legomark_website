/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";

/**
 * Middleware to validate req.body against a Zod schema.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          errors,
        };
        res.status(HttpStatus.BAD_REQUEST).json(response);
        return;
      }
      next(error);
    }
  };
}
