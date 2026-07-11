"use client";

import { Box, useTheme } from "@mui/material";
import { useSidebarStore } from "@/store/useSidebarStore";
import Header from "./Header";
import Sidebar from "./Sidebar";

const COLLAPSED_WIDTH = 72;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { isCollapsed } = useSidebarStore();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          ml: `${isCollapsed ? COLLAPSED_WIDTH : 0}px`,
          transition: theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: "auto",
            backgroundColor: theme.palette.background.default,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
