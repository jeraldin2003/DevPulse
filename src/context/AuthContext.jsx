import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiRegister, apiSendOtp, apiLogout, apiRefreshToken } from '../api/auth.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'devpulse_access_token';
const REFRESH_KEY = 'devpulse_refresh_token';
const USER_KEY = 'devpulse_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedAccess = localStorage.getItem(TOKEN_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedAccess && storedRefresh && storedUser) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist tokens to localStorage
  const persistSession = useCallback((access, refresh, userData) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await apiLogin(username, password);
    if (result.success) {
      persistSession(result.data.accessToken, result.data.refreshToken, result.data.user);
    }
    return result;
  }, [persistSession]);

  const sendOtp = useCallback(async (email) => {
    const result = await apiSendOtp(email);
    return result;
  }, []);

  const register = useCallback(async (username, password, email, otp) => {
    const result = await apiRegister(username, password, email, otp);
    return result;
  }, []);

  const logout = useCallback(async () => {
    if (refreshToken) {
      try {
        await apiLogout(refreshToken);
      } catch {
        // Proceed with local logout even if API call fails
      }
    }
    clearSession();
  }, [refreshToken, clearSession]);

  const refresh = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      const result = await apiRefreshToken(refreshToken);
      if (result.success) {
        localStorage.setItem(TOKEN_KEY, result.data.accessToken);
        localStorage.setItem(REFRESH_KEY, result.data.refreshToken);
        setAccessToken(result.data.accessToken);
        setRefreshToken(result.data.refreshToken);
        return true;
      }
      clearSession();
      return false;
    } catch {
      clearSession();
      return false;
    }
  }, [refreshToken, clearSession]);

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    login,
    sendOtp,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
