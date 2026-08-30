"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/providers/AuthProvider";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { AuthEventsBus } from "@/lib/auth/AuthManager";
import BrandingHeader from "./BrandingHeader";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";
import UsernameField from "./UsernameField";

export default function LoginForm() {
  const t = useTypedTranslations("marketing");
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/mail/inbox");
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        platformAuthenticated: boolean;
        error?: string;
      };

      if (!res.ok || !data.platformAuthenticated) {
        throw new Error(data.error || "Login failed");
      }

      // Signal AuthProvider to refetch MeAuth
      AuthEventsBus.emit("auth:login");

      // Redirect to dashboard — AuthGuard will handle loading state
      router.replace("/mail/inbox");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <BrandingHeader />

      <Stack spacing={2.5}>
        <UsernameField
          value={username}
          onChange={setUsername}
          error={undefined}
          disabled={loading}
        />
        <PasswordField
          value={password}
          onChange={setPassword}
          error={undefined}
          disabled={loading}
        />
        <SubmitButton loading={loading} disabled={loading} />
      </Stack>

      {error && (
        <Typography
          color="error"
          sx={{ mt: 2, textAlign: "center" }}
          variant="body2"
        >
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t("login.noAccount")}{" "}
          <Typography
            component="span"
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 600 }}
          >
            {t("login.requestAccess")}
          </Typography>
        </Typography>
        <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
          {t("login.forgotPassword")}
        </Typography>
      </Box>
    </Box>
  );
}
