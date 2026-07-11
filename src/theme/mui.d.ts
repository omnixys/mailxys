import type {
  OmnixysExtendedPalette,
  OmnixysPresetExtended,
} from "@/theme/paletteTypes";

declare module "@mui/material/styles" {
  interface Shape {
    borderRadius2: number | string;
    sectionRadius?: number | string;
    buttonRadius?: number | string;
  }

  interface ShapeOptions {
    borderRadius2?: number | string;
    sectionRadius?: number | string;
    buttonRadius?: number | string;
  }

  interface Theme {
    mail: {
      sidebar: {
        width: number;
        collapsedWidth: number;
      };
      header: {
        height: number;
      };
    };
    omnixys: {
      visual: {
        background: {
          base: string;
        };
        orb: {
          gradient: string;
          glow: string;
        };
        rays: {
          gradient: string;
          blur: string;
        };
        shader: {
          brightness: number;
          colorA: readonly [number, number, number];
          colorB: readonly [number, number, number];
        };
        logo: {
          src: string;
          glow: string;
        };
      };
    };
  }

  interface ThemeOptions {
    mail?: {
      sidebar?: {
        width?: number;
        collapsedWidth?: number;
      };
      header?: {
        height?: number;
      };
    };
    omnixys?: {
      visual?: {
        background?: {
          base?: string;
        };
        orb?: {
          gradient?: string;
          glow?: string;
        };
        rays?: {
          gradient?: string;
          blur?: string;
        };
        shader?: {
          brightness?: number;
          colorA?: readonly [number, number, number];
          colorB?: readonly [number, number, number];
        };
        logo?: {
          src?: string;
          glow?: string;
        };
      };
    };
  }

  interface Palette {
    extended: OmnixysExtendedPalette;
    omnixys: OmnixysPresetExtended;
  }

  interface PaletteOptions {
    extended?: OmnixysExtendedPalette;
    omnixys?: OmnixysPresetExtended;
  }
}
