export const mailVolumeData = [
  { date: "Jan 1", received: 4200, sent: 3100, bounced: 45, spam: 320 },
  { date: "Jan 2", received: 3800, sent: 2900, bounced: 38, spam: 280 },
  { date: "Jan 3", received: 5100, sent: 4200, bounced: 52, spam: 410 },
  { date: "Jan 4", received: 4600, sent: 3800, bounced: 41, spam: 350 },
  { date: "Jan 5", received: 3200, sent: 2400, bounced: 28, spam: 190 },
  { date: "Jan 6", received: 2800, sent: 2100, bounced: 22, spam: 160 },
  { date: "Jan 7", received: 4900, sent: 3600, bounced: 48, spam: 380 },
  { date: "Jan 8", received: 5400, sent: 4100, bounced: 55, spam: 430 },
  { date: "Jan 9", received: 4700, sent: 3500, bounced: 42, spam: 340 },
  { date: "Jan 10", received: 5200, sent: 4000, bounced: 50, spam: 400 },
  { date: "Jan 11", received: 5800, sent: 4500, bounced: 58, spam: 460 },
  { date: "Jan 12", received: 4100, sent: 3200, bounced: 36, spam: 290 },
  { date: "Jan 13", received: 3600, sent: 2700, bounced: 31, spam: 220 },
  { date: "Jan 14", received: 5500, sent: 4300, bounced: 53, spam: 420 },
];

export const hourlyTrafficData = [
  { hour: "00:00", inbound: 120, outbound: 80 },
  { hour: "02:00", inbound: 60, outbound: 40 },
  { hour: "04:00", inbound: 40, outbound: 25 },
  { hour: "06:00", inbound: 180, outbound: 120 },
  { hour: "08:00", inbound: 450, outbound: 380 },
  { hour: "10:00", inbound: 620, outbound: 510 },
  { hour: "12:00", inbound: 480, outbound: 420 },
  { hour: "14:00", inbound: 580, outbound: 490 },
  { hour: "16:00", inbound: 520, outbound: 440 },
  { hour: "18:00", inbound: 340, outbound: 280 },
  { hour: "20:00", inbound: 220, outbound: 160 },
  { hour: "22:00", inbound: 160, outbound: 110 },
];

export const deliveryStatusData = [
  { name: "Delivered", value: 8924, color: "#22C55E" },
  { name: "Bounced", value: 342, color: "#F59E0B" },
  { name: "Deferred", value: 128, color: "#3B82F6" },
  { name: "Failed", value: 67, color: "#EF4444" },
];

export const storageData = [
  { name: "Mail Data", used: 1240, total: 2000, color: "#6A4BBC" },
  { name: "Attachments", used: 890, total: 1500, color: "#3B82F6" },
  { name: "Search Index", used: 310, total: 500, color: "#22C55E" },
  { name: "Audit Logs", used: 45, total: 200, color: "#F59E0B" },
];

export const domainStatsData = [
  { domain: "omnixys.com", users: 142, emails: 4820, quota: 62 },
  { domain: "mail.dev", users: 86, emails: 2340, quota: 41 },
  { domain: "acme.io", users: 54, emails: 1890, quota: 78 },
  { domain: "startup.co", users: 38, emails: 1120, quota: 35 },
  { domain: "enterprise.de", users: 22, emails: 680, quota: 55 },
];

export const kpiData = {
  totalEmails: { value: 68847, change: 12.5, period: "vs last month" },
  activeUsers: { value: 342, change: 3.2, period: "vs last month" },
  queueSize: { value: 23, change: -8.1, period: "vs yesterday" },
  storageUsed: {
    value: 2.48,
    unit: "TB",
    change: 5.7,
    period: "vs last month",
  },
  uptime: { value: 99.97, unit: "%", change: 0, period: "last 30 days" },
  avgLatency: { value: 42, unit: "ms", change: -15.3, period: "vs last week" },
};

export const systemServices = [
  {
    name: "SMTP",
    status: "operational" as const,
    port: "25, 465, 587",
    uptime: 99.99,
  },
  { name: "JMAP", status: "operational" as const, port: "8080", uptime: 99.98 },
  {
    name: "IMAP",
    status: "operational" as const,
    port: "143, 993",
    uptime: 99.97,
  },
  { name: "Sieve", status: "operational" as const, port: "4190", uptime: 100 },
  {
    name: "PostgreSQL",
    status: "operational" as const,
    port: "5432",
    uptime: 99.99,
  },
  {
    name: "MinIO S3",
    status: "degraded" as const,
    port: "9000",
    uptime: 99.82,
  },
  {
    name: "Meilisearch",
    status: "operational" as const,
    port: "7700",
    uptime: 99.95,
  },
  { name: "Redis", status: "operational" as const, port: "6379", uptime: 100 },
];

export const recentActivity = [
  {
    id: "1",
    time: "2 min ago",
    event: "Mail delivered to john@omnixys.com",
    type: "success" as const,
  },
  {
    id: "2",
    time: "5 min ago",
    event: "New account created: alice@mail.dev",
    type: "info" as const,
  },
  {
    id: "3",
    time: "12 min ago",
    event: "DKIM key rotated for omnixys.com",
    type: "info" as const,
  },
  {
    id: "4",
    time: "18 min ago",
    event: "Queue backlog cleared (47 messages)",
    type: "success" as const,
  },
  {
    id: "5",
    time: "25 min ago",
    event: "Spam filter blocked 15 messages from 45.33.x.x",
    type: "warning" as const,
  },
  {
    id: "6",
    time: "42 min ago",
    event: "TLS certificate renewed for mail.dev",
    type: "success" as const,
  },
  {
    id: "7",
    time: "1 hr ago",
    event: "Domain added: startup.co (pending DNS verification)",
    type: "info" as const,
  },
  {
    id: "8",
    time: "2 hr ago",
    event: "User quota warning: alice@mail.dev (85% used)",
    type: "warning" as const,
  },
];
