"use client";

import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import { ComposeDrawer } from "@/features/mail/components/ComposeDrawer";
import { MailboxList } from "@/features/mail/components/MailboxList";
import { MailToolbar } from "@/features/mail/components/MailToolbar";
import { MessageDetail } from "@/features/mail/components/MessageDetail";
import { MessageList } from "@/features/mail/components/MessageList";
import { mockEmails, mockMailboxes } from "@/features/mail/constants/mockData";
import { useMailStore } from "@/features/mail/store/useMailStore";

export default function InboxPage() {
  const theme = useTheme();
  const { setMailboxes, setEmails } = useMailStore();

  useEffect(() => {
    setMailboxes(mockMailboxes);
    setEmails(mockEmails);
  }, [setMailboxes, setEmails]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        m: -3,
        overflow: "hidden",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Panel 1: Mailbox List */}
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
          overflow: "auto",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <MailboxList />
      </Box>

      {/* Panel 2: Message List */}
      <Box
        sx={{
          width: 380,
          flexShrink: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <MailToolbar />
        <MessageList />
      </Box>

      {/* Panel 3: Message Detail */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <MessageDetail />
      </Box>

      {/* Compose Drawer */}
      <ComposeDrawer />
    </Box>
  );
}
