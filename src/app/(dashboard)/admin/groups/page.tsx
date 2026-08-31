"use client";

import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  GroupRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
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
import { toStalwartGroup } from "@/features/admin/lib/adapters";
import type { StalwartGroup } from "@/features/admin/types";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

const GROUP_COLORS = ["#3B82F6", "#8B5CF6", "#22C55E", "#EF4444", "#F59E0B"];

export default function GroupsPage() {
  const theme = useTheme();
  const t = useTypedTranslations("admin");
  const {
    data: rawGroups,
    loading,
    error,
    refetch,
  } = useAdminList(useCallback(() => adminClient.getGroups(), []));
  const groups = rawGroups.map(toStalwartGroup);
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
    void adminClient.deleteGroup(id).then(() => refetch());
    handleMenuClose();
  };

  const columns: Column<StalwartGroup>[] = [
    {
      id: "name",
      label: t("groupName"),
      sortable: true,
      accessor: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 700,
              bgcolor: `${GROUP_COLORS[groups.indexOf(row) % GROUP_COLORS.length]}18`,
              color: GROUP_COLORS[groups.indexOf(row) % GROUP_COLORS.length],
            }}
          >
            <GroupRounded sx={{ fontSize: "1rem" }} />
          </Avatar>
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
      id: "description",
      label: t("description"),
      sortable: true,
      accessor: (row) => (
        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
          {row.description ?? "—"}
        </Typography>
      ),
    },
    {
      id: "members",
      label: t("members"),
      sortable: true,
      sortAccessor: (row) => row.members.length,
      accessor: (row) => (
        <Chip
          label={t("usersCount", { count: row.members.length })}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: `${theme.palette.primary.main}10`,
            color: theme.palette.primary.main,
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
        title={t("groupsTitle")}
        description={t("groupsCount", { count: groups.length })}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            {t("addGroup")}
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
        data={groups}
        searchPlaceholder={t("searchGroups")}
        searchAccessor={(row) => `${row.name} ${row.description ?? ""}`}
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
