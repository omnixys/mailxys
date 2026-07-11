export interface StalwartAccount {
  id: string;
  name: string;
  description?: string;
  typ: "individual" | "group" | "location" | "resources";
  memberOf?: string[];
  role?: string;
  disabled: boolean;
  isTenantAdmin?: boolean;
  secrets?: string[];
}
