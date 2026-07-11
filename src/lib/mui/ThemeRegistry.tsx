"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const cache = createCache({
      key: "css",
      prepend: true,
    });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    return <meta name="emotion-cache" content="" suppressHydrationWarning />;
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
