/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule Routes_UserPosts_Query.graphql
 * @generated SignedSource<<a5b4f9dd028b42812daf94ea1b97f568>>
 * @relayHash d395449470b3b0025154bfa7e9883825
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/*
query Routes_UserPosts_Query(
  $afterCursor: String
  $count: Int!
) {
  viewer {
    ...UserPosts_viewer
  }
}

fragment UserPosts_viewer on Viewer {
  user {
    posts(after: $afterCursor, first: $count) {
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          id
          ...PostListItem_post
          __typename
        }
        cursor
      }
    }
    id
  }
}

fragment PostListItem_post on Post {
  title
  image
}
*/

const batch /*: ConcreteBatch*/ = {
  fragment: {
    argumentDefinitions: [
      {
        kind: 'LocalArgument',
        name: 'afterCursor',
        type: 'String',
        defaultValue: null,
      },
      {
        kind: 'LocalArgument',
        name: 'count',
        type: 'Int!',
        defaultValue: null,
      },
    ],
    kind: 'Fragment',
    metadata: null,
    name: 'Routes_UserPosts_Query',
    selections: [
      {
        kind: 'LinkedField',
        alias: 'viewer',
        args: null,
        concreteType: 'Viewer',
        name: '__viewer_viewer',
        plural: false,
        selections: [
          {
            kind: 'FragmentSpread',
            name: 'UserPosts_viewer',
            args: null,
          },
        ],
        storageKey: null,
      },
    ],
    type: 'Root',
  },
  id: null,
  kind: 'Batch',
  metadata: {},
  name: 'Routes_UserPosts_Query',
  query: {
    argumentDefinitions: [
      {
        kind: 'LocalArgument',
        name: 'afterCursor',
        type: 'String',
        defaultValue: null,
      },
      {
        kind: 'LocalArgument',
        name: 'count',
        type: 'Int!',
        defaultValue: null,
      },
    ],
    kind: 'Root',
    name: 'Routes_UserPosts_Query',
    operation: 'query',
    selections: [
      {
        kind: 'LinkedField',
        alias: null,
        args: null,
        concreteType: 'Viewer',
        name: 'viewer',
        plural: false,
        selections: [
          {
            kind: 'LinkedField',
            alias: null,
            args: null,
            concreteType: 'User',
            name: 'user',
            plural: false,
            selections: [
              {
                kind: 'LinkedField',
                alias: null,
                args: [
                  {
                    kind: 'Variable',
                    name: 'after',
                    variableName: 'afterCursor',
                    type: 'String',
                  },
                  {
                    kind: 'Variable',
                    name: 'first',
                    variableName: 'count',
                    type: 'Int',
                  },
                ],
                concreteType: 'PostConnection',
                name: 'posts',
                plural: false,
                selections: [
                  {
                    kind: 'LinkedField',
                    alias: null,
                    args: null,
                    concreteType: 'PageInfo',
                    name: 'pageInfo',
                    plural: false,
                    selections: [
                      {
                        kind: 'ScalarField',
                        alias: null,
                        args: null,
                        name: 'hasNextPage',
                        storageKey: null,
                      },
                      {
                        kind: 'ScalarField',
                        alias: null,
                        args: null,
                        name: 'endCursor',
                        storageKey: null,
                      },
                      {
                        kind: 'ScalarField',
                        alias: null,
                        args: null,
                        name: 'hasPreviousPage',
                        storageKey: null,
                      },
                      {
                        kind: 'ScalarField',
                        alias: null,
                        args: null,
                        name: 'startCursor',
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    kind: 'LinkedField',
                    alias: null,
                    args: null,
                    concreteType: 'PostEdge',
                    name: 'edges',
                    plural: true,
                    selections: [
                      {
                        kind: 'LinkedField',
                        alias: null,
                        args: null,
                        concreteType: 'Post',
                        name: 'node',
                        plural: false,
                        selections: [
                          {
                            kind: 'ScalarField',
                            alias: null,
                            args: null,
                            name: 'id',
                            storageKey: null,
                          },
                          {
                            kind: 'ScalarField',
                            alias: null,
                            args: null,
                            name: 'title',
                            storageKey: null,
                          },
                          {
                            kind: 'ScalarField',
                            alias: null,
                            args: null,
                            name: 'image',
                            storageKey: null,
                          },
                          {
                            kind: 'ScalarField',
                            alias: null,
                            args: null,
                            name: '__typename',
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        kind: 'ScalarField',
                        alias: null,
                        args: null,
                        name: 'cursor',
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                kind: 'LinkedHandle',
                alias: null,
                args: [
                  {
                    kind: 'Variable',
                    name: 'after',
                    variableName: 'afterCursor',
                    type: 'String',
                  },
                  {
                    kind: 'Variable',
                    name: 'first',
                    variableName: 'count',
                    type: 'Int',
                  },
                ],
                handle: 'connection',
                name: 'posts',
                key: 'UserPosts_posts',
                filters: null,
              },
              {
                kind: 'ScalarField',
                alias: null,
                args: null,
                name: 'id',
                storageKey: null,
              },
            ],
            storageKey: null,
          },
        ],
        storageKey: null,
      },
      {
        kind: 'LinkedHandle',
        alias: null,
        args: null,
        handle: 'viewer',
        name: 'viewer',
        key: '',
        filters: null,
      },
    ],
  },
  text: 'query Routes_UserPosts_Query(\n  $afterCursor: String\n  $count: Int!\n) {\n  viewer {\n    ...UserPosts_viewer\n  }\n}\n\nfragment UserPosts_viewer on Viewer {\n  user {\n    posts(after: $afterCursor, first: $count) {\n      pageInfo {\n        hasNextPage\n        endCursor\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        node {\n          id\n          ...PostListItem_post\n          __typename\n        }\n        cursor\n      }\n    }\n    id\n  }\n}\n\nfragment PostListItem_post on Post {\n  title\n  image\n}\n',
};

module.exports = batch;