import type { ChatChannel, ChatMessage, ChatUser } from "@/features/chat/types";

export const mockUsers: ChatUser[] = [
  {
    id: "u1",
    name: "Anna Schmidt",
    email: "anna@omnixys.com",
    status: "online",
    avatarColor: "#7C3AED",
  },
  {
    id: "u2",
    name: "Jonas Weber",
    email: "jonas@omnixys.com",
    status: "online",
    avatarColor: "#2563EB",
  },
  {
    id: "u3",
    name: "Mia Fischer",
    email: "mia@omnixys.com",
    status: "busy",
    avatarColor: "#DC2626",
  },
  {
    id: "u4",
    name: "Luca Braun",
    email: "luca@omnixys.com",
    status: "offline",
    avatarColor: "#059669",
  },
  {
    id: "u5",
    name: "Lea Hoffmann",
    email: "lea@omnixys.com",
    status: "online",
    avatarColor: "#D97706",
  },
];

export const mockChannels: ChatChannel[] = [
  { id: "ch1", name: "general", memberCount: 5, unreadCount: 3 },
  { id: "ch2", name: "engineering", memberCount: 4, unreadCount: 0 },
  { id: "ch3", name: "design", memberCount: 3, unreadCount: 7 },
  { id: "ch4", name: "random", memberCount: 5, unreadCount: 1 },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    channelId: "ch1",
    userId: "u1",
    content: "Good morning everyone! Ready for the sprint planning?",
    timestamp: "2026-07-11T08:02:00Z",
  },
  {
    id: "m2",
    channelId: "ch1",
    userId: "u2",
    content: "Morning! Yes, I've updated the JIRA board with the new tickets.",
    timestamp: "2026-07-11T08:05:00Z",
  },
  {
    id: "m3",
    channelId: "ch1",
    userId: "u3",
    content: "I'll join in 10 minutes, finishing up a code review.",
    timestamp: "2026-07-11T08:07:00Z",
  },
  {
    id: "m4",
    channelId: "ch1",
    userId: "u5",
    content:
      "Don't forget to check the shared drive for the updated product roadmap.",
    timestamp: "2026-07-11T08:12:00Z",
  },
  {
    id: "m5",
    channelId: "ch1",
    userId: "u1",
    content:
      "Thanks Lea, already bookmarked it. See you all in the meeting room.",
    timestamp: "2026-07-11T08:14:00Z",
  },
  {
    id: "m6",
    channelId: "ch2",
    userId: "u2",
    content:
      "I just pushed the fix for the IMAP idle connection timeout. Can someone review?",
    timestamp: "2026-07-11T09:30:00Z",
  },
  {
    id: "m7",
    channelId: "ch2",
    userId: "u3",
    content: "Looking at it now. The reconnection logic looks solid.",
    timestamp: "2026-07-11T09:35:00Z",
  },
  {
    id: "m8",
    channelId: "ch2",
    userId: "u4",
    content: "Also, has anyone tested the new JMAP session handler under load?",
    timestamp: "2026-07-11T09:40:00Z",
  },
  {
    id: "m9",
    channelId: "ch2",
    userId: "u2",
    content:
      "I ran k6 locally — 500 concurrent sessions, p99 latency at 120ms. Looks good.",
    timestamp: "2026-07-11T09:45:00Z",
  },
  {
    id: "m10",
    channelId: "ch2",
    userId: "u1",
    content: "Great work Jonas. Let's merge after Mia's review is done.",
    timestamp: "2026-07-11T09:50:00Z",
  },
  {
    id: "m11",
    channelId: "ch3",
    userId: "u5",
    content:
      "Uploaded the new icon set to Figma. 24 variants for the mail module.",
    timestamp: "2026-07-11T10:00:00Z",
  },
  {
    id: "m12",
    channelId: "ch3",
    userId: "u3",
    content:
      "Love the rounded style, very consistent with the rest of the design system.",
    timestamp: "2026-07-11T10:05:00Z",
  },
  {
    id: "m13",
    channelId: "ch3",
    userId: "u1",
    content: "Can we also update the empty state illustrations to match?",
    timestamp: "2026-07-11T10:10:00Z",
  },
  {
    id: "m14",
    channelId: "ch3",
    userId: "u5",
    content: "Already on my list! Should have drafts ready by end of day.",
    timestamp: "2026-07-11T10:12:00Z",
  },
  {
    id: "m15",
    channelId: "ch3",
    userId: "u3",
    content: "Perfect. I'll prepare the motion specs for the transitions.",
    timestamp: "2026-07-11T10:15:00Z",
  },
  {
    id: "m16",
    channelId: "ch4",
    userId: "u4",
    content: "Anyone up for lunch at the Italian place down the street?",
    timestamp: "2026-07-11T11:45:00Z",
  },
  {
    id: "m17",
    channelId: "ch4",
    userId: "u1",
    content: "Count me in! Their carbonara is amazing.",
    timestamp: "2026-07-11T11:47:00Z",
  },
  {
    id: "m18",
    channelId: "ch4",
    userId: "u2",
    content: "I'll join at 12:30, still wrapping up a deployment.",
    timestamp: "2026-07-11T11:50:00Z",
  },
  {
    id: "m19",
    channelId: "ch4",
    userId: "u5",
    content:
      "Has anyone seen the new coffee machine? It makes flat whites now.",
    timestamp: "2026-07-11T12:00:00Z",
  },
  {
    id: "m20",
    channelId: "ch4",
    userId: "u3",
    content: "Game changer. I've had three already today.",
    timestamp: "2026-07-11T12:03:00Z",
  },
];
