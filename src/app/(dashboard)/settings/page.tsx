"use client";

import {
  DarkModeRounded,
  LanguageRounded,
  LightModeRounded,
  NotificationsRounded,
  PaletteRounded,
  SecurityRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { getAuthenticatedUserProfile } from "@/auth/profile";
import { useAuth } from "@/auth/providers/AuthProvider";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";
import { useThemeMode } from "@/providers/ThemeModeProvider";

export default function SettingsPage() {
  const t = useTypedTranslations("settings");
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { user } = useAuth();
  const profile = getAuthenticatedUserProfile(user);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState("daily");
  const [language, setLanguage] = useState("en");

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 3, letterSpacing: "-0.02em" }}
      >
        {t("title")}
      </Typography>

      {/* Profile Section */}
      <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                fontSize: "1.25rem",
                fontWeight: 700,
                bgcolor: theme.palette.primary.main,
                color: "#fff",
              }}
            >
              {profile?.initials}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {profile?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" size="small">
            {t("editProfile")}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <PaletteRounded sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("appearance")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {mode === "dark" ? <DarkModeRounded /> : <LightModeRounded />}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("darkMode")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mode === "dark" ? t("currentlyDark") : t("currentlyLight")}
                </Typography>
              </Box>
            </Box>
            <Switch checked={mode === "dark"} onChange={toggleMode} />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LanguageRounded />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("language")}
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <NotificationsRounded sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("notifications")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("pushNotifications")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("pushNotificationsDesc")}
              </Typography>
            </Box>
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("emailDigest")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("emailDigestDesc")}
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={emailDigest}
                onChange={(e) => setEmailDigest(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="realtime">{t("realtime")}</MenuItem>
                <MenuItem value="daily">{t("daily")}</MenuItem>
                <MenuItem value="weekly">{t("weekly")}</MenuItem>
                <MenuItem value="never">{t("never")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <SecurityRounded sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("security")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("twoFactorAuth")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("twoFactorAuthDesc")}
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              {t("enable2fa")}
            </Button>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("activeSessions")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("activeSessionsDesc")}
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              {t("viewSessions")}
            </Button>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "error.main" }}
              >
                {t("deleteAccount")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("deleteAccountDesc")}
              </Typography>
            </Box>
            <Button variant="outlined" size="small" color="error">
              {t("delete")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
