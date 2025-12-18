import { type ReactNode, useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '../types/auth-user.ts';
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from '../utilities/cookies.utilities.ts';
import { isJwtExpired } from '../utilities/jwt.utilities.ts';
import { userFromAccessToken } from '../utilities/auth-user.utilities.ts';
import axios from 'axios';
import { API_BASE_URL } from '../apis/api.ts';
import { AuthContext, type AuthContextValue } from './auth.context.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const accessToken = getAccessToken();
    if (!accessToken || isJwtExpired(accessToken)) return null;
    return userFromAccessToken(accessToken);
  });

  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearAuthCookies();
    setUser(null);
  }, []);

  const setSession = useCallback(
    ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
      setAuthCookies({ accessToken, refreshToken });
      setUser(userFromAccessToken(accessToken));
    },
    [],
  );

  const tryRefresh = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      return null;
    }

    try {
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${API_BASE_URL}/v1/auth/refresh/`,
        null,
        {
          withCredentials: true,
          headers: {
            'x-refresh-token': refreshToken,
          },
        },
      );

      setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      return userFromAccessToken(data.accessToken);
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession, setSession]);

  useEffect(() => {
    const init = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      if (!isJwtExpired(accessToken)) {
        setUser(userFromAccessToken(accessToken));
        setIsLoading(false);
        return;
      }

      await tryRefresh();
      setIsLoading(false);
    };

    void init();
  }, [tryRefresh]);

  const value: AuthContextValue = {
    user,
    isLoading,
    setSession,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
