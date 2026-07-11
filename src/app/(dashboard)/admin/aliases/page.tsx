"use client";

import {
  AddRounded,
  AlternateEmailRounded,
  DeleteRounded,
  EditRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { mockAliases } from "@/features/admin/constants/mockData";
import type { StalwartAlias } from "@/features/admin/types";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

export default function AliasesPage() {
  const theme = useTheme();
  const t = useTypedTranslations("admin");
  const [aliases, setAliases] = useState(mockAliases);
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
    setAliases((prev) => prev.filter((a) => a.id !== id));
    handleMenuClose();
  };

  const columns: Column<StalwartAlias>[] = [
    {
      id: "alias",
      label: t("aliasesTitle"),
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
              bgcolor: `${theme.palette.primary.main}10`,
            }}
          >
            <AlternateEmailRounded
              sx={{ fontSize: "1rem", color: "primary.main" }}
            />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
            >
              {row.name}@{row.domain}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "domain",
      label: t("domain"),
      sortable: true,
      accessor: (row) => (
        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
          {row.domain}
        </Typography>
      ),
    },
    {
      id: "addresses",
      label: t("forwardingAddress"),
      accessor: (row) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {row.addresses.map((addr) => (
            <Chip
              key={addr}
              label={addr}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                bgcolor: theme.palette.action.hover,
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      id: "status",
      label: t("status"),
      sortable: true,
      sortAccessor: (row) => (row.enabled ? "active" : "disabled"),
      accessor: (row) => (
        <Chip
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
        title={t("aliasesTitle")}
        description={t("aliasesCount", { count: aliases.length })}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            {t("addAlias")}
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={aliases}
        searchPlaceholder={t("searchAliases")}
        searchAccessor={(row) =>
          `${row.name}@${row.domain} ${row.addresses.join(" ")}`
        }
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
