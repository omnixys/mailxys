import { NextResponse } from "next/server";
import { env } from "@/config/env.server";

function retryCookieBase(): string {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = isProd ? "none" : "lax";
  const secure = isProd;
  return `Path=/; SameSite=${sameSite}; ${secure ? "Secure; " : ""}HttpOnly`;
}

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as LoginRequest;
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "Username and password are required" },
      { status: 400 },
    );
  }

  // --- Step 1: GraphQL credentialsLogin ---
  console.log("[Login] GraphQL credentialsLogin");
  let gatewayResponse: Response;
  try {
    gatewayResponse = await fetch(env.BACKEND_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation Login($input: LogInInput!) {
          credentialsLogin(input: $input) {
            accessToken
            expiresIn
            refreshToken
            refreshExpiresIn
            idToken
            scope
          }
        }`,
        variables: { input: { username, password } },
      }),
    });
  } catch (err) {
    console.error("[Login] Gateway unreachable", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json(
      { ok: false, error: "Gateway unreachable" },
      { status: 502 },
    );
  }

  if (!gatewayResponse.ok) {
    console.error("[Login] Gateway error", { status: gatewayResponse.status });
    return NextResponse.json(
      { ok: false, error: "Gateway authentication failed" },
      { status: 401 },
    );
  }

  // Parse gateway response
  const gatewayBody = (await gatewayResponse.json()) as {
    data?: { credentialsLogin?: Record<string, string> };
    errors?: Array<{ message: string }>;
  };

  if (gatewayBody.errors?.length) {
    const firstError = gatewayBody.errors[0];
    console.error("[Login] GraphQL errors", {
      message: firstError?.message,
    });
    return NextResponse.json(
      { ok: false, error: firstError?.message ?? "GraphQL error" },
      { status: 401 },
    );
  }

  const authPayload = gatewayBody.data?.credentialsLogin;
  if (!authPayload?.accessToken || !authPayload?.refreshToken) {
    console.error("[Login] Incomplete auth payload");
    return NextResponse.json(
      { ok: false, error: "Authentication failed" },
      { status: 401 },
    );
  }

  console.log("[Login] GraphQL Login ✓");

  // Build response — we'll add cookies as we go
  const response = NextResponse.json({ ok: true });
  const cookieBase = retryCookieBase();

  // Forward gateway cookies (Set-Cookie from gateway response)
  const gatewaySetCookies = gatewayResponse.headers.getSetCookie?.() ?? [];
  for (const cookie of gatewaySetCookies) {
    response.headers.append("Set-Cookie", cookie);
  }

  // If getSetCookie is not available, set cookies manually from the payload
  if (gatewaySetCookies.length === 0) {
    const expiresAt =
      Date.now() + (Number(authPayload.expiresIn) || 300) * 1000;

    response.headers.append(
      "Set-Cookie",
      `access_token=${authPayload.accessToken}; Max-Age=${authPayload.expiresIn || 300}; ${cookieBase}`,
    );
    response.headers.append(
      "Set-Cookie",
      `refresh_token=${authPayload.refreshToken}; Max-Age=${authPayload.refreshExpiresIn || 1800}; ${cookieBase}`,
    );
    response.headers.append(
      "Set-Cookie",
      `access_expires_at=${expiresAt}; Max-Age=${authPayload.expiresIn || 300}; Path=/; SameSite=${process.env.NODE_ENV === "production" ? "none" : "lax"}; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`,
    );
  }

  return NextResponse.json(
    { ok: true, platformAuthenticated: true },
    {
      status: 200,
      headers: response.headers,
    },
  );
}
