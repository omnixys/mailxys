import { MonitorRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function MonitoringPage() {
  return (
    <PlaceholderPage
      title="Monitoring"
      description="Real-time server monitoring and metrics. Integration coming soon."
      icon={<MonitorRounded sx={{ fontSize: 32 }} />}
    />
  );
}
