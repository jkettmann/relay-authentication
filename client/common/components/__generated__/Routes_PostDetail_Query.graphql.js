/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule Routes_PostDetail_Query.graphql
 * @generated SignedSource<<5e87384f7d2de6d1181f04bac4f60b44>>
 * @relayHash 143661517320fac2f501e5d4f377af51
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/*
query Routes_PostDetail_Query(
  $postId: String!
) {
  viewer {
    ...PostDetail_viewer
  }
}

fragment PostDetail_viewer on Viewer {
  post(postId: $postId) {
    title
    description
    id
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  fragment: {
    argumentDefinitions: [
      {
        kind: 'LocalArgument',
        name: 'postId',
        type: 'String!',
        defaultValue: null,
      },
    ],
    kind: 'Fragment',
    metadata: null,
    name: 'Routes_PostDetail_Query',
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
            name: 'PostDetail_viewer',
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
  name: 'Routes_PostDetail_Query',
  query: {
    argumentDefinitions: [
      {
        kind: 'LocalArgument',
        name: 'postId',
        type: 'String!',
        defaultValue: null,
      },
    ],
    kind: 'Root',
    name: 'Routes_PostDetail_Query',
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
                name: 'postId',
                variableName: 'postId',
                type: 'String',
              },
            ],
            concreteType: 'Post',
            name: 'post',
            plural: false,
            selections: [
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
                name: 'description',
                storageKey: null,
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
  text: 'query Routes_PostDetail_Query(\n  $postId: String!\n) {\n  viewer {\n    ...PostDetail_viewer\n  }\n}\n\nfragment PostDetail_viewer on Viewer {\n  post(postId: $postId) {\n    title\n    description\n    id\n  }\n}\n',
};

module.exports = batch;