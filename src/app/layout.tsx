import type { Metadata, Viewport } from "next";
import "./globals.css";

import ThemeRegistry from "@/lib/mui/ThemeRegistry";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <ThemeModeProvider>{children}</ThemeModeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
