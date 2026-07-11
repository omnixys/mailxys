import { create } from "zustand";
import type { JmapEmail, JmapMailbox } from "@/features/mail/types";

interface ComposeData {
  mode: "new" | "reply" | "replyAll" | "forward";
  to?: string;
  subject?: string;
  body?: string;
}

interface MailState {
  mailboxes: JmapMailbox[];
  emails: JmapEmail[];
  selectedMailboxId: string | null;
  selectedEmailId: string | null;
  searchQuery: string;
  composeOpen: boolean;
  composeData: ComposeData | null;

  setMailboxes: (mailboxes: JmapMailbox[]) => void;
  setEmails: (emails: JmapEmail[]) => void;
  selectMailbox: (id: string) => void;
  selectEmail: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  openCompose: (data?: ComposeData) => void;
  closeCompose: () => void;
}

export const useMailStore = create<MailState>((set) => ({
  mailboxes: [],
  emails: [],
  selectedMailboxId: "inbox-1",
  selectedEmailId: null,
  searchQuery: "",
  composeOpen: false,
  composeData: null,

  setMailboxes: (mailboxes) => set({ mailboxes }),
  setEmails: (emails) => set({ emails }),
  selectMailbox: (id) => set({ selectedMailboxId: id, selectedEmailId: null }),
  selectEmail: (id) => set({ selectedEmailId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openCompose: (data) => set({ composeOpen: true, composeData: data ?? null }),
  closeCompose: () => set({ composeOpen: false, composeData: null }),
}));
