import { DeleteRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function TrashPage() {
  return (
    <PlaceholderPage
      title="Trash"
      description="Deleted emails are moved here. JMAP integration coming soon."
      icon={<DeleteRounded sx={{ fontSize: 32 }} />}
    />
  );
}
