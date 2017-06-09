import { GraphQLObjectType } from 'graphql'

import ViewerType from './ViewerType'

export default new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    viewer: {
      type: ViewerType,
      resolve: () => ({}),
    },
  }),
})
