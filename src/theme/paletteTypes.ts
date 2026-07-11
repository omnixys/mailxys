export interface ColorScale {
  primary: string;
  secondary: string;

  backgroundDefault: string;
  backgroundPaper: string;

  textPrimary: string;
  textSecondary: string;

  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface ColorPreset {
  light: ColorScale;
  dark: ColorScale;
}

export interface OmnixysExtendedPalette {
  surface: {
    level1: string;
    level2: string;
    level3: string;
  };
  border: {
    subtle: string;
    strong: string;
  };
}

export interface OmnixysVisualTokens {
  glow: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradient: {
    orb: [string, string, string];
    rays: [string, string, string];
  };
  shadow: {
    glow: string;
  };
}

export interface OmnixysPresetExtended extends ColorPreset {
  visual: {
    light: OmnixysVisualTokens;
    dark: OmnixysVisualTokens;
  };
}
