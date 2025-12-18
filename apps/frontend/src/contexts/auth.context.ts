import { createContext } from 'react';
import type { AuthUser } from '../types/auth-user';

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  setSession: (params: { accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
