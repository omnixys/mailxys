import {
  ArchiveRounded,
  DeleteRounded,
  DraftsRounded,
  EditRounded,
  InboxRounded,
  ReportRounded,
  SendRounded,
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
];
