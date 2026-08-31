import { MailClientError } from "./jmapClient";

export type MailErrorTranslationKey =
  | "mailAccountMissing"
  | "mailAuthUnavailable"
  | "mailRateLimited"
  | "mailServiceUnavailable"
  | "sessionExpired";

export function mailErrorTranslationKey(
  error: unknown,
): MailErrorTranslationKey | null {
  if (!(error instanceof MailClientError)) return null;
  if (error.status === 401 || error.code === "AUTHENTICATION_REQUIRED") {
    return "sessionExpired";
  }
  if (error.code === "MAIL_ACCOUNT_MISSING") return "mailAccountMissing";
  if (error.code === "MAIL_RATE_LIMITED") return "mailRateLimited";
  if (
    error.code === "MAIL_AUTH_INVALID_RESPONSE" ||
    error.code === "MAIL_AUTH_UNAVAILABLE" ||
    error.code === "MAIL_SERVICE_FORBIDDEN"
  ) {
    return "mailAuthUnavailable";
  }
  if (error.status === 502 || error.status === 503) {
    return "mailServiceUnavailable";
  }
  return null;
}
