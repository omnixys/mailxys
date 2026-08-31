"use client";

import {
  ArchiveRounded,
  AttachFileRounded,
  DeleteRounded,
  DownloadRounded,
  ForwardRounded,
  MoreVertRounded,
  ReplyAllRounded,
  ReplyRounded,
  StarRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { useMailStore } from "../store/useMailStore";

export function MessageDetail() {
  const theme = useTheme();
  const t = useTypedTranslations("mail");
  const { emails, selectedEmailId, openCompose } = useMailStore();
  const email = useMemo(
    () => emails.find((e) => e.id === selectedEmailId) ?? null,
    [emails, selectedEmailId],
  );

  // Resolve body content dynamically from JMAP bodyValues using textBody/htmlBody partIds
  const { bodyHtml, bodyText: resolvedBodyText } = useMemo(() => {
    if (!email) return { bodyHtml: "", bodyText: "" };

    // Prefer HTML body, fall back to plain text
    const htmlPartId = email.htmlBody?.[0]?.partId;
    const textPartId = email.textBody?.[0]?.partId;

    const getBodyValue = (partId?: string) => {
      if (!partId) return "";
      const value = email.bodyValues?.[partId]?.value ?? "";
      // Handle base64 encoded bodies (some mail servers return base64)
      try {
        // Check if value looks like base64 (only base64 chars, length multiple of 4)
        if (
          value &&
          /^[A-Za-z0-9+/]+={0,2}$/.test(value) &&
          value.length % 4 === 0 &&
          value.length > 100
        ) {
          return atob(value);
        }
      } catch {
        // Not valid base64, return as-is
      }
      return value;
    };

    return {
      bodyHtml: getBodyValue(htmlPartId),
      bodyText: getBodyValue(textPartId),
    };
  }, [email]);

  if (!email) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          color: "text.secondary",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("noMessageSelected")}
        </Typography>
        <Typography variant="body2">{t("chooseConversation")}</Typography>
      </Box>
    );
  }

  const senderName =
    email.from[0]?.name ?? email.from[0]?.email ?? t("unknownSender");
  const senderEmail = email.from[0]?.email ?? "";
  const senderInitial = senderName.charAt(0).toUpperCase();

  // Prefer HTML for rendering, fall back to plain text
  const bodyContent = bodyHtml || resolvedBodyText || t("noContent");
  const isHtml = !!bodyHtml;

  const isFlagged = !!email.keywords.$flagged;

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

  let formattedDate: string;
  try {
    formattedDate = format(parseISO(email.date), "MMM d, yyyy 'at' HH:mm");
  } catch {
    formattedDate = email.date;
  }

  const toRecipients = email.to.map((a) => a.name || a.email).join(", ");
  const ccRecipients = email.cc?.map((a) => a.name || a.email).join(", ");

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 2,
          py: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          onClick={() =>
            openCompose({
              mode: "reply",
              to: senderEmail,
              subject: `Re: ${email.subject}`,
              inReplyTo: email.messageId,
              references: [...(email.references ?? []), email.messageId],
            })
          }
          title={t("reply")}
        >
          <ReplyRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() =>
            openCompose({
              mode: "replyAll",
              to: senderEmail,
              subject: `Re: ${email.subject}`,
              inReplyTo: email.messageId,
              references: [...(email.references ?? []), email.messageId],
            })
          }
          title={t("replyAll")}
        >
          <ReplyAllRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() =>
            openCompose({
              mode: "forward",
              subject: `Fwd: ${email.subject}`,
              body: resolvedBodyText,
            })
          }
          title={t("forward")}
        >
          <ForwardRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small">
          <ArchiveRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <IconButton size="small">
          <DeleteRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <IconButton size="small">
          <StarRounded
            sx={{
              fontSize: "1.25rem",
              color: isFlagged ? "warning.main" : "action.active",
            }}
          />
        </IconButton>
        <IconButton size="small">
          <MoreVertRounded sx={{ fontSize: "1.25rem" }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {/* Subject */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}
        >
          {email.subject}
        </Typography>

        {/* Sender + Date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: "1rem",
              fontWeight: 700,
              bgcolor: senderColors[colorIndex],
              color: "#fff",
            }}
          >
            {senderInitial}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {senderName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                &lt;{senderEmail}&gt;
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        {/* Recipients */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" component="span">
            {t("toLabel")}&nbsp;
          </Typography>
          <Typography variant="caption" component="span">
            {toRecipients}
          </Typography>
          {ccRecipients && (
            <>
              <br />
              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
              >
                {t("ccLabel")}&nbsp;
              </Typography>
              <Typography variant="caption" component="span">
                {ccRecipients}
              </Typography>
            </>
          )}
        </Box>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {email.attachments.map((att) => (
                <Chip
                  key={att.partId}
                  icon={<AttachFileRounded sx={{ fontSize: "1rem" }} />}
                  label={`${att.type.split("/").pop()} (${formatBytes(att.size)})`}
                  size="small"
                  variant="outlined"
                  deleteIcon={<DownloadRounded sx={{ fontSize: "0.875rem" }} />}
                  onDelete={() => {}}
                />
              ))}
            </Box>
            <Divider sx={{ mt: 1.5 }} />
          </Box>
        )}

        {/* Body */}
        <Box
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "text.primary",
            whiteSpace: isHtml ? "normal" : "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {isHtml ? (
            <Box
              component="iframe"
              sandbox=""
              srcDoc={bodyContent}
              title={email.subject}
              sx={{
                width: "100%",
                minHeight: 320,
                border: 0,
              }}
            />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{bodyContent}</span>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
