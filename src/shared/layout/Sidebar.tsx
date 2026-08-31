"use client";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getAuthenticatedUserProfile } from "@/auth/profile";
import { useAuth } from "@/auth/providers/AuthProvider";
import { usePermissions } from "@/auth/providers/PermissionProvider";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { navItems } from "@/shared/navigation/navItems";
import { useSidebarStore } from "@/store/useSidebarStore";
import SidebarItem from "./SidebarItem";

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

export default function Sidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  const { user } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const t = useTypedTranslations("nav");
  const profile = getAuthenticatedUserProfile(user);

  const filteredSections = useMemo(() => {
    return navItems
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => !item.permissions || hasAnyPermission(item.permissions),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasAnyPermission]);

  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: isCollapsed ? 2 : 3,
          py: 2.5,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            background: "linear-gradient(135deg, #6A4BBC 0%, #8B5CF6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{ color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}
          >
            O
          </Typography>
        </Box>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Omnixys
            </Typography>
          </motion.div>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.divider,
            borderRadius: 2,
          },
        }}
      >
        {filteredSections.map((section) => (
          <Box key={section.sectionKey} sx={{ mb: 1 }}>
            {!isCollapsed && (
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  py: 1,
                  display: "block",
                  color: "text.secondary",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontSize: "0.6875rem",
                }}
              >
                {t(section.sectionKey as never)}
              </Typography>
            )}
            {section.items.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                isActive={pathname === item.path}
                isCollapsed={isCollapsed}
                label={t(item.labelKey as never)}
              />
            ))}
          </Box>
        ))}
      </Box>

      <Divider />

      {/* User Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: isCollapsed ? 2 : 2.5,
          py: 2,
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
          {profile?.initials}
        </Avatar>
        {!isCollapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile?.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {profile?.email}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
