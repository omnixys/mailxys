import type { Theme } from "@mui/material/styles";

export const chipComponents = (_theme: Theme) => ({
  styleOverrides: {
    root: {
      borderRadius: 6,
      fontWeight: 500,
      fontSize: "0.75rem",
    },
    sizeSmall: {
      height: 20,
      fontSize: "0.6875rem",
    },
  },
});
