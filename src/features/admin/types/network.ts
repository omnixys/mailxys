export type NetworkProtocol =
  | "smtp"
  | "smtps"
  | "submission"
  | "imap"
  | "imaps"
  | "sieve"
  | "http"
  | "pop3"
  | "pop3s";

export interface StalwartNetworkListener {
  id: string;
  protocol: NetworkProtocol;
  bind: string;
  port: number;
  tls?: string;
  enabled: boolean;
}
