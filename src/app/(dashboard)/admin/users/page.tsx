import { PeopleRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Users"
      description="Manage user accounts, roles, and permissions. Stalwart JMAP integration coming soon."
      icon={<PeopleRounded sx={{ fontSize: 32 }} />}
    />
  );
}
