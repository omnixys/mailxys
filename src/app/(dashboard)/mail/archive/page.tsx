"use client";

import { ArchiveRounded } from "@mui/icons-material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import PlaceholderPage from "../PlaceholderPage";

export default function ArchivePage() {
  const t = useTypedTranslations("mail");
  return (
    <PlaceholderPage
      title={t("archive")}
      description={t("archiveDesc")}
      icon={<ArchiveRounded sx={{ fontSize: 32 }} />}
    />
  );
}
