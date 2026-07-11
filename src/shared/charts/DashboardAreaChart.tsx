"use client";

import { useTheme } from "@mui/material";
import {
  Area,
  CartesianGrid,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartColors, chartDefaults } from "@/theme/tokens/chart";

interface DashboardAreaChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  secondDataKey?: string;
  xKey?: string;
  height?: number;
  color?: string;
  secondColor?: string;
  gradientId?: string;
  showGrid?: boolean;
}

export function DashboardAreaChart({
  data,
  dataKey,
  secondDataKey,
  xKey = "date",
  height = 280,
  color = chartColors.primary,
  secondColor = chartColors.info,
  gradientId = "gradient-primary",
  showGrid = true,
}: DashboardAreaChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={chartDefaults.margin}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          {secondDataKey && (
            <linearGradient id={`${gradientId}-2`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={secondColor} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={
              isDark ? chartDefaults.gridStrokeDark : chartDefaults.gridStroke
            }
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark
              ? chartDefaults.tooltipBgDark
              : chartDefaults.tooltipBg,
            border: `1px solid ${isDark ? chartDefaults.tooltipBorderDark : chartDefaults.tooltipBorder}`,
            borderRadius: 8,
            fontSize: 13,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        {secondDataKey && (
          <Area
            type="monotone"
            dataKey={secondDataKey}
            stroke={secondColor}
            fill={`url(#${gradientId}-2)`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
