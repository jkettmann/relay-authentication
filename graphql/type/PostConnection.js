import { connectionDefinitions } from 'graphql-relay'

import PostType from './PostType'

export default connectionDefinitions({
  name: 'Post',
  nodeType: PostType,
})
