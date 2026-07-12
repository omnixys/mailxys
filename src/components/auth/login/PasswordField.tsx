"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
  disabled: boolean;
}

export default function PasswordField({
  value,
  onChange,
  error,
  disabled,
}: PasswordFieldProps) {
  const t = useTypedTranslations("marketing");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel htmlFor="password-field">{t("login.password")}</InputLabel>
      <OutlinedInput
        id="password-field"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        disabled={disabled}
        autoComplete="current-password"
        label={t("login.password")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword((p) => !p)}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
