export interface AdminAccount {
  id: string;
  name: string;
  type: string;
  description?: string;
  disabled: boolean;
  roles?: Record<string, boolean>;
  permissions?: unknown;
}

export interface AdminDomain {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
}

export interface AdminRecipient {
  id: string;
  name: string;
  domainId?: string;
  addresses?: string[];
  enabled: boolean;
}

export interface AdminGroup {
  id: string;
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface AdminQueuedMessage {
  id: string;
  from: string;
  to: string[];
  size: number;
  created: string;
  domain: string;
}

export interface AdminQuota {
  id: string;
  quotaType: string;
  resourceType: string;
  used: number;
  limit: number;
}
