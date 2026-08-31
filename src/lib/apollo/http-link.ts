import { ApolloLink, HttpLink, Observable } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { env } from "@/config/env";
import { getAuthContext } from "@/lib/apollo/auth-context";
import { getAccessTokenClient } from "./cookie.utils";

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if (error instanceof Error && error.name === "AbortError") return true;
  return false;
}

function generateUUID(): string {
  return crypto.randomUUID();
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
    const auth = getAuthContext();
    const prevContext = operation.getContext();

    const requestId = generateUUID();
    const headers = {
      ...(prevContext.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "x-tenant-id": auth.tenantId,
      ...(auth.actorId ? { "x-actor-id": auth.actorId } : {}),
      "x-request-id": requestId,
      "x-correlation-id": requestId,
      "x-device": "web",
      "x-platform": "omnimail",
      "x-client-version": "1.0.0",
    };

    operation.setContext({
      ...prevContext,
      headers,
      omnixys: { requestId, correlationId: requestId },
    });

    return forward(operation);
  });
}

function createLoggingLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const start = Date.now();

    console.log("[HTTP] →", {
      operation: operation.operationName,
      requestId: operation.getContext().omnixys?.requestId,
      variables: operation.variables,
    });

    return new Observable((observer) => {
      const sub = forward(operation).subscribe({
        next: (result) => {
          console.log("[HTTP] ←", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
            requestId: operation.getContext().omnixys?.requestId,
          });
          observer.next(result);
        },
        error: (error) => {
          console.error("[HTTP ERROR]", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
            requestId: operation.getContext().omnixys?.requestId,
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
    uri: env.BACKEND_SERVER_URL,
    credentials: "include",
  });

  return ApolloLink.from([errorLink, authLink, loggingLink, httpLink]);
}
