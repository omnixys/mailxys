export interface StalwartRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
}
