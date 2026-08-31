/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation Login($input: LogInInput!) {\n  credentialsLogin(input: $input) {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}": typeof types.LoginDocument,
    "mutation Logout {\n  logout {\n    ok\n    message\n  }\n}": typeof types.LogoutDocument,
    "query Me {\n  me {\n    id\n    username\n    role\n  }\n}": typeof types.MeDocument,
    "query MeAuth {\n  meAuth {\n    id\n    username\n    firstName\n    lastName\n    email\n    role\n  }\n}": typeof types.MeAuthDocument,
    "mutation Refresh {\n  refresh {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}": typeof types.RefreshDocument,
};
const documents: Documents = {
    "mutation Login($input: LogInInput!) {\n  credentialsLogin(input: $input) {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout {\n    ok\n    message\n  }\n}": types.LogoutDocument,
    "query Me {\n  me {\n    id\n    username\n    role\n  }\n}": types.MeDocument,
    "query MeAuth {\n  meAuth {\n    id\n    username\n    firstName\n    lastName\n    email\n    role\n  }\n}": types.MeAuthDocument,
    "mutation Refresh {\n  refresh {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}": types.RefreshDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LogInInput!) {\n  credentialsLogin(input: $input) {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}"): (typeof documents)["mutation Login($input: LogInInput!) {\n  credentialsLogin(input: $input) {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout {\n    ok\n    message\n  }\n}"): (typeof documents)["mutation Logout {\n  logout {\n    ok\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    id\n    username\n    role\n  }\n}"): (typeof documents)["query Me {\n  me {\n    id\n    username\n    role\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MeAuth {\n  meAuth {\n    id\n    username\n    firstName\n    lastName\n    email\n    role\n  }\n}"): (typeof documents)["query MeAuth {\n  meAuth {\n    id\n    username\n    firstName\n    lastName\n    email\n    role\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Refresh {\n  refresh {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}"): (typeof documents)["mutation Refresh {\n  refresh {\n    accessToken\n    expiresIn\n    refreshToken\n    refreshExpiresIn\n    idToken\n    scope\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;