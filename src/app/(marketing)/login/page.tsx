"use client";

import { ArrowForwardRounded, KeyRounded } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

export default function LoginPage() {
  const t = useTypedTranslations("marketing");
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Mock: simulate Keycloak redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 8,
        background:
          theme.palette.mode === "dark"
            ? `radial-gradient(ellipse at 50% 0%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 60%)`
            : `radial-gradient(ellipse at 50% 0%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 60%)`,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.5rem",
                mx: "auto",
                mb: 2,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              O
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t("signIn")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("omnixysMail")}
            </Typography>
          </Box>

          {/* OIDC Login */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<KeyRounded />}
            endIcon={<ArrowForwardRounded />}
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.9375rem",
              borderRadius: 2,
              mb: 2,
            }}
          >
            {loading ? t("redirectToKeycloak") : t("continueWithSso")}
          </Button>

          <Divider sx={{ my: 2.5 }}>
            <Typography variant="caption" color="text.secondary">
              {t("orSignInWithEmail")}
            </Typography>
          </Divider>

          {/* Email Login */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label={t("emailAddress")}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
            />
            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={!email || loading}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9375rem",
                borderRadius: 2,
              }}
            >
              {t("sendMagicLink")}
            </Button>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 3 }}
          >
            {t("protectedBy")}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
