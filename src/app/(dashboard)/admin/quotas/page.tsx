import { PieChartRounded } from "@mui/icons-material";
import PlaceholderPage from "../../mail/PlaceholderPage";

export default function QuotasPage() {
  return (
    <PlaceholderPage
      title="Quotas"
      description="Set storage and message quotas per account. Stalwart JMAP integration coming soon."
      icon={<PieChartRounded sx={{ fontSize: 32 }} />}
    />
  );
}
