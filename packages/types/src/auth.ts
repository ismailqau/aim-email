/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

// Authentication types
export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  expiresIn: string;
}

export interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
