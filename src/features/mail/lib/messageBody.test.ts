import { describe, expect, it } from "vitest";
import type { JmapEmail } from "@/features/mail/types";
import { resolveMessageBody, safeHtmlDocument } from "./messageBody";

function email(overrides: Partial<JmapEmail>): JmapEmail {
  return {
    id: "message",
    blobId: "blob",
    threadId: "thread",
    mailboxIds: { inbox: true },
    keywords: {},
    receivedAt: "2026-01-01T00:00:00Z",
    date: "2026-01-01T00:00:00Z",
    size: 1,
    subject: "Subject",
    from: [],
    to: [],
    messageId: "message-id",
    textBody: [],
    htmlBody: [],
    attachments: [],
    bodyValues: {},
    headers: [],
    ...overrides,
  };
}

describe("message body resolution", () => {
  it("prefers and combines all HTML body parts", () => {
    expect(
      resolveMessageBody(
        email({
          htmlBody: [
            { partId: "h1", type: "text/html", size: 1 },
            { partId: "h2", type: "text/html", size: 1 },
          ],
          bodyValues: {
            h1: {
              value: "<p>Hello</p>",
              isEncodingProblem: false,
              isTruncated: false,
            },
            h2: {
              value: "<p>World</p>",
              isEncodingProblem: false,
              isTruncated: false,
            },
          },
        }),
      ),
    ).toEqual({ content: "<p>Hello</p>\n\n<p>World</p>", isHtml: true });
  });

  it("resolves nested plain-text parts without base64 guessing", () => {
    const base64LookingText = "QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=";
    expect(
      resolveMessageBody(
        email({
          bodyStructure: {
            partId: "root",
            type: "multipart/alternative",
            size: 1,
            subParts: [{ partId: "text", type: "text/plain", size: 1 }],
          },
          bodyValues: {
            text: {
              value: base64LookingText,
              isEncodingProblem: false,
              isTruncated: false,
            },
          },
        }),
      ),
    ).toEqual({ content: base64LookingText, isHtml: false });
  });

  it("falls back to the JMAP preview", () => {
    expect(resolveMessageBody(email({ preview: "Preview" }))).toEqual({
      content: "Preview",
      isHtml: false,
    });
  });

  it("blocks scripts and externally loaded images in HTML mail", () => {
    const document = safeHtmlDocument('<img src="https://tracker.test/pixel">');
    expect(document).toContain("default-src 'none'");
    expect(document).toContain("img-src data:");
  });
});
