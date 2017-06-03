import { GraphQLNonNull, GraphQLString } from 'graphql'
import {
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from 'graphql-relay'

import UserType from '../type/UserType'
import PostConnection from '../type/PostConnection'
import { ROLES } from '../../config'

import { hasAuthorization } from '../../server/authentication'

import partial from '../helper/partial'

export default mutationWithClientMutationId({
  name: 'CreatePost',
  inputFields: {
    creatorId: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
      resolve: (newPost, args, { db }) => db.getViewerById(newPost.creatorId),
    },
  },
  mutateAndGetPayload: (data, { db }, { rootValue: { tokenData } }) => {
    console.log('create post')
    const create = partial(db.createPost, {
      ...data,
      creatorId: tokenData.userId,
    })

    return hasAuthorization(tokenData.role, ROLES.publisher, create)
  },
})
