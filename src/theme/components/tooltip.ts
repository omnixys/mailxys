import type { Theme } from "@mui/material/styles";

export const tooltipComponents = (theme: Theme) => ({
  defaultProps: {
    arrow: true,
    enterDelay: 400,
    enterNextDelay: 100,
  },
  styleOverrides: {
    tooltip: {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(30, 30, 34, 0.95)"
          : "rgba(49, 46, 129, 0.92)",
      fontSize: "0.75rem",
      fontWeight: 500,
      borderRadius: 6,
      padding: "6px 10px",
      lineHeight: 1.4,
      backdropFilter: "blur(8px)",
      border: `1px solid ${
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(255, 255, 255, 0.12)"
      }`,
    },
    arrow: {
      color:
        theme.palette.mode === "dark"
          ? "rgba(30, 30, 34, 0.95)"
          : "rgba(49, 46, 129, 0.92)",
    },
  },
});
