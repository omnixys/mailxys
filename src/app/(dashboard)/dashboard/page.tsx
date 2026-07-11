"use client";

import {
  MailRounded,
  PeopleRounded,
  SpeedRounded,
  TimerRounded,
} from "@mui/icons-material";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import {
  deliveryStatusData,
  hourlyTrafficData,
  kpiData,
  mailVolumeData,
  recentActivity,
  storageData,
  systemServices,
} from "@/features/dashboard/constants/mockData";
import { DashboardAreaChart } from "@/shared/charts/DashboardAreaChart";
import { DashboardBarChart } from "@/shared/charts/DashboardBarChart";
import { DashboardPieChart } from "@/shared/charts/DashboardPieChart";
import { ActivityCard } from "@/shared/ui/ActivityCard";
import { KpiCard } from "@/shared/ui/KpiCard";
import { StorageCard } from "@/shared/ui/StorageCard";
import { SystemStatusCard } from "@/shared/ui/SystemStatusCard";

export default function DashboardPage() {
  const theme = useTheme();
  const _isDark = theme.palette.mode === "dark";

  const kpis = [
    {
      title: "Total Emails",
      value: kpiData.totalEmails.value,
      change: kpiData.totalEmails.change,
      period: kpiData.totalEmails.period,
      icon: <MailRounded sx={{ fontSize: "1.25rem" }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
    {
      title: "Active Users",
      value: kpiData.activeUsers.value,
      change: kpiData.activeUsers.change,
      period: kpiData.activeUsers.period,
      icon: <PeopleRounded sx={{ fontSize: "1.25rem" }} />,
      gradient: `linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)`,
    },
    {
      title: "Avg Latency",
      value: kpiData.avgLatency.value,
      unit: kpiData.avgLatency.unit,
      change: kpiData.avgLatency.change,
      period: kpiData.avgLatency.period,
      icon: <SpeedRounded sx={{ fontSize: "1.25rem" }} />,
      gradient: `linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)`,
    },
    {
      title: "Uptime",
      value: kpiData.uptime.value,
      unit: kpiData.uptime.unit,
      change: kpiData.uptime.change,
      period: kpiData.uptime.period,
      icon: <TimerRounded sx={{ fontSize: "1.25rem" }} />,
      gradient: `linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)`,
    },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 3, letterSpacing: "-0.02em" }}
        >
          Operations Console
        </Typography>
      </motion.div>

      {/* KPI Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpis.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.title}>
            <KpiCard {...kpi} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Mail Volume Trend */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Box
              sx={{
                background: theme.palette.background.paper,
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
                    Mail Volume
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last 14 days
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
                        backgroundColor: "#3B82F6",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Sent
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3 }}>
                <DashboardAreaChart
                  data={mailVolumeData}
                  dataKey="received"
                  secondDataKey="sent"
                  xKey="date"
                  height={300}
                />
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* Delivery Status */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Box
              sx={{
                background: theme.palette.background.paper,
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
                  Delivery Status
                </Typography>
              </Box>
              <Box
                sx={{ p: 3, flex: 1, display: "flex", alignItems: "center" }}
              >
                <DashboardPieChart
                  data={deliveryStatusData}
                  height={260}
                  innerRadius={65}
                  outerRadius={100}
                />
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Hourly Traffic + System + Storage */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Hourly Traffic */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Box
              sx={{
                background: theme.palette.background.paper,
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
                  Hourly Traffic
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <DashboardBarChart
                  data={hourlyTrafficData}
                  dataKey="inbound"
                  secondDataKey="outbound"
                  xKey="hour"
                  height={240}
                  color={theme.palette.primary.main}
                  secondColor="#3B82F6"
                />
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* System Status */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SystemStatusCard services={systemServices} />
        </Grid>
      </Grid>

      {/* Bottom Row: Storage + Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <StorageCard items={storageData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ActivityCard activities={recentActivity} />
        </Grid>
      </Grid>
    </Box>
  );
}
