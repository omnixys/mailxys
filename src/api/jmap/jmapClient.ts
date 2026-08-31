import type { JmapEmail, JmapMailbox } from "@/features/mail/types";
import type { MailErrorCode } from "@/lib/mail/errors";

export interface JmapApiRequest {
  using: string[];
  methodCalls: Array<[string, Record<string, unknown>, string]>;
}

export interface JmapApiResponse {
  methodResponses: Array<[string, Record<string, unknown>, string]>;
  createdIds?: Record<string, string>;
}

export class MailClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: MailErrorCode | "UNKNOWN",
    message: string,
    readonly requestId?: string,
  ) {
    super(message);
  }
}

async function mailFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/mail${path}`, {
    credentials: "include",
    headers: { "content-type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      code?: MailErrorCode;
      requestId?: string;
    };
    throw new MailClientError(
      response.status,
      payload.code ?? "UNKNOWN",
      payload.error ?? `Mail request failed (${response.status})`,
      payload.requestId,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

class JmapClient {
  getMailboxes(): Promise<JmapMailbox[]> {
    return mailFetch("/mailboxes");
  }

  async getMessages(mailboxId: string): Promise<JmapEmail[]> {
    const messages = await mailFetch<
      Array<JmapEmail & { sentAt?: string; messageId?: string | string[] }>
    >(`/messages?mailboxId=${encodeURIComponent(mailboxId)}`);
    return messages.map((message) => ({
      ...message,
      date: message.sentAt ?? message.receivedAt,
      messageId: Array.isArray(message.messageId)
        ? (message.messageId[0] ?? "")
        : (message.messageId ?? ""),
      from: message.from ?? [],
      to: message.to ?? [],
      textBody: message.textBody ?? [],
      htmlBody: message.htmlBody ?? [],
      attachments: message.attachments ?? [],
      bodyValues: message.bodyValues ?? {},
      headers: message.headers ?? [],
    }));
  }

  markRead(messageId: string, read = true): Promise<void> {
    return mailFetch(`/messages/${encodeURIComponent(messageId)}`, {
      method: "PATCH",
      body: JSON.stringify({ read }),
    });
  }

  send(input: {
    to: string;
    subject: string;
    body: string;
    inReplyTo?: string;
    references?: string[];
  }) {
    return mailFetch<Record<string, unknown>>("/send", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
}

export const jmapClient = new JmapClient();
