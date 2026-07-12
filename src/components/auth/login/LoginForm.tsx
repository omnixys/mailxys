"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { AuthManager } from "@/lib/auth/AuthManager";
import BrandingHeader from "./BrandingHeader";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";
import UsernameField from "./UsernameField";

export default function LoginForm() {
  const router = useRouter();
  const t = useTypedTranslations("marketing");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    const newFieldErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newFieldErrors.username = t("login.usernameRequired");
    if (!password) newFieldErrors.password = t("login.passwordRequired");

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setFieldErrors({});
    setError(null);
    setLoading(true);

    try {
      await AuthManager.login({ username: username.trim(), password });
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(t("login.errors.general"));
    } finally {
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
          error={fieldErrors.username}
          disabled={loading}
        />
        <PasswordField
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
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
