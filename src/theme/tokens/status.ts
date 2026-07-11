export const statusColors = {
  light: {
    success: { main: "#22C55E", light: "#DCFCE7", dark: "#166534" },
    warning: { main: "#F59E0B", light: "#FEF3C7", dark: "#92400E" },
    error: { main: "#EF4444", light: "#FEE2E2", dark: "#991B1B" },
    info: { main: "#3B82F6", light: "#DBEAFE", dark: "#1E40AF" },
  },
  dark: {
    success: {
      main: "#4ADE80",
      light: "rgba(74, 222, 128, 0.12)",
      dark: "#22C55E",
    },
    warning: {
      main: "#FBBF24",
      light: "rgba(251, 191, 36, 0.12)",
      dark: "#F59E0B",
    },
    error: {
      main: "#F87171",
      light: "rgba(248, 113, 113, 0.12)",
      dark: "#EF4444",
    },
    info: {
      main: "#60A5FA",
      light: "rgba(96, 165, 250, 0.12)",
      dark: "#3B82F6",
    },
  },
} as const;
