export const chartTheme = {
  colors: ["#6A4BBC", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#EC4899"],
  grid: { stroke: "#E5E7EB", strokeDasharray: "3 3" },
  axis: { stroke: "#E5E7EB" },
  tick: { fill: "#6B7280", fontSize: 12 },
  tooltip: {
    contentStyle: {
      backgroundColor: "#1F2937",
      border: "none",
      borderRadius: 8,
      color: "#F9FAFB",
      fontSize: 13,
      padding: "8px 12px",
    },
  },
  area: (color: string) => ({
    stroke: color,
    fillOpacity: 0.1,
    fill: `url(#gradient-${color.replace("#", "")})`,
  }),
  darkGrid: { stroke: "#374151", strokeDasharray: "3 3" },
  darkAxis: { stroke: "#374151" },
};
