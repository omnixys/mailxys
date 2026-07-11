export type QueueStatus =
  | "queued"
  | "in-progress"
  | "failed"
  | "completed"
  | "deferred"
  | "bounce";

export interface StalwartQueuedMessage {
  id: string;
  from: string;
  to: string[];
  size: number;
  priority: number;
  created: string;
  status: QueueStatus;
  retryCount: number;
  nextRetry?: string;
  domain: string;
  errorMessage?: string;
}
