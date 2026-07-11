"use client";

import {
  RemoveRounded,
  TrendingDownRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change: number;
  period?: string;
  icon: React.ReactNode;
  gradient?: string;
  index?: number;
}

export function KpiCard({
  title,
  value,
  unit,
  change,
  period,
  icon,
  gradient,
  index = 0,
}: KpiCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const isPositive = change > 0;
  const isNeutral = change === 0;
  const accentGradient =
    gradient ||
    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Box
        sx={{
          position: "relative",
          background: isDark
            ? "rgba(20, 20, 24, 0.80)"
            : "rgba(255, 255, 255, 0.80)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "none",
          borderRadius: 3,
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 200ms ease",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: "1px",
            background: accentGradient,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          },
          "&:hover": {
            boxShadow: `0 8px 32px ${isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.08)"}`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              background: accentGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: `0 4px 14px ${isDark ? "rgba(106, 75, 188, 0.3)" : "rgba(106, 75, 188, 0.25)"}`,
            }}
          >
            {icon}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 2,
              backgroundColor: isNeutral
                ? "action.hover"
                : isPositive
                  ? `${theme.palette.success.main}15`
                  : `${theme.palette.error.main}15`,
              color: isNeutral
                ? "text.secondary"
                : isPositive
                  ? "success.main"
                  : "error.main",
            }}
          >
            {isNeutral ? (
              <RemoveRounded sx={{ fontSize: "0.875rem" }} />
            ) : isPositive ? (
              <TrendingUpRounded sx={{ fontSize: "0.875rem" }} />
            ) : (
              <TrendingDownRounded sx={{ fontSize: "0.875rem" }} />
            )}
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, lineHeight: 1 }}
            >
              {isPositive ? "+" : ""}
              {change}%
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, lineHeight: 1.1, mb: 0.5 }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
            {unit && (
              <Typography
                component="span"
                variant="h6"
                sx={{ fontWeight: 500, ml: 0.5, color: "text.secondary" }}
              >
                {unit}
              </Typography>
            )}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
          {period && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block", opacity: 0.7 }}
            >
              {period}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
