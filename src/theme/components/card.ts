import type { Theme } from "@mui/material/styles";

export const cardComponents = (_theme: Theme) => ({
  styleOverrides: {
    root: {
      borderRadius: 12,
      backgroundImage: "none",
      border: "1px solid",
      borderColor: "divider",
      transition: "all 200ms ease",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
      },
    },
  },
});
