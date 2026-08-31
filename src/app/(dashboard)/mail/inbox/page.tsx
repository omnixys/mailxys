"use client";

import { Alert, Box, Button, CircularProgress, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { jmapClient, MailClientError } from "@/api/jmap/jmapClient";
import { mailErrorTranslationKey } from "@/api/jmap/mailErrorTranslation";
import { ComposeDrawer } from "@/features/mail/components/ComposeDrawer";
import { MailboxList } from "@/features/mail/components/MailboxList";
import { MailToolbar } from "@/features/mail/components/MailToolbar";
import { MessageDetail } from "@/features/mail/components/MessageDetail";
import { MessageList } from "@/features/mail/components/MessageList";
import { useMailStore } from "@/features/mail/store/useMailStore";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

export function MailPage({
  initialRole = "inbox",
  initialCompose = false,
}: {
  initialRole?: string;
  initialCompose?: boolean;
}) {
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
    requestRefresh,
    loading,
    error,
    openCompose,
  } = useMailStore();
  const t = useTypedTranslations("mail");
  const consecutiveMessageFailures = useRef(0);
  const [pollingPaused, setPollingPaused] = useState(false);

  useEffect(() => {
    if (initialCompose) openCompose();
  }, [initialCompose, openCompose]);

  const retryMail = () => {
    consecutiveMessageFailures.current = 0;
    setPollingPaused(false);
    setError(null);
    requestRefresh();
  };

  useEffect(() => {
    void refreshVersion;
    let active = true;
    setLoading(true);
    jmapClient
      .getMailboxes()
      .then((mailboxes) => {
        if (!active) return;
        setMailboxes(mailboxes);
        const currentSelectedMailboxId =
          useMailStore.getState().selectedMailboxId;
        if (
          !currentSelectedMailboxId ||
          !mailboxes.some(({ id }) => id === currentSelectedMailboxId)
        ) {
          const inbox =
            mailboxes.find(({ role }) => role === initialRole) ??
            mailboxes.find(({ role }) => role === "inbox") ??
            mailboxes[0];
          if (inbox) selectMailbox(inbox.id);
        }
        setPollingPaused(false);
        setError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof MailClientError && error.status === 401) {
          resetMail();
          setError(t("sessionExpired"));
          return;
        }
        const translationKey = mailErrorTranslationKey(error);
        setError(t(translationKey ?? "mailboxLoadFailed"));
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
    setError,
    setLoading,
    setMailboxes,
    t,
  ]);

  useEffect(() => {
    void refreshVersion;
    if (!selectedMailboxId || pollingPaused) return;
    let active = true;
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const emails = await jmapClient.getMessages(selectedMailboxId);
        if (active) {
          consecutiveMessageFailures.current = 0;
          setEmails(emails);
          setError(null);
        }
      } catch (error) {
        if (!active) return;
        if (error instanceof MailClientError && error.status === 401) {
          resetMail();
          setPollingPaused(true);
          setError(t("sessionExpired"));
          return;
        }
        if (
          error instanceof MailClientError &&
          (error.status === 502 || error.status === 503)
        ) {
          consecutiveMessageFailures.current += 1;
          if (consecutiveMessageFailures.current >= 3) {
            setPollingPaused(true);
          }
        } else {
          consecutiveMessageFailures.current = 0;
        }
        const translationKey = mailErrorTranslationKey(error);
        setError(t(translationKey ?? "messageLoadFailed"));
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
  }, [
    pollingPaused,
    refreshVersion,
    resetMail,
    selectedMailboxId,
    setEmails,
    setError,
    t,
  ]);

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
          action={
            <Button color="inherit" size="small" onClick={retryMail}>
              {t("retry")}
            </Button>
          }
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
