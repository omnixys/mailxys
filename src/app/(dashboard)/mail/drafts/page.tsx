"use client";

import { DraftsRounded } from "@mui/icons-material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import PlaceholderPage from "../PlaceholderPage";

export default function DraftsPage() {
  const t = useTypedTranslations("mail");
  return (
    <PlaceholderPage
      title={t("draftMessages")}
      description={t("draftsDesc")}
      icon={<DraftsRounded sx={{ fontSize: 32 }} />}
    />
  );
}
