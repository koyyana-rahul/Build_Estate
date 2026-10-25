import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<{ requiresVerification?: boolean }>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  favoriteIds: Set<string>;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('buildestate_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const loadFavorites = useCallback(async () => {
    try {
      const { data } = await userAPI.getFavorites();
      setFavoriteIds(new Set(data.favoriteIds || []));
    } catch {
      setFavoriteIds(new Set());
    }
  }, []);

  // On mount, check if token exists and is valid
  useEffect(() => {
    const storedToken = localStorage.getItem('buildestate_token');
    const storedUser = localStorage.getItem('buildestate_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        void loadFavorites();
      } catch {
        localStorage.removeItem('buildestate_token');
        localStorage.removeItem('buildestate_user');
      }
    }
    setIsLoading(false);
  }, [loadFavorites]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    const { data } = await userAPI.login({ email, password, rememberMe });
    if (data.success && data.token) {
      localStorage.setItem('buildestate_token', data.token);
      localStorage.setItem('buildestate_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      void loadFavorites();
    } else {
      throw new Error(data.message || 'Login failed');
    }
  }, [loadFavorites]);

  const register = useCallback(async (fullName: string, email: string, phone: string, password: string) => {
    const { data } = await userAPI.register({ fullName, email, phone, password });
    if (data.success && data.requiresVerification) {
      return { requiresVerification: true };
    }
    if (data.success && data.token) {
      localStorage.setItem('buildestate_token', data.token);
      localStorage.setItem('buildestate_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return {};
    }
    throw new Error(data.message || 'Registration failed');
  }, []);

  const logout = useCallback(() => {
    // Fire-and-forget — revokes the httpOnly refresh cookie server-side
    userAPI.logout().catch(() => {});
    localStorage.removeItem('buildestate_token');
    localStorage.removeItem('buildestate_user');
    setToken(null);
    setUser(null);
    setFavoriteIds(new Set());
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(async (propertyId: string) => {
    const { data } = await userAPI.toggleFavorite(propertyId);
    if (!data.success) throw new Error(data.message || 'Unable to update saved property');
    setFavoriteIds((previous) => {
      const next = new Set(previous);
      if (data.favorited) next.add(propertyId);
      else next.delete(propertyId);
      return next;
    });
    return Boolean(data.favorited);
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem('buildestate_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        favoriteIds,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
