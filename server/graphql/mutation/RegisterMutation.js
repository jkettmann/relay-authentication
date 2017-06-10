import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'

import UserType from '../type/UserType'

export default mutationWithClientMutationId({
  name: 'Register',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // uncomment following if you want to allow the user
    // to choose its role
    // role: {
    //   type: new GraphQLNonNull(GraphQLString),
    // },
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: payload => payload.user,
    },
  },
  mutateAndGetPayload: (input, { db }) => db.createUser(input),
})
