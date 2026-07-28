import type { MeAuthQuery } from "@/generated/graphql";

interface InternalAuthContext {
  actorId: string | null;
  tenantId: string;
}

let context: InternalAuthContext = {
  actorId: null,
  tenantId: "omnixys",
};

export function setCurrentUser(
  user: Omit<MeAuthQuery["meAuth"], "__typename"> | null,
): void {
  context = {
    actorId: user?.id ?? null,
    tenantId: "omnixys",
  };
}

export function getAuthContext(): InternalAuthContext {
  return context;
}
