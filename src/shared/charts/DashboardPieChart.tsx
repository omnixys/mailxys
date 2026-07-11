"use client";

import { useTheme } from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { chartDefaults } from "@/theme/tokens/chart";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface DashboardPieChartProps {
  data: DataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

export function DashboardPieChart({
  data,
  height = 280,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
}: DashboardPieChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
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
          formatter={(value, name) => [
            `${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`,
            name,
          ]}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span
                style={{ color: theme.palette.text.secondary, fontSize: 12 }}
              >
                {value}
              </span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
