import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { NodeInterface } from '../interface/NodeInterface';
import Post from '../../data/model/Post';

export default new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  isTypeOf: object => object instanceof Post,
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
    }
  }),
  interfaces: [NodeInterface],
});