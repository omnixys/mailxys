import { GroupRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function GroupsPage() {
  return (
    <PlaceholderPage
      title="Groups"
      description="Manage user groups and distribution lists. Stalwart JMAP integration coming soon."
      icon={<GroupRounded sx={{ fontSize: 32 }} />}
    />
  );
}
