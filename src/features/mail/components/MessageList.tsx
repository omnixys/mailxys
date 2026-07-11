"use client";

import { AttachFileRounded, StarRounded } from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Box,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useMemo } from "react";
import type { JmapEmail } from "@/features/mail/types";
import { useMailStore } from "../store/useMailStore";

export function MessageList() {
  const theme = useTheme();
  const { emails, selectedEmailId, selectEmail, searchQuery } = useMailStore();

  const filteredEmails = useMemo(() => {
    if (!searchQuery) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter(
      (e) =>
        e.subject.toLowerCase().includes(q) ||
        e.from.some(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.email.toLowerCase().includes(q),
        ),
    );
  }, [emails, searchQuery]);

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      {filteredEmails.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No messages found
          </Typography>
        </Box>
      ) : (
        filteredEmails.map((email) => (
          <MessageItem
            key={email.id}
            email={email}
            isSelected={selectedEmailId === email.id}
            onSelect={selectEmail}
            theme={theme}
          />
        ))
      )}
    </Box>
  );
}

function MessageItem({
  email,
  isSelected,
  onSelect,
  theme,
}: {
  email: JmapEmail;
  isSelected: boolean;
  onSelect: (id: string) => void;
  theme: Theme;
}) {
  const isUnread = !email.keywords.$seen;
  const isFlagged = !!email.keywords.$flagged;
  const senderName = email.from[0]?.name ?? email.from[0]?.email ?? "Unknown";
  const senderInitial = senderName.charAt(0).toUpperCase();
  const preview = email.bodyValues.t1?.value ?? "";
  const truncatedPreview =
    preview.length > 100 ? `${preview.slice(0, 100)}...` : preview;

  let relativeTime: string;
  try {
    relativeTime = formatDistanceToNow(parseISO(email.receivedAt), {
      addSuffix: true,
    });
  } catch {
    relativeTime = email.receivedAt;
  }

  const senderColors = [
    theme.palette.primary.main,
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#8B5CF6",
    "#06B6D4",
  ];
  const colorIndex = senderName.charCodeAt(0) % senderColors.length;
  const avatarColor = senderColors[colorIndex];

  return (
    <Box
      onClick={() => onSelect(email.id)}
      sx={{
        display: "flex",
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: "pointer",
        borderLeft: `3px solid ${isSelected ? theme.palette.primary.main : "transparent"}`,
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, 0.06)
          : "transparent",
        transition: "all 120ms ease",
        "&:hover": {
          backgroundColor: isSelected
            ? alpha(theme.palette.primary.main, 0.1)
            : "action.hover",
        },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: "0.875rem",
          fontWeight: 700,
          bgcolor: avatarColor,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {senderInitial}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.25,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: isUnread ? 700 : 500,
              fontSize: "0.8125rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              mr: 1,
            }}
          >
            {senderName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            {email.hasAttachment && (
              <AttachFileRounded
                sx={{ fontSize: "0.875rem", color: "text.secondary" }}
              />
            )}
            {isFlagged && (
              <StarRounded
                sx={{ fontSize: "0.875rem", color: "warning.main" }}
              />
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
            >
              {relativeTime}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isUnread ? 600 : 400,
            fontSize: "0.8125rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 0.25,
          }}
        >
          {email.subject}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.75rem",
            lineHeight: 1.4,
          }}
        >
          {truncatedPreview}
        </Typography>
      </Box>
    </Box>
  );
}
