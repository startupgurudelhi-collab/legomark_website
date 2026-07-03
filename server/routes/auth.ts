/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { 
  register, 
  login, 
  refresh, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  resendVerification, 
  getSessions, 
  logoutDevice, 
  logoutAllDevices, 
  getSecurityStats 
} from "../controllers/authController.js";
import { validateBody } from "../middleware/validators.js";
import { registerSchema, loginSchema } from "../../shared/validation.js";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

router.get("/sessions", requireAuth, getSessions);
router.post("/sessions/logout", requireAuth, logoutDevice);
router.post("/sessions/logout-all", requireAuth, logoutAllDevices);

router.get("/admin/security-stats", requireAuth, requireRoles(["ADMIN"]), getSecurityStats);

export default router;

