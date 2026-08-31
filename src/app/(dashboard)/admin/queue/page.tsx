"use client";

import { RefreshRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useCallback } from "react";
import { adminClient } from "@/api/admin/adminClient";
import { useAdminList } from "@/features/admin/hooks/useAdminList";
import { toStalwartQueuedMessage } from "@/features/admin/lib/adapters";
import type { StalwartQueuedMessage } from "@/features/admin/types";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

const statusColors: Record<string, { bg: string; color: string }> = {
  queued: { bg: "#3B82F615", color: "#3B82F6" },
  deferred: { bg: "#F59E0B15", color: "#F59E0B" },
  failed: { bg: "#EF444415", color: "#EF4444" },
  "in-progress": { bg: "#22C55E15", color: "#22C55E" },
  completed: { bg: "#22C55E15", color: "#22C55E" },
  bounce: { bg: "#EF444415", color: "#EF4444" },
};

export default function QueuePage() {
  const theme = useTheme();
  const t = useTypedTranslations("admin");
  const {
    data: rawQueue,
    loading,
    error,
    refetch,
  } = useAdminList(useCallback(() => adminClient.getQueue(), []));
  const items = rawQueue.map(toStalwartQueuedMessage);

  const columns: Column<StalwartQueuedMessage>[] = [
    {
      id: "from",
      label: t("senderAddress"),
      sortable: true,
      accessor: (row) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, fontSize: "0.8125rem" }}
        >
          {row.from}
        </Typography>
      ),
    },
    {
      id: "to",
      label: t("recipientCount"),
      sortable: true,
      accessor: (row) => (
        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
          {Array.isArray(row.to) ? row.to.join(", ") : row.to}
        </Typography>
      ),
    },
    {
      id: "size",
      label: t("messageSize"),
      sortable: true,
      align: "right",
      accessor: (row) => (
        <Typography variant="caption" color="text.secondary">
          {row.size > 1024
            ? `${(row.size / 1024).toFixed(1)} KB`
            : `${row.size} B`}
        </Typography>
      ),
    },
    {
      id: "created",
      label: t("created"),
      sortable: true,
      sortAccessor: (row) => row.created,
      accessor: (row) => {
        let time: string;
        try {
          time = formatDistanceToNow(parseISO(row.created), {
            addSuffix: true,
          });
        } catch {
          time = row.created;
        }
        return (
          <Typography variant="caption" color="text.secondary">
            {time}
          </Typography>
        );
      },
    },
    {
      id: "status",
      label: t("status"),
      sortable: true,
      accessor: (row) => {
        const cfg = statusColors[row.status] ?? {
          bg: theme.palette.action.hover,
          color: theme.palette.text.secondary,
        };
        return (
          <Chip
            label={`${row.status}${row.retryCount > 0 ? ` (${row.retryCount})` : ""}`}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 600,
              bgcolor: cfg.bg,
              color: cfg.color,
            }}
          />
        );
      },
    },
  ];

  return (
    <Box>
      <SectionHeader
        title={t("queueTitle")}
        description={t("queueCount", { count: items.length })}
        action={
          <Button
            startIcon={<RefreshRounded />}
            variant="outlined"
            size="small"
            onClick={refetch}
          >
            {t("refresh")}
          </Button>
        }
      />
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              {t("retry")}
            </Button>
          }
        >
          {t(error === "sessionExpired" ? "sessionExpired" : "loadFailed")}
        </Alert>
      )}
      {loading && (
        <CircularProgress
          size={24}
          sx={{ position: "absolute", top: 16, right: 16 }}
        />
      )}
      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder={t("queueEmpty")}
        searchAccessor={(row) =>
          `${row.from} ${Array.isArray(row.to) ? row.to.join(" ") : row.to}`
        }
        rowsPerPage={10}
        emptyMessage={t("queueEmpty")}
      />
    </Box>
  );
}
