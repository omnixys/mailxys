import type { Theme } from "@mui/material/styles";
import type { TextFieldProps } from "@mui/material/TextField";

export const textFieldComponents = (_theme: Theme) => ({
  defaultProps: {
    variant: "outlined" as const,
    size: "small" as const,
  } satisfies Partial<TextFieldProps>,
  styleOverrides: {
    root: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 8,
        transition: "all 150ms ease",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(106, 75, 188, 0.4)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#6A4BBC",
          borderWidth: 1.5,
        },
      },
      "& .MuiInputLabel-outlined": {
        "&.Mui-focused": {
          color: "#6A4BBC",
        },
      },
    },
  },
});
