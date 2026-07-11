import { LanguageRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function DomainsPage() {
  return (
    <PlaceholderPage
      title="Domains"
      description="Configure email domains, DNS, and DKIM settings. Stalwart JMAP integration coming soon."
      icon={<LanguageRounded sx={{ fontSize: 32 }} />}
    />
  );
}
