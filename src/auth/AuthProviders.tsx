"use client";

import { AuthProvider } from "@/auth/providers/AuthProvider";
import { PermissionProvider } from "@/auth/providers/PermissionProvider";

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PermissionProvider>{children}</PermissionProvider>
    </AuthProvider>
  );
}
