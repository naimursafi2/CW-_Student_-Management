import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../api/auth.api';
import { getApiErrorMessage } from '../api/client';
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '../utils/tokenStorage';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ verificationUrl?: string; previewUrl?: string }>;
  logout: () => void;
  setSession: (user: User, token: string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((nextUser: User, token: string) => {
    setToken(token);
    setStoredUser(JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await authApi.getMe();
    if (response.data?.user) {
      setStoredUser(JSON.stringify(response.data.user));
      setUser(response.data.user);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (!token) {
        setIsLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as User);
        } catch {
          clearAuthStorage();
          setIsLoading(false);
          return;
        }
      }

      try {
        await refreshUser();
      } catch {
        clearAuthStorage();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      if (!response.data?.user || !response.data?.token) {
        throw new Error(response.message || 'Login failed.');
      }
      setSession(response.data.user, response.data.token);
    },
    [setSession]
  );

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const response = await authApi.register(credentials);
    return {
      verificationUrl: response.data?.verificationUrl ?? response.verificationUrl,
      previewUrl: response.data?.previewUrl ?? response.previewUrl,
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && getToken()),
      isLoading,
      login,
      register,
      logout,
      setSession,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, setSession, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { getApiErrorMessage };
