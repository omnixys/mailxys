import { beforeEach, describe, expect, it, vi } from "vitest";

const nextHeaders = vi.hoisted(() => ({ cookies: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => nextHeaders);
vi.mock("@/config/env.server", () => ({
  env: {
    MAIL_TOKEN_URL: "https://gateway.test/v1/mail/token",
    OMNIMAIL_SERVICE_TOKEN: "service-token",
    STALWART_JMAP_URL: "https://mail.test/jmap",
    OMNIXYS_TENANT_ID: "default",
  },
}));

import {
  ensureMailAccount,
  getMessage,
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
              {
                list: [
                  { id: "drafts", role: "drafts" },
                  { id: "sent", role: "sent" },
                ],
              },
              "mailboxes",
            ],
          ],
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          methodResponses: [
            ["Email/set", { created: { draft: { id: "email" } } }, "draft"],
            [
              "EmailSubmission/set",
              { created: { send: { id: "submission" } } },
              "submission",
            ],
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
    ).resolves.toEqual({ emailId: "email", submissionId: "submission" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const call of fetchMock.mock.calls) {
      expect(new Headers(call[1]?.headers).get("authorization")).toBe(
        "Bearer mail-token",
      );
    }
    const request = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body));
    expect(request.methodCalls[1][1]).toMatchObject({
      create: {
        send: {
          emailId: "#draft",
          identityId: "identity",
          envelope: {
            mailFrom: { email: "me@test" },
            rcptTo: [{ email: "you@test" }],
          },
        },
      },
      onSuccessUpdateEmail: {
        "#send": {
          "mailboxIds/drafts": null,
          "mailboxIds/sent": true,
          "keywords/$draft": null,
          "keywords/$seen": true,
        },
      },
    });
  });

  it("rejects a per-object submission failure", async () => {
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
              {
                list: [
                  { id: "drafts", role: "drafts" },
                  { id: "sent", role: "sent" },
                ],
              },
              "mailboxes",
            ],
          ],
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          methodResponses: [
            ["Email/set", { created: { draft: { id: "email" } } }, "draft"],
            [
              "EmailSubmission/set",
              { notCreated: { send: { type: "invalidRecipients" } } },
              "submission",
            ],
          ],
        }),
      );

    await expect(
      sendMessage(
        "mail-token",
        "account",
        { to: "invalid", subject: "Hello", body: "World" },
        "request-1",
      ),
    ).rejects.toMatchObject({ status: 422, code: "MAIL_RECIPIENTS_INVALID" });
  });

  it("loads a complete message body by id", async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        methodResponses: [
          ["Email/get", { list: [{ id: "message", bodyValues: {} }] }, "email"],
        ],
      }),
    );

    await expect(
      getMessage("mail-token", "account", "message", "request-1"),
    ).resolves.toMatchObject({ id: "message" });
    const request = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(request.methodCalls[0][1]).toMatchObject({
      ids: ["message"],
      fetchTextBodyValues: true,
      fetchHTMLBodyValues: true,
      fetchAllBodyValues: true,
    });
  });
});
