"use client";

import {
  AnalyticsTokenManager,
  type ConsentState,
  createAnalytics,
  FetchAnalyticsTransport,
} from "@omnixys/analytics-sdk";
import {
  AnalyticsProvider as SdkAnalyticsProvider,
  useAnalytics,
} from "@omnixys/analytics-sdk/react";
import { usePathname } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/auth/providers/AuthProvider";
import { env } from "@/config/env";
import { fetchAnalyticsToken } from "@/lib/analytics/browser-token-provider";

const OmnixysAnalyticsContext = createContext<ReturnType<
  typeof createAnalytics
> | null>(null);

function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unknown";
  const stored = window.localStorage.getItem("analytics:consent");
  return stored === "granted" || stored === "denied" ? stored : "unknown";
}

export function AnalyticsRootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => {
    const tokens = new AnalyticsTokenManager(undefined, fetchAnalyticsToken);
    const transport = new FetchAnalyticsTransport(
      env.ANALYTICS_URL,
      tokens,
      fetch.bind(globalThis),
    );
    return createAnalytics({
      consent: readConsent(),
      endpoint: env.ANALYTICS_URL,
      transport,
      tokenProvider: fetchAnalyticsToken,
      context: () => ({
        application: "omnimail",
        path: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    });
  });

  return (
    <OmnixysAnalyticsContext.Provider value={client}>
      <SdkAnalyticsProvider client={client}>
        <AnalyticsNavigation />
        <AnalyticsIdentityBridge />
        {children}
      </SdkAnalyticsProvider>
    </OmnixysAnalyticsContext.Provider>
  );
}

function AnalyticsNavigation() {
  const analytics = useAnalytics();
  const pathname = usePathname();

  useEffect(() => {
    analytics.page("$pageview", { path: pathname });
  }, [analytics, pathname]);

  return null;
}

function AnalyticsIdentityBridge() {
  const analytics = useAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id)
      analytics.identify(user.id, { email: user.email, name: user.name });
  }, [analytics, user?.id, user?.email, user?.name]);

  return null;
}

export function useOmnixysAnalytics(): ReturnType<typeof createAnalytics> {
  const context = useContext(OmnixysAnalyticsContext);
  if (!context) {
    throw new Error(
      "useOmnixysAnalytics must be used inside OmnixysAnalyticsProvider",
    );
  }
  return context;
}
