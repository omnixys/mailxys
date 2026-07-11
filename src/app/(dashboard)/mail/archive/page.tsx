import { ArchiveRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function ArchivePage() {
  return (
    <PlaceholderPage
      title="Archive"
      description="Archived emails are stored here. JMAP integration coming soon."
      icon={<ArchiveRounded sx={{ fontSize: 32 }} />}
    />
  );
}
