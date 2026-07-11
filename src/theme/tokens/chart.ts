export const chartColors = {
  primary: "#6A4BBC",
  secondary: "#8B5CF6",
  accent: "#A78BFA",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  palette: [
    "#6A4BBC",
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#14B8A6",
  ],

  gradients: {
    primary: "linear-gradient(135deg, #6A4BBC 0%, #8B5CF6 100%)",
    blue: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    green: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)",
    warm: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  },
} as const;

export const chartDefaults = {
  margin: { top: 5, right: 10, left: 0, bottom: 0 },
  gridStroke: "rgba(0, 0, 0, 0.06)",
  gridStrokeDark: "rgba(255, 255, 255, 0.06)",
  axisStroke: "rgba(0, 0, 0, 0.12)",
  axisStrokeDark: "rgba(255, 255, 255, 0.12)",
  tooltipBg: "#FFFFFF",
  tooltipBgDark: "#1E1E22",
  tooltipBorder: "rgba(0, 0, 0, 0.08)",
  tooltipBorderDark: "rgba(255, 255, 255, 0.12)",
} as const;
