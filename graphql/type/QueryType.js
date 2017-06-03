import { GraphQLObjectType } from 'graphql'

import ViewerType from './ViewerType'
import { NodeField } from '../interface/NodeInterface'

export default new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    node: NodeField,
    viewer: {
      type: ViewerType,
      resolve: ({ tokenData }) => ({ id: tokenData.userId }),
    },
  }),
})
