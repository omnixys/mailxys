"use client";

import { CheckCircleRounded, WarningRounded } from "@mui/icons-material";
import { Box, Chip, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface Service {
  name: string;
  status: "operational" | "degraded" | "outage";
  port: string;
  uptime: number;
}

interface SystemStatusCardProps {
  services: Service[];
}

const statusColorMap = {
  operational: { color: "#22C55E" as const, bg: "#22C55E15" },
  degraded: { color: "#F59E0B" as const, bg: "#F59E0B15" },
  outage: { color: "#EF4444" as const, bg: "#EF444415" },
} as const;

const statusKeyMap = {
  operational: "statusOperational",
  degraded: "statusDegraded",
  outage: "statusOutage",
} as const;

export function SystemStatusCard({ services }: SystemStatusCardProps) {
  const theme = useTheme();
  const t = useTypedTranslations("common");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
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
            {t("systemStatus")}
          </Typography>
        </Box>
        <Box sx={{ p: 0 }}>
          {services.map((service, index) => {
            const config = statusColorMap[service.status];
            return (
              <Box
                key={service.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 3,
                  py: 1.5,
                  borderBottom:
                    index < services.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                  "&:hover": { backgroundColor: "action.hover" },
                  transition: "background-color 150ms ease",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                  }}
                >
                  {service.status === "operational" ? (
                    <CheckCircleRounded
                      sx={{ fontSize: "1rem", color: config.color }}
                    />
                  ) : (
                    <WarningRounded
                      sx={{ fontSize: "1rem", color: config.color }}
                    />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {service.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    :{service.port}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {service.uptime}%
                  </Typography>
                  <Chip
                    label={t(statusKeyMap[service.status] as never)}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      backgroundColor: config.bg,
                      color: config.color,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
}
