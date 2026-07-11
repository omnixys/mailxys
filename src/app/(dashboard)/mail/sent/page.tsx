"use client";

import { SendRounded } from "@mui/icons-material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import PlaceholderPage from "../PlaceholderPage";

export default function SentPage() {
  const t = useTypedTranslations("mail");
  return (
    <PlaceholderPage
      title={t("sentMessages")}
      description={t("sentDesc")}
      icon={<SendRounded sx={{ fontSize: 32 }} />}
    />
  );
}
