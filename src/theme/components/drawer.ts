import type { Theme } from "@mui/material/styles";

export const drawerComponents = (theme: Theme) => ({
  styleOverrides: {
    paper: {
      border: "none",
      backgroundColor: theme.palette.background.paper,
    },
  },
});
