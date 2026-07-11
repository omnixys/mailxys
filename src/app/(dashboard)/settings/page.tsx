import { SettingsRounded } from "@mui/icons-material";
import PlaceholderPage from "../mail/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Application and account settings. Coming soon."
      icon={<SettingsRounded sx={{ fontSize: 32 }} />}
    />
  );
}
