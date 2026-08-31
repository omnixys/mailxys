export interface JmapAddress {
  name: string;
  email: string;
}

export interface JmapBodyPart {
  partId: string;
  type: string;
  size: number;
}

export interface JmapBodyValue {
  value: string;
  isEncodingProblem: boolean;
  isTruncated: boolean;
  encoding?: "base64" | "7bit" | "quoted-printable";
}

export interface JmapHeader {
  name: string;
  value: string;
}

export interface JmapEmail {
  id: string;
  blobId: string;
  threadId: string;
  mailboxIds: Record<string, boolean>;
  keywords: Record<string, boolean>;
  receivedAt: string;
  size: number;
  subject: string;
  from: JmapAddress[];
  to: JmapAddress[];
  cc?: JmapAddress[];
  bcc?: JmapAddress[];
  replyTo?: JmapAddress[];
  sender?: JmapAddress[];
  date: string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];
  textBody: JmapBodyPart[];
  htmlBody: JmapBodyPart[];
  attachments: JmapBodyPart[];
  bodyValues: Record<string, JmapBodyValue>;
  headers: JmapHeader[];
  hasAttachment?: boolean;
}
