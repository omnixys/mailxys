"use client";

import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface StorageItem {
  name: string;
  used: number;
  total: number;
  color: string;
}

interface StorageCardProps {
  items: StorageItem[];
}

export function StorageCard({ items }: StorageCardProps) {
  const theme = useTheme();
  const t = useTypedTranslations("common");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Box
        sx={{
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("storage")}
          </Typography>
        </Box>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {items.map((item) => {
            const percentage = Math.round((item.used / item.total) * 100);
            const isHigh = percentage > 75;
            return (
              <Box key={item.name}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(item.used / 1000).toFixed(1)} /{" "}
                    {(item.total / 1000).toFixed(1)} TB
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${item.color}15`,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      backgroundColor: isHigh
                        ? theme.palette.warning.main
                        : item.color,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
}
