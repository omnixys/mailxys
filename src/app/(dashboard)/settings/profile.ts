import type { User } from "@/auth/types/auth";

interface SettingsProfile {
  name: string;
  email: string;
  initials: string;
}

export function getSettingsProfile(
  user: Pick<User, "name" | "email"> | null,
): SettingsProfile | null {
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
