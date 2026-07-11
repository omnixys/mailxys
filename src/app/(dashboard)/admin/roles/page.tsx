import { ShieldRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function RolesPage() {
  return (
    <PlaceholderPage
      title="Roles"
      description="Define roles and permission sets for RBAC. Stalwart JMAP integration coming soon."
      icon={<ShieldRounded sx={{ fontSize: 32 }} />}
    />
  );
}
