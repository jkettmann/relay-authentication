import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId, cursorForObjectInConnection } from 'graphql-relay';

import UserType from '../type/UserType';
import PostType from '../type/PostType';
import PostConnection from '../type/PostConnection';
import { ROLES } from '../../config';

import { hasAuthorization } from '../../server/authentication';

import partial from '../helper/partial';

export default mutationWithClientMutationId({
  name: 'CreatePost',
  inputFields: {
    creatorId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    image: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    postEdge: {
      type: PostConnection.edgeType,
      resolve: (newPost) => {
        return {
          cursor: cursorForObjectInConnection(getPosts(), newPost),
          node: newPost,
        };
      },
    },
    user: {
      type: UserType,
      resolve: (newPost) => getViewerById(newPost.creatorId)
    }
  },
  mutateAndGetPayload: (data, { db }, { rootValue: { tokenData } }) => {
    console.log('create post');
    data.creatorId = tokenData.userId;
    const create = partial(db.createPost, data);
    return hasAuthorization(tokenData.role, ROLES.publisher, create);
  }
});