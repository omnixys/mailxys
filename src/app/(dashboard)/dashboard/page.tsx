"use client";

import {
  CheckCircleRounded,
  ErrorRounded,
  MailRounded,
  PeopleRounded,
  QueueRounded,
  StorageRounded,
  TrendingDownRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const kpis = [
  {
    label: "Mails Today",
    value: "12,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: MailRounded,
    color: "#6A4BBC",
  },
  {
    label: "Queue Size",
    value: "23",
    change: "-8.1%",
    trend: "down" as const,
    icon: QueueRounded,
    color: "#3B82F6",
  },
  {
    label: "Active Users",
    value: "342",
    change: "+3.2%",
    trend: "up" as const,
    icon: PeopleRounded,
    color: "#22C55E",
  },
  {
    label: "Storage Used",
    value: "2.4 TB",
    change: "67%",
    trend: "up" as const,
    icon: StorageRounded,
    color: "#F59E0B",
  },
];

const systemStatus = [
  { label: "SMTP", status: "operational", port: "25, 465, 587" },
  { label: "IMAP", status: "operational", port: "143, 993" },
  { label: "JMAP", status: "operational", port: "8080" },
  { label: "Sieve", status: "operational", port: "4190" },
  { label: "PostgreSQL", status: "operational", port: "5432" },
  { label: "MinIO S3", status: "operational", port: "9000" },
];

const recentActivity = [
  {
    time: "2 min ago",
    event: "Mail delivered to john@example.com",
    type: "success",
  },
  {
    time: "5 min ago",
    event: "New account created: user@omnixys.com",
    type: "info",
  },
  {
    time: "12 min ago",
    event: "DKIM key rotated for omnixys.com",
    type: "info",
  },
  {
    time: "18 min ago",
    event: "Queue backlog cleared (47 messages)",
    type: "success",
  },
  {
    time: "25 min ago",
    event: "Spam filter blocked 15 messages",
    type: "warning",
  },
  { time: "1 hr ago", event: "Domain added: newclient.com", type: "info" },
];

export default function DashboardPage() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Operations Console
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpis.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.label}>
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: "100%",
                  background: theme.palette.background.paper,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: `${kpi.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <kpi.icon
                        sx={{ color: kpi.color, fontSize: "1.25rem" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color:
                          kpi.trend === "up" ? "success.main" : "error.main",
                      }}
                    >
                      {kpi.trend === "up" ? (
                        <TrendingUpRounded sx={{ fontSize: "1rem" }} />
                      ) : (
                        <TrendingDownRounded sx={{ fontSize: "1rem" }} />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {kpi.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {kpi.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* System Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                System Status
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {systemStatus.map((service) => (
                  <Box
                    key={service.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <CheckCircleRounded
                        sx={{ fontSize: "1rem", color: "success.main" }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {service.label}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {service.port}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Storage
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">
                    Data Store (PostgreSQL)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    1.2 / 2.0 TB
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Blob Store (MinIO)</Typography>
                  <Typography variant="body2" color="text.secondary">
                    890 / 1.5 TB
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={59}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Search Store</Typography>
                  <Typography variant="body2" color="text.secondary">
                    310 / 500 GB
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={62}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={activity.event}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 1,
                      borderBottom:
                        index < recentActivity.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : "none",
                    }}
                  >
                    {activity.type === "success" && (
                      <CheckCircleRounded
                        sx={{ fontSize: "1rem", color: "success.main" }}
                      />
                    )}
                    {activity.type === "warning" && (
                      <ErrorRounded
                        sx={{ fontSize: "1rem", color: "warning.main" }}
                      />
                    )}
                    {activity.type === "info" && (
                      <MailRounded
                        sx={{ fontSize: "1rem", color: "info.main" }}
                      />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">{activity.event}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
