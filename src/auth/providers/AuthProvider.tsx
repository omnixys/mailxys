"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  MeAuthDocument,
  type MeAuthQuery,
  type MeAuthQueryVariables,
} from "@/generated/graphql";
import { setCurrentUser } from "@/lib/apollo/auth-context";
import { AuthEventsBus, AuthManager } from "@/lib/auth/AuthManager";
import { StalwartSessionManager } from "@/lib/mail/StalwartSessionManager";
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
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<MeAuthQuery["meAuth"] | null>(null);

  const { data, loading, refetch } = useQuery<
    MeAuthQuery,
    MeAuthQueryVariables
  >(MeAuthDocument, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    AuthManager.init(client);
  }, [client]);

  useEffect(() => {
    if (!data?.meAuth) {
      if (!loading) {
        setUser(null);
        setAuthUser(null);
        setCurrentUser(null);
      }
      return;
    }

    const me = data.meAuth;
    const roles = me.role ? [me.role] : [];
    const permissions = mapRoleToPermissions(roles);

    setAuthUser(me);
    setCurrentUser(me);

    setUser({
      id: me.id,
      email: me.email,
      name: `${me.firstName} ${me.lastName}`.trim() || me.username,
      roles,
      permissions,
    });
  }, [data, loading]);

  useEffect(() => {
    const handleLogin = async () => {
      await refetch();
    };

    const handleLogout = () => {
      setUser(null);
      setAuthUser(null);
      setCurrentUser(null);
    };

    const handleRefresh = async () => {
      await refetch();
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
    await StalwartSessionManager.logout();
    setUser(null);
    setAuthUser(null);
    setCurrentUser(null);
    await client.clearStore();
    window.location.href = "/login";
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!authUser,
    isLoading: loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
