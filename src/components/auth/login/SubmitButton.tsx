"use client";

import { Button, CircularProgress } from "@mui/material";
import { useTypedTranslations } from "@/i18n/useTypedTranslations";

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
}

export default function SubmitButton({ loading, disabled }: SubmitButtonProps) {
  const t = useTypedTranslations("marketing");

  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={disabled || loading}
      size="large"
      sx={{
        py: 1.5,
        fontWeight: 600,
        textTransform: "none",
        fontSize: "0.9375rem",
        borderRadius: 2,
      }}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        t("login.submit")
      )}
    </Button>
  );
}
