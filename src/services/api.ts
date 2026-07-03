/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "../types/index.js";

const BASE_URL = "/api";

export const api = {
  getHeaders() {
    const token = localStorage.getItem("efilingg_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  },

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Network request failed",
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  },

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Network request failed",
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  },
};
