export interface StalwartQuota {
  id: string;
  quotaType: string;
  resourceType: string;
  used: number;
  limit: number;
}

export interface StalwartQuotaConfig {
  accountId: string;
  quotas: StalwartQuota[];
}
