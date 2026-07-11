export interface DashboardStats {
  totalEmails: number;
  activeUsers: number;
  storageUsed: number;
  queueSize: number;
}

export interface OperationsDashboard {
  systemStatus: string;
  uptime: number;
  lastChecked: string;
}

export interface MailMetrics {
  sent: number;
  received: number;
  bounced: number;
  spamBlocked: number;
}

export interface UserMetrics {
  total: number;
  active: number;
  newThisMonth: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  mrr: number;
  churnRate: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

export interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
  lastChecked: string;
}
