"use client";

import {
  AddRounded,
  AdminPanelSettingsRounded,
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
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

interface MockRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: number;
  color: string;
}

const mockRoles: MockRole[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: [
      "manage_users",
      "manage_domains",
      "manage_roles",
      "manage_quotas",
      "view_logs",
    ],
    users: 2,
    color: "#EF4444",
  },
  {
    id: "r2",
    name: "Domain Admin",
    description: "Manage domains and domain-level settings",
    permissions: ["manage_domains", "manage_users", "view_logs"],
    users: 3,
    color: "#3B82F6",
  },
  {
    id: "r3",
    name: "Mail Admin",
    description: "Manage mail flow, queues, and routing",
    permissions: ["manage_routes", "manage_queue", "view_logs"],
    users: 5,
    color: "#8B5CF6",
  },
  {
    id: "r4",
    name: "User Manager",
    description: "Create and manage user accounts",
    permissions: ["manage_users", "view_logs"],
    users: 4,
    color: "#22C55E",
  },
  {
    id: "r5",
    name: "Viewer",
    description: "Read-only access to admin dashboard",
    permissions: ["view_logs"],
    users: 8,
    color: "#F59E0B",
  },
];

const permissionColorMap: Record<string, string> = {
  manage_users: "#3B82F6",
  manage_domains: "#8B5CF6",
  manage_roles: "#EF4444",
  manage_quotas: "#F59E0B",
  manage_routes: "#22C55E",
  manage_queue: "#06B6D4",
  view_logs: "#6B7280",
};

export default function RolesPage() {
  const theme = useTheme();
  const t = useTypedTranslations("admin");
  const [roles, setRoles] = useState(mockRoles);
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
    setRoles((prev) => prev.filter((r) => r.id !== id));
    handleMenuClose();
  };

  const columns: Column<MockRole>[] = [
    {
      id: "name",
      label: t("roleName"),
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
            <AdminPanelSettingsRounded sx={{ fontSize: "1rem" }} />
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
            >
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.description}
            </Typography>
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
          {row.description}
        </Typography>
      ),
    },
    {
      id: "permissions",
      label: t("permissions"),
      accessor: (row) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {row.permissions.map((perm) => (
            <Chip
              key={perm}
              label={perm.replace(/_/g, " ")}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "capitalize",
                bgcolor: `${permissionColorMap[perm] ?? theme.palette.grey[500]}12`,
                color: permissionColorMap[perm] ?? theme.palette.grey[600],
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      id: "users",
      label: t("users"),
      sortable: true,
      sortAccessor: (row) => row.users,
      accessor: (row) => (
        <Chip
          label={t("usersCount", { count: row.users })}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 600,
            bgcolor: `${theme.palette.info.main}10`,
            color: theme.palette.info.main,
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
        title={t("rolesTitle")}
        description={t("rolesCount", { count: roles.length })}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            {t("addRole")}
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={roles}
        searchPlaceholder={t("searchRoles")}
        searchAccessor={(row) =>
          `${row.name} ${row.description} ${row.permissions.join(" ")}`
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
