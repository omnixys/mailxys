"use client";

import PersonRounded from "@mui/icons-material/PersonRounded";
import { InputAdornment, TextField } from "@mui/material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
  disabled: boolean;
}

export default function UsernameField({
  value,
  onChange,
  error,
  disabled,
}: UsernameFieldProps) {
  const t = useTypedTranslations("marketing");

  return (
    <TextField
      fullWidth
      label={t("login.username")}
      name="username"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      disabled={disabled}
      autoComplete="username"
      autoFocus
      required
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PersonRounded fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
