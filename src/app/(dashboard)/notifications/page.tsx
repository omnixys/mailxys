"use client";

import {
  DeleteSweepRounded,
  FilterListRounded,
  InfoRounded,
  MailRounded,
  MarkEmailReadRounded,
  SecurityRounded,
  SettingsRounded,
  WarningRounded,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Chip,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useState } from "react";
import { mockNotifications } from "@/features/notifications/constants/mockData";
import type {
  Notification,
  NotificationPriority,
  NotificationType,
} from "@/features/notifications/types";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  mail: {
    icon: <MailRounded sx={{ fontSize: "1.125rem" }} />,
    color: "#6A4BBC",
    bg: "#6A4BBC15",
  },
  security: {
    icon: <SecurityRounded sx={{ fontSize: "1.125rem" }} />,
    color: "#EF4444",
    bg: "#EF444415",
  },
  system: {
    icon: <SettingsRounded sx={{ fontSize: "1.125rem" }} />,
    color: "#3B82F6",
    bg: "#3B82F615",
  },
  admin: {
    icon: <WarningRounded sx={{ fontSize: "1.125rem" }} />,
    color: "#F59E0B",
    bg: "#F59E0B15",
  },
};

export default function NotificationsPage() {
  const t = useTypedTranslations("notifications");
  const theme = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const priorityLabels: Record<NotificationPriority, string> = {
    urgent: t("urgent"),
    high: t("high"),
    normal: t("normal"),
    low: t("low"),
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            {t("title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {unreadCount > 0
              ? `${unreadCount} ${t("unread")}`
              : t("noUnreadNotifications")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterListRounded />}
            onClick={() => setFilter(filter === "all" ? "unread" : "all")}
          >
            {filter === "all" ? t("unread") : t("all")}
          </Button>
          {unreadCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<MarkEmailReadRounded />}
              onClick={markAllRead}
            >
              {t("markAllRead")}
            </Button>
          )}
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepRounded />}
            onClick={clearAll}
          >
            {t("clearAll")}
          </Button>
        </Box>
      </Box>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <InfoRounded
            sx={{ fontSize: 48, color: "text.secondary", opacity: 0.4, mb: 1 }}
          />
          <Typography variant="h6" color="text.secondary">
            {filter === "unread"
              ? t("noUnreadNotifications")
              : t("noNotifications")}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
              theme={theme}
              priorityLabel={priorityLabels[notification.priority]}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
  theme,
  priorityLabel,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  theme: Theme;
  priorityLabel: string;
}) {
  const type = typeConfig[notification.type];

  let relativeTime: string;
  try {
    relativeTime = formatDistanceToNow(parseISO(notification.timestamp), {
      addSuffix: true,
    });
  } catch {
    relativeTime = notification.timestamp;
  }

  const priorityColor =
    notification.priority === "urgent"
      ? "#EF4444"
      : notification.priority === "high"
        ? "#F59E0B"
        : notification.priority === "normal"
          ? "#3B82F6"
          : "#6B7280";
  const priorityBg =
    notification.priority === "urgent"
      ? "#EF444415"
      : notification.priority === "high"
        ? "#F59E0B15"
        : notification.priority === "normal"
          ? "#3B82F615"
          : "#6B728015";

  return (
    <Box
      onClick={() => !notification.read && onMarkRead(notification.id)}
      sx={{
        display: "flex",
        gap: 2,
        px: 3,
        py: 2,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: notification.read
          ? "transparent"
          : alpha(theme.palette.primary.main, 0.03),
        border: `1px solid ${notification.read ? "transparent" : alpha(theme.palette.primary.main, 0.08)}`,
        transition: "all 150ms ease",
        "&:hover": {
          bgcolor: alpha(theme.palette.action.active, 0.04),
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: type.bg,
          color: type.color,
          flexShrink: 0,
          mt: 0.25,
        }}
      >
        {type.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: notification.read ? 500 : 700,
              flex: 1,
            }}
          >
            {notification.title}
          </Typography>
          {!notification.read && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: theme.palette.primary.main,
                flexShrink: 0,
              }}
            />
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexShrink: 0 }}
          >
            {relativeTime}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.8125rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notification.message}
        </Typography>
        <Box sx={{ mt: 0.75 }}>
          <Chip
            label={priorityLabel}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.65rem",
              fontWeight: 600,
              bgcolor: priorityBg,
              color: priorityColor,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
