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
    "\n  query GetEstimatedHourMinMax {\n    estimatedHour {\n      min\n      max\n    }\n  }\n": typeof types.GetEstimatedHourMinMaxDocument,
    "\n  query GetLabels {\n    labels {\n      name\n      count\n    }\n  }\n": typeof types.GetLabelsDocument,
    "\n  query GetPriorities {\n    priorities {\n      name\n      count\n    }\n  }\n": typeof types.GetPrioritiesDocument,
    "\n  query GetStatuses {\n    statuses {\n      name\n      count\n    }\n  }\n": typeof types.GetStatusesDocument,
};
const documents: Documents = {
    "\n  query GetEstimatedHourMinMax {\n    estimatedHour {\n      min\n      max\n    }\n  }\n": types.GetEstimatedHourMinMaxDocument,
    "\n  query GetLabels {\n    labels {\n      name\n      count\n    }\n  }\n": types.GetLabelsDocument,
    "\n  query GetPriorities {\n    priorities {\n      name\n      count\n    }\n  }\n": types.GetPrioritiesDocument,
    "\n  query GetStatuses {\n    statuses {\n      name\n      count\n    }\n  }\n": types.GetStatusesDocument,
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
export function graphql(source: "\n  query GetEstimatedHourMinMax {\n    estimatedHour {\n      min\n      max\n    }\n  }\n"): (typeof documents)["\n  query GetEstimatedHourMinMax {\n    estimatedHour {\n      min\n      max\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLabels {\n    labels {\n      name\n      count\n    }\n  }\n"): (typeof documents)["\n  query GetLabels {\n    labels {\n      name\n      count\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPriorities {\n    priorities {\n      name\n      count\n    }\n  }\n"): (typeof documents)["\n  query GetPriorities {\n    priorities {\n      name\n      count\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStatuses {\n    statuses {\n      name\n      count\n    }\n  }\n"): (typeof documents)["\n  query GetStatuses {\n    statuses {\n      name\n      count\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;