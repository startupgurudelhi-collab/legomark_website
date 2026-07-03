/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to require authentication.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response: ApiResponse = {
      success: false,
      message: "Authorization token required",
    };
    res.status(HttpStatus.UNAUTHORIZED).json(response);
    return;
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    const response: ApiResponse = {
      success: false,
      message: "Invalid or expired token",
    };
    res.status(HttpStatus.UNAUTHORIZED).json(response);
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware to restrict access to specific roles.
 */
export function requireRoles(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: "Authentication required",
      };
      res.status(HttpStatus.UNAUTHORIZED).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        message: "Forbidden: You do not have permission to perform this action",
      };
      res.status(HttpStatus.FORBIDDEN).json(response);
      return;
    }

    next();
  };
}
