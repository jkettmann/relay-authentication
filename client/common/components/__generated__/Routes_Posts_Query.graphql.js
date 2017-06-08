/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule Routes_Posts_Query.graphql
 * @generated SignedSource<<dbc53bb6a986226dbf86acc62a9681d4>>
 * @relayHash 2f8a4df24fbd036a6b239d29ec7738eb
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/*
query Routes_Posts_Query(
  $afterCursor: String
  $count: Int!
) {
  viewer {
    ...Posts_viewer
  }
}

fragment Posts_viewer on Viewer {
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
    name: 'Routes_Posts_Query',
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
            name: 'Posts_viewer',
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
  name: 'Routes_Posts_Query',
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
    name: 'Routes_Posts_Query',
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
            key: 'Posts_posts',
            filters: null,
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
  text: 'query Routes_Posts_Query(\n  $afterCursor: String\n  $count: Int!\n) {\n  viewer {\n    ...Posts_viewer\n  }\n}\n\nfragment Posts_viewer on Viewer {\n  posts(after: $afterCursor, first: $count) {\n    pageInfo {\n      hasNextPage\n      endCursor\n      hasPreviousPage\n      startCursor\n    }\n    edges {\n      node {\n        id\n        ...PostListItem_post\n        __typename\n      }\n      cursor\n    }\n  }\n}\n\nfragment PostListItem_post on Post {\n  title\n  image\n}\n',
};

module.exports = batch;