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
  | "session:refreshed"
  | "user:changed";

class AuthEventEmitter {
  private readonly listeners = new Map<
    AuthEvent,
    Array<(payload?: unknown) => void>
  >();

  on(name: AuthEvent, fn: (payload?: unknown) => void) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name)?.push(fn);
  }

  off(name: AuthEvent, fn: (payload?: unknown) => void) {
    const list = this.listeners.get(name);
    if (!list) return;
    this.listeners.set(
      name,
      list.filter((l) => l !== fn),
    );
  }

  emit(name: AuthEvent, payload?: unknown) {
    this.listeners.get(name)?.forEach((fn) => {
      fn(payload);
    });
  }
}

export const AuthEventsBus = new AuthEventEmitter();

class AuthManagerClass {
  private intervalId: number | null = null;
  private apollo: ApolloClient | null = null;
  private isRefreshing = false;

  init(apollo?: ApolloClient) {
    if (apollo) {
      this.apollo = apollo;
    }

    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        this.checkRefresh();
      }, 5000);
    }
  }

  private async checkRefresh() {
    if (this.isRefreshing) return;

    const expRaw = getCookie("access_expires_at");
    if (!expRaw) return;

    const expiresAt = Number(expRaw);
    const remainingMs = expiresAt - Date.now();

    if (remainingMs <= 30_000 && remainingMs > 0) {
      this.isRefreshing = true;
      try {
        await this.forceRefresh();
      } finally {
        this.isRefreshing = false;
      }
    }
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
