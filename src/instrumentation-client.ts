import { initializeBrowserTracing } from "@omnixys/observability-ts/browser";
import { env } from "@/config/env";

/**
 * Client instrumentation for @omnixys/observability-ts.
 *
 * initializeBrowserTracing is safe to call multiple times — subsequent calls
 * are no-ops when already initialized.
 */
initializeBrowserTracing({
  serviceName: env.OTEL_SERVICE_NAME,
  environment: env.NODE_ENV,
  sampleRate: env.OTEL_SAMPLE_RATE,
  otlpEndpoint: env.OTEL_ENDPOINT,
  instrumentations: ["fetch", "xhr", "document-load"],
  enabled: env.IS_PRODUCTION,
});
