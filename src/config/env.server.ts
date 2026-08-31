import "server-only";

import { env as publicEnv } from "./env";
import { getEnv, minLength, toHttpUrl } from "./env.shared";

export const env = {
  ...publicEnv,
  BACKEND_SERVER_URL: getEnv(
    "BACKEND_SERVER_URL",
    process.env.BACKEND_SERVER_URL,
    { fallback: publicEnv.BACKEND_SERVER_URL, transform: toHttpUrl },
  ),
  ANALYTICS_CONSENT_SECRET: getEnv(
    "ANALYTICS_CONSENT_SECRET",
    process.env.ANALYTICS_CONSENT_SECRET,
    { required: true, transform: minLength(2) },
  ),
  NEXT_RUNTIME: getEnv("NEXT_RUNTIME", process.env.NEXT_RUNTIME, {
    fallback: "nodejs",
  }),
} as const;
