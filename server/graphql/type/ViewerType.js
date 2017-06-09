import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
} from 'graphql-relay'

import UserType from './UserType'
import PostType, { PostConnection } from './PostType'

import { ROLES } from '../../config'

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    isLoggedIn: {
      type: GraphQLBoolean,
      resolve: (obj, args, { db }, { rootValue: { tokenData } }) =>
        tokenData.role === ROLES.reader ||
        tokenData.role === ROLES.publisher ||
        tokenData.role === ROLES.admin,
    },
    canPublish: {
      type: GraphQLBoolean,
      resolve: (obj, args, { db }, { rootValue: { tokenData } }) =>
        tokenData.role === ROLES.admin || tokenData.role === ROLES.publisher,
    },
    user: {
      type: UserType,
      // tokenData origins from a cookie containing session data
      // and is set in server/authentication.js
      resolve: (obj, args, { db }, { rootValue: { tokenData } }) =>
        db.getUserById(tokenData.userId),
    },
    posts: {
      type: PostConnection.connectionType,
      args: connectionArgs,
      resolve: (obj, args, { db }) => connectionFromArray(db.getPosts(), args),
    },
    post: {
      type: PostType,
      args: {
        postId: { type: GraphQLString },
      },
      resolve: (obj, { postId }, { db }) => db.getPost(fromGlobalId(postId).id),
    },
  }),
})
