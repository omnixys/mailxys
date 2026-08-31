export type AdminErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "INVALID_REQUEST"
  | "ADMIN_FAILED_TO_LOGIN"
  | "ADMIN_AUTH_INVALID_RESPONSE"
  | "ADMIN_AUTH_UNAVAILABLE"
  | "ADMIN_OPERATION_NOT_FOUND"
  | "ADMIN_RATE_LIMITED"
  | "ADMIN_SERVICE_FORBIDDEN"
  | "JMAP_INVALID_RESPONSE"
  | "JMAP_REQUEST_FAILED"
  | "JMAP_UNAVAILABLE";

export interface AdminFailure {
  status: number;
  code: AdminErrorCode;
  message: string;
}

export function classifyAdminLoginFailure(status: number): AdminFailure {
  if (status === 401) {
    return {
      status: 401,
      code: "ADMIN_FAILED_TO_LOGIN",
      message: "Admin authentication failed",
    };
  }
  if (status === 403) {
    return {
      status: 502,
      code: "ADMIN_SERVICE_FORBIDDEN",
      message: "Admin service authentication is unavailable",
    };
  }
  if (status === 429) {
    return {
      status: 503,
      code: "ADMIN_RATE_LIMITED",
      message: "Admin service is temporarily busy",
    };
  }
  return {
    status: 502,
    code: "ADMIN_AUTH_UNAVAILABLE",
    message: "Admin authentication is unavailable",
  };
}

export function isTransientAdminStatus(status: number): boolean {
  return status === 502 || status === 503;
}
