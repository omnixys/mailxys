export type ClusterNodeStatus = "online" | "offline" | "degraded";

export interface StalwartClusterNode {
  id: string;
  name: string;
  address: string;
  status: ClusterNodeStatus;
  lastSeen: string;
}
