import { ContactsRounded } from "@mui/icons-material";
import PlaceholderPage from "../mail/PlaceholderPage";

export default function ContactsPage() {
  return (
    <PlaceholderPage
      title="Contacts"
      description="Contact management powered by JMAP. Coming soon."
      icon={<ContactsRounded sx={{ fontSize: 32 }} />}
    />
  );
}
