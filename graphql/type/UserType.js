import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay'

import PostConnection from './PostConnection'
import { NodeInterface } from '../interface/NodeInterface'

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    userId: {
      description: 'user id for current viewer',
      type: GraphQLString,
    },
    email: {
      description: 'the users email address',
      type: GraphQLString,
    },
    firstName: {
      description: 'the users first name',
      type: GraphQLString,
    },
    lastName: {
      description: 'the users last name',
      type: GraphQLString,
    },
    role: {
      description: 'the users role',
      type: GraphQLString,
    },
    postCount: {
      description: 'the number of posts created by the user',
      type: GraphQLInt,
      resolve: (user, args, { db }, { rootValue: { tokenData } }) =>
        db.getPostCountForCreator(tokenData),
    },
    posts: {
      type: PostConnection.connectionType,
      args: connectionArgs,
      resolve: (user, args, { db }, { rootValue: { tokenData } }) =>
        connectionFromArray(db.getPostsForCreator(tokenData), args),
    },
  },
  interfaces: [NodeInterface],
})
