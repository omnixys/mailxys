export type MailErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "INTERNAL_ERROR"
  | "INVALID_REQUEST"
  | "MAIL_ACCOUNT_MISSING"
  | "MAIL_AUTH_INVALID_RESPONSE"
  | "MAIL_AUTH_UNAVAILABLE"
  | "MAIL_OPERATION_NOT_FOUND"
  | "MAIL_RATE_LIMITED"
  | "MAIL_SERVICE_FORBIDDEN"
  | "JMAP_INVALID_RESPONSE"
  | "JMAP_REQUEST_FAILED"
  | "JMAP_UNAVAILABLE";

export interface MailFailure {
  status: number;
  code: MailErrorCode;
  message: string;
}

export function classifyMailTokenFailure(status: number): MailFailure {
  if (status === 401) {
    return {
      status: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication required",
    };
  }
  if (status === 403) {
    return {
      status: 502,
      code: "MAIL_SERVICE_FORBIDDEN",
      message: "Mail service authentication is unavailable",
    };
  }
  if (status === 429) {
    return {
      status: 503,
      code: "MAIL_RATE_LIMITED",
      message: "Mail service is temporarily busy",
    };
  }
  return {
    status: 502,
    code: "MAIL_AUTH_UNAVAILABLE",
    message: "Mail authentication is unavailable",
  };
}

export function isTransientMailStatus(status: number): boolean {
  return status === 502 || status === 503;
}
