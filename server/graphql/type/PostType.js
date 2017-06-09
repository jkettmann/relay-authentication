import { GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField, connectionDefinitions } from 'graphql-relay'

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: () => ({
    id: globalIdField('Post'),
    creatorId: {
      type: GraphQLString,
      description: 'The posts creators id',
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
