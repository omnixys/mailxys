"use client";

import { useTheme } from "@mui/material";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartColors, chartDefaults } from "@/theme/tokens/chart";

interface DashboardBarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  secondDataKey?: string;
  xKey?: string;
  height?: number;
  color?: string;
  secondColor?: string;
  radius?: [number, number, number, number];
}

export function DashboardBarChart({
  data,
  dataKey,
  secondDataKey,
  xKey = "name",
  height = 280,
  color = chartColors.primary,
  secondColor = chartColors.info,
  radius = [4, 4, 0, 0],
}: DashboardBarChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={chartDefaults.margin} barGap={4}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={
            isDark ? chartDefaults.gridStrokeDark : chartDefaults.gridStroke
          }
          vertical={false}
        />
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
        <Bar dataKey={dataKey} fill={color} radius={radius} maxBarSize={40} />
        {secondDataKey && (
          <Bar
            dataKey={secondDataKey}
            fill={secondColor}
            radius={radius}
            maxBarSize={40}
          />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
