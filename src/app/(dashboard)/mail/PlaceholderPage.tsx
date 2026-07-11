"use client";

import { ArrowBackRounded } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backHref?: string;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
  backHref = "/dashboard",
}: PlaceholderPageProps) {
  const theme = useTheme();
  const t = useTypedTranslations("common");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          backgroundColor: `${theme.palette.primary.main}10`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          mb: 1,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        {description}
      </Typography>
      <Button
        component={Link}
        href={backHref}
        startIcon={<ArrowBackRounded />}
        variant="outlined"
        sx={{ mt: 1 }}
      >
        {t("backToDashboard")}
      </Button>
    </Box>
  );
}
