/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, LoginInput, RegisterInput } from "../types/index.js";
import { useToast } from "./ToastContext.js";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<boolean>;
  register: (data: RegisterInput) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  // Load user session from localStorage on app boot
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("efilingg_token");
      const storedUser = localStorage.getItem("efilingg_user");
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to restore auth session:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginInput): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        // Non-JSON response (e.g. 502/504 gateway error)
        console.error("Non-JSON response received from /api/auth/login:", response.status, response.statusText);
      }

      if (result && result.success && result.data) {
        const { token: authToken, user: authUser } = result.data;
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem("efilingg_token", authToken);
        localStorage.setItem("efilingg_user", JSON.stringify(authUser));
        toast.success("Welcome back!", "Login Successful");
        return true;
      } else if (result && result.message) {
        toast.error(result.message, "Login Failed");
        return false;
      } else {
        toast.error(
          response.status === 401 
            ? "Invalid email or password." 
            : `Server returned status ${response.status} (${response.statusText || "Service unavailable"}).`, 
          "Login Failed"
        );
        return false;
      }
    } catch (err: any) {
      console.error("Login network exception:", err);
      toast.error(err?.message || "Could not connect to authentication server. Please verify network and server status.", "Connection Error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const registerUser = useCallback(async (data: RegisterInput): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        console.error("Non-JSON response received from /api/auth/register:", response.status, response.statusText);
      }

      if (result && result.success) {
        toast.success("Account created successfully. Please login.", "Registration Success");
        return true;
      } else if (result && result.message) {
        toast.error(result.message, "Registration Failed");
        return false;
      } else {
        toast.error(`Registration failed with status ${response.status}.`, "Registration Failed");
        return false;
      }
    } catch (err: any) {
      console.error("Register network exception:", err);
      toast.error(err?.message || "Could not connect to authentication server.", "Connection Error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("efilingg_token");
    localStorage.removeItem("efilingg_user");
    toast.info("You have logged out of your session.", "Logged Out");
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register: registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
