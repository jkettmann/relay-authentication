import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField, connectionDefinitions } from 'graphql-relay'

import UserType from './UserType'

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: () => ({
    id: globalIdField('Post'),
    creator: {
      type: UserType,
      description: 'The posts creators',
      resolve: (post, args, { db }) => db.getPostCreator(post),
    },
    title: {
      type: GraphQLString,
      description: 'The posts title',
    },
    image: {
      type: GraphQLString,
      description: 'The posts image',
    },
    description: {
      type: GraphQLString,
      description: 'The posts description',
    },
  }),
})

export const PostConnection = connectionDefinitions({
  name: 'Post',
  nodeType: PostType,
})

export default PostType
