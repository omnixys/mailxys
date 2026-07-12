"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { AppShell } from "@/shared/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
