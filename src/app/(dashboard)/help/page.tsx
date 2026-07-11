import { HelpRounded } from "@mui/icons-material";
import PlaceholderPage from "../mail/PlaceholderPage";

export default function HelpPage() {
  return (
    <PlaceholderPage
      title="Help"
      description="Documentation and support resources. Coming soon."
      icon={<HelpRounded sx={{ fontSize: 32 }} />}
    />
  );
}
