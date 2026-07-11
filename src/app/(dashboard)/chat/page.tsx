"use client";

import { SendRounded, TagRounded } from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Badge,
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useState } from "react";
import {
  mockChannels,
  mockMessages,
  mockUsers,
} from "@/features/chat/constants/mockData";
import type { ChatChannel, ChatMessage, ChatUser } from "@/features/chat/types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function StatusDot({ status }: { status: ChatUser["status"] }) {
  const theme = useTheme();
  const colors: Record<ChatUser["status"], string> = {
    online: theme.palette.success.main,
    busy: theme.palette.warning.main,
    offline: theme.palette.action.disabled,
  };

  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: colors[status],
        border: `2px solid ${theme.palette.background.paper}`,
        position: "absolute",
        bottom: 0,
        right: 0,
      }}
    />
  );
}

export default function ChatPage() {
  const theme = useTheme();
  const [selectedChannelId, setSelectedChannelId] = useState("ch1");

  const selectedChannel = mockChannels.find(
    (ch) => ch.id === selectedChannelId,
  ) as ChatChannel;
  const channelMessages = mockMessages.filter(
    (m) => m.channelId === selectedChannelId,
  );

  const getUserById = (id: string): ChatUser =>
    mockUsers.find((u) => u.id === id) as ChatUser;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Channel Sidebar */}
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Channels
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", px: 1.5 }}>
          {mockChannels.map((channel) => {
            const isSelected = channel.id === selectedChannelId;
            return (
              <Box
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  mb: 0.25,
                  backgroundColor: isSelected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.18)
                      : alpha(theme.palette.action.hover, 0.06),
                  },
                }}
              >
                <TagRounded
                  sx={{
                    fontSize: 18,
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                >
                  {channel.name}
                </Typography>
                {channel.unreadCount > 0 && (
                  <Badge
                    badgeContent={channel.unreadCount}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 10,
                        height: 18,
                        minWidth: 18,
                      },
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Channel Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TagRounded
            sx={{ fontSize: 20, color: theme.palette.text.secondary }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {selectedChannel.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {selectedChannel.memberCount} members
          </Typography>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {channelMessages.map((msg: ChatMessage) => {
            const user = getUserById(msg.userId);
            return (
              <Box key={msg.id} sx={{ display: "flex", gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: user.avatarColor,
                    color: "#fff",
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {formatDistanceToNow(parseISO(msg.timestamp), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mt: 0.25,
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Message Input */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.6),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <InputBase
              placeholder={`Message #${selectedChannel.name}`}
              sx={{ flex: 1, fontSize: 14 }}
            />
            <IconButton
              size="small"
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <SendRounded fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Member List */}
      <Box
        sx={{
          width: 200,
          flexShrink: 0,
          borderLeft: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Members — {mockUsers.length}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", px: 1.5 }}>
          {(["online", "busy", "offline"] as const).map((status) => {
            const usersInStatus = mockUsers.filter((u) => u.status === status);
            if (usersInStatus.length === 0) return null;
            return (
              <Box key={status} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {status} — {usersInStatus.length}
                </Typography>
                {usersInStatus.map((user) => (
                  <Box
                    key={user.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.action.hover,
                          0.06,
                        ),
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor: user.avatarColor,
                          color: "#fff",
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <StatusDot status={user.status} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13,
                        color: theme.palette.text.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
