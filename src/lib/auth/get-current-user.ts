import { MeAuthDocument, type MeAuthQuery } from "@/generated/graphql";
import { createServerClient } from "@/lib/apollo/server-client";

export async function getCurrentUser() {
  try {
    const client = await createServerClient();

    const { data } = await client.query<MeAuthQuery>({
      query: MeAuthDocument,
      fetchPolicy: "cache-first",
    });

    if (!data?.meAuth) {
      return null;
    }

    return data.meAuth;
  } catch {
    return null;
  }
}
