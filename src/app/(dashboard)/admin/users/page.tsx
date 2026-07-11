"use client";

import {
  AddRounded,
  BlockRounded,
  CheckCircleRounded,
  DeleteRounded,
  EditRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import {
  Avatar,
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
import { mockAccounts } from "@/features/admin/constants/mockData";
import type { StalwartAccount } from "@/features/admin/types";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

export default function UsersPage() {
  const theme = useTheme();
  const [accounts, setAccounts] = useState(mockAccounts);
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
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, disabled: !a.disabled } : a)),
    );
    handleMenuClose();
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    handleMenuClose();
  };

  const columns: Column<StalwartAccount>[] = [
    {
      id: "name",
      label: "Account",
      sortable: true,
      accessor: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 700,
              bgcolor:
                row.typ === "group"
                  ? theme.palette.info.main
                  : theme.palette.primary.main,
              color: "#fff",
            }}
          >
            {row.name.charAt(0).toUpperCase()}
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
      id: "type",
      label: "Type",
      sortable: true,
      sortAccessor: (row) => row.typ,
      accessor: (row) => (
        <Chip
          label={row.typ}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "capitalize",
            bgcolor: `${theme.palette.primary.main}10`,
            color: theme.palette.primary.main,
          }}
        />
      ),
    },
    {
      id: "role",
      label: "Role",
      sortable: true,
      sortAccessor: (row) => row.role ?? "",
      accessor: (row) => (
        <Chip
          label={row.role ?? "user"}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "capitalize",
            bgcolor:
              row.role === "admin"
                ? `${theme.palette.error.main}10`
                : `${theme.palette.success.main}10`,
            color: row.role === "admin" ? "error.main" : "success.main",
          }}
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      sortAccessor: (row) => (row.disabled ? "disabled" : "active"),
      accessor: (row) => (
        <Chip
          icon={
            row.disabled ? undefined : (
              <CheckCircleRounded sx={{ fontSize: "0.875rem" }} />
            )
          }
          label={row.disabled ? "Disabled" : "Active"}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: row.disabled
              ? `${theme.palette.warning.main}10`
              : `${theme.palette.success.main}10`,
            color: row.disabled ? "warning.main" : "success.main",
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
        title="Users"
        description={`${accounts.length} accounts configured`}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            Add User
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={accounts}
        searchPlaceholder="Search users..."
        searchAccessor={(row) => `${row.name} ${row.description ?? ""}`}
        rowsPerPage={10}
      />

      {/* Context Menu */}
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
            {accounts.find((a) => a.id === selectedId)?.disabled ? (
              <CheckCircleRounded sx={{ fontSize: "1.125rem" }} />
            ) : (
              <BlockRounded sx={{ fontSize: "1.125rem" }} />
            )}
          </ListItemIcon>
          <ListItemText>
            {accounts.find((a) => a.id === selectedId)?.disabled
              ? "Enable"
              : "Disable"}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditRounded sx={{ fontSize: "1.125rem" }} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
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
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
