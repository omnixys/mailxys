import type { User } from "@/auth/types/auth";

interface AuthenticatedUserProfile {
  name: string;
  email: string;
  initials: string;
}

export function getAuthenticatedUserProfile(
  user: Pick<User, "name" | "email"> | null,
): AuthenticatedUserProfile | null {
  if (!user) return null;

  const name = user.name.trim();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    name,
    email: user.email,
    initials,
  };
}
