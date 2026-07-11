"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { Permission } from "../rbac/permissions";
import { useAuth } from "./AuthProvider";

interface PermissionContextValue {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
});

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (permission: Permission) => {
      return user?.permissions.includes(permission) ?? false;
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]) => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission],
  );

  const hasAllPermissions = useCallback(
    (permissions: Permission[]) => {
      return permissions.every((p) => hasPermission(p));
    },
    [hasPermission],
  );

  const value = useMemo(
    () => ({ hasPermission, hasAnyPermission, hasAllPermissions }),
    [hasPermission, hasAnyPermission, hasAllPermissions],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext);
}
