import { apiClient } from './client';
import type {
  ApiResponse,
  AuthPayload,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth.types';

export async function register(credentials: RegisterCredentials) {
  const { data } = await apiClient.post<
    ApiResponse<{ user: User; verificationUrl?: string; previewUrl?: string }>
  >('/auth/register', credentials);
  return data;
}

export async function login(credentials: LoginCredentials) {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', credentials);
  return data;
}

export async function verifyEmail(token: string) {
  const { data } = await apiClient.get<ApiResponse<AuthPayload>>(`/auth/verify-email/${token}`);
  return data;
}

export async function resendVerification(email: string) {
  const { data } = await apiClient.post<ApiResponse>('/auth/resend-verification', { email });
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token: string, password: string) {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>(
    `/auth/reset-password/${token}`,
    { password }
  );
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
  return data;
}
