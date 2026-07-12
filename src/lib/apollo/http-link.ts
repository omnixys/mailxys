import { ApolloLink, HttpLink, Observable } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { env } from "@/lib/env";
import { getAccessTokenClient } from "./cookie.utils";

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if (error instanceof Error && error.name === "AbortError") return true;
  return false;
}

function createErrorLink(): ErrorLink {
  return new ErrorLink(({ error, operation }) => {
    if (isAbortError(error)) return;
    console.error("[GraphQL Error]", {
      operation: operation.operationName,
      error,
    });
  });
}

function createAuthLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const token = getAccessTokenClient();
    const prevHeaders = operation.getContext().headers || {};

    operation.setContext({
      headers: {
        ...prevHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return forward(operation);
  });
}

function createLoggingLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const start = Date.now();

    return new Observable((observer) => {
      const sub = forward(operation).subscribe({
        next: (result) => {
          console.log("[HTTP] ←", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
          });
          observer.next(result);
        },
        error: (error) => {
          console.error("[HTTP ERROR]", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
          });
          observer.error(error);
        },
        complete: () => observer.complete(),
      });

      return () => sub.unsubscribe();
    });
  });
}

export function createHttpLink(): ApolloLink {
  const errorLink = createErrorLink();
  const authLink = createAuthLink();
  const loggingLink = createLoggingLink();

  const httpLink = new HttpLink({
    uri: env.NEXT_PUBLIC_BACKEND_SERVER_URL,
    credentials: "include",
  });

  return ApolloLink.from([errorLink, authLink, loggingLink, httpLink]);
}
