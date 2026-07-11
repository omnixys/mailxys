export type MailboxRole =
  | "inbox"
  | "trash"
  | "sent"
  | "drafts"
  | "spam"
  | "archive"
  | "important"
  | "flagged";

export interface MailboxRights {
  mayReadItems: boolean;
  mayAddItems: boolean;
  mayRemoveItems: boolean;
  mayModifyItems: boolean;
  mayCreateMailbox: boolean;
  mayDeleteMailbox: boolean;
  mayRenameMailbox: boolean;
  maySubmit: boolean;
}

export interface JmapMailbox {
  id: string;
  name: string;
  parentId: string | null;
  role: MailboxRole;
  sortOrder: number;
  totalEmails: number;
  unreadEmails: number;
  totalThreads: number;
  unreadThreads: number;
  myRights: MailboxRights;
  isSubscribed: boolean;
}
