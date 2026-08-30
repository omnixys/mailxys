import "server-only";
import { cookies } from "next/headers";

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
    message: string,
  ) {
    super(message);
  }
}

export async function mailAccessToken(): Promise<string> {
  const store = await cookies();
  const platformToken = store.get("access_token")?.value;
  if (!platformToken) throw new MailApiError(401, "Authentication required");
  try {
    const res = await fetch(required("MAIL_TOKEN_URL"), {
      method: "POST",
      headers: {
        authorization: `Bearer ${platformToken}`,
        "x-omnimail-service-token": required("OMNIMAIL_SERVICE_TOKEN"),
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[Mail Token] Gateway rejected request", {
        status: res.status,
      });
      throw new MailApiError(
        res.status === 401 ? 401 : 502,
        res.status === 401
          ? "Authentication required"
          : "Mail authentication is unavailable",
      );
    }
    const data = (await res.json()) as {
      accessToken?: string;
      tokenType?: string;
      expiresIn?: number;
    };
    if (
      !data.accessToken ||
      data.tokenType !== "Bearer" ||
      typeof data.expiresIn !== "number" ||
      data.expiresIn <= 0
    ) {
      throw new MailApiError(502, "Invalid mail authentication response");
    }
    return data.accessToken;
  } catch (error) {
    if (error instanceof MailApiError) throw error;
    console.error("[Mail Token] Gateway request failed");
    throw new MailApiError(502, "Mail authentication is unavailable");
  }
}

async function doJmapFetch(
  accessToken: string,
  methodCalls: unknown[],
): Promise<Response> {
  return fetch(required("STALWART_JMAP_URL"), {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
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
  });
}

async function parseJmapResponse(response: Response): Promise<JmapResponse> {
  if (!response.ok) {
    console.error("[Stalwart] JMAP error", { status: response.status });
    throw new MailApiError(502, "Stalwart is unavailable");
  }

  const payload = (await response.json()) as JmapResponse;
  if (!payload?.methodResponses || !Array.isArray(payload.methodResponses)) {
    console.error("[Stalwart] Invalid JMAP response structure");
    throw new MailApiError(502, "Invalid JMAP response from Stalwart");
  }

  const error = payload.methodResponses.find(([name]) => name === "error");
  if (error) {
    const detail = String(
      error[1].description ?? error[1].type ?? "JMAP request failed",
    );
    console.error("[Stalwart] JMAP error", { detail });
    throw new MailApiError(502, detail);
  }

  return payload;
}

export async function jmapSecure(
  methodCalls: unknown[],
): Promise<JmapResponse> {
  const token = await mailAccessToken();
  const response = await doJmapFetch(token, methodCalls);
  if (response.status === 401) {
    throw new MailApiError(401, "Mail session expired");
  }
  return parseJmapResponse(response);
}

export async function ensureMailAccount(accessToken: string): Promise<string> {
  const sessionUrl = required("STALWART_JMAP_URL").replace(
    /\/jmap\/?$/,
    "/jmap/session",
  );
  const response = await fetch(sessionUrl, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (response.status === 401) {
    console.error("[Stalwart] Session returned 401");
    throw new MailApiError(401, "Mail session is not authenticated");
  }
  if (!response.ok) {
    console.error("[Stalwart] Session returned error", {
      status: response.status,
    });
    throw new MailApiError(502, "Stalwart is unavailable");
  }
  const session = (await response.json()) as {
    accounts?: Record<string, unknown>;
    primaryAccounts?: Record<string, string>;
  };
  if (!session || typeof session !== "object") {
    console.error("[Stalwart] Invalid session response");
    throw new MailApiError(502, "Invalid Stalwart session response");
  }
  const accountId =
    session.primaryAccounts?.["urn:ietf:params:jmap:mail"] ??
    Object.keys(session.accounts ?? {})[0];
  if (!accountId)
    throw new MailApiError(503, "No mailbox is provisioned for this account");

  return accountId;
}

export async function getMailboxes(accountId: string) {
  const result = await jmapSecure([
    ["Mailbox/get", { accountId }, "mailboxes"],
  ]);
  const response = result.methodResponses[0];
  if (!response) return [];
  const list = response[1]?.list;
  return Array.isArray(list) ? list : [];
}

export async function getMessages(accountId: string, mailboxId: string) {
  const result = await jmapSecure([
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
          "textBody",
          "htmlBody",
          "attachments",
          "bodyValues",
          "hasAttachment",
        ],
        fetchAllBodyValues: true,
        maxBodyValueBytes: 1_000_000,
      },
      "emails",
    ],
  ]);
  const emailResponse = result.methodResponses.find(
    ([name]) => name === "Email/get",
  );
  if (!emailResponse) return [];
  const list = emailResponse[1]?.list;
  return Array.isArray(list) ? list : [];
}

export async function markMessageRead(
  accountId: string,
  messageId: string,
  read: boolean,
) {
  const patch = read ? { "keywords/$seen": true } : { "keywords/$seen": null };
  await jmapSecure([
    ["Email/set", { accountId, update: { [messageId]: patch } }, "read"],
  ]);
}

export type SendMailInput = {
  to: string;
  subject: string;
  body: string;
  inReplyTo?: string;
  references?: string[];
};

export async function sendMessage(accountId: string, input: SendMailInput) {
  if (!input.to.trim() || !input.body.trim())
    throw new MailApiError(422, "Recipient and body are required");
  const setup = await jmapSecure([
    ["Identity/get", { accountId }, "identities"],
    ["Mailbox/get", { accountId }, "mailboxes"],
  ]);

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

  if (!identity || !drafts)
    throw new MailApiError(502, "Mail identity or Drafts mailbox is missing");

  const created = await jmapSecure([
    [
      "Email/set",
      {
        accountId,
        create: {
          draft: {
            mailboxIds: { [drafts.id]: true },
            keywords: { $draft: true },
            from: [{ email: identity.email }],
            to: input.to
              .split(",")
              .map((email) => ({ email: email.trim() }))
              .filter(({ email }) => email),
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
  ]);

  const createdDraft = created.methodResponses[0]?.[1] as
    | { created?: { draft?: { id?: string } } }
    | undefined;
  const emailId = createdDraft?.created?.draft?.id;
  if (!emailId) {
    console.error("[Stalwart] Draft creation failed");
    throw new MailApiError(502, "Draft creation failed");
  }

  const submitted = await jmapSecure([
    [
      "EmailSubmission/set",
      { accountId, create: { send: { identityId: identity.id, emailId } } },
      "submission",
    ],
  ]);

  const submissionResponse = submitted.methodResponses[0]?.[1] as
    | { created?: Record<string, unknown> }
    | undefined;
  return submissionResponse?.created ?? {};
}
