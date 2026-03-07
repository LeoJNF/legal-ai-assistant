export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  oab?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'LAWYER' | 'INTERN';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  oab?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
