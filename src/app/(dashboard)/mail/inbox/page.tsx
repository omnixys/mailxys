"use client";

import { Alert, Box, CircularProgress, useTheme } from "@mui/material";
import { useEffect } from "react";
import { jmapClient, MailClientError } from "@/api/jmap/jmapClient";
import { ComposeDrawer } from "@/features/mail/components/ComposeDrawer";
import { MailboxList } from "@/features/mail/components/MailboxList";
import { MailToolbar } from "@/features/mail/components/MailToolbar";
import { MessageDetail } from "@/features/mail/components/MessageDetail";
import { MessageList } from "@/features/mail/components/MessageList";
import { useMailStore } from "@/features/mail/store/useMailStore";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

export function MailPage({ initialRole = "inbox" }: { initialRole?: string }) {
  const theme = useTheme();
  const {
    setMailboxes,
    setEmails,
    selectedMailboxId,
    selectMailbox,
    setLoading,
    setError,
    resetMail,
    refreshVersion,
    loading,
    error,
  } = useMailStore();
  const _t = useTypedTranslations("mail");

  useEffect(() => {
    void refreshVersion;
    let active = true;
    setLoading(true);
    jmapClient
      .getMailboxes()
      .then((mailboxes) => {
        if (!active) return;
        setMailboxes(mailboxes);
        if (
          !selectedMailboxId ||
          !mailboxes.some(({ id }) => id === selectedMailboxId)
        ) {
          const inbox =
            mailboxes.find(({ role }) => role === initialRole) ??
            mailboxes.find(({ role }) => role === "inbox") ??
            mailboxes[0];
          if (inbox) selectMailbox(inbox.id);
        }
        setError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof MailClientError && error.status === 401) {
          resetMail();
          setError("Session expired — please reload the page");
          return;
        }
        setError(
          error instanceof Error ? error.message : "Mailbox loading failed",
        );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [
    initialRole,
    refreshVersion,
    resetMail,
    selectMailbox,
    selectedMailboxId,
    setError,
    setLoading,
    setMailboxes,
  ]);

  useEffect(() => {
    void refreshVersion;
    if (!selectedMailboxId) return;
    let active = true;
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const emails = await jmapClient.getMessages(selectedMailboxId);
        if (active) {
          setEmails(emails);
          setError(null);
        }
      } catch (error) {
        if (!active) return;
        if (error instanceof MailClientError && error.status === 401) {
          resetMail();
          setError("Session expired — please reload the page");
          return;
        }
        setError(
          error instanceof Error ? error.message : "Message loading failed",
        );
      }
    };
    void load();
    const interval = window.setInterval(load, 30_000);
    document.addEventListener("visibilitychange", load);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", load);
    };
  }, [refreshVersion, resetMail, selectedMailboxId, setEmails, setError]);

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        height: "100%",
        m: -3,
        overflow: "hidden",
        bgcolor: theme.palette.background.default,
      }}
    >
      {loading && (
        <CircularProgress
          size={24}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}
        />
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ position: "absolute", top: 16, left: "50%", zIndex: 2 }}
        >
          {error}
        </Alert>
      )}
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

export default function InboxPage() {
  return <MailPage />;
}
