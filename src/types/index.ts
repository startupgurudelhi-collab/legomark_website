/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from "../../shared/types.js";

export * from "../../shared/types.js";
export * from "../../shared/enums.js";
export * from "../../shared/validation.js";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;
}
