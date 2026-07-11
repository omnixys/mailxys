export type MtaRouteKind = "dns-mx" | "dns-smtp" | "dns-smtp-mx" | "none";

export interface StalwartMtaRoute {
  id: string;
  name: string;
  domain: string;
  host: string;
  port: number;
  enabled: boolean;
  priority: number;
}

export interface StalwartMtaOutboundStrategy {
  kind: MtaRouteKind;
}
