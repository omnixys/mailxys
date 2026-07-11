"use client";

import { Box, Skeleton } from "@mui/material";

interface LoadingStateProps {
  variant?: "page" | "card" | "list" | "table";
  rows?: number;
}

export function LoadingState({
  variant = "page",
  rows = 5,
}: LoadingStateProps) {
  if (variant === "page") {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 4 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
          }}
        >
          {[
            "skeleton-0",
            "skeleton-1",
            "skeleton-2",
            "skeleton-3",
            "skeleton-4",
            "skeleton-5",
          ].map((key) => (
            <Skeleton
              key={key}
              variant="rounded"
              height={160}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (variant === "card") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
          p: 3,
        }}
      >
        {Array.from({ length: rows }, (_, i) => `card-${i}`).map((key) => (
          <Skeleton
            key={key}
            variant="rounded"
            height={160}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (variant === "list") {
    return (
      <Box sx={{ p: 3 }}>
        {Array.from({ length: rows }, (_, i) => `list-${i}`).map((key) => (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
      {Array.from({ length: rows }, (_, i) => `row-${i}`).map((key) => (
        <Skeleton key={key} variant="text" height={40} />
      ))}
    </Box>
  );
}
