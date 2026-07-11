import type { JmapAddress } from "./email";

export interface JmapIdentity {
  id: string;
  name: string;
  email: string;
  replyTo?: JmapAddress[];
  htmlSig?: string;
  textSig?: string;
  mayDelete: boolean;
}
