/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole, ServiceCategory, LeadStatus } from "./enums.js";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDefinition {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price?: number;
  features: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceRequested: ServiceCategory;
  status: LeadStatus;
  message?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
