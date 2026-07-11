import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["de-DE", "en-US", "it-IT", "ak-GH"] as const;
const DEFAULT_LOCALE = "de-DE";

type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const languages = header
    .split(",")
    .map((l) => l.split(";")[0].trim().toLowerCase());

  for (const lang of languages) {
    for (const supported of SUPPORTED_LOCALES) {
      if (lang.startsWith(supported.toLowerCase().split("-")[0])) {
        return supported;
      }
    }
  }

  return DEFAULT_LOCALE;
}

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }
  const cookieLocale = req.cookies.get("locale")?.value;

  // console.log({cookieLocale});

  if (!isLocale(cookieLocale)) {
    const header = req.headers.get("accept-language");
    const locale = detectLocale(header);

    res.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
