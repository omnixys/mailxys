"use client";

import {
  Badge,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Link from "next/link";
import type { NavItem } from "@/shared/navigation/navItems";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  label: string;
}

export default function SidebarItem({
  item,
  isActive,
  isCollapsed,
  label,
}: SidebarItemProps) {
  const theme = useTheme();
  const Icon = item.icon;

  return (
    <ListItemButton
      component={Link}
      href={item.path}
      selected={isActive}
      sx={{
        mx: 1,
        my: 0.25,
        px: isCollapsed ? 1.5 : 2,
        py: 1,
        borderRadius: 1.5,
        justifyContent: isCollapsed ? "center" : "flex-start",
        minHeight: 40,
        transition: "all 150ms ease",
        color: isActive
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
        backgroundColor: isActive
          ? alpha(theme.palette.primary.main, 0.08)
          : "transparent",
        "&:hover": {
          backgroundColor: isActive
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.primary.main, 0.04),
        },
        "&.Mui-selected": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? 0 : 36,
          color: "inherit",
          justifyContent: "center",
        }}
      >
        <Badge
          badgeContent={item.badge}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.625rem",
              height: 16,
              minWidth: 16,
            },
          }}
        >
          <Icon fontSize="small" />
        </Badge>
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          primary={label}
          slotProps={{
            primary: {
              sx: {
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 500,
              },
            },
          }}
        />
      )}
    </ListItemButton>
  );
}
