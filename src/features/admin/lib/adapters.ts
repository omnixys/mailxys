import type {
  StalwartAccount,
  StalwartAlias,
  StalwartDomain,
  StalwartGroup,
  StalwartQueuedMessage,
  StalwartQuota,
} from "@/features/admin/types";
import type {
  AdminAccount,
  AdminDomain,
  AdminGroup,
  AdminQueuedMessage,
  AdminQuota,
  AdminRecipient,
} from "@/features/admin/types/api";

export function toStalwartAccount(a: AdminAccount): StalwartAccount {
  const type = a.type.toLowerCase();
  const typ =
    type === "group"
      ? "group"
      : type === "location"
        ? "location"
        : "individual";
  const role = a.roles
    ? Object.keys(a.roles).find((key) => a.roles?.[key])
    : undefined;
  return {
    id: a.id,
    name: a.name,
    ...(a.description !== undefined && { description: a.description }),
    typ,
    role: role ?? "user",
    disabled: a.disabled,
    isTenantAdmin: role === "sysadmin" || role === "admin",
  };
}

export function toStalwartDomain(d: AdminDomain): StalwartDomain {
  return {
    id: d.id,
    name: d.name,
    ...(d.description !== undefined && { description: d.description }),
    enabled: d.enabled,
    maxUsers: 0,
  };
}

export function toStalwartAlias(r: AdminRecipient): StalwartAlias {
  const domain = r.domainId ?? "";
  return {
    id: r.id,
    name: r.name,
    domain,
    addresses: r.addresses ?? [],
    enabled: r.enabled,
  };
}

export function toStalwartGroup(g: AdminGroup): StalwartGroup {
  return {
    id: g.id,
    name: g.name,
    ...(g.description !== undefined && { description: g.description }),
    members: g.memberIds ?? [],
  };
}

export function toStalwartQueuedMessage(
  q: AdminQueuedMessage,
): StalwartQueuedMessage {
  return {
    id: q.id,
    from: q.from,
    to: q.to,
    size: q.size,
    priority: 0,
    created: q.created,
    status: "queued",
    retryCount: 0,
    domain: q.domain,
  };
}

export function toStalwartQuota(q: AdminQuota): StalwartQuota {
  return {
    id: q.id,
    quotaType: q.quotaType,
    resourceType: q.resourceType,
    used: q.used,
    limit: q.limit,
  };
}
