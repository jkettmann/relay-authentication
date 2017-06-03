import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import { createToken, decodeToken } from '../../server/authentication'

import UserType from '../type/UserType'

export default mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: ({ email, password }, { db }, { rootValue }) => {
    // eslint-disable-next-line no-undef
    log(`get user with credentials. email: ${email}  password: ${password}`)
    const user = db.getUserWithCredentials(email, password)
    if (user) {
      /* eslint-disable no-param-reassign */
      rootValue.session.token = createToken(user)
      rootValue.tokenData = decodeToken(rootValue.session.token)
      /* eslint-enable no-param-reassign */
    }
    return user
  },
})
