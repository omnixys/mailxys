"use client";

import {
  ArchiveRounded,
  DeleteRounded,
  DraftsRounded,
  InboxRounded,
  LabelRounded,
  ReportRounded,
  SendRounded,
  StarRounded,
} from "@mui/icons-material";
import {
  alpha,
  Badge,
  Box,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import type { JmapMailbox } from "@/features/mail/types";
import { useMailStore } from "../store/useMailStore";

const roleIcon: Record<string, React.ReactNode> = {
  inbox: <InboxRounded sx={{ fontSize: "1.25rem" }} />,
  drafts: <DraftsRounded sx={{ fontSize: "1.25rem" }} />,
  sent: <SendRounded sx={{ fontSize: "1.25rem" }} />,
  archive: <ArchiveRounded sx={{ fontSize: "1.25rem" }} />,
  spam: <ReportRounded sx={{ fontSize: "1.25rem" }} />,
  trash: <DeleteRounded sx={{ fontSize: "1.25rem" }} />,
  important: <StarRounded sx={{ fontSize: "1.25rem" }} />,
  flagged: <LabelRounded sx={{ fontSize: "1.25rem" }} />,
};

export function MailboxList() {
  const theme = useTheme();
  const { mailboxes, selectedMailboxId, selectMailbox } = useMailStore();

  return (
    <Box sx={{ py: 1 }}>
      {mailboxes.map((mailbox) => (
        <MailboxItem
          key={mailbox.id}
          mailbox={mailbox}
          isSelected={selectedMailboxId === mailbox.id}
          onSelect={selectMailbox}
          theme={theme}
        />
      ))}
    </Box>
  );
}

function MailboxItem({
  mailbox,
  isSelected,
  onSelect,
  theme,
}: {
  mailbox: JmapMailbox;
  isSelected: boolean;
  onSelect: (id: string) => void;
  theme: Theme;
}) {
  const icon = roleIcon[mailbox.role] ?? (
    <InboxRounded sx={{ fontSize: "1.25rem" }} />
  );
  const hasUnread = mailbox.unreadEmails > 0;

  return (
    <Box
      onClick={() => onSelect(mailbox.id)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        mx: 1,
        borderRadius: 1.5,
        cursor: "pointer",
        transition: "all 150ms ease",
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, 0.08)
          : "transparent",
        color: isSelected ? "primary.main" : "text.primary",
        "&:hover": {
          backgroundColor: isSelected
            ? alpha(theme.palette.primary.main, 0.12)
            : "action.hover",
        },
        "& .MuiBadge-badge": {
          fontSize: "0.65rem",
          height: 18,
          minWidth: 18,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          color: isSelected ? "primary.main" : "text.secondary",
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: hasUnread ? 600 : 400,
          fontSize: "0.8125rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {mailbox.name}
      </Typography>
      {hasUnread && (
        <Badge
          badgeContent={mailbox.unreadEmails}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
            },
          }}
        />
      )}
      {!hasUnread && mailbox.totalEmails > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          {mailbox.totalEmails > 999
            ? `${(mailbox.totalEmails / 1000).toFixed(1)}k`
            : mailbox.totalEmails}
        </Typography>
      )}
    </Box>
  );
}
