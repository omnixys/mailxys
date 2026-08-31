"use client";

import {
  AddRounded,
  CheckCircleRounded,
  DeleteRounded,
  EditRounded,
  LanguageRounded,
  MoreVertRounded,
  WarningRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useState } from "react";
import { adminClient } from "@/api/admin/adminClient";
import { useAdminList } from "@/features/admin/hooks/useAdminList";
import { toStalwartDomain } from "@/features/admin/lib/adapters";
import type { StalwartDomain } from "@/features/admin/types";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

export default function DomainsPage() {
  const theme = useTheme();
  const t = useTypedTranslations("admin");
  const {
    data: rawDomains,
    loading,
    error,
    refetch,
  } = useAdminList(useCallback(() => adminClient.getDomains(), []));
  const domains = rawDomains.map(toStalwartDomain);
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

  const handleToggle = (id: string) => {
    const domain = domains.find((d) => d.id === id);
    if (domain) {
      void adminClient
        .setDomainEnabled(id, !domain.enabled)
        .then(() => refetch());
    }
    handleMenuClose();
  };

  const handleDelete = (id: string) => {
    void adminClient.deleteDomain(id).then(() => refetch());
    handleMenuClose();
  };

  const planColors: Record<string, string> = {
    Enterprise: theme.palette.primary.main,
    Professional: "#3B82F6",
    Starter: "#22C55E",
  };

  const columns: Column<StalwartDomain>[] = [
    {
      id: "domain",
      label: t("domain"),
      sortable: true,
      accessor: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: row.enabled
                ? `${theme.palette.primary.main}10`
                : `${theme.palette.action.hover}`,
            }}
          >
            <LanguageRounded
              sx={{
                fontSize: "1rem",
                color: row.enabled ? "primary.main" : "text.secondary",
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
            >
              {row.name}
            </Typography>
            {row.description && (
              <Typography variant="caption" color="text.secondary">
                {row.description}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: "plan",
      label: t("plan"),
      sortable: true,
      sortAccessor: (row) => row.plan ?? "",
      accessor: (row) => (
        <Chip
          label={row.plan ?? "Free"}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: `${planColors[row.plan ?? "Starter"] ?? planColors.Starter}15`,
            color: planColors[row.plan ?? "Starter"] ?? planColors.Starter,
          }}
        />
      ),
    },
    {
      id: "status",
      label: t("status"),
      sortable: true,
      sortAccessor: (row) => (row.enabled ? "active" : "disabled"),
      accessor: (row) => (
        <Chip
          icon={
            row.enabled ? (
              <CheckCircleRounded sx={{ fontSize: "0.875rem" }} />
            ) : (
              <WarningRounded sx={{ fontSize: "0.875rem" }} />
            )
          }
          label={row.enabled ? t("active") : t("disabled")}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: row.enabled
              ? `${theme.palette.success.main}10`
              : `${theme.palette.warning.main}10`,
            color: row.enabled ? "success.main" : "warning.main",
            "& .MuiChip-icon": { color: "inherit" },
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
        title={t("domainsTitle")}
        description={t("domainsCount", { count: domains.length })}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            {t("addDomain")}
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
        data={domains}
        searchPlaceholder={t("searchDomains")}
        searchAccessor={(row) => `${row.name} ${row.description ?? ""}`}
        rowsPerPage={10}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedId) handleToggle(selectedId);
          }}
        >
          <ListItemIcon>
            {domains.find((d) => d.id === selectedId)?.enabled ? (
              <WarningRounded sx={{ fontSize: "1.125rem" }} />
            ) : (
              <CheckCircleRounded sx={{ fontSize: "1.125rem" }} />
            )}
          </ListItemIcon>
          <ListItemText>
            {domains.find((d) => d.id === selectedId)?.enabled
              ? t("disable")
              : t("enable")}
          </ListItemText>
        </MenuItem>
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
