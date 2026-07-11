"use client";

import { Box, useTheme } from "@mui/material";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Marketing Nav */}
      <Box
        component="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.875rem",
              }}
            >
              O
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "text.primary",
                letterSpacing: "-0.02em",
              }}
            >
              Omnixys Mail
            </Box>
          </Box>
        </Link>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}
