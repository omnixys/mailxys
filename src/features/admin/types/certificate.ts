export interface StalwartCertificate {
  id: string;
  domain: string;
  certificate: string;
  key: string;
  expires: string;
}

export interface StalwartAcmeProvider {
  id: string;
  provider: string;
  domain: string;
  enabled: boolean;
}
