export const MAIL_FOLDER_ROLES: Record<string, string> = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  archive: "Archive",
  spam: "Spam",
  trash: "Trash",
  important: "Important",
  flagged: "Flagged",
} as const;

export const MAIL_KEYWORDS = {
  SEEN: "$seen",
  ANSWERED: "$answered",
  FLAGGED: "$flagged",
  DRAFT: "$draft",
  DELETED: "$deleted",
  FORWARDED: "$forwarded",
  IMPORTANT: "$important",
  JUNK: "$junk",
  NOTJUNK: "$notjunk",
} as const;
