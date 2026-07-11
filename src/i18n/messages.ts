import admin from "../../messages/en/admin.json";
import analytics from "../../messages/en/analytics.json";
import calendar from "../../messages/en/calendar.json";
import chat from "../../messages/en/chat.json";
import common from "../../messages/en/common.json";
import contacts from "../../messages/en/contacts.json";
import dashboard from "../../messages/en/dashboard.json";
import help from "../../messages/en/help.json";
import mail from "../../messages/en/mail.json";
import marketing from "../../messages/en/marketing.json";
import nav from "../../messages/en/nav.json";
import notifications from "../../messages/en/notifications.json";
import settings from "../../messages/en/settings.json";
import shared from "../../messages/en/shared.json";
import theme from "../../messages/en/theme.json";

export const messages = {
  nav,
  common,
  dashboard,
  mail,
  admin,
  settings,
  notifications,
  contacts,
  calendar,
  chat,
  analytics,
  help,
  marketing,
  shared,
  theme,
};

export type Messages = typeof messages;
