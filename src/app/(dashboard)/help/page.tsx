"use client";

import {
  AdminPanelSettingsRounded,
  ContactMailRounded,
  ExpandMoreRounded,
  InfoRounded,
  MailRounded,
  SearchRounded,
  SecurityRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

const faqSections = [
  {
    categoryKey: "gettingStarted" as const,
    icon: <InfoRounded sx={{ fontSize: 20 }} />,
    color: "#3B82F6",
    items: [
      {
        questionKey: "faqAccessEmail" as const,
        answerKey: "faqAccessEmailAnswer" as const,
      },
      {
        questionKey: "faqBrowsers" as const,
        answerKey: "faqBrowsersAnswer" as const,
      },
      {
        questionKey: "faqCompose" as const,
        answerKey: "faqComposeAnswer" as const,
      },
    ],
  },
  {
    categoryKey: "mailFeatures" as const,
    icon: <MailRounded sx={{ fontSize: 20 }} />,
    color: "#6A4BBC",
    items: [
      {
        questionKey: "faqSearch" as const,
        answerKey: "faqSearchAnswer" as const,
      },
      {
        questionKey: "faqFolders" as const,
        answerKey: "faqFoldersAnswer" as const,
      },
      {
        questionKey: "faqFilters" as const,
        answerKey: "faqFiltersAnswer" as const,
      },
      {
        questionKey: "faqShortcuts" as const,
        answerKey: "faqShortcutsAnswer" as const,
      },
    ],
  },
  {
    categoryKey: "securityPrivacy" as const,
    icon: <SecurityRounded sx={{ fontSize: 20 }} />,
    color: "#EF4444",
    items: [
      {
        questionKey: "faqEmailProtected" as const,
        answerKey: "faqEmailProtectedAnswer" as const,
      },
      { questionKey: "faqDkim" as const, answerKey: "faqDkimAnswer" as const },
      { questionKey: "faq2fa" as const, answerKey: "faq2faAnswer" as const },
    ],
  },
  {
    categoryKey: "administration" as const,
    icon: <AdminPanelSettingsRounded sx={{ fontSize: 20 }} />,
    color: "#F59E0B",
    items: [
      {
        questionKey: "faqAddDomain" as const,
        answerKey: "faqAddDomainAnswer" as const,
      },
      {
        questionKey: "faqManageUsers" as const,
        answerKey: "faqManageUsersAnswer" as const,
      },
      {
        questionKey: "faqMonitorQueue" as const,
        answerKey: "faqMonitorQueueAnswer" as const,
      },
    ],
  },
  {
    categoryKey: "settingsConfig" as const,
    icon: <SettingsRounded sx={{ fontSize: 20 }} />,
    color: "#22C55E",
    items: [
      {
        questionKey: "faqDisplayName" as const,
        answerKey: "faqDisplayNameAnswer" as const,
      },
      {
        questionKey: "faqDarkMode" as const,
        answerKey: "faqDarkModeAnswer" as const,
      },
      {
        questionKey: "faqLanguage" as const,
        answerKey: "faqLanguageAnswer" as const,
      },
    ],
  },
  {
    categoryKey: "contactsCalendar" as const,
    icon: <ContactMailRounded sx={{ fontSize: 20 }} />,
    color: "#EC4899",
    items: [
      {
        questionKey: "faqAddContacts" as const,
        answerKey: "faqAddContactsAnswer" as const,
      },
      {
        questionKey: "faqImportContacts" as const,
        answerKey: "faqImportContactsAnswer" as const,
      },
      {
        questionKey: "faqCalendar" as const,
        answerKey: "faqCalendarAnswer" as const,
      },
    ],
  },
];

export default function HelpPage() {
  const t = useTypedTranslations("help");
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      category: t(section.categoryKey),
      items: section.items.filter(
        (item) =>
          t(item.questionKey)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          t(item.answerKey).toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.02em" }}
      >
        {t("title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("subtitle")}
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder={t("searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 4 }}
      />

      {/* FAQ Sections */}
      {filteredSections.map((section) => (
        <Box key={section.category} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: alpha(section.color, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: section.color,
              }}
            >
              {section.icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {section.category}
            </Typography>
            <Chip
              label={section.items.length}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.75rem",
                bgcolor: alpha(section.color, 0.1),
                color: section.color,
                fontWeight: 600,
              }}
            />
          </Box>

          {section.items.map((item) => (
            <Accordion
              key={item.questionKey}
              disableGutters
              sx={{
                mb: 0.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px !important",
                "&::before": { display: "none" },
                boxShadow: "none",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t(item.questionKey)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {t(item.answerKey)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}

      {filteredSections.length === 0 && (
        <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <SearchRounded
              sx={{
                fontSize: 48,
                color: "text.secondary",
                opacity: 0.4,
                mb: 1,
              }}
            />
            <Typography variant="h6" color="text.secondary">
              {t("noResults")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("noResults")}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card
        sx={{
          mt: 4,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t("stillNeedHelp")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("contactEmail")} / {t("contactChannel")}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
