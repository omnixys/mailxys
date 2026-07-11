import type { Theme } from "@mui/material/styles";

export const appBarComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      backgroundImage: "none",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: "none",
    },
  },
});
