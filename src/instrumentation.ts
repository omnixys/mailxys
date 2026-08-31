import { env } from "@/config/env.server";

/**
 * Server-side instrumentation hook (Next.js App Router).
 *
 * Server-side OpenTelemetry SDK initialization is deferred in this phase;
 * the Gateway handles OTLP ingestion and the browser client instruments
 * fetch/XHR/navigation. A production server could initialize the Node OTel
 * SDK here via `@omnixys/observability-ts/server`.
 */
export async function register() {
  if (env.NEXT_RUNTIME === "nodejs") {
    // Future: initialize server-side OTel tracing here.
  }
}

/**
 * Track server-side request errors that are not handled by an error boundary.
 */
export function onRequestError(
  error: unknown,
  request: { path: string; method: string },
): void {
  if (env.NODE_ENV === "development") {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      "[observability] request error",
      request.method,
      request.path,
      message,
    );
  }
}
