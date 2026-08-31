"use client";

import type { AnalyticsTokenProvider } from "@omnixys/analytics-sdk";

/**
 * Fetches an analytics bearer token from the local BFF. The BFF mints a
 * short-lived anonymous token signed with the server-only consent secret, so
 * the browser never sees or stores a long-lived analytics secret.
 */
export const fetchAnalyticsToken: AnalyticsTokenProvider = async (request) => {
  const response = await fetch("/api/analytics/token", {
    method: "POST",
    body: JSON.stringify({ forceRefresh: request.forceRefresh }),
    headers: { "content-type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Analytics token request failed (${response.status})`);
  }
  const payload = (await response.json()) as { token?: string };
  return payload.token ?? "";
};
