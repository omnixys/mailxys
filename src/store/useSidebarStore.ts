"use client";

import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggle: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),
  collapse: () => set({ isCollapsed: true }),
  expand: () => set({ isCollapsed: false }),
  setOpen: (open) => set({ isOpen: open }),
}));
