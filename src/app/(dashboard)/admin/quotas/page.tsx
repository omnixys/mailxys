"use client";

import { AddRounded, DataUsageRounded } from "@mui/icons-material";
import type { Theme } from "@mui/material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback } from "react";
import { adminClient } from "@/api/admin/adminClient";
import { useAdminList } from "@/features/admin/hooks/useAdminList";
import type { AdminQuota } from "@/features/admin/types/api";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function UsageBar({
  used,
  limit,
  label,
  theme,
}: {
  used: number;
  limit: number;
  label: string;
  theme: Theme;
}) {
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
  const isWarning = pct > 80;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {pct}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: `${theme.palette.primary.main}10`,
          "& .MuiLinearProgress-bar": {
            borderRadius: 2,
            bgcolor: isWarning
              ? theme.palette.warning.main
              : theme.palette.primary.main,
          },
        }}
      />
    </Box>
  );
}

export default function QuotasPage() {
  const theme = useTheme();
  const t = useTypedTranslations("admin");
  const {
    data: quotas,
    loading,
    error,
    refetch,
  } = useAdminList<AdminQuota>(useCallback(() => adminClient.getQuotas(), []));

  const columns: Column<AdminQuota>[] = [
    {
      id: "name",
      label: t("displayName"),
      sortable: true,
      accessor: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 700,
              bgcolor: `${theme.palette.primary.main}18`,
              color: theme.palette.primary.main,
            }}
          >
            <DataUsageRounded sx={{ fontSize: "1rem" }} />
          </Avatar>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
          >
            {row.quotaType}
          </Typography>
        </Box>
      ),
    },
    {
      id: "type",
      label: t("type"),
      sortable: true,
      accessor: (row) => (
        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
          {row.resourceType}
        </Typography>
      ),
    },
    {
      id: "used",
      label: t("storageUsed"),
      sortable: true,
      sortAccessor: (row) => row.used,
      width: 220,
      accessor: (row) => (
        <UsageBar
          used={row.used}
          limit={row.limit}
          label={`${formatSize(row.used)} / ${formatSize(row.limit)}`}
          theme={theme}
        />
      ),
    },
  ];

  return (
    <Box>
      <SectionHeader
        title={t("quotasTitle")}
        description={t("quotasCount", { count: quotas.length })}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            {t("addQuota")}
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
        data={quotas}
        searchPlaceholder={t("searchQuotas")}
        searchAccessor={(row) => `${row.quotaType} ${row.resourceType}`}
        rowsPerPage={10}
      />
    </Box>
  );
}
