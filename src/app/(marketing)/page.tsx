"use client";

import {
  ArrowForwardRounded,
  CheckCircleRounded,
  MailRounded,
  SecurityRounded,
  SpeedRounded,
  StorageRounded,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

const features = [
  {
    icon: <MailRounded sx={{ fontSize: 28 }} />,
    titleKey: "modernWebmail",
    descKey: "modernWebmailDesc",
  },
  {
    icon: <SecurityRounded sx={{ fontSize: 28 }} />,
    titleKey: "enterpriseSecurity",
    descKey: "enterpriseSecurityDesc",
  },
  {
    icon: <SpeedRounded sx={{ fontSize: 28 }} />,
    titleKey: "blazingFast",
    descKey: "blazingFastDesc",
  },
  {
    icon: <StorageRounded sx={{ fontSize: 28 }} />,
    titleKey: "scalableStorage",
    descKey: "scalableStorageDesc",
  },
];

const highlightKeys = [
  "jmapProtocol",
  "multiDomain",
  "rbac",
  "realtimeNotifications",
  "sieveFiltering",
  "dkimRotation",
];

export default function MarketingPage() {
  const t = useTypedTranslations("marketing");
  const theme = useTheme();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 4,
          textAlign: "center",
          background:
            theme.palette.mode === "dark"
              ? `radial-gradient(ellipse at 50% 20%, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 50%)`
              : `radial-gradient(ellipse at 50% 20%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          {t("heroTitle")}
          <br />
          <Box
            component="span"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("heroHighlight")}
          </Box>
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 500, mx: "auto", mb: 4, fontWeight: 400 }}
        >
          {t("heroSubtitle")}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRounded />}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              borderRadius: 2,
            }}
          >
            {t("getStarted")}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              borderRadius: 2,
            }}
          >
            {t("documentation")}
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Box sx={{ px: 4, py: 8, maxWidth: 1000, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            mb: 6,
            letterSpacing: "-0.02em",
          }}
        >
          {t("builtForScale")}
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid size={{ xs: 12, sm: 6 }} key={feature.titleKey}>
              <Card
                sx={{
                  height: "100%",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 200ms ease",
                  "&:hover": {
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t(feature.titleKey as never)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(feature.descKey as never)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Highlights */}
      <Box
        sx={{
          px: 4,
          py: 8,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, mb: 4, letterSpacing: "-0.02em" }}
          >
            {t("everythingYouNeed")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              textAlign: "left",
            }}
          >
            {highlightKeys.map((key) => (
              <Box
                key={key}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <CheckCircleRounded
                  sx={{ fontSize: "1.25rem", color: "success.main" }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t(key as never)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 4, py: 4, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          {t("footer")}
        </Typography>
      </Box>
    </Box>
  );
}
