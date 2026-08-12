/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../shared/enums.js";
import { ApiResponse } from "../../shared/types.js";
import { UserRepository, SessionRepository, SecurityRepository, isDbActive } from "../repositories/dataRepository.js";
import { verifyConnection } from "../../database/index.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { logger } from "../utils/logger.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { EmailService } from "../services/emailService.js";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Handle user registration.
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, fullName, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await UserRepository.findByEmail(cleanEmail);
    if (existing) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "A user with this email address already exists.",
      });
      return;
    }

    // Securely hash password
    const hashed = await hashPassword(password);
    
    // Generate new unique user ID
    const role = "CLIENT";
    const userId = `usr-${role.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
    
    const user = await UserRepository.create({
      id: userId,
      email: cleanEmail,
      fullName,
      passwordHash: hashed,
      role
    });

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;

    // Log security audit
    await SecurityRepository.logAudit(cleanEmail, "REGISTER_SUCCESS", ipAddress, userAgent);

    // Generate Verification Token
    const verificationCode = `LM-${Math.floor(10000 + Math.random() * 90000)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    await SecurityRepository.createEmailVerification(cleanEmail, verificationCode, expiresAt);

    // Dispatch welcome & verification emails via existing EmailService
    try {
      await EmailService.sendTemplate(cleanEmail, "Welcome Email", {
        fullName,
        clientEmail: cleanEmail,
        dashboardUrl: `${req.protocol}://${req.get("host")}/client-portal`
      });

      await EmailService.sendTemplate(cleanEmail, "Email Verification", {
        fullName,
        verificationCode,
        verifyUrl: `${req.protocol}://${req.get("host")}/verify-email?token=${verificationCode}`
      });
    } catch (err) {
      logger.error("[AuthService] Email dispatch failed upon registration:", err);
    }

    const response: ApiResponse = {
      success: true,
      message: "User registration completed successfully. Please check your email to verify your account.",
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
    };
    res.status(HttpStatus.CREATED).json(response);
  } catch (error) {
    logger.error("Error in registration controller:", error);
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error instanceof Error ? error.message : "User registration failed.",
    });
  }
}

/**
 * Handle user login.
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
  const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;

  try {
    const { email, password, rememberMe } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const user = await UserRepository.findByEmail(cleanEmail);
    if (!user) {
      // Avoid enum leak by using general error, but increment failed attempts
      await SecurityRepository.incrementFailedAttempts(cleanEmail);
      await SecurityRepository.logAudit(cleanEmail, "LOGIN_FAILED_USER_NOT_FOUND", ipAddress, userAgent);
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }

    // Since our fallback uses a placeholder hash for pre-existing safe users, we allow simple matches
    const hash = user.passwordHash || "";
    let isValid = false;
    if (hash.includes("placeholder_hash")) {
      isValid = (password === "admin123" || password === "client123");
    } else if (hash) {
      isValid = await comparePassword(password, hash);
    }

    if (!isValid) {
      await SecurityRepository.incrementFailedAttempts(cleanEmail);
      await SecurityRepository.logAudit(cleanEmail, "LOGIN_FAILED_WRONG_PASSWORD", ipAddress, userAgent);
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }

    // Successful Login: Reset failed attempts
    await SecurityRepository.resetFailedAttempts(cleanEmail);

    // Check email verification status
    const isVerified = await SecurityRepository.getUserVerificationStatus(cleanEmail);

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload, !!rememberMe);

    // Expire settings
    const refreshLifetime = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 24 hours
    const expiresAt = new Date(Date.now() + refreshLifetime).toISOString();

    // Register active session in DB
    const sessionId = `sess-${Math.random().toString(36).substring(2, 10)}`;
    await SessionRepository.createSession({
      id: sessionId,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      userAgent,
      ipAddress,
      lastLogin: new Date().toISOString(),
      expiresAt,
      refreshToken,
      isRevoked: false
    });

    // Log security audit
    await SecurityRepository.logAudit(cleanEmail, "LOGIN_SUCCESS", ipAddress, userAgent);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Authentication successful",
      data: {
        token: accessToken,
        refreshToken,
        isVerified,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error: any) {
    logger.error("Error in login controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error instanceof Error ? error.message : "An internal server error occurred during authentication.",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Handle Token Refresh Rotation.
 */
export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Refresh token is required."
    });
    return;
  }

  try {
    // 1. Verify Refresh Token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired refresh token."
      });
      return;
    }

    // 2. Lookup session matching token and verify rotation/revocation
    const session = await SessionRepository.findSessionByRefreshToken(refreshToken);
    if (!session || session.isRevoked || new Date(session.expiresAt) < new Date()) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Session is expired or has been revoked."
      });
      return;
    }

    // 3. Perform Token Rotation: Generate new access & refresh tokens
    const tokenPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload, true); // Keep alive on rotation

    // Update the session with new rotated token
    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Keep rotated token alive
    session.lastLogin = new Date().toISOString();

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    logger.error("Error in refresh controller:", error);
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Token verification failed."
    });
  }
}

/**
 * Request Password Reset.
 */
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email address is required."
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await UserRepository.findByEmail(cleanEmail);

    // Standard Response to prevent user enumeration
    const standardResponse = {
      success: true,
      message: "If your email exists in our system, a password reset link has been dispatched to it."
    };

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;

    if (user) {
      // Create resetting token
      const token = `RST-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

      await SecurityRepository.createPasswordReset(cleanEmail, token, expiresAt);
      await SecurityRepository.logAudit(cleanEmail, "PWD_RESET_REQUESTED", ipAddress, userAgent);

      const resetUrl = `${req.protocol}://${req.get("host")}/reset-password?token=${token}`;
      
      // Dispatch reset email
      try {
        await EmailService.sendTemplate(cleanEmail, "Password Reset", {
          fullName: user.fullName,
          resetUrl
        });
      } catch (err) {
        logger.error("[forgotPassword] Failed to dispatch password reset email:", err);
      }
    }

    res.status(HttpStatus.OK).json(standardResponse);
  } catch (error) {
    logger.error("Error in forgotPassword controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to process forgot password request."
    });
  }
}

/**
 * Handle Password Reset Endpoint.
 */
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Security token and new password are required."
      });
      return;
    }

    const pr = await SecurityRepository.findPasswordReset(token);
    if (!pr || new Date(pr.expiresAt) < new Date()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired password reset token."
      });
      return;
    }

    const user = await UserRepository.findByEmail(pr.email);
    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Associated user profile was not found."
      });
      return;
    }

    // Update password
    const hashed = await hashPassword(password);
    user.passwordHash = hashed;
    user.updatedAt = new Date().toISOString();

    await SecurityRepository.markPasswordResetUsed(token);

    // Revoke all sessions to enforce re-authentication
    await SessionRepository.revokeAllSessionsForUser(pr.email);

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;
    await SecurityRepository.logAudit(pr.email, "PWD_RESET_SUCCESS", ipAddress, userAgent);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Your password has been reset successfully. Please log in with your new credentials."
    });
  } catch (error) {
    logger.error("Error in resetPassword controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An internal server error occurred while resetting password."
    });
  }
}

/**
 * Handle Email Verification.
 */
export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Verification token is required."
      });
      return;
    }

    const ev = await SecurityRepository.findEmailVerification(token);
    if (!ev || new Date(ev.expiresAt) < new Date()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired verification token."
      });
      return;
    }

    await SecurityRepository.markEmailVerificationUsed(token);

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;
    await SecurityRepository.logAudit(ev.email, "EMAIL_VERIFICATION_SUCCESS", ipAddress, userAgent);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Congratulations! Your email address has been verified and active filing is unlocked."
    });
  } catch (error) {
    logger.error("Error in verifyEmail controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to verify email."
    });
  }
}

/**
 * Resend Email Verification Token.
 */
export async function resendVerification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email address is required."
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await UserRepository.findByEmail(cleanEmail);
    if (!user) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "If the email is registered, a new verification link has been sent."
      });
      return;
    }

    const verificationCode = `LM-${Math.floor(10000 + Math.random() * 90000)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await SecurityRepository.createEmailVerification(cleanEmail, verificationCode, expiresAt);

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;
    await SecurityRepository.logAudit(cleanEmail, "EMAIL_VERIFICATION_RESENT", ipAddress, userAgent);

    try {
      await EmailService.sendTemplate(cleanEmail, "Email Verification", {
        fullName: user.fullName,
        verificationCode,
        verifyUrl: `${req.protocol}://${req.get("host")}/verify-email?token=${verificationCode}`
      });
    } catch (err) {
      logger.error("Resend verification email dispatch error:", err);
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: "A new verification code has been dispatched successfully."
    });
  } catch (error) {
    logger.error("Error in resendVerification controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An internal server error occurred while resending verification."
    });
  }
}

/**
 * Retrieve Active Sessions.
 */
export async function getSessions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  try {
    const sessions = await SessionRepository.getActiveSessionsForUser(req.user.email);
    res.status(HttpStatus.OK).json({
      success: true,
      data: sessions.map((s) => ({
        id: s.id,
        userAgent: s.userAgent,
        ipAddress: s.ipAddress,
        lastLogin: s.lastLogin,
        expiresAt: s.expiresAt
      }))
    });
  } catch (error) {
    logger.error("Error fetching sessions:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve active sessions."
    });
  }
}

/**
 * Revoke specific session (Logout Device).
 */
export async function logoutDevice(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Session ID is required."
      });
      return;
    }

    const session = await SessionRepository.findSessionById(sessionId);
    if (!session || session.email.toLowerCase() !== req.user.email.toLowerCase()) {
      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "You cannot terminate this session."
      });
      return;
    }

    await SessionRepository.revokeSession(sessionId);

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;
    await SecurityRepository.logAudit(req.user.email, `SESSION_REVOKED_${sessionId}`, ipAddress, userAgent);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Session terminated successfully."
    });
  } catch (error) {
    logger.error("Error terminating session:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to terminate session."
    });
  }
}

/**
 * Revoke all sessions for user (Logout All Devices).
 */
export async function logoutAllDevices(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  try {
    await SessionRepository.revokeAllSessionsForUser(req.user.email);

    const ipAddress = (req.ip || req.headers["x-forwarded-for"] || "127.0.0.1") as string;
    const userAgent = (req.headers["user-agent"] || "Unknown Device") as string;
    await SecurityRepository.logAudit(req.user.email, "ALL_SESSIONS_REVOKED", ipAddress, userAgent);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "All device sessions revoked successfully."
    });
  } catch (error) {
    logger.error("Error in logoutAllDevices controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An internal server error occurred while revoking all sessions."
    });
  }
}

/**
 * Retrieve admin security and monitoring stats.
 */
export async function getSecurityStats(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const activeSessions = await SessionRepository.getAllActiveSessions();
    const audits = await SecurityRepository.getAuditLogs();

    // Map failed attempt counts and locked account statuses
    const failedLogins = audits.filter(a => a.event.includes("LOGIN_FAILED"));
    const lockedAccounts = audits.filter(a => a.event === "LOGIN_BLOCKED_LOCKEDOUT");
    const pwdResets = audits.filter(a => a.event === "PWD_RESET_REQUESTED");

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        activeSessionCount: activeSessions.length,
        failedLoginCount: failedLogins.length,
        lockedAccountCount: lockedAccounts.length,
        pwdResetCount: pwdResets.length,
        activeSessions: activeSessions.map(s => ({
          id: s.id,
          email: s.email,
          fullName: s.fullName,
          ipAddress: s.ipAddress,
          userAgent: s.userAgent,
          lastLogin: s.lastLogin
        })),
        recentAudits: audits.slice(-15).reverse() // Last 15 audits
      }
    });
  } catch (error) {
    logger.error("Error in getSecurityStats controller:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve security stats."
    });
  }
}

