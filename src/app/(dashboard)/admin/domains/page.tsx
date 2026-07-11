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
import { mockDomains } from "@/features/admin/constants/mockData";
import type { StalwartDomain } from "@/features/admin/types";
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

export default function DomainsPage() {
  const theme = useTheme();
  const [domains, setDomains] = useState(mockDomains);
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
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)),
    );
    handleMenuClose();
  };

  const handleDelete = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
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
      label: "Domain",
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
      label: "Plan",
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
      id: "maxUsers",
      label: "Users",
      sortable: true,
      sortAccessor: (row) => row.maxUsers ?? 0,
      width: 140,
      accessor: (row) => {
        const usage = Math.floor(Math.random() * (row.maxUsers ?? 10));
        const pct = Math.round((usage / (row.maxUsers ?? 10)) * 100);
        return (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {usage} / {row.maxUsers ?? "N/A"}
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
                  bgcolor:
                    pct > 80
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      id: "status",
      label: "Status",
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
          label={row.enabled ? "Active" : "Disabled"}
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
        title="Domains"
        description={`${domains.length} domains configured`}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            Add Domain
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={domains}
        searchPlaceholder="Search domains..."
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
              ? "Disable"
              : "Enable"}
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
