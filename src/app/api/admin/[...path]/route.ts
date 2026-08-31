import { type NextRequest, NextResponse } from "next/server";
import type { Permission } from "@/auth/rbac/permissions";
import { PERMISSIONS } from "@/auth/rbac/permissions";
import { mapRoleToPermissions } from "@/auth/rbac/roleMapping";
import {
  AdminApiError,
  adminAccessToken,
  deleteAccount,
  deleteDomain,
  deleteGroup,
  deleteQuota,
  deleteRecipient,
  getAccounts,
  getDomains,
  getGroups,
  getQueue,
  getQuotas,
  getRecipients,
  setAccountEnabled,
  setDomainEnabled,
} from "@/lib/admin/stalwart-admin.server";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function adminContext(requestId: string, permission: Permission) {
  const user = await getCurrentUser();
  if (!user) {
    throw new AdminApiError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Authentication required",
    );
  }

  const permissions = mapRoleToPermissions(user.role ? [user.role] : []);
  if (!permissions.includes(permission)) {
    throw new AdminApiError(403, "FORBIDDEN", "Admin permission required");
  }

  return { accessToken: await adminAccessToken(requestId) };
}

async function routeParts(
  params: RouteContext["params"],
  expectedLength: number,
): Promise<string[]> {
  const parts = (await params).path;
  if (!Array.isArray(parts) || parts.length !== expectedLength) {
    throw new AdminApiError(
      404,
      "ADMIN_OPERATION_NOT_FOUND",
      "Admin operation not found",
    );
  }
  if (parts.some((part) => part.trim().length === 0)) {
    throw new AdminApiError(422, "INVALID_REQUEST", "Invalid admin path");
  }
  return parts;
}

function requestIdFor(request: NextRequest): string {
  const incoming = request.headers.get("x-request-id")?.trim();
  return incoming && incoming.length <= 128 ? incoming : crypto.randomUUID();
}

function failure(error: unknown, requestId: string) {
  const status = error instanceof AdminApiError ? error.status : 500;
  const code = error instanceof AdminApiError ? error.code : "INTERNAL_ERROR";
  const message =
    error instanceof AdminApiError ? error.message : "Admin request failed";
  console.error("[Admin API]", { status, code, message, requestId });
  return NextResponse.json(
    { error: message, code, requestId },
    { status, headers: { "x-request-id": requestId } },
  );
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const requestId = requestIdFor(request);
  try {
    const [resource] = await routeParts(params, 1);
    switch (resource) {
      case "accounts": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_USERS_READ,
        );
        const accounts = await getAccounts(accessToken, requestId);
        return NextResponse.json(accounts);
      }
      case "domains": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_DOMAINS_READ,
        );
        const domains = await getDomains(accessToken, requestId);
        return NextResponse.json(domains);
      }
      case "aliases": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_USERS_READ,
        );
        const recipients = await getRecipients(accessToken, requestId);
        return NextResponse.json(recipients);
      }
      case "groups": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_USERS_READ,
        );
        const groups = await getGroups(accessToken, requestId);
        return NextResponse.json(groups);
      }
      case "queue": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_QUEUE_READ,
        );
        const queue = await getQueue(accessToken, requestId);
        return NextResponse.json(queue);
      }
      case "quotas": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_QUOTAS,
        );
        const quotas = await getQuotas(accessToken, requestId);
        return NextResponse.json(quotas);
      }
      default:
        throw new AdminApiError(
          404,
          "ADMIN_OPERATION_NOT_FOUND",
          "Admin operation not found",
        );
    }
  } catch (error) {
    return failure(error, requestId);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const requestId = requestIdFor(request);
  try {
    const [resource, id, action] = await routeParts(params, 3);
    if (!resource || !id || !action) {
      throw new AdminApiError(422, "INVALID_REQUEST", "Invalid admin path");
    }
    if (resource === "accounts" && action === "enabled") {
      const { accessToken } = await adminContext(
        requestId,
        PERMISSIONS.ADMIN_USERS_WRITE,
      );
      const body = (await request.json().catch(() => null)) as {
        enabled?: boolean;
      } | null;
      if (!body || typeof body.enabled !== "boolean") {
        throw new AdminApiError(
          422,
          "INVALID_REQUEST",
          "enabled must be boolean",
        );
      }
      await setAccountEnabled(accessToken, id, body.enabled, requestId);
      return new NextResponse(null, { status: 204 });
    }
    if (resource === "domains" && action === "enabled") {
      const { accessToken } = await adminContext(
        requestId,
        PERMISSIONS.ADMIN_DOMAINS_WRITE,
      );
      const body = (await request.json().catch(() => null)) as {
        enabled?: boolean;
      } | null;
      if (!body || typeof body.enabled !== "boolean") {
        throw new AdminApiError(
          422,
          "INVALID_REQUEST",
          "enabled must be boolean",
        );
      }
      await setDomainEnabled(accessToken, id, body.enabled, requestId);
      return new NextResponse(null, { status: 204 });
    }
    throw new AdminApiError(
      404,
      "ADMIN_OPERATION_NOT_FOUND",
      "Admin operation not found",
    );
  } catch (error) {
    return failure(error, requestId);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const requestId = requestIdFor(request);
  try {
    const [resource, id] = await routeParts(params, 2);
    if (!resource || !id) {
      throw new AdminApiError(422, "INVALID_REQUEST", "Invalid admin path");
    }
    switch (resource) {
      case "accounts": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_USERS_WRITE,
        );
        await deleteAccount(accessToken, id, requestId);
        break;
      }
      case "domains": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_DOMAINS_WRITE,
        );
        await deleteDomain(accessToken, id, requestId);
        break;
      }
      case "aliases": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_USERS_WRITE,
        );
        await deleteRecipient(accessToken, id, requestId);
        break;
      }
      case "groups": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_USERS_WRITE,
        );
        await deleteGroup(accessToken, id, requestId);
        break;
      }
      case "quotas": {
        const { accessToken } = await adminContext(
          requestId,
          PERMISSIONS.ADMIN_QUOTAS,
        );
        await deleteQuota(accessToken, id, requestId);
        break;
      }
      default:
        throw new AdminApiError(
          404,
          "ADMIN_OPERATION_NOT_FOUND",
          "Admin operation not found",
        );
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return failure(error, requestId);
  }
}
