import { beforeEach, describe, expect, it, vi } from "vitest";

const nextHeaders = vi.hoisted(() => ({ cookies: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => nextHeaders);

import {
  ensureMailAccount,
  jmapSecure,
  mailAccessToken,
  sendMessage,
} from "./stalwart.server";

describe("Stalwart server client", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("MAIL_TOKEN_URL", "https://gateway.test/v1/mail/token");
    vi.stubEnv("OMNIMAIL_SERVICE_TOKEN", "service-token");
    vi.stubEnv("STALWART_JMAP_URL", "https://mail.test/jmap");
    nextHeaders.cookies.mockResolvedValue({
      get: () => ({ value: "platform-token" }),
    });
  });

  it("rejects an invalid mail-token response", async () => {
    fetchMock.mockResolvedValue(Response.json({ tokenType: "Bearer" }));

    await expect(mailAccessToken("request-1")).rejects.toMatchObject({
      status: 502,
      code: "MAIL_AUTH_INVALID_RESPONSE",
    });
  });

  it("rejects an invalid JMAP response", async () => {
    fetchMock.mockResolvedValue(Response.json({}));

    await expect(
      jmapSecure("mail-token", [], "request-1"),
    ).rejects.toMatchObject({
      status: 502,
      code: "JMAP_INVALID_RESPONSE",
    });
  });

  it("resolves the primary mail account", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        accounts: { account: {} },
        primaryAccounts: { "urn:ietf:params:jmap:mail": "account" },
      }),
    );

    await expect(ensureMailAccount("mail-token", "request-1")).resolves.toBe(
      "account",
    );
  });

  it("creates and submits a message with the provided token", async () => {
    fetchMock
      .mockResolvedValueOnce(
        Response.json({
          methodResponses: [
            [
              "Identity/get",
              { list: [{ id: "identity", email: "me@test" }] },
              "identities",
            ],
            [
              "Mailbox/get",
              { list: [{ id: "drafts", role: "drafts" }] },
              "mailboxes",
            ],
          ],
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          methodResponses: [
            ["Email/set", { created: { draft: { id: "email" } } }, "draft"],
          ],
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          methodResponses: [
            ["EmailSubmission/set", { created: { send: {} } }, "submission"],
          ],
        }),
      );

    await expect(
      sendMessage(
        "mail-token",
        "account",
        { to: "you@test", subject: "Hello", body: "World" },
        "request-1",
      ),
    ).resolves.toEqual({ send: {} });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    for (const call of fetchMock.mock.calls) {
      expect(new Headers(call[1]?.headers).get("authorization")).toBe(
        "Bearer mail-token",
      );
    }
  });
});
