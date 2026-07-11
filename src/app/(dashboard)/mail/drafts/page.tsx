import { DraftsRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function DraftsPage() {
  return (
    <PlaceholderPage
      title="Drafts"
      description="Your draft emails will appear here. JMAP integration coming soon."
      icon={<DraftsRounded sx={{ fontSize: 32 }} />}
    />
  );
}
