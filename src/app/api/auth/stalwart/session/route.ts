import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await cookies();
  const token = store.get("stalwart_access_token");
  const expiresRaw = store.get("stalwart_expires_at");

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    expiresAt: expiresRaw ? Number(expiresRaw.value) : null,
  });
}

export async function DELETE() {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = isProd ? "none" : "lax";
  const secure = isProd;
  const base = `Path=/; SameSite=${sameSite}; ${secure ? "Secure; " : ""}HttpOnly`;

  const response = NextResponse.json({ ok: true });

  // Clear all Stalwart cookies
  for (const name of [
    "stalwart_access_token",
    "stalwart_refresh_token",
    "stalwart_expires_at",
  ]) {
    response.headers.append("Set-Cookie", `${name}=; Max-Age=0; ${base}`);
  }

  console.log("[Stalwart] Session cleared");

  return response;
}
