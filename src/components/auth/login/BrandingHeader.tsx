"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

export default function BrandingHeader() {
  const theme = useTheme();
  const t = useTypedTranslations("marketing");

  return (
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
          boxShadow: `0 4px 14px ${theme.palette.primary.main}33`,
        }}
      >
        O
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        {t("login.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("login.subtitle")}
      </Typography>
    </Box>
  );
}
