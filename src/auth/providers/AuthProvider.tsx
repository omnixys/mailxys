"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "../types/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

// Mock user for development
const MOCK_USER: User = {
  id: "usr_001",
  email: "admin@omnixys.com",
  name: "Admin User",
  roles: ["ADMIN"],
  permissions: [
    "mail.read",
    "mail.write",
    "mail.delete",
    "mail.send",
    "admin.users.read",
    "admin.users.write",
    "admin.domains.read",
    "admin.domains.write",
    "admin.queue.read",
    "admin.monitoring",
    "admin.roles",
    "admin.quotas",
    "admin.dkim",
    "admin.spam",
    "admin.network",
    "admin.storage",
    "system.settings",
    "system.analytics",
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const storedToken = localStorage.getItem("omnixys.auth.token");
    if (storedToken) {
      setToken(storedToken);
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(() => {
    // TODO: Integrate with Keycloak
    const mockToken = "mock-jwt-token";
    localStorage.setItem("omnixys.auth.token", mockToken);
    setToken(mockToken);
    setUser(MOCK_USER);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("omnixys.auth.token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!user && !!token,
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
