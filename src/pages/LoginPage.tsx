/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Shield, KeyRound, Mail, ArrowLeft, ArrowRight, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.js";
import { useToast } from "../contexts/ToastContext.js";
import { PublicLayout } from "../layouts/PublicLayout.js";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { useBrandMedia } from "../hooks/useBrandMedia.js";

export default function LoginPage() {
  const { config: brandConfig } = useBrandMedia();
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Secure Portal Sign-In | Legomark India";
  }, []);

  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [mode, setMode] = useState<"login" | "forgot" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password & OTP simulation
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields", "Validation Failed");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login({ email, password });
      if (success) {
        // Read stored user from localStorage to determine correct role redirect
        const storedUser = localStorage.getItem("efilingg_user");
        let redirectPath = "/dashboard";
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (userObj.role === "ADMIN") {
            redirectPath = "/admin";
          }
        }
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      toast.error("An unexpected login error occurred.", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      toast.error("Please enter a valid email address.", "Invalid Email");
      return;
    }

    setIsSubmitting(true);
    // Simulate sending OTP on backend
    setTimeout(() => {
      setIsSubmitting(false);
      setMode("otp");
      toast.success(
        `A secure 6-digit OTP has been sent to ${resetEmail} (Architecture only).`,
        "OTP Sent Successfully"
      );
    }, 1000);
  };

  const handleOtpResetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.", "Verification Failed");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.", "Weak Password");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.", "Mismatch");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMode("login");
      setEmail(resetEmail);
      toast.success("Your password has been reset. Please log in with your new credentials.", "Success!");
    }, 1200);
  };

  return (
    <PublicLayout id="login-layout">
      <div className="flex-1 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary-500/5 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-primary-500/5 rounded-full blur-3xl z-0" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1 shadow-xl border border-slate-200">
            <img
              key={brandConfig.logo.url}
              src={brandConfig.logo.url || "/logo.png"}
              alt="Legomark India Logo"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = "true";
                  target.src = "/logo.png";
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              Legomark India Secure Gateway
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              Access your personal Client Workspace or verify Enterprise administrative credentials.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white py-8 px-4 sm:px-10 shadow-lg sm:rounded-2xl border border-slate-200/60">
            {mode === "login" && (
              <div className="flex border border-slate-200 p-1 rounded-lg bg-slate-50/55 mb-6" id="login-role-selector">
                <button
                  type="button"
                  onClick={() => {
                    setUserType("client");
                    setEmail("client@example.com");
                    setPassword("client123");
                  }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-md cursor-pointer transition-all ${
                    userType === "client"
                      ? "bg-white text-brand-primary-950 shadow-xs border border-slate-200/40"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Client Workspace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserType("admin");
                    setEmail("admin@legomark.com");
                    setPassword("admin123");
                  }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-md cursor-pointer transition-all ${
                    userType === "admin"
                      ? "bg-white text-brand-primary-950 shadow-xs border border-slate-200/40"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Admin Gateway
                </button>
              </div>
            )}

            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5" id="form-login">
                <div>
                  <Input
                    label={userType === "client" ? "Customer Registered Email *" : "Enterprise Email *"}
                    type="email"
                    placeholder={userType === "client" ? "e.g. client@example.com" : "e.g. admin@legomark.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="login-email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans" htmlFor="login-password">
                      Security Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs font-semibold text-brand-secondary-600 hover:text-brand-secondary-700 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      id="login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Info Tip */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3.5">
                  <KeyRound className="h-4.5 w-4.5 text-brand-secondary-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    {userType === "client" ? (
                      <p>
                        <strong>Demo Client Mode:</strong> Try logging in with <code className="bg-slate-150 px-1 py-0.5 text-slate-800 rounded font-mono font-medium">client@example.com</code> or <code className="bg-slate-150 px-1 py-0.5 text-slate-800 rounded font-mono font-medium">sunita@deshmukhfoods.co</code> and password <code className="bg-slate-150 px-1 py-0.5 text-slate-800 rounded font-mono font-medium">client123</code>.
                      </p>
                    ) : (
                      <p>
                        <strong>Demo Admin Mode:</strong> Try logging in with <code className="bg-slate-150 px-1 py-0.5 text-slate-800 rounded font-mono font-medium">admin@legomark.com</code> and password <code className="bg-slate-150 px-1 py-0.5 text-slate-800 rounded font-mono font-medium">admin123</code>.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Verifying authority...</span>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-5" id="form-forgot">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">Reset Security Credentials</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enter your registered enterprise email below. A secure 6-digit Reset OTP will be dispatched immediately.
                  </p>
                </div>

                <div>
                  <Input
                    label="Registered Email *"
                    type="email"
                    placeholder="e.g. admin@legomark.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    id="forgot-email"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Sign In
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
                  >
                    {isSubmitting ? "Generating OTP..." : "Send Verification OTP"}
                  </button>
                </div>
              </form>
            )}

            {mode === "otp" && (
              <form onSubmit={handleOtpResetSubmit} className="space-y-4" id="form-otp">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-brand-secondary-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="text-base font-bold text-slate-900">OTP Code Received</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    A temporary security token was sent to <strong className="text-slate-700">{resetEmail}</strong>. Provide it below alongside your new password.
                  </p>
                </div>

                <div>
                  <Input
                    label="Enter 6-Digit OTP *"
                    placeholder="e.g. 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    id="otp-code"
                  />
                </div>

                <div>
                  <Input
                    label="New Security Password *"
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    id="otp-new-password"
                  />
                </div>

                <div>
                  <Input
                    label="Confirm New Password *"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    id="otp-confirm-password"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Resend Code
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-brand-primary-950 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
                  >
                    {isSubmitting ? "Updating..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
