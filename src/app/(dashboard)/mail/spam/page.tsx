import { ReportRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function SpamPage() {
  return (
    <PlaceholderPage
      title="Spam"
      description="Spam messages are filtered here. JMAP integration coming soon."
      icon={<ReportRounded sx={{ fontSize: 32 }} />}
    />
  );
}
