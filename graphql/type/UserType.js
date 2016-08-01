import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray, globalIdField, fromGlobalId } from 'graphql-relay';

import PostType from './PostType';
import PostConnection from './PostConnection';
import { NodeInterface } from '../interface/NodeInterface';

import User from '../../data/model/User';
import {ROLES} from '../../config';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    userId: {
      description: 'user id for current viewer',
      type: GraphQLString
    },
    email: {
      description: 'the users email address',
      type: GraphQLString
    },
    firstName: {
      description: 'the users first name',
      type: GraphQLString
    },
    lastName: {
      description: 'the users last name',
      type: GraphQLString
    },
    role: {
      description: 'the users role',
      type: GraphQLString
    },
    posts: {
      type: PostConnection.connectionType,
      args: connectionArgs,
      resolve: (obj, args, { db }, { rootValue: {tokenData } }) => {
        log('get user posts for userId=' + tokenData.userId + ' and role=' + tokenData.role);
        if (tokenData && tokenData.userId && tokenData.role !== ROLES.anonymous) {
          return connectionFromArray(db.getPostsForCreator(tokenData.userId), args);
        }
        else {
          return connectionFromArray([], args);
        }
      }
    }
  },
  interfaces: [NodeInterface]
});