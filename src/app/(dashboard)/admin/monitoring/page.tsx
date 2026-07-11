"use client";

import {
  MailRounded,
  SpeedRounded,
  StorageRounded,
  TimerRounded,
} from "@mui/icons-material";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { DashboardAreaChart } from "@/shared/charts/DashboardAreaChart";
import { DashboardBarChart } from "@/shared/charts/DashboardBarChart";
import { KpiCard } from "@/shared/ui/KpiCard";

const deliveryData = [
  { time: "00:00", delivered: 320, bounced: 4, deferred: 2 },
  { time: "02:00", delivered: 180, bounced: 2, deferred: 1 },
  { time: "04:00", delivered: 120, bounced: 1, deferred: 0 },
  { time: "06:00", delivered: 450, bounced: 5, deferred: 3 },
  { time: "08:00", delivered: 890, bounced: 8, deferred: 5 },
  { time: "10:00", delivered: 1240, bounced: 12, deferred: 8 },
  { time: "12:00", delivered: 980, bounced: 10, deferred: 4 },
  { time: "14:00", delivered: 1100, bounced: 11, deferred: 6 },
  { time: "16:00", delivered: 1050, bounced: 9, deferred: 7 },
  { time: "18:00", delivered: 680, bounced: 6, deferred: 3 },
  { time: "20:00", delivered: 420, bounced: 4, deferred: 2 },
  { time: "22:00", delivered: 310, bounced: 3, deferred: 1 },
];

const latencyData = [
  { time: "00:00", smtp: 38, jmap: 22, imap: 45 },
  { time: "02:00", smtp: 35, jmap: 20, imap: 42 },
  { time: "04:00", smtp: 32, jmap: 18, imap: 40 },
  { time: "06:00", smtp: 42, jmap: 25, imap: 50 },
  { time: "08:00", smtp: 55, jmap: 35, imap: 62 },
  { time: "10:00", smtp: 68, jmap: 42, imap: 78 },
  { time: "12:00", smtp: 58, jmap: 38, imap: 65 },
  { time: "14:00", smtp: 62, jmap: 40, imap: 72 },
  { time: "16:00", smtp: 60, jmap: 38, imap: 70 },
  { time: "18:00", smtp: 48, jmap: 30, imap: 55 },
  { time: "20:00", smtp: 40, jmap: 24, imap: 48 },
  { time: "22:00", smtp: 36, jmap: 21, imap: 44 },
];

export default function MonitoringPage() {
  const theme = useTheme();

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
          Monitoring
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Delivery Rate"
            value="99.1"
            unit="%"
            change={0.3}
            period="last 24h"
            icon={<MailRounded sx={{ fontSize: "1.25rem" }} />}
            gradient="linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)"
            index={0}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Avg Latency"
            value="42"
            unit="ms"
            change={-15.3}
            period="vs last week"
            icon={<SpeedRounded sx={{ fontSize: "1.25rem" }} />}
            gradient="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
            index={1}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Queue Depth"
            value="23"
            change={-8.1}
            period="vs yesterday"
            icon={<TimerRounded sx={{ fontSize: "1.25rem" }} />}
            gradient={`linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`}
            index={2}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            title="Storage I/O"
            value="128"
            unit="MB/s"
            change={5.2}
            period="vs last hour"
            icon={<StorageRounded sx={{ fontSize: "1.25rem" }} />}
            gradient="linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)"
            index={3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
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
                Delivery Throughput
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <DashboardAreaChart
                data={deliveryData}
                dataKey="delivered"
                secondDataKey="bounced"
                xKey="time"
                height={280}
                color="#22C55E"
                secondColor="#EF4444"
              />
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
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
                Protocol Latency
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <DashboardBarChart
                data={latencyData}
                dataKey="smtp"
                secondDataKey="jmap"
                xKey="time"
                height={280}
                color={theme.palette.primary.main}
                secondColor="#3B82F6"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
