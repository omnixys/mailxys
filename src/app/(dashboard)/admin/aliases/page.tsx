import { AlternateEmailRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function AliasesPage() {
  return (
    <PlaceholderPage
      title="Aliases"
      description="Manage email aliases and forwarding rules. Stalwart JMAP integration coming soon."
      icon={<AlternateEmailRounded sx={{ fontSize: 32 }} />}
    />
  );
}
