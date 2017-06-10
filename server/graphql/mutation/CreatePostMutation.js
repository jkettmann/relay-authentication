import { GraphQLNonNull, GraphQLString } from 'graphql'
import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from 'graphql-relay'

import UserType from '../type/UserType'
import { PostConnection } from '../type/PostType'

export default mutationWithClientMutationId({
  name: 'CreatePost',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    image: {
      description: 'image field is set by upload middleware automatically',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    postEdge: {
      type: PostConnection.edgeType,
      resolve: (newPost, args, { db }) => ({
        cursor: cursorForObjectInConnection(db.getPosts(), newPost),
        node: newPost,
      }),
    },
    user: {
      type: UserType,
      resolve: (newPost, args, { db }, tokenData) =>
        db.getUserById(tokenData.userId),
    },
  },
  mutateAndGetPayload: (data, { db }, { rootValue: { tokenData } }) =>
    db.createPost(data, tokenData),
})
