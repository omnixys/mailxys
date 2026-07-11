"use client";

import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  GroupRounded,
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
import { type Column, DataTable } from "@/shared/ui/DataTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";

interface MockGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  created: string;
  color: string;
}

const mockGroups: MockGroup[] = [
  {
    id: "g1",
    name: "Engineering",
    description: "All engineering staff",
    members: 24,
    created: "2025-01-15",
    color: "#3B82F6",
  },
  {
    id: "g2",
    name: "Marketing",
    description: "Marketing and growth team",
    members: 12,
    created: "2025-02-20",
    color: "#8B5CF6",
  },
  {
    id: "g3",
    name: "Support",
    description: "Customer support team",
    members: 18,
    created: "2025-03-10",
    color: "#22C55E",
  },
  {
    id: "g4",
    name: "Admins",
    description: "System administrators",
    members: 4,
    created: "2025-01-01",
    color: "#EF4444",
  },
  {
    id: "g5",
    name: "All Staff",
    description: "Company-wide distribution list",
    members: 58,
    created: "2025-01-01",
    color: "#F59E0B",
  },
];

export default function GroupsPage() {
  const theme = useTheme();
  const [groups, setGroups] = useState(mockGroups);
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
    setGroups((prev) => prev.filter((g) => g.id !== id));
    handleMenuClose();
  };

  const columns: Column<MockGroup>[] = [
    {
      id: "name",
      label: "Name",
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
            <GroupRounded sx={{ fontSize: "1rem" }} />
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
      label: "Description",
      sortable: true,
      accessor: (row) => (
        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
          {row.description}
        </Typography>
      ),
    },
    {
      id: "members",
      label: "Members",
      sortable: true,
      sortAccessor: (row) => row.members,
      accessor: (row) => (
        <Chip
          label={`${row.members} users`}
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
      id: "created",
      label: "Created",
      sortable: true,
      accessor: (row) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8125rem", color: "text.secondary" }}
        >
          {row.created}
        </Typography>
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
        title="Groups"
        description={`${groups.length} groups configured`}
        action={
          <Button startIcon={<AddRounded />} variant="contained" size="small">
            Add Group
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={groups}
        searchPlaceholder="Search groups..."
        searchAccessor={(row) => `${row.name} ${row.description}`}
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
