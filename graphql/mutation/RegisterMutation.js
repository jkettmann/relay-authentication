import {GraphQLNonNull, GraphQLString} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';

import UserType from '../type/UserType';

export default mutationWithClientMutationId({
  name: 'Register',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    role: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: payload => {
        return payload.user;
      }
    }
  },
  mutateAndGetPayload: ({ email, password, firstName, lastName, role }, { db }) =>
    db.createUser(email, password, firstName, lastName, role)
})