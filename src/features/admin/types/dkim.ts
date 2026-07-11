export type DkimAlgorithm = "rsa-sha256" | "ed25519";

export interface StalwartDkimSignature {
  id: string;
  domain: string;
  selector: string;
  privateKey: string;
  publicKey: string;
  algorithm: DkimAlgorithm;
  enabled: boolean;
}
