"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  MeAuthDocument,
  type MeAuthQuery,
  type MeAuthQueryVariables,
} from "@/generated/graphql";
import { getCookie } from "@/lib/apollo/cookie.utils";
import { AuthEventsBus, AuthManager } from "@/lib/auth/AuthManager";
import { mapRoleToPermissions } from "../rbac/roleMapping";
import type { User } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  const hasSession = !!getCookie("access_expires_at");
  const [user, setUser] = useState<User | null>(null);

  const { data, loading, refetch } = useQuery<
    MeAuthQuery,
    MeAuthQueryVariables
  >(MeAuthDocument, {
    skip: !hasSession,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    context: { fetchOptions: { credentials: "include" } },
  });

  useEffect(() => {
    AuthManager.init(client);
  }, [client]);

  useEffect(() => {
    if (!data?.meAuth) {
      if (!loading && hasSession) {
        setUser(null);
      }
      return;
    }

    const me = data.meAuth;
    const roles = me.role ? [me.role] : [];
    const permissions = mapRoleToPermissions(roles);

    setUser({
      id: me.id,
      email: me.email,
      name: `${me.firstName} ${me.lastName}`.trim() || me.username,
      roles,
      permissions,
    });
  }, [data, loading, hasSession]);

  useEffect(() => {
    const handleLogin = () => {
      void refetch();
    };

    const handleLogout = () => {
      setUser(null);
    };

    const handleRefresh = () => {
      void refetch();
    };

    AuthEventsBus.on("auth:login", handleLogin);
    AuthEventsBus.on("auth:logout", handleLogout);
    AuthEventsBus.on("session:refreshed", handleRefresh);

    return () => {
      AuthEventsBus.off("auth:login", handleLogin);
      AuthEventsBus.off("auth:logout", handleLogout);
      AuthEventsBus.off("session:refreshed", handleRefresh);
    };
  }, [refetch]);

  const logout = async (): Promise<void> => {
    await AuthManager.logout();
    setUser(null);
    await client.clearStore();
    window.location.href = "/login";
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading: loading && hasSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
