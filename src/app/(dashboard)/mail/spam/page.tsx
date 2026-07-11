"use client";

import { ReportRounded } from "@mui/icons-material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import PlaceholderPage from "../PlaceholderPage";

export default function SpamPage() {
  const t = useTypedTranslations("mail");
  return (
    <PlaceholderPage
      title={t("spam")}
      description={t("spamDesc")}
      icon={<ReportRounded sx={{ fontSize: 32 }} />}
    />
  );
}
