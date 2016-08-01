import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

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
  mutateAndGetPayload: (obj, { db }, { rootValue }) => {
    const user = db.getAnonymousUser();
    rootValue.session.token = createAnonymousToken();
    return user;
  }
});