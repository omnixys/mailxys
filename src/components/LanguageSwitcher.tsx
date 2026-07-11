"use client";

import LanguageIcon from "@mui/icons-material/Language";
import {
  alpha,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import type { Locale } from "@/i18n/request";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en-US", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "de-DE", label: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }
    // biome-ignore lint/suspicious/noDocumentCookie: Standard next-intl cookie-based locale switching pattern
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    handleClose();
    router.refresh();
  };

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        onClick={handleOpen}
        sx={{ cursor: "pointer", alignItems: "center" }}
      >
        <Button size="small" sx={{ minWidth: "auto", p: 0.5 }}>
          <Typography
            sx={{
              letterSpacing: "0.05em",
              fontWeight: 600,
              fontSize: "0.8125rem",
              border: `1.5px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              borderRadius: 1.5,
              px: 1.5,
              py: 0.25,
            }}
          >
            {locale.slice(0, 2).toUpperCase()}
          </Typography>
        </Button>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 160,
              borderRadius: 2,
              backdropFilter: "blur(20px)",
              background: alpha(theme.palette.background.paper, 0.95),
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            },
          },
        }}
      >
        {LOCALES.map((l) => (
          <MenuItem
            key={l.code}
            onClick={() => switchLocale(l.code)}
            selected={locale === l.code}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.875rem" }}>
                {l.flag} {l.label}
              </Typography>
              {locale === l.code && (
                <LanguageIcon fontSize="small" color="primary" />
              )}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
