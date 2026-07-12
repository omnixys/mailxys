"use client";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? (match[1] ? decodeURIComponent(match[1]) : null) : null;
}

export function getAccessTokenClient(): string | null {
  return getCookie("access_token");
}
