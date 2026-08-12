export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  isEmailVerified: boolean;
  isApproved?: boolean;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
}

export interface ManagedUser extends Omit<User, 'id' | 'isEmailVerified'> {
  id?: string;
  _id?: string;
  bio?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  // Supports the current backend response while it is being standardized.
  isEmailVerfied?: boolean;
}

export type UserRole = 'admin' | 'teacher' | 'student';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  verificationUrl?: string;
  resetUrl?: string;
  previewUrl?: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  role: Exclude<UserRole, 'admin'>;
  email: string;
  password: string;
}
