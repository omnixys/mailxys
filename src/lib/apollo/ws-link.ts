import { ApolloLink, Observable } from "@apollo/client";
import { print } from "graphql";
import { type Client, createClient } from "graphql-ws";
import { env } from "@/lib/env";
import { getAccessTokenClient } from "./cookie.utils";

export function createWsLink(): ApolloLink | null {
  if (typeof window === "undefined") return null;

  const client: Client = createClient({
    url: env.NEXT_PUBLIC_GRAPHQL_WS_URL,
    lazy: true,
    retryAttempts: Number.POSITIVE_INFINITY,
    retryWait: async (retries) => {
      const delay = Math.min(1000 * retries, 5000);
      await new Promise((r) => setTimeout(r, delay));
    },
    connectionParams: () => {
      const token = getAccessTokenClient();
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  });

  return new ApolloLink((operation) => {
    return new Observable((sink) => {
      const dispose = client.subscribe(
        {
          query: print(operation.query),
          variables: operation.variables,
        },
        {
          next: (value) => {
            // biome-ignore lint/suspicious/noExplicitAny: WS subscription value needs type assertion
            sink.next(value as any);
          },
          error: (err) => sink.error(err),
          complete: () => sink.complete(),
        },
      );

      return () => {
        dispose();
      };
    });
  });
}
