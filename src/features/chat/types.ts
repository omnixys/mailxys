export type ChatMessage = {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  timestamp: string;
  edited?: boolean;
};

export type ChatChannel = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  memberCount: number;
};

export type ChatUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "online" | "offline" | "busy";
};
