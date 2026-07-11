"use client";

import {
  DarkModeRounded,
  KeyboardCommandKeyRounded,
  LightModeRounded,
  LogoutRounded,
  NotificationsRounded,
  PersonRounded,
  SearchRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/auth/providers/AuthProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useThemeMode } from "@/providers/ThemeModeProvider";
import { useCommandPaletteStore } from "@/store/useCommandPaletteStore";

export default function Header() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { open } = useCommandPaletteStore();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        px: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      {/* Left: Search Trigger */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          onClick={open}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            borderRadius: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            cursor: "pointer",
            color: "text.secondary",
            minWidth: 240,
            transition: "all 150ms ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: "action.hover",
            },
          }}
        >
          <SearchRounded fontSize="small" />
          <Typography variant="body2" sx={{ flex: 1, color: "text.secondary" }}>
            Search...
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 0.75,
              py: 0.25,
              borderRadius: 0.75,
              border: `1px solid ${theme.palette.divider}`,
              fontSize: "0.6875rem",
              color: "text.secondary",
            }}
          >
            <KeyboardCommandKeyRounded sx={{ fontSize: "0.75rem" }} />K
          </Box>
        </Box>
      </Box>

      {/* Right: Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={toggleMode}
          sx={{ color: "text.secondary" }}
        >
          {mode === "light" ? (
            <DarkModeRounded fontSize="small" />
          ) : (
            <LightModeRounded fontSize="small" />
          )}
        </IconButton>

        <LanguageSwitcher />

        <IconButton size="small" sx={{ color: "text.secondary" }}>
          <Badge badgeContent={3} color="primary" variant="dot">
            <NotificationsRounded fontSize="small" />
          </Badge>
        </IconButton>

        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: 1,
            px: 1,
            py: 0.5,
            borderRadius: 1.5,
            cursor: "pointer",
            transition: "background 150ms ease",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.primary.main,
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </Avatar>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              },
            },
          }}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <PersonRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <SettingsRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
