export interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: number;
}

export type AuthMode = 'login' | 'register';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
  };
}
