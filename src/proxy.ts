import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["de-DE", "en-US", "it-IT", "ak-GH"] as const;
const DEFAULT_LOCALE = "de-DE";
const MOCK_MODULE_PREFIXES = [
  "/dashboard",
  "/admin",
  "/chat",
  "/notifications",
  "/calendar",
  "/contacts",
  "/analytics",
  "/settings",
  "/help",
] as const;

type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const accepted = header
    .split(",")
    .map((entry) => (entry.split(";").at(0) ?? "").trim().toLowerCase());
  for (const candidate of accepted) {
    const exact = SUPPORTED_LOCALES.find(
      (locale) => locale.toLowerCase() === candidate,
    );
    if (exact) return exact;
    const language = candidate.split("-").at(0);
    const match = SUPPORTED_LOCALES.find(
      (locale) => locale.toLowerCase().split("-").at(0) === language,
    );
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest): NextResponse {
  const mockModule = MOCK_MODULE_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );
  if (process.env.NODE_ENV === "production" && mockModule) {
    return NextResponse.redirect(new URL("/mail/inbox", request.url));
  }

  const response = NextResponse.next();
  const cookieLocale = request.cookies.get("locale")?.value;
  if (!isLocale(cookieLocale)) {
    response.cookies.set(
      "locale",
      detectLocale(request.headers.get("accept-language")),
      { path: "/", maxAge: 60 * 60 * 24 * 365 },
    );
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
