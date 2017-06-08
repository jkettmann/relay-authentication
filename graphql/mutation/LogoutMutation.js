import { mutationWithClientMutationId } from 'graphql-relay'

import { createAnonymousToken } from '../../server/authentication'

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
    const user = db.getAnonymousUser()
    // eslint-disable-next-line no-param-reassign
    rootValue.session.token = createAnonymousToken()
    return { user }
  },
})
