import { mutationWithClientMutationId } from 'graphql-relay'

import UserType from '../type/UserType'

export default mutationWithClientMutationId({
  name: 'Logout',
  outputFields: {
    user: {
      type: UserType,
      resolve: ({ user }) => user,
    },
  },
  mutateAndGetPayload: (obj, { db }, { rootValue }) => {
    // eslint-disable-next-line no-param-reassign
    rootValue.session.token = null
    return { user: null }
  },
})
