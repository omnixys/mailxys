import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
const admin = vi.hoisted(() => ({
  adminAccessToken: vi.fn(),
  deleteAccount: vi.fn(),
  deleteDomain: vi.fn(),
  deleteGroup: vi.fn(),
  deleteQuota: vi.fn(),
  deleteRecipient: vi.fn(),
  getAccounts: vi.fn(),
  getDomains: vi.fn(),
  getGroups: vi.fn(),
  getQueue: vi.fn(),
  getQuotas: vi.fn(),
  getRecipients: vi.fn(),
  setAccountEnabled: vi.fn(),
  setDomainEnabled: vi.fn(),
}));

vi.mock("@/lib/auth/get-current-user", () => auth);
vi.mock("@/lib/admin/stalwart-admin.server", () => ({
  ...admin,
  AdminApiError: class AdminApiError extends Error {
    constructor(
      readonly status: number,
      readonly code: string,
      message: string,
    ) {
      super(message);
    }
  },
}));

import { DELETE, GET, PATCH } from "./route";

function context(path?: readonly string[]) {
  return {
    params: Promise.resolve(path ? { path: [...path] } : {}),
  };
}

describe("admin route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    admin.adminAccessToken.mockResolvedValue("admin-token");
    admin.getAccounts.mockResolvedValue([{ id: "account-1" }]);
  });

  it("returns 401 without exchanging admin credentials when unauthenticated", async () => {
    auth.getCurrentUser.mockResolvedValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/admin/accounts"),
      context(["accounts"]),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      code: "AUTHENTICATION_REQUIRED",
    });
    expect(admin.adminAccessToken).not.toHaveBeenCalled();
  });

  it("returns 403 without exchanging admin credentials when unauthorized", async () => {
    auth.getCurrentUser.mockResolvedValue({ role: "BASIC" });

    const response = await GET(
      new NextRequest("http://localhost/api/admin/accounts"),
      context(["accounts"]),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ code: "FORBIDDEN" });
    expect(admin.adminAccessToken).not.toHaveBeenCalled();
  });

  it("allows an administrator to load accounts", async () => {
    auth.getCurrentUser.mockResolvedValue({ role: "ADMIN" });

    const response = await GET(
      new NextRequest("http://localhost/api/admin/accounts"),
      context(["accounts"]),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([{ id: "account-1" }]);
    expect(admin.adminAccessToken).toHaveBeenCalledTimes(1);
    expect(admin.getAccounts).toHaveBeenCalledWith(
      "admin-token",
      expect.any(String),
    );
  });

  it.each([
    ["missing GET path", "GET", undefined, 404],
    ["empty GET segment", "GET", [""], 422],
    ["long PATCH path", "PATCH", ["accounts", "id", "enabled", "extra"], 404],
    ["long DELETE path", "DELETE", ["accounts", "id", "extra"], 404],
  ] as const)(
    "rejects an invalid route: %s",
    async (_name, method, path, status) => {
      auth.getCurrentUser.mockResolvedValue({ role: "ADMIN" });
      const request = new NextRequest("http://localhost/api/admin/invalid", {
        method,
      });
      const handler =
        method === "GET" ? GET : method === "PATCH" ? PATCH : DELETE;

      const response = await handler(request, context(path));

      expect(response.status).toBe(status);
      expect(auth.getCurrentUser).not.toHaveBeenCalled();
      expect(admin.adminAccessToken).not.toHaveBeenCalled();
    },
  );
});
