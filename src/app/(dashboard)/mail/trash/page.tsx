"use client";

import { DeleteRounded } from "@mui/icons-material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import PlaceholderPage from "../PlaceholderPage";

export default function TrashPage() {
  const t = useTypedTranslations("mail");
  return (
    <PlaceholderPage
      title={t("trashedMessages")}
      description={t("trashDesc")}
      icon={<DeleteRounded sx={{ fontSize: 32 }} />}
    />
  );
}
