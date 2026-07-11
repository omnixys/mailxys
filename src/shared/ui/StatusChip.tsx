"use client";

import { Chip, type ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type StatusVariant = "operational" | "degraded" | "outage" | "maintenance";

interface StatusChipProps extends Omit<ChipProps, "color" | "variant"> {
  status: StatusVariant;
  label?: string;
}

const statusConfig: Record<
  StatusVariant,
  { color: string; bg: string; label: string }
> = {
  operational: { color: "#22C55E", bg: "#22C55E15", label: "Operational" },
  degraded: { color: "#F59E0B", bg: "#F59E0B15", label: "Degraded" },
  outage: { color: "#EF4444", bg: "#EF444415", label: "Outage" },
  maintenance: { color: "#3B82F6", bg: "#3B82F615", label: "Maintenance" },
};

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "statusColor" && prop !== "statusBg",
})<{ statusColor: string; statusBg: string }>(({ statusColor, statusBg }) => ({
  backgroundColor: statusBg,
  color: statusColor,
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 24,
  "& .MuiChip-label": { px: 1 },
  "&::before": {
    content: '""',
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: statusColor,
    mr: 0.5,
  },
}));

export function StatusChip({ status, label, ...props }: StatusChipProps) {
  const config = statusConfig[status];
  return (
    <StyledChip
      statusColor={config.color}
      statusBg={config.bg}
      label={label ?? config.label}
      {...props}
    />
  );
}
