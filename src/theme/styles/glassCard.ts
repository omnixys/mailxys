import type { SxProps, Theme } from "@mui/material/styles";

export const glassCard = (theme: Theme): SxProps<Theme> => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(20, 20, 24, 0.80)"
      : "rgba(255, 255, 255, 0.80)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  transition: "all 200ms ease",
  "&:hover": {
    boxShadow: `0 8px 32px ${
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(0, 0, 0, 0.08)"
    }`,
  },
});

export const gradientBorder = (
  theme: Theme,
  color?: string,
): SxProps<Theme> => ({
  position: "relative",
  background: theme.palette.background.paper,
  border: "none",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1px",
    background:
      color ||
      `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
});
