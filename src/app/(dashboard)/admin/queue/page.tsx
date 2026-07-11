import { QueueRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function QueuePage() {
  return (
    <PlaceholderPage
      title="Queue"
      description="Monitor the mail delivery queue. Stalwart JMAP integration coming soon."
      icon={<QueueRounded sx={{ fontSize: 32 }} />}
    />
  );
}
