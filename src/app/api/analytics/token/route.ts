import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/config/env.server";

const ANONYMOUS_TOKEN_TTL_MS = 60 * 60 * 1000;

/**
 * Mint a short-lived anonymous analytics bearer token that the browser uses to
 * authenticate to the analytics gateway. The token is signed with the
 * server-only consent secret and never exposed to the client as a secret.
 */
export async function POST() {
  try {
    const anonymousId = randomUUID();
    const issuedAt = Date.now();
    const expiresAt = issuedAt + ANONYMOUS_TOKEN_TTL_MS;
    const payload = `${anonymousId}.${issuedAt}.${expiresAt}`;
    const signature = createHmac("sha256", env.ANALYTICS_CONSENT_SECRET)
      .update(payload)
      .digest("hex");
    return NextResponse.json({
      token: `${payload}.${signature}`,
      expiresAt,
    });
  } catch (error) {
    console.error("[Analytics Token] Failed to mint token", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "Analytics token unavailable" },
      { status: 502 },
    );
  }
}
