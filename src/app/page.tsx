"use client";

import { Box, Typography, Button } from "@mui/material";
import { useThemeMode } from "@/providers/ThemeModeProvider";
import {
  LightModeRounded,
  DarkModeRounded,
} from "@mui/icons-material";

export default function Home() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        gap: 3,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700, color: "primary.main" }}>
        Omnixys Mail
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Enterprise Webmail & Server Administration
      </Typography>
      <Button
        variant="outlined"
        startIcon={mode === "light" ? <DarkModeRounded /> : <LightModeRounded />}
        onClick={toggleMode}
      >
        Switch to {mode === "light" ? "Dark" : "Light"} Mode
      </Button>
    </Box>
  );
}
