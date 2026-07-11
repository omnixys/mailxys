"use client";

import { ErrorOutlineRounded, RefreshRounded } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const theme = useTheme();
  const t = useTypedTranslations("common");
  const resolvedTitle = title ?? t("somethingWentWrong");
  const resolvedDescription = description ?? t("errorDescription");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          backgroundColor: `${theme.palette.error.main}10`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <ErrorOutlineRounded sx={{ fontSize: 32, color: "error.main" }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {resolvedTitle}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 320, mb: 2 }}
      >
        {resolvedDescription}
      </Typography>
      {onRetry && (
        <Button
          startIcon={<RefreshRounded />}
          variant="outlined"
          onClick={onRetry}
        >
          {t("retry")}
        </Button>
      )}
    </Box>
  );
}
