"use client";

import type { ApolloClient } from "@apollo/client";
import { AppError, ErrorCode } from "@/errors/app-error";
import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
  LogoutDocument,
  type LogoutMutation,
  type LogoutMutationVariables,
  RefreshDocument,
  type RefreshMutation,
  type RefreshMutationVariables,
} from "@/generated/graphql";
import { getCookie } from "@/lib/apollo/cookie.utils";

type AuthEvent =
  | "auth:login"
  | "auth:logout"
  | "auth:session-expired"
  | "session:refreshed"
  | "user:changed";

type AuthEventListener = (payload?: unknown) => void | Promise<void>;

const TERMINAL_REFRESH_CODES = new Set([
  "INVALID_CREDENTIALS",
  "REFRESH_TOKEN_EXPIRED",
  "UNAUTHENTICATED",
]);
const REFRESH_LOCK_NAME = "omnimail-session-refresh";
const RETRY_DELAYS_MS = [2_000, 5_000, 10_000, 30_000] as const;

function errorRecords(error: unknown): Record<string, unknown>[] {
  if (!error || typeof error !== "object") return [];
  const record = error as Record<string, unknown>;
  const nested = Array.isArray(record.errors)
    ? record.errors.flatMap((item) => errorRecords(item))
    : [];
  return [record, ...nested];
}

function errorExtensions(error: unknown): Record<string, unknown>[] {
  return errorRecords(error).flatMap((record) => {
    const extensions = record.extensions;
    return extensions && typeof extensions === "object"
      ? [extensions as Record<string, unknown>]
      : [];
  });
}

export function isRetryableAuthError(error: unknown): boolean {
  return errorExtensions(error).some(
    (extensions) =>
      extensions.retryable === true ||
      extensions.code === "IDENTITY_PROVIDER_UNAVAILABLE" ||
      (typeof extensions.httpStatus === "number" &&
        extensions.httpStatus >= 500),
  );
}

export function isTerminalRefreshError(error: unknown): boolean {
  if (isRetryableAuthError(error)) return false;
  return errorExtensions(error).some(
    (extensions) =>
      (typeof extensions.code === "string" &&
        TERMINAL_REFRESH_CODES.has(extensions.code)) ||
      extensions.httpStatus === 401,
  );
}

class AuthEventEmitter {
  private readonly listeners = new Map<AuthEvent, AuthEventListener[]>();

  on(name: AuthEvent, fn: AuthEventListener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name)?.push(fn);
  }

  off(name: AuthEvent, fn: AuthEventListener) {
    const list = this.listeners.get(name);
    if (!list) return;
    this.listeners.set(
      name,
      list.filter((l) => l !== fn),
    );
  }

  emit(name: AuthEvent, payload?: unknown) {
    this.listeners.get(name)?.forEach((fn) => {
      void Promise.resolve(fn(payload)).catch((error: unknown) => {
        console.error("[Auth Event Error]", { name, error });
      });
    });
  }
}

export const AuthEventsBus = new AuthEventEmitter();

export class AuthManagerClass {
  private intervalId: number | null = null;
  private apollo: ApolloClient | null = null;
  private refreshPromise: Promise<void> | null = null;
  private retryAttempt = 0;
  private retryAt = 0;

  init(apollo?: ApolloClient) {
    if (apollo) {
      this.apollo = apollo;
    }

    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        void this.checkRefresh();
      }, 5000);
    }
  }

  private async checkRefresh() {
    if (this.refreshPromise || Date.now() < this.retryAt) return;

    this.refreshPromise = this.refreshWhenNeeded().finally(() => {
      this.refreshPromise = null;
    });
    await this.refreshPromise;
  }

  private async refreshWhenNeeded(): Promise<void> {
    if (!this.shouldRefresh()) return;

    const run = async () => {
      if (!this.shouldRefresh()) return;
      try {
        await this.forceRefresh();
        this.retryAttempt = 0;
        this.retryAt = 0;
      } catch (error: unknown) {
        this.handleRefreshError(error);
      }
    };

    if (typeof navigator !== "undefined" && navigator.locks) {
      await navigator.locks.request(REFRESH_LOCK_NAME, run);
      return;
    }

    await run();
  }

  private shouldRefresh(): boolean {
    if (Date.now() < this.retryAt) return false;

    const expRaw = getCookie("access_expires_at");
    if (!expRaw) return false;

    const expiresAt = Number(expRaw);
    if (!Number.isFinite(expiresAt)) return false;
    const remainingMs = expiresAt - Date.now();
    return remainingMs <= 30_000 && remainingMs > 0;
  }

  private handleRefreshError(error: unknown): void {
    if (isTerminalRefreshError(error)) {
      this.retryAttempt = 0;
      this.retryAt = 0;
      AuthEventsBus.emit("auth:session-expired");
      return;
    }

    const delay =
      RETRY_DELAYS_MS[Math.min(this.retryAttempt, RETRY_DELAYS_MS.length - 1)];
    this.retryAttempt += 1;
    this.retryAt = Date.now() + (delay ?? 30_000);
  }

  async login(input: { username: string; password: string }): Promise<void> {
    this.assertApollo();

    const res = await this.apollo?.mutate<
      LoginMutation,
      LoginMutationVariables
    >({
      mutation: LoginDocument,
      variables: { input },
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (!res?.data?.credentialsLogin) {
      throw new AppError({
        code: ErrorCode.AUTHENTICATION_FAILED,
        message: "Login response was incomplete",
        operationName: "CredentialsLogin",
      });
    }

    AuthEventsBus.emit("auth:login");
  }

  async forceRefresh(): Promise<void> {
    this.assertApollo();

    const res = await this.apollo?.mutate<
      RefreshMutation,
      RefreshMutationVariables
    >({
      mutation: RefreshDocument,
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (!res?.data?.refresh) {
      throw new AppError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Refresh response was incomplete",
        operationName: "Refresh",
      });
    }

    AuthEventsBus.emit("session:refreshed");
  }

  async logout(): Promise<void> {
    this.assertApollo();

    await this.apollo?.mutate<LogoutMutation, LogoutMutationVariables>({
      mutation: LogoutDocument,
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    AuthEventsBus.emit("auth:logout");
  }

  private assertApollo() {
    if (!this.apollo) {
      throw new AppError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Authentication client is not initialized",
      });
    }
  }
}

export const AuthManager = new AuthManagerClass();
