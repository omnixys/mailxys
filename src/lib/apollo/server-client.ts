"use server";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { cookies } from "next/headers";

export async function createServerClient(): Promise<ApolloClient> {
  const cookieStore = await cookies();

  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri:
        process.env.BACKEND_SERVER_URL ??
        process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ??
        "http://localhost:8000/graphql",
      headers: {
        cookie: cookieStore.toString(),
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
