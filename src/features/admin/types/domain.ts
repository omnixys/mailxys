export interface StalwartDomain {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  catchAll?: string[];
  directory?: string;
  maxUsers?: number;
  plan?: string;
}
