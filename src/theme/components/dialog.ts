import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export const dialogComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      "& .MuiBackdrop-root": {
        backgroundColor: alpha(theme.palette.common.black, 0.5),
        backdropFilter: "blur(4px)",
      },
    },
    paper: {
      borderRadius: 16,
      boxShadow: theme.shadows[8],
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
    },
  },
});

export const dialogTitleComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      padding: theme.spacing(3, 3, 1),
      fontSize: "1.125rem",
      fontWeight: 600,
    },
  },
});

export const dialogContentComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      padding: theme.spacing(2, 3),
    },
  },
});

export const dialogActionsComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      padding: theme.spacing(1, 3, 2),
      gap: theme.spacing(1),
    },
  },
});
