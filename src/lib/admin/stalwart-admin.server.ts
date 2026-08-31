import "server-only";
import { env } from "@/config/env.server";
import type {
  AdminAccount,
  AdminDomain,
  AdminGroup,
  AdminQueuedMessage,
  AdminQuota,
  AdminRecipient,
} from "@/features/admin/types/api";
import {
  type AdminErrorCode,
  classifyAdminLoginFailure,
} from "@/lib/admin/errors";

const UPSTREAM_TIMEOUT_MS = 10_000;

type JmapResponse = {
  methodResponses: Array<[string, Record<string, unknown>, string]>;
};

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: AdminErrorCode,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Resolve the downstream Stalwart admin access token.
 *
 * 1. `credentialsLogin` against the authentication service with the service
 *    account (admin). Returns a platform bearer token with the System
 *    Administrator role (full `sys*` access).
 * 2. Exchange the platform token via the same MAIL_TOKEN_URL gateway used for
 *    regular mail, returning a Stalwart admin (downstream) bearer token.
 *
 * No user cookie is involved — this path is independent of the logged-in
 * frontend user and is used exclusively by the server-side admin BFF layer.
 */
export async function adminAccessToken(requestId: string): Promise<string> {
  let platformToken: string;
  try {
    platformToken = await adminPlatformToken(requestId);
  } catch (error) {
    if (error instanceof AdminApiError) throw error;
    console.error("[Admin Token] Platform login failed", { requestId });
    throw new AdminApiError(
      502,
      "ADMIN_AUTH_UNAVAILABLE",
      "Admin authentication is unavailable",
    );
  }

  try {
    const res = await fetch(env.MAIL_TOKEN_URL, {
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
      console.error("[Admin Token] Gateway rejected request", {
        status: res.status,
        requestId,
      });
      const failure = classifyAdminLoginFailure(res.status);
      throw new AdminApiError(failure.status, failure.code, failure.message);
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
      console.error("[Admin Token] Invalid gateway response", { requestId });
      throw new AdminApiError(
        502,
        "ADMIN_AUTH_INVALID_RESPONSE",
        "Admin authentication is unavailable",
      );
    }
    return data.accessToken;
  } catch (error) {
    if (error instanceof AdminApiError) throw error;
    console.error("[Admin Token] Gateway request failed", { requestId });
    throw new AdminApiError(
      502,
      "ADMIN_AUTH_UNAVAILABLE",
      "Admin authentication is unavailable",
    );
  }
}

async function adminPlatformToken(requestId: string): Promise<string> {
  const res = await fetch(env.BACKEND_SERVER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `mutation AdminLogin($input: LogInInput!) {
        credentialsLogin(input: $input) { accessToken }
      }`,
      variables: {
        input: { username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD },
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) {
    console.error("[Admin Token] Auth service rejected request", {
      status: res.status,
      requestId,
    });
    const failure = classifyAdminLoginFailure(res.status);
    throw new AdminApiError(failure.status, failure.code, failure.message);
  }
  const body = (await res.json().catch(() => null)) as {
    data?: { credentialsLogin?: { accessToken?: string } };
  } | null;
  const accessToken = body?.data?.credentialsLogin?.accessToken;
  if (!accessToken) {
    console.error("[Admin Token] Auth service returned no access token", {
      requestId,
    });
    throw new AdminApiError(
      502,
      "ADMIN_AUTH_INVALID_RESPONSE",
      "Admin authentication is unavailable",
    );
  }
  return accessToken;
}

async function doAdminJmapFetch(
  accessToken: string,
  methodCalls: unknown[],
  requestId: string,
): Promise<Response> {
  return fetch(env.STALWART_JMAP_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      "x-request-id": requestId,
      "x-correlation-id": requestId,
    },
    body: JSON.stringify({
      using: ["urn:ietf:params:jmap:core", "urn:stalwart:jmap"],
      methodCalls,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
}

async function parseAdminJmapResponse(
  response: Response,
  requestId: string,
): Promise<JmapResponse> {
  if (!response.ok) {
    console.error("[Stalwart Admin] JMAP error", {
      status: response.status,
      requestId,
    });
    if (response.status === 401) {
      throw new AdminApiError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Admin session expired",
      );
    }
    if (response.status === 429) {
      throw new AdminApiError(
        503,
        "ADMIN_RATE_LIMITED",
        "Admin service is temporarily busy",
      );
    }
    throw new AdminApiError(502, "JMAP_UNAVAILABLE", "Stalwart is unavailable");
  }

  const payload = (await response
    .json()
    .catch(() => null)) as JmapResponse | null;
  if (!payload?.methodResponses || !Array.isArray(payload.methodResponses)) {
    console.error("[Stalwart Admin] Invalid JMAP response structure", {
      requestId,
    });
    throw new AdminApiError(
      502,
      "JMAP_INVALID_RESPONSE",
      "Invalid response from the admin service",
    );
  }

  const error = payload.methodResponses.find(([name]) => name === "error");
  if (error) {
    const detail = String(
      error[1].description ?? error[1].type ?? "JMAP request failed",
    );
    console.error("[Stalwart Admin] JMAP request failed", {
      detail,
      requestId,
    });
    throw new AdminApiError(502, "JMAP_REQUEST_FAILED", "Admin request failed");
  }

  return payload;
}

export async function adminJmap(
  accessToken: string,
  methodCalls: unknown[],
  requestId: string,
): Promise<JmapResponse> {
  try {
    const response = await doAdminJmapFetch(
      accessToken,
      methodCalls,
      requestId,
    );
    return parseAdminJmapResponse(response, requestId);
  } catch (error) {
    if (error instanceof AdminApiError) throw error;
    console.error("[Stalwart Admin] JMAP request unavailable", { requestId });
    throw new AdminApiError(502, "JMAP_UNAVAILABLE", "Stalwart is unavailable");
  }
}

function listOf(response: JmapResponse, name: string): unknown[] {
  const entry = response.methodResponses.find(([n]) => n === name);
  const list = entry?.[1]?.list;
  return Array.isArray(list) ? list : [];
}

export async function getAccounts(
  accessToken: string,
  requestId: string,
): Promise<AdminAccount[]> {
  const result = await adminJmap(
    accessToken,
    [["x:Account/get", { ids: null }, "a"]],
    requestId,
  );
  return listOf(result, "x:Account/get").map((item) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? ""),
      name: String(record.name ?? ""),
      type: String(record["@type"] ?? "unknown"),
      ...(typeof record.description === "string"
        ? { description: record.description }
        : {}),
      disabled: typeof record.enabled === "boolean" ? !record.enabled : false,
      ...(record.roles && typeof record.roles === "object"
        ? { roles: record.roles as Record<string, boolean> }
        : {}),
      permissions: record.permissions,
    };
  });
}

export async function setAccountEnabled(
  accessToken: string,
  accountId: string,
  enabled: boolean,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Account/set", { update: { [accountId]: { enabled } } }, "u"]],
    requestId,
  );
}

export async function deleteAccount(
  accessToken: string,
  accountId: string,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Account/set", { destroy: [accountId] }, "d"]],
    requestId,
  );
}

export async function getDomains(
  accessToken: string,
  requestId: string,
): Promise<AdminDomain[]> {
  const result = await adminJmap(
    accessToken,
    [["x:Domain/get", { ids: null }, "d"]],
    requestId,
  );
  return listOf(result, "x:Domain/get").map((item) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? ""),
      name: String(record.name ?? ""),
      ...(typeof record.description === "string"
        ? { description: record.description }
        : {}),
      enabled: typeof record.enabled === "boolean" ? record.enabled : true,
    };
  });
}

export async function setDomainEnabled(
  accessToken: string,
  domainId: string,
  enabled: boolean,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Domain/set", { update: { [domainId]: { enabled } } }, "u"]],
    requestId,
  );
}

export async function deleteDomain(
  accessToken: string,
  domainId: string,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Domain/set", { destroy: [domainId] }, "d"]],
    requestId,
  );
}

export async function getRecipients(
  accessToken: string,
  requestId: string,
): Promise<AdminRecipient[]> {
  const result = await adminJmap(
    accessToken,
    [["x:Recipient/get", { ids: null }, "r"]],
    requestId,
  );
  return listOf(result, "x:Recipient/get").map((item) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? ""),
      name: String(record.name ?? ""),
      ...(typeof record.domainId === "string"
        ? { domainId: record.domainId }
        : {}),
      addresses: Array.isArray(record.addresses)
        ? (record.addresses as string[])
        : [],
      enabled: typeof record.enabled === "boolean" ? record.enabled : true,
    };
  });
}

export async function deleteRecipient(
  accessToken: string,
  recipientId: string,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Recipient/set", { destroy: [recipientId] }, "d"]],
    requestId,
  );
}

export async function getGroups(
  accessToken: string,
  requestId: string,
): Promise<AdminGroup[]> {
  const result = await adminJmap(
    accessToken,
    [["x:Account/get", { ids: null }, "g"]],
    requestId,
  );
  const groups: AdminGroup[] = [];
  for (const item of listOf(result, "x:Account/get")) {
    const record = item as Record<string, unknown>;
    if (String(record["@type"] ?? "").toLowerCase() !== "group") continue;
    groups.push({
      id: String(record.id ?? ""),
      name: String(record.name ?? ""),
      ...(typeof record.description === "string"
        ? { description: record.description }
        : {}),
      memberIds: Array.isArray(record.memberGroupIds)
        ? (record.memberGroupIds as string[])
        : [],
    });
  }
  return groups;
}

export async function deleteGroup(
  accessToken: string,
  groupId: string,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Account/set", { destroy: [groupId] }, "d"]],
    requestId,
  );
}

export async function getQueue(
  accessToken: string,
  requestId: string,
): Promise<AdminQueuedMessage[]> {
  const result = await adminJmap(
    accessToken,
    [["x:Queue/get", { ids: null }, "q"]],
    requestId,
  );
  return listOf(result, "x:Queue/get").map((item) => {
    const record = item as Record<string, unknown>;
    const to = Array.isArray(record.to)
      ? (record.to as string[])
      : typeof record.to === "string"
        ? [record.to]
        : [];
    return {
      id: String(record.id ?? ""),
      from: typeof record.from === "string" ? record.from : "",
      to,
      size: typeof record.size === "number" ? record.size : 0,
      created:
        typeof record.created === "string"
          ? record.created
          : new Date(0).toISOString(),
      domain: typeof record.domain === "string" ? record.domain : "",
    };
  });
}

export async function getQuotas(
  accessToken: string,
  requestId: string,
): Promise<AdminQuota[]> {
  const result = await adminJmap(
    accessToken,
    [["x:Quota/get", { ids: null }, "q"]],
    requestId,
  );
  return listOf(result, "x:Quota/get").map((item) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? ""),
      quotaType: typeof record.quotaType === "string" ? record.quotaType : "",
      resourceType:
        typeof record.resourceType === "string" ? record.resourceType : "",
      used: typeof record.used === "number" ? record.used : 0,
      limit: typeof record.limit === "number" ? record.limit : 0,
    };
  });
}

export async function deleteQuota(
  accessToken: string,
  quotaId: string,
  requestId: string,
): Promise<void> {
  await adminJmap(
    accessToken,
    [["x:Quota/set", { destroy: [quotaId] }, "d"]],
    requestId,
  );
}
