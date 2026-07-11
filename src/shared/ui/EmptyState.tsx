"use client";

import { InboxRounded } from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material";
import { Box, Typography, useTheme } from "@mui/material";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactElement<SvgIconProps>;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
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
          backgroundColor: `${theme.palette.primary.main}08`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          color: "primary.main",
          opacity: 0.6,
        }}
      >
        {icon ?? <InboxRounded sx={{ fontSize: 32 }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 320, mb: 2 }}
        >
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
