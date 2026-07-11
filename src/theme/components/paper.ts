import type { Theme } from "@mui/material/styles";

export const paperComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      backgroundImage: "none",
      borderRadius: 12,
      backgroundColor: theme.palette.background.paper,
    },
    elevation0: {
      boxShadow: "none",
    },
    elevation1: {
      boxShadow: theme.shadows[1],
    },
    elevation2: {
      boxShadow: theme.shadows[2],
    },
    outlined: {
      border: `1px solid ${theme.palette.divider}`,
    },
  },
});
