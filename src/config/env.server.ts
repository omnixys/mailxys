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
  MAIL_TOKEN_URL: getEnv("MAIL_TOKEN_URL", process.env.MAIL_TOKEN_URL, {
    required: true,
    transform: toHttpUrl,
  }),
  OMNIMAIL_SERVICE_TOKEN: getEnv(
    "OMNIMAIL_SERVICE_TOKEN",
    process.env.OMNIMAIL_SERVICE_TOKEN,
    { required: true },
  ),
  OMNIXYS_TENANT_ID: getEnv(
    "OMNIXYS_TENANT_ID",
    process.env.OMNIXYS_TENANT_ID,
    { fallback: publicEnv.OMNIXYS_TENANT_ID },
  ),
  STALWART_JMAP_URL: getEnv(
    "STALWART_JMAP_URL",
    process.env.STALWART_JMAP_URL,
    { required: true, transform: toHttpUrl },
  ),
  ADMIN_USERNAME: getEnv("ADMIN_USERNAME", process.env.ADMIN_USERNAME, {
    required: true,
  }),
  ADMIN_PASSWORD: getEnv("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD, {
    required: true,
  }),
  NEXT_RUNTIME: getEnv("NEXT_RUNTIME", process.env.NEXT_RUNTIME, {
    fallback: "nodejs",
  }),
} as const;
