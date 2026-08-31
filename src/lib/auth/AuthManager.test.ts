import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AuthManagerClass,
  isRetryableAuthError,
  isTerminalRefreshError,
} from "./AuthManager";

function graphQLError(extensions: Record<string, unknown>) {
  return { errors: [{ extensions }] };
}

describe("refresh error classification", () => {
  it("keeps the session for retryable identity-provider failures", () => {
    const error = graphQLError({
      code: "IDENTITY_PROVIDER_UNAVAILABLE",
      httpStatus: 503,
      retryable: true,
    });

    expect(isRetryableAuthError(error)).toBe(true);
    expect(isTerminalRefreshError(error)).toBe(false);
  });

  it("expires the session only for terminal refresh failures", () => {
    const error = graphQLError({
      code: "REFRESH_TOKEN_EXPIRED",
      httpStatus: 401,
      retryable: false,
    });

    expect(isRetryableAuthError(error)).toBe(false);
    expect(isTerminalRefreshError(error)).toBe(true);
  });

  it("does not log out for an unclassified transient failure", () => {
    expect(isTerminalRefreshError(new Error("network interrupted"))).toBe(
      false,
    );
  });
});

describe("scheduled refresh", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("contains retryable refresh rejections inside the timer", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const documentState = {
      cookie: `access_expires_at=${Date.now() + 10_000}`,
    };
    vi.stubGlobal("document", documentState);
    vi.stubGlobal("window", { setInterval, clearInterval });
    vi.stubGlobal("navigator", {});
    const mutate = vi.fn().mockRejectedValue(
      graphQLError({
        code: "IDENTITY_PROVIDER_UNAVAILABLE",
        httpStatus: 503,
        retryable: true,
      }),
    );
    const manager = new AuthManagerClass();
    manager.init({ mutate } as never);

    await vi.advanceTimersByTimeAsync(5_000);
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it("serializes refreshes across browser contexts and rechecks expiry", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const documentState = {
      cookie: `access_expires_at=${Date.now() + 10_000}`,
    };
    vi.stubGlobal("document", documentState);
    vi.stubGlobal("window", { setInterval, clearInterval });
    let lockQueue = Promise.resolve();
    vi.stubGlobal("navigator", {
      locks: {
        request: (_name: string, callback: () => Promise<void>) => {
          const result = lockQueue.then(callback);
          lockQueue = result.catch(() => undefined);
          return result;
        },
      },
    });
    const mutate = vi.fn().mockImplementation(async () => {
      documentState.cookie = `access_expires_at=${Date.now() + 300_000}`;
      return { data: { refresh: { accessToken: "updated" } } };
    });
    new AuthManagerClass().init({ mutate } as never);
    new AuthManagerClass().init({ mutate } as never);

    await vi.advanceTimersByTimeAsync(5_000);
    await lockQueue;
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
