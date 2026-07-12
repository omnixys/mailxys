"use client";

import { alpha, Box, Card, CardContent, useTheme } from "@mui/material";
import { Suspense } from "react";
import LoginForm from "@/components/auth/login/LoginForm";

function LoginPageFallback() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: 4, minHeight: 300 }} />
      </Card>
    </Box>
  );
}

export default function LoginPage() {
  const theme = useTheme();

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
          <Suspense fallback={<LoginPageFallback />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </Box>
  );
}
