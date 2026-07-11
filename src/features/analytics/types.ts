export type AnalyticsEvent = {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, unknown>;
};

export type MetricTrend = {
  label: string;
  value: number;
  change: number;
  changePercent: number;
  period: "day" | "week" | "month";
};
