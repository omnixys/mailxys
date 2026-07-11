import type { JmapAddress } from "./email";

export interface JmapEmailSubmission {
  id: string;
  identityId: string;
  emailId: string;
  blobId: string;
  mailboxId: string;
  keywords: Record<string, boolean>;
  receivedAt: string;
  envelope: {
    mailFrom: JmapAddress;
    rcptTo: JmapAddress[];
  };
  sendAt?: string;
  undoStatus: "pending" | "canceled" | "final";
  deliveryStatus?: Record<string, JmapDeliveryStatus>;
  smtpErrors?: string;
}

export interface JmapDeliveryStatus {
  status: "queued" | "sending" | "sent" | "failed";
  deliveryAttemptedAt: string;
  delivered: boolean;
  displayableMessage?: string;
}
