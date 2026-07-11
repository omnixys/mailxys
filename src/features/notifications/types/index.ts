export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  priority: NotificationPriority;
};

export type NotificationType = "mail" | "system" | "security" | "admin";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";
