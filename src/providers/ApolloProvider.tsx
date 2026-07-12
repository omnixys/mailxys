"use client";

import { ApolloProvider } from "@apollo/client/react";
import type React from "react";
import { useMemo } from "react";
import { createApolloClient } from "@/lib/apollo/client";

export function ApolloRootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(() => createApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
