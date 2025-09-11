// Authentication types
export interface LoginCredentials {
  email: string;
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