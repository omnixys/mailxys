import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

import { AuthProviders } from "@/auth/AuthProviders";
import ThemeRegistry from "@/lib/mui/ThemeRegistry";
import { AnalyticsRootProvider } from "@/providers/AnalyticsProvider";
import { ApolloRootProvider } from "@/providers/ApolloProvider";
import { ThemeModeProvider } from "@/providers/ThemeModeProvider";

export const metadata: Metadata = {
  title: {
    default: "Omnixys Mail",
    template: "%s | Omnixys Mail",
  },
  description:
    "Omnixys Mail - Enterprise Webmail & Mail Server Administration powered by Stalwart",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <ThemeModeProvider>
            <NextIntlClientProvider messages={messages}>
              <ApolloRootProvider>
                <AuthProviders>
                  <AnalyticsRootProvider>{children}</AnalyticsRootProvider>
                </AuthProviders>
              </ApolloRootProvider>
            </NextIntlClientProvider>
          </ThemeModeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
