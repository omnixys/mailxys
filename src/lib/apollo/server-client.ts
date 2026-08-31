"use server";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";
import { env } from "@/config/env.server";

/**
 * Server-side Apollo client with cookie forwarding
 */
export async function createServerClient(): Promise<ApolloClient> {
  const cookieStore = await cookies();

  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: env.BACKEND_SERVER_URL,
      headers: {
        cookie: cookieStore.toString(),
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
