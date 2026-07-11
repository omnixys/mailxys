import { EditRounded } from "@mui/icons-material";
import PlaceholderPage from "../PlaceholderPage";

export default function ComposePage() {
  return (
    <PlaceholderPage
      title="Compose"
      description="Write and send new emails. Email composition coming soon."
      icon={<EditRounded sx={{ fontSize: 32 }} />}
    />
  );
}
