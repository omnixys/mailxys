import type { PaletteMode } from "@mui/material";

export const createShadows = (mode: PaletteMode) => {
  const isDark = mode === "dark";

  return [
    "none",
    isDark ? "0 1px 2px rgba(0, 0, 0, 0.40)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
    isDark
      ? "0 1px 3px rgba(0, 0, 0, 0.50), 0 1px 2px rgba(0, 0, 0, 0.40)"
      : "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
    isDark ? "0 4px 6px rgba(0, 0, 0, 0.50)" : "0 4px 6px rgba(0, 0, 0, 0.06)",
    isDark
      ? "0 4px 6px rgba(0, 0, 0, 0.50), 0 2px 4px rgba(0, 0, 0, 0.40)"
      : "0 4px 6px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)",
    isDark
      ? "0 10px 15px rgba(0, 0, 0, 0.50)"
      : "0 10px 15px rgba(0, 0, 0, 0.06)",
    isDark
      ? "0 10px 15px rgba(0, 0, 0, 0.50), 0 4px 6px rgba(0, 0, 0, 0.40)"
      : "0 10px 15px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.04)",
    isDark
      ? "0 20px 25px rgba(0, 0, 0, 0.50)"
      : "0 20px 25px rgba(0, 0, 0, 0.08)",
    isDark
      ? "0 20px 25px rgba(0, 0, 0, 0.50), 0 8px 10px rgba(0, 0, 0, 0.40)"
      : "0 20px 25px rgba(0, 0, 0, 0.08), 0 8px 10px rgba(0, 0, 0, 0.04)",
    isDark
      ? "0 25px 50px rgba(0, 0, 0, 0.60)"
      : "0 25px 50px rgba(0, 0, 0, 0.12)",
  ] as const;
};

export type MailShadows = ReturnType<typeof createShadows>;
