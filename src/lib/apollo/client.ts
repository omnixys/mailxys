import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import type { DefinitionNode, OperationDefinitionNode } from "graphql";
import { createHttpLink } from "./http-link";
import { createWsLink } from "./ws-link";

function isSubscription(
  def: DefinitionNode | null,
): def is OperationDefinitionNode {
  return (
    !!def &&
    def.kind === "OperationDefinition" &&
    def.operation === "subscription"
  );
}

let apolloClient: ApolloClient | null = null;

export function createApolloClient(): ApolloClient {
  if (apolloClient) return apolloClient;

  const httpLink = createHttpLink();
  const wsLink = createWsLink();

  const link = wsLink
    ? split(
        ({ query }) => isSubscription(getMainDefinition(query)),
        wsLink,
        httpLink,
      )
    : httpLink;

  apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return apolloClient;
}
