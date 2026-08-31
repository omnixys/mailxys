import type {
  AdminAccount,
  AdminDomain,
  AdminGroup,
  AdminQueuedMessage,
  AdminQuota,
  AdminRecipient,
} from "@/features/admin/types/api";
import type { AdminErrorCode } from "@/lib/admin/errors";

export class AdminClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: AdminErrorCode | "UNKNOWN",
    message: string,
    readonly requestId?: string,
  ) {
    super(message);
  }
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
    credentials: "include",
    headers: { "content-type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      code?: AdminErrorCode;
      requestId?: string;
    };
    throw new AdminClientError(
      response.status,
      payload.code ?? "UNKNOWN",
      payload.error ?? `Admin request failed (${response.status})`,
      payload.requestId,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

class AdminClient {
  getAccounts(): Promise<AdminAccount[]> {
    return adminFetch("/accounts");
  }

  setAccountEnabled(id: string, enabled: boolean): Promise<void> {
    return adminFetch(`/accounts/${encodeURIComponent(id)}/enabled`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    });
  }

  deleteAccount(id: string): Promise<void> {
    return adminFetch(`/accounts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  getDomains(): Promise<AdminDomain[]> {
    return adminFetch("/domains");
  }

  setDomainEnabled(id: string, enabled: boolean): Promise<void> {
    return adminFetch(`/domains/${encodeURIComponent(id)}/enabled`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    });
  }

  deleteDomain(id: string): Promise<void> {
    return adminFetch(`/domains/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  getAliases(): Promise<AdminRecipient[]> {
    return adminFetch("/aliases");
  }

  deleteAlias(id: string): Promise<void> {
    return adminFetch(`/aliases/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  getGroups(): Promise<AdminGroup[]> {
    return adminFetch("/groups");
  }

  deleteGroup(id: string): Promise<void> {
    return adminFetch(`/groups/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  getQueue(): Promise<AdminQueuedMessage[]> {
    return adminFetch("/queue");
  }

  getQuotas(): Promise<AdminQuota[]> {
    return adminFetch("/quotas");
  }

  deleteQuota(id: string): Promise<void> {
    return adminFetch(`/quotas/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }
}

export const adminClient = new AdminClient();
