import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mail = vi.hoisted(() => ({
  ensureMailAccount: vi.fn(),
  getMessage: vi.fn(),
  getMailboxes: vi.fn(),
  getMessages: vi.fn(),
  mailAccessToken: vi.fn(),
  markMessageRead: vi.fn(),
  sendMessage: vi.fn(),
}));

vi.mock("@/lib/mail/stalwart.server", () => ({
  ...mail,
  MailApiError: class MailApiError extends Error {
    constructor(
      readonly status: number,
      readonly code: string,
      message: string,
    ) {
      super(message);
    }
  },
}));

import { GET, POST } from "./route";

describe("mail route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mail.mailAccessToken.mockResolvedValue("mail-token");
    mail.ensureMailAccount.mockResolvedValue("account");
    mail.getMailboxes.mockResolvedValue([{ id: "inbox" }]);
    mail.getMessages.mockResolvedValue([{ id: "message" }]);
    mail.getMessage.mockResolvedValue({ id: "message", bodyValues: {} });
    mail.sendMessage.mockResolvedValue({ send: {} });
  });

  it("loads mailboxes with exactly one token exchange", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/mail/mailboxes"),
      { params: Promise.resolve({ path: ["mailboxes"] }) },
    );

    expect(response.status).toBe(200);
    expect(mail.mailAccessToken).toHaveBeenCalledTimes(1);
    expect(mail.getMailboxes).toHaveBeenCalledWith(
      "mail-token",
      "account",
      expect.any(String),
    );
  });

  it("loads messages with exactly one token exchange", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/mail/messages?mailboxId=inbox"),
      { params: Promise.resolve({ path: ["messages"] }) },
    );

    expect(response.status).toBe(200);
    expect(mail.mailAccessToken).toHaveBeenCalledTimes(1);
    expect(mail.getMessages).toHaveBeenCalledWith(
      "mail-token",
      "account",
      "inbox",
      expect.any(String),
    );
  });

  it("sends messages with exactly one token exchange", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/mail/send", {
        method: "POST",
        body: JSON.stringify({
          to: "you@test",
          subject: "Hello",
          body: "World",
        }),
      }),
      { params: Promise.resolve({ path: ["send"] }) },
    );

    expect(response.status).toBe(201);
    expect(mail.mailAccessToken).toHaveBeenCalledTimes(1);
    expect(mail.sendMessage).toHaveBeenCalledWith(
      "mail-token",
      "account",
      { to: "you@test", subject: "Hello", body: "World" },
      expect.any(String),
    );
  });

  it("loads one complete message with exactly one token exchange", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/mail/messages/message-1"),
      { params: Promise.resolve({ path: ["messages", "message-1"] }) },
    );

    expect(response.status).toBe(200);
    expect(mail.mailAccessToken).toHaveBeenCalledTimes(1);
    expect(mail.getMessage).toHaveBeenCalledWith(
      "mail-token",
      "account",
      "message-1",
      expect.any(String),
    );
  });

  it("rejects unknown route shapes before using mail credentials", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/mail/messages/message-1/extra"),
      {
        params: Promise.resolve({
          path: ["messages", "message-1", "extra"],
        }),
      },
    );

    expect(response.status).toBe(404);
    expect(mail.mailAccessToken).not.toHaveBeenCalled();
  });
});
