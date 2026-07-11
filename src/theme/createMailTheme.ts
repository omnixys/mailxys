import { createTheme, type PaletteMode } from "@mui/material";
import { buildExtendedPalette } from "@/theme/buildExtendedPalette";
import { omnixysPreset } from "@/theme/tokens/colors";
import { typographyTokens } from "@/theme/tokens/typography";
import { shapeDefaults } from "@/theme/tokens/radius";
import { createShadows } from "@/theme/tokens/shadows";
import { layout } from "@/theme/tokens/breakpoints";
import { createComponentOverrides } from "@/theme/components";

export const createMailTheme = (mode: PaletteMode) => {
  const omni = omnixysPreset[mode];
  const extended = buildExtendedPalette(mode, omni);

  const baseTheme = createTheme({
    palette: {
      mode,
      primary: { main: omni.primary, contrastText: "#FFFFFF" },
      secondary: { main: omni.secondary, contrastText: "#FFFFFF" },
      error: { main: omni.error },
      warning: { main: omni.warning },
      success: { main: omni.success },
      info: { main: omni.info },

      background: {
        default: omni.backgroundDefault,
        paper: omni.backgroundPaper,
      },

      text: {
        primary: omni.textPrimary,
        secondary: omni.textSecondary,
      },

      divider: extended.border.subtle,

      omnixys,
      extended,
    },

    typography: {
      fontFamily: typographyTokens.fontFamily,
      h1: {
        fontSize: "2.25rem",
        fontWeight: typographyTokens.fontWeight.semibold,
        lineHeight: typographyTokens.lineHeight.tight,
        letterSpacing: typographyTokens.letterSpacing.tight,
      },
      h2: {
        fontSize: "1.875rem",
        fontWeight: typographyTokens.fontWeight.semibold,
        lineHeight: typographyTokens.lineHeight.tight,
        letterSpacing: typographyTokens.letterSpacing.tight,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: typographyTokens.fontWeight.semibold,
        lineHeight: typographyTokens.lineHeight.snug,
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: typographyTokens.fontWeight.semibold,
        lineHeight: typographyTokens.lineHeight.snug,
      },
      h5: {
        fontSize: "1.125rem",
        fontWeight: typographyTokens.fontWeight.medium,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: typographyTokens.fontWeight.medium,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: typographyTokens.fontWeight.medium,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: typographyTokens.fontWeight.medium,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: typographyTokens.fontWeight.regular,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: typographyTokens.fontWeight.regular,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      button: {
        fontFamily: typographyTokens.fontFamily,
        fontWeight: typographyTokens.fontWeight.semibold,
        textTransform: "none",
        letterSpacing: typographyTokens.letterSpacing.normal,
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: typographyTokens.fontWeight.regular,
        lineHeight: typographyTokens.lineHeight.normal,
      },
      overline: {
        fontSize: "0.6875rem",
        fontWeight: typographyTokens.fontWeight.semibold,
        letterSpacing: typographyTokens.letterSpacing.widest,
        textTransform: "uppercase",
      },
    },

    shape: {
      ...shapeDefaults,
    },

    shadows: createShadows(mode) as any,

    spacing: 8,

    layout: {
      ...layout,
    } as any,

    mail: {
      sidebar: layout.sidebar,
      header: layout.header,
    },

    omnixys: {
      visual: {
        background: {
          base: omni.backgroundDefault,
        },
        orb: {
          gradient: `radial-gradient(circle, ${omni.primary} 0%, transparent 70%)`,
          glow: omni.primary,
        },
        rays: {
          gradient: `linear-gradient(135deg, ${omni.primary} 0%, transparent 100%)`,
          blur: "80px",
        },
        shader: {
          brightness: mode === "dark" ? 0.8 : 1.0,
          colorA: [106, 75, 188] as const,
          colorB: [139, 92, 246] as const,
        },
        logo: {
          src: "/logo.svg",
          glow: `0 0 20px ${omni.primary}40`,
        },
      },
    },
  });

  baseTheme.components = createComponentOverrides(baseTheme);

  return baseTheme;
};
