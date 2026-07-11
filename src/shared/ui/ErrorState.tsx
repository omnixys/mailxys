"use client";

import { ErrorOutlineRounded, RefreshRounded } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

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
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 320, mb: 2 }}
      >
        {description}
      </Typography>
      {onRetry && (
        <Button
          startIcon={<RefreshRounded />}
          variant="outlined"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
