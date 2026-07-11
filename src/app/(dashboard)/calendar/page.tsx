import { CalendarMonthRounded } from "@mui/icons-material";
import PlaceholderPage from "../mail/PlaceholderPage";

export default function CalendarPage() {
  return (
    <PlaceholderPage
      title="Calendar"
      description="Calendar management powered by JMAP. Coming soon."
      icon={<CalendarMonthRounded sx={{ fontSize: 32 }} />}
    />
  );
}
