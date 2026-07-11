import type { OmnixysPresetExtended } from "@/theme/paletteTypes";

export const omnixysPreset: OmnixysPresetExtended = {
  light: {
    primary: "#6A4BBC",
    secondary: "#4E3792",
    backgroundDefault: "#F8F8FC",
    backgroundPaper: "#FFFFFF",
    textPrimary: "#312E81",
    textSecondary: "#6B7280",
    error: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  dark: {
    primary: "#8B6FD4",
    secondary: "#6A4BBC",
    backgroundDefault: "#0A0A0F",
    backgroundPaper: "#141418",
    textPrimary: "#EDEDED",
    textSecondary: "#9CA3AF",
    error: "#F87171",
    success: "#4ADE80",
    warning: "#FBBF24",
    info: "#60A5FA",
  },
  visual: {
    light: {
      glow: {
        primary: "#6A4BBC",
        secondary: "#4E3792",
        accent: "#A78BFA",
      },
      gradient: {
        orb: ["#6A4BBC", "#8B5CF6", "#C084FC"],
        rays: ["#A78BFA", "#60A5FA", "#F472B6"],
      },
      shadow: {
        glow: "rgba(106, 75, 188, 0.40)",
      },
    },
    dark: {
      glow: {
        primary: "#8B6FD4",
        secondary: "#6A4BBC",
        accent: "#C4B5FD",
      },
      gradient: {
        orb: ["#6A4BBC", "#7C3AED", "#A78BFA"],
        rays: ["#C4B5FD", "#818CF8", "#F472B6"],
      },
      shadow: {
        glow: "rgba(139, 111, 212, 0.35)",
      },
    },
  },
};
