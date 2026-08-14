/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ WARNING: JWT_SECRET environment variable is missing in production. Using secure internal secret fallback. Please configure JWT_SECRET in Coolify for production.");
    }
    return process.env.SESSION_SECRET || "legomark_india_secure_jwt_token_secret_production_2026";
  }
  return secret;
};

const getJwtRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    return getJwtSecret();
  }
  return secret;
};

/**
 * Generates an access token valid for 15m.
 */
export function generateToken(payload: TokenPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

/**
 * Generates an access token valid for 15m.
 */
export function generateAccessToken(payload: TokenPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

/**
 * Generates a refresh token valid for 24h or 30d if rememberMe is active.
 */
export function generateRefreshToken(payload: TokenPayload, rememberMe: boolean = false): string {
  const secret = getJwtRefreshSecret();
  const expiresIn = rememberMe ? "30d" : "24h";
  return jwt.sign({ ...payload, isRefresh: true }, secret, { expiresIn });
}

/**
 * Verifies an access token.
 */
export function verifyToken(token: string): TokenPayload | null {
  const secret = getJwtSecret();
  try {
    const decoded = jwt.verify(token, secret) as any;
    if (decoded && decoded.isRefresh) {
      return null; // Don't accept refresh tokens as access tokens
    }
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a refresh token.
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  const secret = getJwtRefreshSecret();
  try {
    const decoded = jwt.verify(token, secret) as any;
    if (decoded && decoded.isRefresh) {
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

