import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

// Server-side lock to prevent concurrent refreshes
let refreshPromise: Promise<NextResponse> | null = null;

export async function POST() {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    console.log("[Stalwart Refresh] Already in progress, waiting...");
    return refreshPromise;
  }

  refreshPromise = doRefresh();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function doRefresh(): Promise<NextResponse> {
  const store = await cookies();
  const refreshToken = store.get("stalwart_refresh_token")?.value;

  if (!refreshToken) {
    console.log("[Stalwart Refresh] No refresh token available");
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const isProd = process.env.NODE_ENV === "production";
  const sameSite = isProd ? "none" : "lax";
  const secure = isProd;
  const base = `Path=/; SameSite=${sameSite}; ${secure ? "Secure; " : ""}HttpOnly`;

  try {
    const tokenUrl = `${required("STALWART_BASE_URL")}/auth/token`;
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) {
      console.error("[Stalwart Refresh] Failed", { status: res.status });
      const response = NextResponse.json(
        { error: "Refresh failed" },
        { status: 401 },
      );
      // Clear stale cookies
      for (const name of [
        "stalwart_access_token",
        "stalwart_refresh_token",
        "stalwart_expires_at",
      ]) {
        response.headers.append("Set-Cookie", `${name}=; Max-Age=0; ${base}`);
      }
      return response;
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    const expiresAt = Date.now() + data.expires_in * 1000;

    console.log("[Stalwart Refresh] Success");

    const response = NextResponse.json({ ok: true });
    response.headers.append(
      "Set-Cookie",
      `stalwart_access_token=${data.access_token}; Max-Age=${data.expires_in}; ${base}`,
    );
    response.headers.append(
      "Set-Cookie",
      `stalwart_refresh_token=${data.refresh_token}; Max-Age=2592000; ${base}`,
    );
    response.headers.append(
      "Set-Cookie",
      `stalwart_expires_at=${expiresAt}; Max-Age=${data.expires_in}; Path=/; SameSite=${sameSite}; ${secure ? "Secure; " : ""}`,
    );

    return response;
  } catch (err) {
    console.error("[Stalwart Refresh] Network error", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }
}
