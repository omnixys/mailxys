import type { MeAuthQuery } from "@/generated/graphql";

/**
 * Canonical Omnixys tenant id (mirror of OMNIXYS_TENANT_ID in
 * @omnixys/contracts-ts). Kept local: the published contracts package
 * is not a dependency of this project.
 */
const OMNIXYS_TENANT_ID = "6e788f7f-c233-4cb8-bbde-c0b855e564be";

interface InternalAuthContext {
  actorId: string | null;
  tenantId: string;
}

let context: InternalAuthContext = {
  actorId: null,
  tenantId: OMNIXYS_TENANT_ID,
};

export function setCurrentUser(
  user: Omit<MeAuthQuery["meAuth"], "__typename"> | null,
): void {
  context = {
    actorId: user?.id ?? null,
    tenantId: OMNIXYS_TENANT_ID,
  };
}

export function getAuthContext(): InternalAuthContext {
  return context;
}
