"use client";

import {
  EditRounded,
  FilterListRounded,
  RefreshRounded,
  SearchRounded,
  SelectAllRounded,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { useMailStore } from "../store/useMailStore";

export function MailToolbar() {
  const theme = useTheme();
  const t = useTypedTranslations("mail");
  const {
    searchQuery,
    setSearchQuery,
    openCompose,
    selectedMailboxId,
    mailboxes,
    requestRefresh,
  } = useMailStore();
  const mailbox = mailboxes.find((m) => m.id === selectedMailboxId);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      {/* Mailbox Title */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mr: 1, whiteSpace: "nowrap" }}
      >
        {mailbox?.name ?? t("folderMail")}
      </Typography>

      {/* Search */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          bgcolor: alpha(theme.palette.action.active, 0.04),
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          maxWidth: 320,
        }}
      >
        <SearchRounded sx={{ fontSize: "1.125rem", color: "text.secondary" }} />
        <InputBase
          placeholder={t("searchMailPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            fontSize: "0.8125rem",
            "& input::placeholder": { opacity: 0.6 },
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Actions */}
      <IconButton size="small" title={t("selectAll")}>
        <SelectAllRounded sx={{ fontSize: "1.25rem" }} />
      </IconButton>
      <IconButton size="small" title={t("filter")}>
        <FilterListRounded sx={{ fontSize: "1.25rem" }} />
      </IconButton>
      <IconButton size="small" title={t("refresh")} onClick={requestRefresh}>
        <RefreshRounded sx={{ fontSize: "1.25rem" }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => openCompose({ mode: "new" })}
        title={t("compose")}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          "&:hover": { bgcolor: theme.palette.primary.dark },
        }}
      >
        <EditRounded sx={{ fontSize: "1.125rem" }} />
      </IconButton>
    </Box>
  );
}
