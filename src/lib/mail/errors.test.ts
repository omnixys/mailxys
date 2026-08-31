import { describe, expect, it } from "vitest";
import { classifyMailTokenFailure, isTransientMailStatus } from "./errors";

describe("classifyMailTokenFailure", () => {
  it.each([
    [401, 401, "AUTHENTICATION_REQUIRED"],
    [403, 502, "MAIL_SERVICE_FORBIDDEN"],
    [429, 503, "MAIL_RATE_LIMITED"],
    [500, 502, "MAIL_AUTH_UNAVAILABLE"],
    [503, 502, "MAIL_AUTH_UNAVAILABLE"],
  ] as const)("maps upstream status %i", (upstream, status, code) => {
    expect(classifyMailTokenFailure(upstream)).toMatchObject({ status, code });
  });
});

describe("isTransientMailStatus", () => {
  it("only pauses polling for temporary upstream failures", () => {
    expect(isTransientMailStatus(502)).toBe(true);
    expect(isTransientMailStatus(503)).toBe(true);
    expect(isTransientMailStatus(401)).toBe(false);
    expect(isTransientMailStatus(422)).toBe(false);
  });
});
