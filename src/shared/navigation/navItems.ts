import {
  AlternateEmailRounded,
  AnalyticsRounded,
  ArchiveRounded,
  CalendarMonthRounded,
  ChatRounded,
  ContactsRounded,
  DashboardRounded,
  DeleteRounded,
  DraftsRounded,
  EditRounded,
  GroupRounded,
  HelpRounded,
  InboxRounded,
  LanguageRounded,
  MonitorRounded,
  NotificationsRounded,
  PeopleRounded,
  PieChartRounded,
  QueueRounded,
  ReportRounded,
  SendRounded,
  SettingsRounded,
  ShieldRounded,
} from "@mui/icons-material";
import type { ElementType } from "react";
import type { Permission } from "@/auth/rbac/permissions";
import { PERMISSIONS } from "@/auth/rbac/permissions";
import { ROUTES } from "@/constants/routes";

export interface NavItem {
  labelKey: string;
  icon: ElementType;
  path: string;
  permissions?: Permission[];
  badge?: number;
}

export interface NavSection {
  sectionKey: string;
  items: NavItem[];
}

export const navItems: NavSection[] = [
  {
    sectionKey: "sectionMain",
    items: [
      {
        labelKey: "dashboard",
        icon: DashboardRounded,
        path: ROUTES.DASHBOARD,
      },
    ],
  },
  {
    sectionKey: "sectionMail",
    items: [
      {
        labelKey: "inbox",
        icon: InboxRounded,
        path: ROUTES.MAIL.INBOX,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        labelKey: "sent",
        icon: SendRounded,
        path: ROUTES.MAIL.SENT,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        labelKey: "drafts",
        icon: DraftsRounded,
        path: ROUTES.MAIL.DRAFTS,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        labelKey: "archive",
        icon: ArchiveRounded,
        path: ROUTES.MAIL.ARCHIVE,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        labelKey: "spam",
        icon: ReportRounded,
        path: ROUTES.MAIL.SPAM,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        labelKey: "trash",
        icon: DeleteRounded,
        path: ROUTES.MAIL.TRASH,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        labelKey: "compose",
        icon: EditRounded,
        path: ROUTES.MAIL.COMPOSE,
        permissions: [PERMISSIONS.MAIL_SEND],
      },
    ],
  },
  {
    sectionKey: "sectionAdmin",
    items: [
      {
        labelKey: "users",
        icon: PeopleRounded,
        path: ROUTES.ADMIN.USERS,
        permissions: [PERMISSIONS.ADMIN_USERS_READ],
      },
      {
        labelKey: "domains",
        icon: LanguageRounded,
        path: ROUTES.ADMIN.DOMAINS,
        permissions: [PERMISSIONS.ADMIN_DOMAINS_READ],
      },
      {
        labelKey: "aliases",
        icon: AlternateEmailRounded,
        path: ROUTES.ADMIN.ALIASES,
        permissions: [PERMISSIONS.ADMIN_DOMAINS_READ],
      },
      {
        labelKey: "groups",
        icon: GroupRounded,
        path: ROUTES.ADMIN.GROUPS,
        permissions: [PERMISSIONS.ADMIN_USERS_READ],
      },
      {
        labelKey: "roles",
        icon: ShieldRounded,
        path: ROUTES.ADMIN.ROLES,
        permissions: [PERMISSIONS.ADMIN_ROLES],
      },
      {
        labelKey: "quotas",
        icon: PieChartRounded,
        path: ROUTES.ADMIN.QUOTAS,
        permissions: [PERMISSIONS.ADMIN_QUOTAS],
      },
      {
        labelKey: "queue",
        icon: QueueRounded,
        path: ROUTES.ADMIN.QUEUE,
        permissions: [PERMISSIONS.ADMIN_QUEUE_READ],
      },
      {
        labelKey: "monitoring",
        icon: MonitorRounded,
        path: ROUTES.ADMIN.MONITORING,
        permissions: [PERMISSIONS.ADMIN_MONITORING],
      },
    ],
  },
  {
    sectionKey: "sectionCommunication",
    items: [
      {
        labelKey: "chat",
        icon: ChatRounded,
        path: ROUTES.CHAT,
      },
      {
        labelKey: "notifications",
        icon: NotificationsRounded,
        path: ROUTES.NOTIFICATIONS,
      },
    ],
  },
  {
    sectionKey: "sectionPersonal",
    items: [
      {
        labelKey: "calendar",
        icon: CalendarMonthRounded,
        path: ROUTES.CALENDAR,
      },
      {
        labelKey: "contacts",
        icon: ContactsRounded,
        path: ROUTES.CONTACTS,
      },
    ],
  },
  {
    sectionKey: "sectionSystem",
    items: [
      {
        labelKey: "analytics",
        icon: AnalyticsRounded,
        path: ROUTES.ANALYTICS,
        permissions: [PERMISSIONS.SYSTEM_ANALYTICS],
      },
      {
        labelKey: "settings",
        icon: SettingsRounded,
        path: ROUTES.SETTINGS,
      },
      {
        labelKey: "help",
        icon: HelpRounded,
        path: ROUTES.HELP,
      },
    ],
  },
];
