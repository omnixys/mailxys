"use client";

import {
  AddRounded,
  DataUsageRounded,
  DeleteRounded,
  EditRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import type { Theme } from "@mui/material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

interface MockQuota {
  id: string;
  name: string;
  type: string;
  storageLimit: number;
  storageUsed: number;
  messageLimit: number;
  messageUsed: number;
  active: boolean;
  color: string;
}

const mockQuotas: MockQuota[] = [
  {
    id: "q1",
    name: "Default",
    type: "Standard",
    storageLimit: 5120,
    storageUsed: 1230,
    messageLimit: 10000,
    messageUsed: 3450,
    active: true,
    color: "#6B7280",
  },
  {
    id: "q2",
    name: "Premium",
    type: "Upgraded",
    storageLimit: 20480,
    storageUsed: 8700,
    messageLimit: 50000,
    messageUsed: 21300,
    active: true,
    color: "#3B82F6",
  },
  {
    id: "q3",
    name: "Enterprise",
    type: "Unlimited",
    storageLimit: 102400,
    storageUsed: 45200,
    messageLimit: 500000,
    messageUsed: 128000,
    active: true,
    color: "#8B5CF6",
  },
  {
    id: "q4",
    name: "Trial",
    type: "Limited",
    storageLimit: 1024,
    storageUsed: 890,
    messageLimit: 1000,
    messageUsed: 870,
    active: true,
    color: "#F59E0B",
  },
  {
    id: "q5",
    name: "VIP",
    type: "Premium",
    storageLimit: 51200,
    storageUsed: 0,
    messageLimit: 200000,
    messageUsed: 0,
    active: false,
    color: "#22C55E",
  },
];

function formatSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
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
  const pct = Math.round((used / limit) * 100);
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
  const [quotas, setQuotas] = useState(mockQuotas);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = (id: string) => {
    setQuotas((prev) => prev.filter((q) => q.id !== id));
    handleMenuClose();
  };

  const columns: Column<MockQuota>[] = [
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
              bgcolor: `${row.color}18`,
              color: row.color,
            }}
          >
            <DataUsageRounded sx={{ fontSize: "1rem" }} />
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
            >
              {row.name}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "type",
      label: t("type"),
      sortable: true,
      accessor: (row) => (
        <Chip
          label={row.type}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: `${row.color}12`,
            color: row.color,
          }}
        />
      ),
    },
    {
      id: "storageLimit",
      label: t("storageLimit"),
      sortable: true,
      sortAccessor: (row) => row.storageLimit,
      width: 180,
      accessor: (row) => (
        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
          >
            {formatSize(row.storageUsed)} / {formatSize(row.storageLimit)}
          </Typography>
          <UsageBar
            used={row.storageUsed}
            limit={row.storageLimit}
            label={t("storageUsed")}
            theme={theme}
          />
        </Box>
      ),
    },
    {
      id: "messageLimit",
      label: t("messageLimit"),
      sortable: true,
      sortAccessor: (row) => row.messageLimit,
      width: 180,
      accessor: (row) => (
        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
          >
            {formatCount(row.messageUsed)} / {formatCount(row.messageLimit)}
          </Typography>
          <UsageBar
            used={row.messageUsed}
            limit={row.messageLimit}
            label={t("messagesUsed")}
            theme={theme}
          />
        </Box>
      ),
    },
    {
      id: "status",
      label: t("status"),
      sortable: true,
      sortAccessor: (row) => (row.active ? "active" : "inactive"),
      accessor: (row) => (
        <Chip
          label={row.active ? t("active") : t("inactive")}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: row.active
              ? `${theme.palette.success.main}10`
              : `${theme.palette.warning.main}10`,
            color: row.active ? "success.main" : "warning.main",
          }}
        />
      ),
    },
    {
      id: "actions",
      label: "",
      width: 48,
      align: "right",
      accessor: (row) => (
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, row.id)}>
          <MoreVertRounded sx={{ fontSize: "1.125rem" }} />
        </IconButton>
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
      <DataTable
        columns={columns}
        data={quotas}
        searchPlaceholder={t("searchQuotas")}
        searchAccessor={(row) => `${row.name} ${row.type}`}
        rowsPerPage={10}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditRounded sx={{ fontSize: "1.125rem" }} />
          </ListItemIcon>
          <ListItemText>{t("edit")}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedId) handleDelete(selectedId);
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteRounded sx={{ fontSize: "1.125rem", color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>{t("delete")}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
