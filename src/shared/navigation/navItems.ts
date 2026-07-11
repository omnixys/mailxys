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
  label: string;
  icon: ElementType;
  path: string;
  permissions?: Permission[];
  badge?: number;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export const navItems: NavSection[] = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        icon: DashboardRounded,
        path: ROUTES.DASHBOARD,
      },
    ],
  },
  {
    section: "Mail",
    items: [
      {
        label: "Inbox",
        icon: InboxRounded,
        path: ROUTES.MAIL.INBOX,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        label: "Sent",
        icon: SendRounded,
        path: ROUTES.MAIL.SENT,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        label: "Drafts",
        icon: DraftsRounded,
        path: ROUTES.MAIL.DRAFTS,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        label: "Archive",
        icon: ArchiveRounded,
        path: ROUTES.MAIL.ARCHIVE,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        label: "Spam",
        icon: ReportRounded,
        path: ROUTES.MAIL.SPAM,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        label: "Trash",
        icon: DeleteRounded,
        path: ROUTES.MAIL.TRASH,
        permissions: [PERMISSIONS.MAIL_READ],
      },
      {
        label: "Compose",
        icon: EditRounded,
        path: ROUTES.MAIL.COMPOSE,
        permissions: [PERMISSIONS.MAIL_SEND],
      },
    ],
  },
  {
    section: "Administration",
    items: [
      {
        label: "Users",
        icon: PeopleRounded,
        path: ROUTES.ADMIN.USERS,
        permissions: [PERMISSIONS.ADMIN_USERS_READ],
      },
      {
        label: "Domains",
        icon: LanguageRounded,
        path: ROUTES.ADMIN.DOMAINS,
        permissions: [PERMISSIONS.ADMIN_DOMAINS_READ],
      },
      {
        label: "Aliases",
        icon: AlternateEmailRounded,
        path: ROUTES.ADMIN.ALIASES,
        permissions: [PERMISSIONS.ADMIN_DOMAINS_READ],
      },
      {
        label: "Groups",
        icon: GroupRounded,
        path: ROUTES.ADMIN.GROUPS,
        permissions: [PERMISSIONS.ADMIN_USERS_READ],
      },
      {
        label: "Roles",
        icon: ShieldRounded,
        path: ROUTES.ADMIN.ROLES,
        permissions: [PERMISSIONS.ADMIN_ROLES],
      },
      {
        label: "Quotas",
        icon: PieChartRounded,
        path: ROUTES.ADMIN.QUOTAS,
        permissions: [PERMISSIONS.ADMIN_QUOTAS],
      },
      {
        label: "Queue",
        icon: QueueRounded,
        path: ROUTES.ADMIN.QUEUE,
        permissions: [PERMISSIONS.ADMIN_QUEUE_READ],
      },
      {
        label: "Monitoring",
        icon: MonitorRounded,
        path: ROUTES.ADMIN.MONITORING,
        permissions: [PERMISSIONS.ADMIN_MONITORING],
      },
    ],
  },
  {
    section: "Communication",
    items: [
      {
        label: "Chat",
        icon: ChatRounded,
        path: ROUTES.CHAT,
      },
      {
        label: "Notifications",
        icon: NotificationsRounded,
        path: ROUTES.NOTIFICATIONS,
      },
    ],
  },
  {
    section: "Personal",
    items: [
      {
        label: "Calendar",
        icon: CalendarMonthRounded,
        path: ROUTES.CALENDAR,
      },
      {
        label: "Contacts",
        icon: ContactsRounded,
        path: ROUTES.CONTACTS,
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Analytics",
        icon: AnalyticsRounded,
        path: ROUTES.ANALYTICS,
        permissions: [PERMISSIONS.SYSTEM_ANALYTICS],
      },
      {
        label: "Settings",
        icon: SettingsRounded,
        path: ROUTES.SETTINGS,
      },
      {
        label: "Help",
        icon: HelpRounded,
        path: ROUTES.HELP,
      },
    ],
  },
];
