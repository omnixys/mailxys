function getClientEnv(key: string, fallback: string): string {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (typeof window === "undefined") return fallback;
  return fallback;
}

export const env = {
  NEXT_PUBLIC_BACKEND_SERVER_URL: getClientEnv(
    "NEXT_PUBLIC_BACKEND_SERVER_URL",
    "http://localhost:8000/graphql",
  ),
  NEXT_PUBLIC_GRAPHQL_WS_URL: getClientEnv(
    "NEXT_PUBLIC_GRAPHQL_WS_URL",
    "ws://localhost:8000/ws",
  ),
  NEXT_PUBLIC_APP_URL: getClientEnv(
    "NEXT_PUBLIC_APP_URL",
    "http://localhost:3000",
  ),
  NEXT_PUBLIC_AUTH_API_BASE_URL: getClientEnv(
    "NEXT_PUBLIC_AUTH_API_BASE_URL",
    "http://localhost:8000",
  ),
};
