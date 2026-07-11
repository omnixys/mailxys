export const STORAGE_KEYS = {
  THEME_MODE: "omnixys.theme.mode",
  THEME_SCHEME: "omnixys.theme.scheme",
  SIDEBAR_COLLAPSED: "omnixys.sidebar.collapsed",
  SIDEBAR_OPEN: "omnixys.sidebar.open",
  LOCALE: "omnixys.locale",
  LAST_PATH: "omnixys.lastPath",
} as const;

export const APP_CONFIG = {
  NAME: "Omnixys Mail",
  VERSION: "0.1.0",
  DESCRIPTION: "Enterprise Webmail & Mail Server Administration",
  API_TIMEOUT: 10000,
  DEBOUNCE_MS: 300,
  PAGE_SIZE: 25,
  MAX_UPLOAD_SIZE_MB: 25,
} as const;
