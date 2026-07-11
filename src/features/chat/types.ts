export type UserStatus = "online" | "offline" | "busy";

export type ChatUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  avatarColor: string;
};

export type ChatMessage = {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  timestamp: string;
};

export type ChatChannel = {
  id: string;
  name: string;
  memberCount: number;
  unreadCount: number;
};
