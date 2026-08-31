import "server-only";
import { cookies } from "next/headers";
import { env } from "@/config/env.server";
import {
  classifyMailTokenFailure,
  type MailErrorCode,
} from "@/lib/mail/errors";

const UPSTREAM_TIMEOUT_MS = 10_000;

type JmapResponse = {
  methodResponses: Array<[string, Record<string, unknown>, string]>;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server environment variable ${name}`);
  return value;
}

export class MailApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: MailErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export async function mailAccessToken(requestId: string): Promise<string> {
  const store = await cookies();
  const platformToken = store.get("access_token")?.value;
  if (!platformToken) {
    throw new MailApiError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authentication required",
    );
  }
  try {
    const res = await fetch(required("MAIL_TOKEN_URL"), {
      method: "POST",
      headers: {
        authorization: `Bearer ${platformToken}`,
        "x-omnimail-service-token": env.OMNIMAIL_SERVICE_TOKEN,
        "x-request-id": requestId,
        "x-correlation-id": requestId,
        "x-tenant-id": env.OMNIXYS_TENANT_ID,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("[Mail Token] Gateway rejected request", {
        status: res.status,
        requestId,
      });
      const failure = classifyMailTokenFailure(res.status);
      throw new MailApiError(failure.status, failure.code, failure.message);
    }
    const data = (await res.json().catch(() => null)) as {
      accessToken?: string;
      tokenType?: string;
      expiresIn?: number;
    } | null;
    if (
      !data?.accessToken ||
      data.tokenType !== "Bearer" ||
      typeof data.expiresIn !== "number" ||
      data.expiresIn <= 0
    ) {
      console.error("[Mail Token] Invalid gateway response", { requestId });
      throw new MailApiError(
        502,
        "MAIL_AUTH_INVALID_RESPONSE",
        "Mail authentication is unavailable",
      );
    }
    return data.accessToken;
  } catch (error) {
    if (error instanceof MailApiError) throw error;
    console.error("[Mail Token] Gateway request failed", { requestId });
    throw new MailApiError(
      502,
      "MAIL_AUTH_UNAVAILABLE",
      "Mail authentication is unavailable",
    );
  }
}

async function doJmapFetch(
  accessToken: string,
  methodCalls: unknown[],
  requestId: string,
): Promise<Response> {
  return fetch(required("STALWART_JMAP_URL"), {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      "x-request-id": requestId,
      "x-correlation-id": requestId,
    },
    body: JSON.stringify({
      using: [
        "urn:ietf:params:jmap:core",
        "urn:ietf:params:jmap:mail",
        "urn:ietf:params:jmap:submission",
        "urn:stalwart:jmap",
      ],
      methodCalls,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
}

async function parseJmapResponse(
  response: Response,
  requestId: string,
): Promise<JmapResponse> {
  if (!response.ok) {
    console.error("[Stalwart] JMAP error", {
      status: response.status,
      requestId,
    });
    if (response.status === 401) {
      throw new MailApiError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Mail session expired",
      );
    }
    if (response.status === 429) {
      throw new MailApiError(
        503,
        "MAIL_RATE_LIMITED",
        "Mail service is temporarily busy",
      );
    }
    throw new MailApiError(502, "JMAP_UNAVAILABLE", "Stalwart is unavailable");
  }

  const payload = (await response
    .json()
    .catch(() => null)) as JmapResponse | null;
  if (!payload?.methodResponses || !Array.isArray(payload.methodResponses)) {
    console.error("[Stalwart] Invalid JMAP response structure", { requestId });
    throw new MailApiError(
      502,
      "JMAP_INVALID_RESPONSE",
      "Invalid response from the mail service",
    );
  }

  const error = payload.methodResponses.find(([name]) => name === "error");
  if (error) {
    const detail = String(
      error[1].description ?? error[1].type ?? "JMAP request failed",
    );
    console.error("[Stalwart] JMAP request failed", { detail, requestId });
    throw new MailApiError(502, "JMAP_REQUEST_FAILED", "Mail request failed");
  }

  return payload;
}

export async function jmapSecure(
  accessToken: string,
  methodCalls: unknown[],
  requestId: string,
): Promise<JmapResponse> {
  try {
    const response = await doJmapFetch(accessToken, methodCalls, requestId);
    return parseJmapResponse(response, requestId);
  } catch (error) {
    if (error instanceof MailApiError) throw error;
    console.error("[Stalwart] JMAP request unavailable", { requestId });
    throw new MailApiError(502, "JMAP_UNAVAILABLE", "Stalwart is unavailable");
  }
}

export async function ensureMailAccount(
  accessToken: string,
  requestId: string,
): Promise<string> {
  const sessionUrl = required("STALWART_JMAP_URL").replace(
    /\/jmap\/?$/,
    "/jmap/session",
  );
  let response: Response;
  try {
    response = await fetch(sessionUrl, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-request-id": requestId,
        "x-correlation-id": requestId,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    console.error("[Stalwart] Session request unavailable", { requestId });
    throw new MailApiError(502, "JMAP_UNAVAILABLE", "Stalwart is unavailable");
  }
  if (response.status === 401) {
    console.error("[Stalwart] Session returned 401", { requestId });
    throw new MailApiError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Mail session is not authenticated",
    );
  }
  if (!response.ok) {
    console.error("[Stalwart] Session returned error", {
      status: response.status,
      requestId,
    });
    throw new MailApiError(502, "JMAP_UNAVAILABLE", "Stalwart is unavailable");
  }
  const session = (await response.json().catch(() => null)) as {
    accounts?: Record<string, unknown>;
    primaryAccounts?: Record<string, string>;
  } | null;
  if (!session || typeof session !== "object") {
    console.error("[Stalwart] Invalid session response", { requestId });
    throw new MailApiError(
      502,
      "JMAP_INVALID_RESPONSE",
      "Invalid response from the mail service",
    );
  }
  const accountId =
    session.primaryAccounts?.["urn:ietf:params:jmap:mail"] ??
    Object.keys(session.accounts ?? {})[0];
  if (!accountId)
    throw new MailApiError(
      503,
      "MAIL_ACCOUNT_MISSING",
      "No mailbox is provisioned for this account",
    );

  return accountId;
}

export async function getMailboxes(
  accessToken: string,
  accountId: string,
  requestId: string,
) {
  const result = await jmapSecure(
    accessToken,
    [["Mailbox/get", { accountId }, "mailboxes"]],
    requestId,
  );
  const response = result.methodResponses[0];
  if (!response) return [];
  const list = response[1]?.list;
  return Array.isArray(list) ? list : [];
}

export async function getMessages(
  accessToken: string,
  accountId: string,
  mailboxId: string,
  requestId: string,
) {
  const result = await jmapSecure(
    accessToken,
    [
      [
        "Email/query",
        {
          accountId,
          filter: { inMailbox: mailboxId },
          sort: [{ property: "receivedAt", isAscending: false }],
          limit: 100,
        },
        "query",
      ],
      [
        "Email/get",
        {
          accountId,
          "#ids": { resultOf: "query", name: "Email/query", path: "/ids/*" },
          properties: [
            "id",
            "blobId",
            "threadId",
            "mailboxIds",
            "keywords",
            "receivedAt",
            "size",
            "subject",
            "from",
            "to",
            "cc",
            "bcc",
            "replyTo",
            "sender",
            "sentAt",
            "messageId",
            "inReplyTo",
            "references",
            "preview",
            "hasAttachment",
          ],
        },
        "emails",
      ],
    ],
    requestId,
  );
  const emailResponse = result.methodResponses.find(
    ([name]) => name === "Email/get",
  );
  if (!emailResponse) return [];
  const list = emailResponse[1]?.list;
  return Array.isArray(list) ? list : [];
}

export async function getMessage(
  accessToken: string,
  accountId: string,
  messageId: string,
  requestId: string,
) {
  const result = await jmapSecure(
    accessToken,
    [
      [
        "Email/get",
        {
          accountId,
          ids: [messageId],
          properties: [
            "id",
            "blobId",
            "threadId",
            "mailboxIds",
            "keywords",
            "receivedAt",
            "sentAt",
            "size",
            "subject",
            "from",
            "to",
            "cc",
            "bcc",
            "replyTo",
            "sender",
            "messageId",
            "inReplyTo",
            "references",
            "preview",
            "bodyStructure",
            "textBody",
            "htmlBody",
            "attachments",
            "bodyValues",
            "hasAttachment",
          ],
          bodyProperties: [
            "partId",
            "blobId",
            "size",
            "name",
            "type",
            "charset",
            "disposition",
            "cid",
            "language",
            "location",
          ],
          fetchTextBodyValues: true,
          fetchHTMLBodyValues: true,
          fetchAllBodyValues: true,
          maxBodyValueBytes: 5_000_000,
        },
        "email",
      ],
    ],
    requestId,
  );
  const response = result.methodResponses.find(
    ([name, , callId]) => name === "Email/get" && callId === "email",
  );
  const list = response?.[1]?.list;
  const message = Array.isArray(list) ? list[0] : undefined;
  if (!message) {
    throw new MailApiError(
      404,
      "MAIL_OPERATION_NOT_FOUND",
      "Message not found",
    );
  }
  return message;
}

export async function markMessageRead(
  accessToken: string,
  accountId: string,
  messageId: string,
  read: boolean,
  requestId: string,
) {
  const patch = read ? { "keywords/$seen": true } : { "keywords/$seen": null };
  await jmapSecure(
    accessToken,
    [["Email/set", { accountId, update: { [messageId]: patch } }, "read"]],
    requestId,
  );
}

export type SendMailInput = {
  to: string;
  subject: string;
  body: string;
  inReplyTo?: string;
  references?: string[];
};

export async function sendMessage(
  accessToken: string,
  accountId: string,
  input: SendMailInput,
  requestId: string,
) {
  if (!input.to.trim() || !input.body.trim())
    throw new MailApiError(
      422,
      "INVALID_REQUEST",
      "Recipient and body are required",
    );
  const setup = await jmapSecure(
    accessToken,
    [
      ["Identity/get", { accountId }, "identities"],
      ["Mailbox/get", { accountId }, "mailboxes"],
    ],
    requestId,
  );

  const identityResponse = setup.methodResponses.find(
    ([name]) => name === "Identity/get",
  );
  const identityList = identityResponse?.[1]?.list;
  const identity = Array.isArray(identityList)
    ? (identityList as Array<{ id: string; email: string }>)[0]
    : undefined;

  const mailboxResponse = setup.methodResponses.find(
    ([name]) => name === "Mailbox/get",
  );
  const mailboxList = mailboxResponse?.[1]?.list;
  const mailboxes = Array.isArray(mailboxList)
    ? (mailboxList as Array<{ id: string; role?: string }>)
    : [];
  const drafts = mailboxes.find((mailbox) => mailbox.role === "drafts");
  const sent = mailboxes.find((mailbox) => mailbox.role === "sent");

  if (!identity || !drafts || !sent)
    throw new MailApiError(
      502,
      "JMAP_INVALID_RESPONSE",
      "Mail identity, Drafts mailbox, or Sent mailbox is missing",
    );

  const recipients = input.to
    .split(",")
    .map((email) => ({ email: email.trim() }))
    .filter(({ email }) => email);

  const submitted = await jmapSecure(
    accessToken,
    [
      [
        "Email/set",
        {
          accountId,
          create: {
            draft: {
              mailboxIds: { [drafts.id]: true },
              keywords: { $draft: true },
              from: [{ email: identity.email }],
              to: recipients,
              subject: input.subject,
              ...(input.inReplyTo
                ? { "header:In-Reply-To:asText": input.inReplyTo }
                : {}),
              ...(input.references?.length
                ? { "header:References:asText": input.references.join(" ") }
                : {}),
              bodyStructure: { type: "text/plain", partId: "body" },
              bodyValues: { body: { value: input.body, isTruncated: false } },
            },
          },
        },
        "draft",
      ],
      [
        "EmailSubmission/set",
        {
          accountId,
          create: {
            send: {
              identityId: identity.id,
              emailId: "#draft",
              envelope: {
                mailFrom: { email: identity.email },
                rcptTo: recipients,
              },
            },
          },
          onSuccessUpdateEmail: {
            "#send": {
              [`mailboxIds/${drafts.id}`]: null,
              [`mailboxIds/${sent.id}`]: true,
              "keywords/$draft": null,
              "keywords/$seen": true,
            },
          },
        },
        "submission",
      ],
    ],
    requestId,
  );

  const draftResponse = submitted.methodResponses.find(
    ([name, , callId]) => name === "Email/set" && callId === "draft",
  )?.[1] as
    | {
        created?: { draft?: { id?: string } };
        notCreated?: { draft?: Record<string, unknown> };
      }
    | undefined;
  if (draftResponse?.notCreated?.draft) {
    throwMailSetError(draftResponse.notCreated.draft, "Draft creation failed");
  }
  const emailId = draftResponse?.created?.draft?.id;
  if (!emailId) {
    throw new MailApiError(
      502,
      "JMAP_INVALID_RESPONSE",
      "Draft creation failed",
    );
  }

  const submissionResponse = submitted.methodResponses.find(
    ([name, , callId]) =>
      name === "EmailSubmission/set" && callId === "submission",
  )?.[1] as
    | {
        created?: { send?: { id?: string } };
        notCreated?: { send?: Record<string, unknown> };
      }
    | undefined;
  if (submissionResponse?.notCreated?.send) {
    throwMailSetError(
      submissionResponse.notCreated.send,
      "Message submission failed",
    );
  }
  const submissionId = submissionResponse?.created?.send?.id;
  if (!submissionId) {
    throw new MailApiError(
      502,
      "JMAP_INVALID_RESPONSE",
      "Message submission failed",
    );
  }
  return { emailId, submissionId };
}

function throwMailSetError(
  failure: Record<string, unknown>,
  fallbackMessage: string,
): never {
  const type = typeof failure.type === "string" ? failure.type : "";
  if (type === "invalidRecipients" || type === "noRecipients") {
    throw new MailApiError(422, "MAIL_RECIPIENTS_INVALID", "Invalid recipient");
  }
  if (type === "forbiddenMailFrom" || type === "forbiddenFrom") {
    throw new MailApiError(
      403,
      "MAIL_SENDER_FORBIDDEN",
      "Sender is not allowed",
    );
  }
  if (type === "tooLarge") {
    throw new MailApiError(
      413,
      "MAIL_MESSAGE_TOO_LARGE",
      "Message is too large",
    );
  }
  if (type === "overQuota") {
    throw new MailApiError(
      507,
      "MAIL_QUOTA_EXCEEDED",
      "Mailbox quota exceeded",
    );
  }
  throw new MailApiError(502, "JMAP_REQUEST_FAILED", fallbackMessage);
}
