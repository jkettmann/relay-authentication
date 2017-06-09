import { GraphQLNonNull, GraphQLString } from 'graphql'
import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from 'graphql-relay'

import UserType from '../type/UserType'
import PostConnection from '../type/PostConnection'
import { ROLES } from '../../config'

import { hasAuthorization } from '../../authentication'

import partial from '../helper/partial'

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
  mutateAndGetPayload: (data, { db }, { rootValue: { tokenData } }) => {
    const create = partial(db.createPost, {
      ...data,
      creatorId: tokenData.userId,
    })

    return hasAuthorization(tokenData.role, ROLES.publisher, create)
  },
})
