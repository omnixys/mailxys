"use client";

import {
  CheckCircleRounded,
  InfoRounded,
  WarningRounded,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface Activity {
  id: string;
  time: string;
  event: string;
  type: "success" | "info" | "warning";
}

interface ActivityCardProps {
  activities: Activity[];
}

const typeIcon = {
  success: { Icon: CheckCircleRounded, color: "success.main" },
  info: { Icon: InfoRounded, color: "info.main" },
  warning: { Icon: WarningRounded, color: "warning.main" },
};

export function ActivityCard({ activities }: ActivityCardProps) {
  const theme = useTheme();
  const t = useTypedTranslations("common");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
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
            {t("recentActivity")}
          </Typography>
        </Box>
        <Box sx={{ p: 0 }}>
          {activities.map((activity, index) => {
            const { Icon, color } = typeIcon[activity.type];
            return (
              <Box
                key={activity.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 3,
                  py: 1.5,
                  borderBottom:
                    index < activities.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                  "&:hover": { backgroundColor: "action.hover" },
                  transition: "background-color 150ms ease",
                }}
              >
                <Icon sx={{ fontSize: "1rem", color, flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{ flex: 1, minWidth: 0 }}
                  noWrap
                >
                  {activity.event}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ flexShrink: 0 }}
                >
                  {activity.time}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
}
