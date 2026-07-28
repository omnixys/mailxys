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
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css", prepend: true });
    cache.compat = true;

    const prevInsert = cache.insert.bind(cache);
    let inserted: string[] = [];

    cache.insert = (
      // biome-ignore lint/suspicious/noExplicitAny: Emotion internal API
      selector: any,
      // biome-ignore lint/suspicious/noExplicitAny: Emotion internal API
      serialized: any,
      // biome-ignore lint/suspicious/noExplicitAny: Emotion internal API
      sheet: any,
      // biome-ignore lint/suspicious/noExplicitAny: Emotion internal API
      shouldCache: any,
    ) => {
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(selector, serialized, sheet, shouldCache);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style key={cache.key} data-emotion={`${cache.key} ${names.join(" ")}`}>
        {styles}
      </style>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
