import { SendRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function SentPage() {
  return (
    <PlaceholderPage
      title="Sent"
      description="View all emails you have sent. JMAP integration coming soon."
      icon={<SendRounded sx={{ fontSize: 32 }} />}
    />
  );
}
