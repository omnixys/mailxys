import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export const listItemComponents = (theme: Theme) => ({
  styleOverrides: {
    root: {
      borderRadius: 8,
      margin: "2px 8px",
      padding: "6px 12px",
      transition: "all 150ms ease",
      color: theme.palette.text.secondary,
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha("#FFFFFF", 0.06)
            : alpha("#6A4BBC", 0.06),
        color: theme.palette.text.primary,
      },
      "&.Mui-selected": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha("#6A4BBC", 0.2)
            : alpha("#6A4BBC", 0.1),
        color: theme.palette.primary.main,
        fontWeight: 600,
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha("#6A4BBC", 0.28)
              : alpha("#6A4BBC", 0.14),
        },
      },
    },
  },
});
