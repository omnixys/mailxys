import { ChatRounded } from "@mui/icons-material";
import PlaceholderPage from "../mail/PlaceholderPage";

export default function ChatPage() {
  return (
    <PlaceholderPage
      title="Chat"
      description="Internal team messaging and communication. Coming soon."
      icon={<ChatRounded sx={{ fontSize: 32 }} />}
    />
  );
}
