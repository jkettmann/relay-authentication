import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { getAnonymousUser } from '../database';
import { createAnonymousToken } from '../../server/authentication';

import UserType from '../type/UserType';

export default mutationWithClientMutationId({
  name: 'Logout',
  inputFields: {
    id: {
      type: GraphQLString
    }
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: (payload) => payload
    }
  },
  mutateAndGetPayload: (obj, { rootValue }) => {
    const user = getAnonymousUser();
    rootValue.session.token = createAnonymousToken();
    return user;
  }
});