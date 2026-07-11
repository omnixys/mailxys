import type { Theme } from "@mui/material/styles";

export const buttonComponents = (_theme: Theme) => ({
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      borderRadius: 8,
      padding: "8px 16px",
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: 1.5,
      boxShadow: "none",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        boxShadow: "none",
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    sizeSmall: {
      padding: "4px 10px",
      fontSize: "0.8125rem",
    },
    sizeLarge: {
      padding: "10px 22px",
      fontSize: "0.9375rem",
    },
    containedPrimary: {
      background: "linear-gradient(135deg, #6A4BBC 0%, #8B5CF6 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, #5A3DAA 0%, #7C4EE0 100%)",
      },
    },
    outlinedPrimary: {
      borderWidth: 1.5,
      "&:hover": {
        borderWidth: 1.5,
      },
    },
    textPrimary: {
      "&:hover": {
        backgroundColor: "rgba(106, 75, 188, 0.08)",
      },
    },
  },
});
