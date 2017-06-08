/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule Routes_Profile_Query.graphql
 * @generated SignedSource<<9d6e988e717070904993c7ac19d0c60e>>
 * @relayHash 3639e3fa9bf2653cc2465df016922ff7
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/*
query Routes_Profile_Query {
  viewer {
    ...Profile_viewer
  }
}

fragment Profile_viewer on Viewer {
  user {
    firstName
    lastName
    role
    id
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  fragment: {
    argumentDefinitions: [],
    kind: 'Fragment',
    metadata: null,
    name: 'Routes_Profile_Query',
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
            name: 'Profile_viewer',
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
  name: 'Routes_Profile_Query',
  query: {
    argumentDefinitions: [],
    kind: 'Root',
    name: 'Routes_Profile_Query',
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
                kind: 'ScalarField',
                alias: null,
                args: null,
                name: 'firstName',
                storageKey: null,
              },
              {
                kind: 'ScalarField',
                alias: null,
                args: null,
                name: 'lastName',
                storageKey: null,
              },
              {
                kind: 'ScalarField',
                alias: null,
                args: null,
                name: 'role',
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
  text: 'query Routes_Profile_Query {\n  viewer {\n    ...Profile_viewer\n  }\n}\n\nfragment Profile_viewer on Viewer {\n  user {\n    firstName\n    lastName\n    role\n    id\n  }\n}\n',
};

module.exports = batch;