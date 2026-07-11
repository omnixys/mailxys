"use client";

import { useTranslations } from "next-intl";
import type { Messages } from "./messages";
import type { NamespaceKeys } from "./typed";

export function useTypedTranslations<N extends keyof Messages>(namespace: N) {
  const t = useTranslations(namespace as string);

  return <K extends NamespaceKeys<N>>(
    key: K,
    values?: Record<string, string | number>,
  ) => t(key as string, values);
}
