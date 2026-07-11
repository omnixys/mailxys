import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["de-DE", "en-US"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "en-US";

function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectLocaleFromHeader(header: string | null): Locale {
  if (!header) {
    return DEFAULT_LOCALE;
  }

  const lang = header.toLowerCase();

  if (lang.startsWith("de")) {
    return "de-DE";
  }

  return "en-US";
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get("locale")?.value;
  const acceptLanguage = headerStore.get("accept-language");

  let locale: Locale;

  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    locale = detectLocaleFromHeader(acceptLanguage);
  }

  const language = locale.split("-")[0] ?? "en";

  const messages = {
    nav: (await import(`../../messages/${language}/nav.json`)).default,
    common: (await import(`../../messages/${language}/common.json`)).default,
    dashboard: (await import(`../../messages/${language}/dashboard.json`))
      .default,
    mail: (await import(`../../messages/${language}/mail.json`)).default,
    admin: (await import(`../../messages/${language}/admin.json`)).default,
    settings: (await import(`../../messages/${language}/settings.json`))
      .default,
    notifications: (
      await import(`../../messages/${language}/notifications.json`)
    ).default,
    contacts: (await import(`../../messages/${language}/contacts.json`))
      .default,
    calendar: (await import(`../../messages/${language}/calendar.json`))
      .default,
    chat: (await import(`../../messages/${language}/chat.json`)).default,
    analytics: (await import(`../../messages/${language}/analytics.json`))
      .default,
    help: (await import(`../../messages/${language}/help.json`)).default,
    marketing: (await import(`../../messages/${language}/marketing.json`))
      .default,
    shared: (await import(`../../messages/${language}/shared.json`)).default,
    theme: (await import(`../../messages/${language}/theme.json`)).default,
  };

  return {
    locale: language,
    messages,
  };
});
