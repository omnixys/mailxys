export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const layout = {
  sidebar: {
    width: 260,
    collapsedWidth: 72,
  },
  header: {
    height: 64,
  },
  mobileNav: {
    height: 56,
  },
} as const;
