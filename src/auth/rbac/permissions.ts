export const PERMISSIONS = {
  MAIL_READ: "mail.read",
  MAIL_WRITE: "mail.write",
  MAIL_DELETE: "mail.delete",
  MAIL_SEND: "mail.send",

  ADMIN_USERS_READ: "admin.users.read",
  ADMIN_USERS_WRITE: "admin.users.write",
  ADMIN_DOMAINS_READ: "admin.domains.read",
  ADMIN_DOMAINS_WRITE: "admin.domains.write",
  ADMIN_QUEUE_READ: "admin.queue.read",
  ADMIN_QUEUE_MANAGE: "admin.queue.manage",
  ADMIN_MONITORING: "admin.monitoring",
  ADMIN_ROLES: "admin.roles",
  ADMIN_QUOTAS: "admin.quotas",
  ADMIN_DKIM: "admin.dkim",
  ADMIN_SPAM: "admin.spam",
  ADMIN_NETWORK: "admin.network",
  ADMIN_STORAGE: "admin.storage",

  SYSTEM_SETTINGS: "system.settings",
  SYSTEM_ANALYTICS: "system.analytics",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
