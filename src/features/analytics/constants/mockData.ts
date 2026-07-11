import type { MetricTrend } from "@/features/analytics/types";

function generateLast30Days(): {
  date: string;
  sent: number;
  received: number;
}[] {
  const data: { date: string; sent: number; received: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;
    const baseSent = isWeekend ? 1800 : 3400;
    const baseReceived = isWeekend ? 2600 : 5100;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sent: baseSent + Math.floor(Math.random() * 1200 - 600),
      received: baseReceived + Math.floor(Math.random() * 1800 - 900),
    });
  }
  return data;
}

export const emailVolumeData = generateLast30Days();

export const topSenders = [
  { name: "alice@omnixys.com", count: 1842 },
  { name: "bob@omnixys.com", count: 1567 },
  { name: "carol@mail.dev", count: 1234 },
  { name: "dave@acme.io", count: 1102 },
  { name: "eve@omnixys.com", count: 987 },
  { name: "frank@startup.co", count: 876 },
  { name: "grace@mail.dev", count: 743 },
  { name: "hank@enterprise.de", count: 654 },
  { name: "irene@acme.io", count: 521 },
  { name: "jake@omnixys.com", count: 438 },
];

export const topReceivers = [
  { name: "inbox@omnixys.com", count: 4210 },
  { name: "support@omnixys.com", count: 3856 },
  { name: "admin@mail.dev", count: 2943 },
  { name: "alerts@acme.io", count: 2487 },
  { name: "newsletter@startup.co", count: 2102 },
  { name: "billing@enterprise.de", count: 1876 },
  { name: "devops@mail.dev", count: 1654 },
  { name: "hr@omnixys.com", count: 1432 },
  { name: "sales@acme.io", count: 1198 },
  { name: "ops@enterprise.de", count: 967 },
];

export const bounceDefermentByHour = Array.from({ length: 24 }, (_, hour) => {
  const h = String(hour).padStart(2, "0");
  const isPeak = hour >= 8 && hour <= 18;
  return {
    hour: `${h}:00`,
    bounced: isPeak
      ? 12 + Math.floor(Math.random() * 28)
      : 2 + Math.floor(Math.random() * 8),
    deferred: isPeak
      ? 8 + Math.floor(Math.random() * 18)
      : 1 + Math.floor(Math.random() * 5),
  };
});

export const domainDistribution = [
  { name: "omnixys.com", value: 3842, color: "#6A4BBC" },
  { name: "mail.dev", value: 2967, color: "#3B82F6" },
  { name: "acme.io", value: 1843, color: "#22C55E" },
  { name: "startup.co", value: 1204, color: "#F59E0B" },
  { name: "enterprise.de", value: 876, color: "#EF4444" },
  { name: "Other", value: 612, color: "#8B5CF6" },
];

export const storageGrowthData = [
  { month: "Aug", used: 420, capacity: 2000 },
  { month: "Sep", used: 485, capacity: 2000 },
  { month: "Oct", used: 560, capacity: 2000 },
  { month: "Nov", used: 630, capacity: 2000 },
  { month: "Dec", used: 710, capacity: 2000 },
  { month: "Jan", used: 805, capacity: 2000 },
  { month: "Feb", used: 920, capacity: 2000 },
  { month: "Mar", used: 1050, capacity: 2000 },
  { month: "Apr", used: 1200, capacity: 2000 },
  { month: "May", used: 1380, capacity: 2000 },
  { month: "Jun", used: 1560, capacity: 2000 },
  { month: "Jul", used: 1720, capacity: 2000 },
];

export const analyticsKpiMetrics: MetricTrend[] = [
  {
    label: "Total Sent",
    value: 87432,
    change: 4210,
    changePercent: 5.1,
    period: "month",
  },
  {
    label: "Total Received",
    value: 124891,
    change: 6340,
    changePercent: 5.4,
    period: "month",
  },
  {
    label: "Bounce Rate",
    value: 2.3,
    change: -0.4,
    changePercent: -14.8,
    period: "month",
  },
  {
    label: "Avg Delivery Time",
    value: 1.8,
    change: -0.3,
    changePercent: -14.3,
    period: "month",
  },
];
