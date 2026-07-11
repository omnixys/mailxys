import { NotificationsRounded } from "@mui/icons-material";
import PlaceholderPage from "../mail/PlaceholderPage";

export default function NotificationsPage() {
  return (
    <PlaceholderPage
      title="Notifications"
      description="View all notifications from mail, system, and security. Coming soon."
      icon={<NotificationsRounded sx={{ fontSize: 32 }} />}
    />
  );
}
