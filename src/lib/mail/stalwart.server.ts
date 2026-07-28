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

// --- Server-side refresh lock ---
let refreshPromise: Promise<string | null> | null = null;

async function refreshStalwartToken(): Promise<string | null> {
  if (refreshPromise) {
    console.log("[Stalwart] Refresh already in progress, waiting...");
    return refreshPromise;
  }

  refreshPromise = doRefresh();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function doRefresh(): Promise<string | null> {
  const store = await cookies();
  const refreshToken = store.get("stalwart_refresh_token")?.value;

  if (!refreshToken) {
    console.error("[Stalwart] No refresh token available");
    return null;
  }

  try {
    const tokenUrl = `${required("STALWART_BASE_URL")}/auth/token`;
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) {
      console.error("[Stalwart] Refresh failed", { status: res.status });
      return null;
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    const expiresAt = Date.now() + data.expires_in * 1000;
    const isProd = process.env.NODE_ENV === "production";
    const sameSite = isProd ? "none" : "lax";
    const secure = isProd;

    // Set new cookies via Next.js headers API
    const cookieStore = await cookies();
    cookieStore.set("stalwart_access_token", data.access_token, {
      httpOnly: true,
      secure,
      sameSite: sameSite === "none" ? "none" : "lax",
      path: "/",
      maxAge: data.expires_in,
    });
    cookieStore.set("stalwart_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: sameSite === "none" ? "none" : "lax",
      path: "/",
      maxAge: 2592000,
    });
    cookieStore.set("stalwart_expires_at", String(expiresAt), {
      httpOnly: false,
      secure,
      sameSite: sameSite === "none" ? "none" : "lax",
      path: "/",
      maxAge: data.expires_in,
    });

    console.log("[Stalwart] Token refreshed ✓");
    return data.access_token;
  } catch (err) {
    console.error("[Stalwart] Refresh network error", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return null;
  }
}

// --- Public API ---

export async function mailAccessToken(): Promise<string> {
  const store = await cookies();
  const token = store.get("stalwart_access_token")?.value;
  if (!token) throw new MailApiError(401, "Authentication required");
  return token;
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

/**
 * Execute a JMAP call with automatic retry on 401.
 * Handles token refresh server-side with a lock to prevent concurrent refreshes.
 */
export async function jmapSecure(
  methodCalls: unknown[],
): Promise<JmapResponse> {
  const token = await mailAccessToken();

  // First attempt
  const firstResponse = await doJmapFetch(token, methodCalls);

  if (firstResponse.status !== 401) {
    return parseJmapResponse(firstResponse);
  }

  // 401 → refresh
  console.log("[Stalwart] JMAP 401, refreshing token");
  const newToken = await refreshStalwartToken();
  if (!newToken) {
    throw new MailApiError(401, "Mail session expired");
  }

  // Retry
  const retryResponse = await doJmapFetch(newToken, methodCalls);
  if (retryResponse.status === 401) {
    console.error("[Stalwart] JMAP 401 after refresh");
    throw new MailApiError(401, "Mail session expired");
  }

  return parseJmapResponse(retryResponse);
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
