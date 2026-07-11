"use client";

import { EditRounded } from "@mui/icons-material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import PlaceholderPage from "../PlaceholderPage";

export default function ComposePage() {
  const t = useTypedTranslations("mail");
  return (
    <PlaceholderPage
      title={t("compose")}
      description={t("composeDesc")}
      icon={<EditRounded sx={{ fontSize: 32 }} />}
    />
  );
}
