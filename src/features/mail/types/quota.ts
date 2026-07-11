export interface JmapQuota {
  id: string;
  quotaType: string;
  resourceType: string;
  used: number;
  limit: number;
}
