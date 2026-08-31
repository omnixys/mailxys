import { describe, expect, it } from "vitest";
import { gatewayLoginFailure, validateLoginInput } from "./login-validation";

describe("validateLoginInput", () => {
  it("rejects empty credentials without accepting whitespace", () => {
    expect(validateLoginInput({ username: "  ", password: "" })).toEqual({
      success: false,
      fields: { username: "required", password: "required" },
    });
  });

  it("normalizes the username without changing the password", () => {
    expect(
      validateLoginInput({
        username: "  user@example.com ",
        password: " pass ",
      }),
    ).toEqual({
      success: true,
      data: { username: "user@example.com", password: " pass " },
    });
  });
});

describe("gatewayLoginFailure", () => {
  it.each([401, 403])(
    "maps gateway status %i to an authentication failure",
    (status) => {
      expect(gatewayLoginFailure(status)).toEqual({
        status: 401,
        message: "Authentication failed",
      });
    },
  );

  it.each([400, 429, 500, 503])(
    "maps gateway status %i to an upstream failure",
    (status) => {
      expect(gatewayLoginFailure(status)).toEqual({
        status: 502,
        message: "Authentication service is unavailable",
      });
    },
  );
});
