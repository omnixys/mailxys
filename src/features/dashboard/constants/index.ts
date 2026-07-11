export const DASHBOARD_REFRESH_INTERVAL = 30_000;

export const DASHBOARD_KPI_CARDS = [
  { key: "mailsToday", label: "Mails Today", icon: "MailRounded" },
  { key: "queueSize", label: "Queue Size", icon: "QueueRounded" },
  { key: "activeUsers", label: "Active Users", icon: "PeopleRounded" },
  { key: "storageUsed", label: "Storage Used", icon: "StorageRounded" },
] as const;
