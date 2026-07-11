"use client";

import {
  InboxRounded,
  SendRounded,
  TimerRounded,
  WarningRounded,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  analyticsKpiMetrics,
  bounceDefermentByHour,
  domainDistribution,
  emailVolumeData,
  storageGrowthData,
  topSenders,
} from "@/features/analytics/constants/mockData";

const DATE_RANGE_TABS = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
] as const;

type DateRange = (typeof DATE_RANGE_TABS)[number]["value"];

const KPI_ICONS: Record<string, React.ReactNode> = {
  "Total Sent": <SendRounded sx={{ fontSize: "1.5rem" }} />,
  "Total Received": <InboxRounded sx={{ fontSize: "1.5rem" }} />,
  "Bounce Rate": <WarningRounded sx={{ fontSize: "1.5rem" }} />,
  "Avg Delivery Time": <TimerRounded sx={{ fontSize: "1.5rem" }} />,
};

const KPI_GRADIENTS: Record<string, string> = {
  "Total Sent": "linear-gradient(135deg, #6A4BBC 0%, #8B6FDB 100%)",
  "Total Received": "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
  "Bounce Rate": "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  "Avg Delivery Time": "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)",
};

function formatValue(metric: (typeof analyticsKpiMetrics)[number]): string {
  if (metric.label === "Bounce Rate") return `${metric.value}%`;
  if (metric.label === "Avg Delivery Time") return `${metric.value}s`;
  return metric.value.toLocaleString();
}

export default function AnalyticsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const chartTextColor = isDark
    ? theme.palette.grey[400]
    : theme.palette.grey[600];
  const gridColor = isDark
    ? alpha(theme.palette.common.white, 0.08)
    : alpha(theme.palette.common.black, 0.08);
  const tooltipBg = isDark
    ? theme.palette.grey[900]
    : theme.palette.background.paper;
  const tooltipBorder = theme.palette.divider;

  const filteredVolumeData = useMemo(() => {
    if (dateRange === "7d") return emailVolumeData.slice(-7);
    if (dateRange === "90d") return emailVolumeData;
    return emailVolumeData;
  }, [dateRange]);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Analytics
          </Typography>
          <Tabs
            value={dateRange}
            onChange={(_, v) => setDateRange(v)}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 32,
                px: 2,
                py: 0,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8125rem",
                minWidth: "auto",
              },
              "& .MuiTabs-indicator": {
                height: 32,
                borderRadius: 1,
                zIndex: 0,
              },
            }}
          >
            {DATE_RANGE_TABS.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disableRipple
              />
            ))}
          </Tabs>
        </Box>
      </motion.div>

      {/* KPI Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {analyticsKpiMetrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={metric.label}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: KPI_GRADIENTS[metric.label],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {KPI_ICONS[metric.label]}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  {metric.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {formatValue(metric)}
                </Typography>
                <Chip
                  label={`${metric.changePercent > 0 ? "+" : ""}${metric.changePercent}%`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color:
                      metric.changePercent >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                    backgroundColor:
                      metric.changePercent >= 0
                        ? alpha(theme.palette.success.main, 0.12)
                        : alpha(theme.palette.error.main, 0.12),
                  }}
                />
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1: Volume + Domain Distribution */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Email Volume Line Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Email Volume
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sent vs Received over time
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Received
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#F59E0B",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Sent
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3, height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredVolumeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) =>
                        v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                      }}
                      labelStyle={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="received"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sent"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Domain Distribution Pie Chart */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Domain Distribution
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Emails by recipient domain
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 3,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={domainDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {domainDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                      }}
                      formatter={(value, name) => [
                        Number(value).toLocaleString(),
                        String(name),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {/* Legend */}
              <Box
                sx={{
                  px: 3,
                  pb: 2.5,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {domainDistribution.map((entry) => (
                  <Box
                    key={entry.name}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: entry.color,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {entry.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Row 2: Top Senders Bar + Bounce/Deferment Bar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top Senders */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Top Senders
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Messages sent this period
                </Typography>
              </Box>
              <Box sx={{ p: 3, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSenders}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={160}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                      }}
                      formatter={(value) => [
                        Number(value).toLocaleString(),
                        "Emails",
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                      {topSenders.map((sender, index) => (
                        <Cell
                          key={sender.name}
                          fill={
                            index < 3
                              ? theme.palette.primary.main
                              : alpha(theme.palette.primary.main, 0.4)
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Bounce & Deferment by Hour */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Bounce &amp; Deferment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Distribution by hour of day
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#EF4444",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Bounced
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#F59E0B",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Deferred
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bounceDefermentByHour}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      interval={2}
                    />
                    <YAxis
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                      }}
                    />
                    <Bar
                      dataKey="bounced"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                    <Bar
                      dataKey="deferred"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Row 3: Storage Growth Area Chart */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Storage Growth
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Monthly storage usage over 12 months
                  </Typography>
                </Box>
                <Chip
                  label={`${Math.round(((storageGrowthData.at(-1)?.used ?? 0) / (storageGrowthData.at(-1)?.capacity ?? 1)) * 100)}% capacity used`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.warning.main,
                    backgroundColor: alpha(theme.palette.warning.main, 0.12),
                  }}
                />
              </Box>
              <Box sx={{ p: 3, height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={storageGrowthData}>
                    <defs>
                      <linearGradient
                        id="storageGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: chartTextColor, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `${v}GB`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                      }}
                      formatter={(value, name) => [
                        `${value} GB`,
                        name === "used" ? "Used" : "Capacity",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="capacity"
                      stroke={alpha(theme.palette.primary.main, 0.25)}
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                      fill="none"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="used"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2.5}
                      fill="url(#storageGradient)"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
