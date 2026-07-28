export enum ErrorCode {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",
}

interface AppErrorOptions {
  code: ErrorCode;
  message: string;
  operationName?: string;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly operationName: string | undefined;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.operationName = options.operationName;
  }

  toLogContext() {
    return {
      code: this.code,
      message: this.message,
      operationName: this.operationName,
    };
  }
}
