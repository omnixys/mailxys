"use client";

import type { PaletteMode } from "@mui/material";
import { create } from "zustand";

const STORAGE_KEY = "omnixys.theme.mode";

interface ThemeState {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
}

function getInitialMode(): PaletteMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialMode(),
  toggleMode: () =>
    set((state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, newMode);
      return { mode: newMode };
    }),
  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    set({ mode });
  },
}));
