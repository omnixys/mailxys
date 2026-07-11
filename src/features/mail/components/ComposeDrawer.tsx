"use client";

import {
  AttachFileRounded,
  CloseRounded,
  FormatBoldRounded,
  FormatItalicRounded,
  SendRounded,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useMailStore } from "../store/useMailStore";

export function ComposeDrawer() {
  const theme = useTheme();
  const { composeOpen, composeData, closeCompose } = useMailStore();

  const [to, setTo] = useState(composeData?.to ?? "");
  const [subject, setSubject] = useState(composeData?.subject ?? "");
  const [body, setBody] = useState(composeData?.body ?? "");

  const handleSend = () => {
    // TODO: Implement actual send via JMAP EmailSubmission
    console.log("Send:", { to, subject, body });
    closeCompose();
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
            ? "Reply"
            : composeData?.mode === "replyAll"
              ? "Reply All"
              : composeData?.mode === "forward"
                ? "Forward"
                : "New Message"}
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
          placeholder="To"
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
          placeholder="Subject"
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
        placeholder="Write your message..."
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
          Draft auto-saved
        </Typography>
        <IconButton
          onClick={handleSend}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            px: 2.5,
            borderRadius: 2,
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          <SendRounded sx={{ fontSize: "1.125rem", mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>
            Send
          </Typography>
        </IconButton>
      </Box>
    </Drawer>
  );
}
