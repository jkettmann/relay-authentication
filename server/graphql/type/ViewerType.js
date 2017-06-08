import { GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
} from 'graphql-relay'

import UserType from './UserType'
import PostType from './PostType'
import PostConnection from './PostConnection'

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type: UserType,
      // tokenData origins from a cookie containing session data
      // and is set in server/authentication.js
      resolve: (obj, args, { db }, { rootValue: { tokenData } }) =>
        db.getCurrentUser(tokenData),
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
