import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/env.server", () => ({
  env: { BACKEND_SERVER_URL: "https://gateway.test/graphql" },
}));

import { POST } from "./route";

describe("POST /api/auth/login", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("returns 400 without calling the gateway for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 without calling the gateway for empty credentials", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: " ", password: "" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [401, 401],
    [403, 401],
    [429, 502],
    [503, 502],
  ])("maps gateway status %i to %i", async (gatewayStatus, expectedStatus) => {
    fetchMock.mockResolvedValue(new Response(null, { status: gatewayStatus }));

    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "user", password: "secret" }),
      }),
    );

    expect(response.status).toBe(expectedStatus);
  });
});
