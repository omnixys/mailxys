"use client";

import {
  AttachFileRounded,
  CloseRounded,
  FormatBoldRounded,
  FormatItalicRounded,
  SendRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { jmapClient } from "@/api/jmap/jmapClient";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { useMailStore } from "../store/useMailStore";

export function ComposeDrawer() {
  const theme = useTheme();
  const t = useTypedTranslations("mail");
  const { composeOpen, composeData, closeCompose } = useMailStore();

  const [to, setTo] = useState(composeData?.to ?? "");
  const [subject, setSubject] = useState(composeData?.subject ?? "");
  const [body, setBody] = useState(composeData?.body ?? "");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (!composeOpen) return;
    setTo(composeData?.to ?? "");
    setSubject(composeData?.subject ?? "");
    setBody(composeData?.body ?? "");
    setSendError(null);
  }, [composeData, composeOpen]);

  const handleSend = async () => {
    if (sending || !to.trim() || !body.trim()) return;
    setSending(true);
    setSendError(null);
    try {
      await jmapClient.send({
        to,
        subject,
        body,
        ...(composeData?.inReplyTo ? { inReplyTo: composeData.inReplyTo } : {}),
        ...(composeData?.references
          ? { references: composeData.references }
          : {}),
      });
      closeCompose();
      useMailStore.getState().requestRefresh();
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : "Email could not be sent",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={composeOpen}
      onClose={closeCompose}
      slotProps={{
        paper: {
          sx: {
            height: "70vh",
            maxHeight: 600,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bgcolor: theme.palette.background.paper,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {composeData?.mode === "reply"
            ? t("reply")
            : composeData?.mode === "replyAll"
              ? t("replyAll")
              : composeData?.mode === "forward"
                ? t("forward")
                : t("composeNew")}
        </Typography>
        <IconButton size="small" onClick={closeCompose}>
          <CloseRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
      </Box>

      {/* Fields */}
      <Box sx={{ px: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t("to")}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          variant="standard"
          slotProps={{ input: { disableUnderline: true } }}
          sx={{ py: 1 }}
        />
        <Divider />
        <TextField
          fullWidth
          size="small"
          placeholder={t("subject")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          variant="standard"
          slotProps={{ input: { disableUnderline: true } }}
          sx={{ py: 1 }}
        />
        <Divider />
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 2.5,
          py: 0.5,
        }}
      >
        <IconButton size="small">
          <FormatBoldRounded sx={{ fontSize: "1.125rem" }} />
        </IconButton>
        <IconButton size="small">
          <FormatItalicRounded sx={{ fontSize: "1.125rem" }} />
        </IconButton>
        <IconButton size="small">
          <AttachFileRounded sx={{ fontSize: "1.125rem" }} />
        </IconButton>
      </Box>

      {/* Body */}
      <TextField
        fullWidth
        multiline
        placeholder={t("writeBody")}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        variant="standard"
        slotProps={{ input: { disableUnderline: true } }}
        sx={{
          flex: 1,
          px: 2.5,
          py: 1,
          "& .MuiInputBase-root": {
            height: "100%",
            alignItems: "flex-start",
          },
          "& .MuiInputBase-input": {
            height: "100% !important",
            overflow: "auto !important",
          },
        }}
      />

      {/* Footer */}
      {sendError && (
        <Alert severity="error" sx={{ mx: 2.5, mb: 1 }}>
          {sendError}
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t("draftSaved")}
        </Typography>
        <IconButton
          onClick={handleSend}
          disabled={sending || !to.trim() || !body.trim()}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            px: 2.5,
            borderRadius: 2,
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          {sending ? (
            <CircularProgress size={18} color="inherit" sx={{ mr: 0.5 }} />
          ) : (
            <SendRounded sx={{ fontSize: "1.125rem", mr: 0.5 }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>
            {t("send")}
          </Typography>
        </IconButton>
      </Box>
    </Drawer>
  );
}
