export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface Session {
  id: string;
  userId: string;
  startedAt: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
}
