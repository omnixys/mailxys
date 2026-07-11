import { InboxRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function InboxPage() {
  return (
    <PlaceholderPage
      title="Inbox"
      description="Your inbox will display all received emails. JMAP integration coming soon."
      icon={<InboxRounded sx={{ fontSize: 32 }} />}
    />
  );
}
