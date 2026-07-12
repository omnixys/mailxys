import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["de-DE", "en-US", "it-IT", "ak-GH"] as const;
const DEFAULT_LOCALE = "de-DE";

type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectLocale(header: string | null): Locale {
  if (!header) {
    return DEFAULT_LOCALE;
  }

  const accepted = header
    .split(",")
    .map((entry) => (entry.split(";").at(0) ?? "").trim().toLowerCase());

  for (const candidate of accepted) {
    // 1. Exakter Match
    const exact = SUPPORTED_LOCALES.find(
      (locale) => locale.toLowerCase() === candidate,
    );

    if (exact) {
      return exact;
    }

    // 2. Sprache matchen (de, en, fr, pt, zh, ...)
    const candidateLanguage = candidate.split("-").at(0);

    if (!candidateLanguage) {
      continue;
    }

    const languageMatch = SUPPORTED_LOCALES.find((locale) => {
      const language = locale.toLowerCase().split("-").at(0);
      return language === candidateLanguage;
    });

    if (languageMatch) {
      return languageMatch;
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
