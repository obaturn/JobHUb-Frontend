/**
 * Real Authentication API Client
 * Communicates with backend at /api/v1/auth/*
 */

import { httpPost, httpGet } from './httpClient';
import { User } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType?: 'job_seeker' | 'employer' | 'admin';
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return httpPost<LoginResponse>('/api/v1/auth/login', credentials);
}

/**
 * Register new user
 */
export async function signup(userData: SignupRequest): Promise<SignupResponse> {
  return httpPost<SignupResponse>('/api/v1/auth/register', userData);
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  return httpGet<User>('/api/v1/auth/me');
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await httpPost('/api/v1/auth/logout', {});
}

/**
 * Refresh access token (called by httpClient interceptor)
 */
export async function refreshToken(
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  return httpPost<RefreshTokenResponse>('/api/v1/auth/refresh-token', {
    refreshToken: refreshTokenValue,
  });
}
