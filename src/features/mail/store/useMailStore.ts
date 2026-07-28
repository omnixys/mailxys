import { create } from "zustand";
import type { JmapEmail, JmapMailbox } from "@/features/mail/types";

interface ComposeData {
  mode: "new" | "reply" | "replyAll" | "forward";
  to?: string;
  subject?: string;
  body?: string;
  inReplyTo?: string;
  references?: string[];
}

interface MailState {
  mailboxes: JmapMailbox[];
  emails: JmapEmail[];
  selectedMailboxId: string | null;
  selectedEmailId: string | null;
  searchQuery: string;
  composeOpen: boolean;
  composeData: ComposeData | null;
  loading: boolean;
  error: string | null;
  refreshVersion: number;

  setMailboxes: (mailboxes: JmapMailbox[]) => void;
  setEmails: (emails: JmapEmail[]) => void;
  selectMailbox: (id: string) => void;
  selectEmail: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  openCompose: (data?: ComposeData) => void;
  closeCompose: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetMail: () => void;
  requestRefresh: () => void;
}

export const useMailStore = create<MailState>((set) => ({
  mailboxes: [],
  emails: [],
  selectedMailboxId: "inbox-1",
  selectedEmailId: null,
  searchQuery: "",
  composeOpen: false,
  composeData: null,
  loading: false,
  error: null,
  refreshVersion: 0,

  setMailboxes: (mailboxes) => set({ mailboxes }),
  setEmails: (emails) => set({ emails }),
  selectMailbox: (id) => set({ selectedMailboxId: id, selectedEmailId: null }),
  selectEmail: (id) => set({ selectedEmailId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openCompose: (data) => set({ composeOpen: true, composeData: data ?? null }),
  closeCompose: () => set({ composeOpen: false, composeData: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetMail: () =>
    set({
      mailboxes: [],
      emails: [],
      selectedMailboxId: null,
      selectedEmailId: null,
      error: null,
    }),
  requestRefresh: () =>
    set((state) => ({ refreshVersion: state.refreshVersion + 1 })),
}));
